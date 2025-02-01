import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from base64 import urlsafe_b64encode
from email.mime.text import MIMEText
import pytz  # For timezone handling
from database import initialize_database, save_to_database  # Import database functions

# Define scopes for both Calendar and Gmail APIs
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
    """Create a Google Meet event and return its details."""
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

    # Insert the event
    event = service.events().insert(
        calendarId='primary',
        conferenceDataVersion=1,
        body=event
    ).execute()
    print("Google Meet link created:", event.get('hangoutLink'))
    return event.get('hangoutLink')

def send_email_via_gmail(service, sender_email, recipient_emails, subject, body):
    """Send an email with the specified subject and body."""
    for recipient in recipient_emails:
        message = MIMEText(body)
        message['to'] = recipient.strip()
        message['from'] = sender_email
        message['subject'] = subject

        # Encode the message
        raw_message = urlsafe_b64encode(message.as_bytes()).decode()

        # Send the email
        service.users().messages().send(
            userId='me',
            body={'raw': raw_message}
        ).execute()
    print("Email sent successfully.")

def main():
    # Initialize the database
    initialize_database()
    
    # Authenticate APIs
    calendar_service, gmail_service = authenticate_google_api()

    # Input meeting details
    event_summary = input("Enter the meeting title: ")
    date = input("Enter the meeting date (YYYY-MM-DD): ")
    start_time = input("Enter the start time (HH:MM, 24-hour format): ")
    end_time = input("Enter the end time (HH:MM, 24-hour format): ")

    # Parse start and end times in IST
    ist_timezone = pytz.timezone('Asia/Kolkata')
    start_datetime = ist_timezone.localize(datetime.datetime.strptime(f"{date} {start_time}", "%Y-%m-%d %H:%M"))
    end_datetime = ist_timezone.localize(datetime.datetime.strptime(f"{date} {end_time}", "%Y-%m-%d %H:%M"))

    attendees = input("Enter the participants' email addresses (comma-separated): ").split(',')

    # Create Google Meet event
    gmeet_link = create_google_meet_event(
        calendar_service,
        event_summary,
        start_datetime.isoformat(),
        end_datetime.isoformat(),
        attendees
    )

    # Save meeting details to the database
    save_to_database(event_summary, date, start_time, end_time, attendees, gmeet_link)

    # Email details
    sender_email = "your_email@gmail.com"
    subject = f"Invitation to {event_summary}"
    body = f"Dear Participant,\n\nYou are invited to the meeting: {event_summary}.\nGoogle Meet Link: {gmeet_link}\n\nBest regards."

    # Send the email
    send_email_via_gmail(gmail_service, sender_email, attendees, subject, body)

if __name__ == '__main__':
    main()
