from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request  # <-- This was missing
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
import os
import pickle

app = Flask(__name__)
CORS(app)

# Gmail API configuration
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
TOKEN_FILE = 'token.pickle'
CREDENTIALS_FILE = 'credentials.json'

def init_db():
    """Initialize the database if it doesn't exist"""
    if not os.path.exists('sent_emails.db'):
        conn = sqlite3.connect('sent_emails.db')
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS sent_emails
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                     recipient TEXT NOT NULL,
                     subject TEXT,
                     message TEXT,
                     sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        conn.commit()
        conn.close()

def get_gmail_service():
    """Authenticate and return Gmail API service"""
    creds = None

    # Load existing credentials if available
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)

    # If no valid credentials available, authenticate
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                return None, "Missing credentials.json file"

            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the credentials for next run
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)

    return build('gmail', 'v1', credentials=creds), None

@app.route('/api/send-email', methods=['POST'])
def send_email():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    # Validate required fields
    if not all(k in data for k in ['to', 'subject', 'message']):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        service, error = get_gmail_service()
        if error:
            return jsonify({"error": error}), 401

        # Create email message
        email_msg = MIMEText(data['message'])
        email_msg['to'] = data['to']
        email_msg['subject'] = data['subject']
        email_msg['from'] = 'me'

        # Encode and send message
        raw_message = base64.urlsafe_b64encode(email_msg.as_bytes()).decode()
        body = {'raw': raw_message}

        sent_message = service.users().messages().send(
            userId='me',
            body=body
        ).execute()

        # Store in database
        conn = sqlite3.connect('sent_emails.db')
        c = conn.cursor()
        c.execute('''INSERT INTO sent_emails (recipient, subject, message)
                     VALUES (?, ?, ?)''',
                     (data['to'], data['subject'], data['message']))
        conn.commit()
        email_id = c.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "message": "Email sent successfully",
            "message_id": sent_message['id'],
            "email_id": email_id
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5003, debug=True)