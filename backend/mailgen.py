import sqlite3
import base64
import email
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
from database import initialize_mails_database, save_email_to_database

# If modifying these SCOPES, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_gmail_service():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('gmail', 'v1', credentials=creds)
    return service

def retrieve_emails(service):
    # Call the Gmail API to fetch INBOX emails
    results = service.users().messages().list(userId='me', labelIds=['INBOX']).execute()
    messages = results.get('messages', [])

    if not messages:
        print('No new messages.')
    else:
        conn = sqlite3.connect('mails.db')
        cursor = conn.cursor()

        for message in messages:
            msg = service.users().messages().get(userId='me', id=message['id']).execute()
            payload = msg['payload']
            headers = payload['headers']

            subject = ''
            sender = ''
            date = ''
            body = ''

            for header in headers:
                if header['name'] == 'Subject':
                    subject = header['value']
                elif header['name'] == 'From':
                    sender = header['value']
                elif header['name'] == 'Date':
                    date = header['value']

            if 'parts' in payload:
                parts = payload['parts']
                for part in parts:
                    if part['mimeType'] == 'text/plain':
                        body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                        break
            else:
                body = base64.urlsafe_b64decode(payload['body']['data']).decode('utf-8')

            cursor.execute('''
                INSERT INTO emails (subject, sender, date, body) VALUES (?, ?, ?, ?)
            ''', (subject, sender, date, body))

        conn.commit()
        conn.close()

if __name__ == '__main__':
    initialize_mails_database()
    service = get_gmail_service()
    retrieve_emails(service)