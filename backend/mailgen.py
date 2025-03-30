import sqlite3
import base64
import requests
import os.path
import pickle
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from database import initialize_mails_database, save_email_to_database

# 🔹 Configuration
API_URL = "https://495c-34-87-43-39.ngrok-free.app/classify"  # Replace with your Colab API URL
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# 🔹 Classify email using only the subject
def classify_email(subject: str) -> int:
    """Call Colab-hosted API for classification using subject only"""
    try:
        response = requests.post(API_URL, json={"subject": subject}, timeout=10)
        data = response.json()
        
        print(f"📩 API Response: {data}")  # Debugging output

        return data.get("important", 0), data.get("critical_email_count", 0)

    except Exception as e:
        print(f"⚠️ API Error: {e}")
        return 0  # Default to not important

# 🔹 Authenticate & get Gmail service
def get_gmail_service():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('gmail', 'v1', credentials=creds)

# 🔹 Retrieve & classify unread emails
def retrieve_emails(service):
    results = service.users().messages().list(
        userId='me', 
        labelIds=['INBOX'], 
        q="is:unread"  # Fetch only unread emails
    ).execute()
    critical_email_count = 0
    messages = results.get('messages', [])

    if not messages:
        print('📭 No new unread messages.')
        return

    for message in messages:
        msg = service.users().messages().get(userId='me', id=message['id']).execute()
        headers = msg['payload']['headers']

        subject, sender, date = '', '', ''
        for header in headers:
            if header['name'] == 'Subject':
                subject = header['value']
            elif header['name'] == 'From':
                sender = header['value']
            elif header['name'] == 'Date':
                date = header['value']

        # 🔹 Classify email using subject only
        important, critical_count = classify_email(subject)
        critical_email_count = critical_count

        # 🔹 Save to database
        save_email_to_database(subject=subject, sender=sender, date=date, body="", important=important)

        print(f"✅ Processed: {subject[:50]}... | Importance: {important}")
    print(f"\n🚨 Total Emails with Critical Words: {critical_email_count}")

# 🔹 Main Execution
if __name__ == '__main__':
    initialize_mails_database()
    service = get_gmail_service()
    retrieve_emails(service)
