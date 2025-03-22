from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import pytz
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
from base64 import urlsafe_b64encode
from email.mime.text import MIMEText
from database import initialize_database, save_to_database

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # Enable CORS for frontend communication

SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly'
]

def authenticate_google_api():
    """Authenticate and return service objects for Calendar and Gmail APIs."""
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    
    calendar_service = build('calendar', 'v3', credentials=creds)
    gmail_service = build('gmail', 'v1', credentials=creds)
    return calendar_service, gmail_service

def create_google_meet_event(service, event_summary, start_datetime, end_datetime, attendees):
    """Create a Google Meet event and return its link."""
    event = {
        'summary': event_summary,
        'start': {'dateTime': start_datetime, 'timeZone': 'Asia/Kolkata'},
        'end': {'dateTime': end_datetime, 'timeZone': 'Asia/Kolkata'},
        'attendees': [{'email': email.strip()} for email in attendees],
        "conferenceData": {
            "createRequest": {
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
                "requestId": "unique-request-id"
            },
        },
    }
    event = service.events().insert(
        calendarId='primary',
        conferenceDataVersion=1,
        body=event
    ).execute()
    return event.get('hangoutLink')

def send_email_via_gmail(service, sender_email, recipient_emails, subject, body):
    """Send an email with the meeting invitation."""
    for recipient in recipient_emails:
        message = MIMEText(body)
        message['to'] = recipient.strip()
        message['from'] = sender_email
        message['subject'] = subject
        raw_message = urlsafe_b64encode(message.as_bytes()).decode()

        service.users().messages().send(
            userId='me',
            body={'raw': raw_message}
        ).execute()

@app.route('/create_meeting', methods=['POST'])
def create_meeting():
    """API endpoint to create a Google Meet meeting."""
    try:
        initialize_database()
        data = request.json
        title = data.get("title")
        date = data.get("date")
        start_time = data.get("startTime")
        end_time = data.get("endTime")
        participants = data.get("participants", [])

        ist_timezone = pytz.timezone('Asia/Kolkata')
        start_datetime = ist_timezone.localize(datetime.datetime.strptime(f"{date} {start_time}", "%Y-%m-%d %H:%M"))
        end_datetime = ist_timezone.localize(datetime.datetime.strptime(f"{date} {end_time}", "%Y-%m-%d %H:%M"))

        calendar_service, gmail_service = authenticate_google_api()
        meet_link = create_google_meet_event(
            calendar_service, title, start_datetime.isoformat(), end_datetime.isoformat(), participants
        )

        save_to_database(title, date, start_time, end_time, participants, meet_link)

        sender_email = "your_email@gmail.com"
        subject = f"Invitation to {title}"
        body = f"Dear Participant,\n\nYou are invited to {title}.\nGoogle Meet Link: {meet_link}\n\nBest regards."

        send_email_via_gmail(gmail_service, sender_email, participants, subject, body)

        return jsonify({"message": "Meeting created successfully", "meet_link": meet_link})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
