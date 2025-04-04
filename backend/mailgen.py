import sqlite3
import base64
import requests
import os.path
import pickle
import numpy as np
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# 🔹 Configuration
API_URL = "https://2eb7-34-82-71-252.ngrok-free.app/classify"  # Replace with your Colab API URL
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def initialize_mails_database():
    """Create the emails table if it doesn't exist with spam
classification support"""
    conn = sqlite3.connect('mails.db')
    cursor = conn.cursor()

    # Check if table exists and if it has the is_spam column
    cursor.execute("PRAGMA table_info(emails)")
    columns = [column[1] for column in cursor.fetchall()]

    if 'emails' not in [table[0] for table in cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]:
        # Create new table with all columns
        cursor.execute('''
            CREATE TABLE emails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message_id TEXT UNIQUE,
                subject TEXT,
                sender TEXT,
                date TEXT,
                body TEXT,
                important INTEGER DEFAULT 0,
                is_spam INTEGER DEFAULT 0
            )
        ''')
    elif 'is_spam' not in columns:
        # Table exists but missing is_spam column - add it
        cursor.execute('ALTER TABLE emails ADD COLUMN is_spam INTEGER DEFAULT 0')
        print("✅ Added is_spam column to existing database")

    conn.commit()
    conn.close()

# Load spam classifier and vectorizer with proper label handling
def load_spam_classifier():
    try:
        with open('spam_classifier.pkl', 'rb') as f:
            classifier = pickle.load(f)
        with open('vectorizer.pkl', 'rb') as f:
            vectorizer = pickle.load(f)

        # Convert string labels to numeric if needed
        if hasattr(classifier, 'classes_') and isinstance(classifier.classes_[0], str):
            original_predict = classifier.predict
            classifier.predict = lambda X: [1 if x == 'spam' else 0
for x in original_predict(X)]

        return classifier, vectorizer
    except Exception as e:
        print(f"⚠️ Error loading spam classifier: {e}")
        return None, None

# Initialize spam classifier
spam_classifier, vectorizer = load_spam_classifier()
if spam_classifier:
    print("✅ Spam classifier loaded successfully")

# 🔹 Initialize database connection
def get_db_connection():
    conn = sqlite3.connect('mails.db')
    conn.row_factory = sqlite3.Row
    return conn

# 🔹 Check if email already exists in database
def email_exists(message_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM emails WHERE message_id = ?", (message_id,))
    exists = cursor.fetchone() is not None
    conn.close()
    return exists

# 🔹 Save email to database if it doesn't exist
def save_email_to_database(message_id, subject, sender, date, body,
important, is_spam):
    if email_exists(message_id):
        return False

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO emails (message_id, subject, sender, date, body,important, is_spam) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (message_id, subject, sender, date, body, important, is_spam)
    )
    conn.commit()
    conn.close()
    return True

# 🔹 Enhanced spam classification with better error handling
def classify_spam(body: str) -> int:
    """Classify email body as spam (1) or ham (0) with robust handling"""
    if not body or not spam_classifier or not vectorizer:
        return 0

    try:
        # Clean and limit the input size
        clean_body = ' '.join(str(body).split()[:1000])  # Limit to first 1000 words
        features = vectorizer.transform([clean_body])

        # Handle both string and numeric predictions
        prediction = spam_classifier.predict(features)
        if isinstance(prediction[0], str):
            return 1 if prediction[0].lower() == 'spam' else 0
        return int(prediction[0])
    except Exception as e:
        print(f"⚠️ Spam classification error: {e}")
        return 0

# 🔹 Classify email using only the subject
def classify_email(subject: str) -> tuple:
    """Call Colab-hosted API for classification using subject only"""
    try:
        response = requests.post(API_URL, json={"subject": subject}, timeout=10)
        data = response.json()
        print(f"📩 API Response: {data}")  # Debugging output
        return data.get("important", 0), data.get("critical_email_count", 0)
    except Exception as e:
        print(f"⚠️ API Error: {e}")
        return 0, 0  # Default to not important

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

# 🔹 Retrieve & classify unread emails with improved spam detection
def retrieve_emails(service):
    results = service.users().messages().list(
        userId='me',
        labelIds=['INBOX'],
        q="is:unread"
    ).execute()

    critical_email_count = 0
    messages = results.get('messages', [])
    spam_messages = []

    if not messages:
        print('📭 No new unread messages.')
        return

    for message in messages:
        msg = service.users().messages().get(userId='me',
id=message['id'], format='full').execute()
        headers = msg['payload']['headers']
        message_id = msg['id']

        if email_exists(message_id):
            continue

        subject, sender, date, body = '', '', '', ''

        for header in headers:
            if header['name'] == 'Subject':
                subject = header['value']
            elif header['name'] == 'From':
                sender = header['value']
            elif header['name'] == 'Date':
                date = header['value']

        # Get email body
        if 'parts' in msg['payload']:
            for part in msg['payload']['parts']:
                if part['mimeType'] == 'text/plain':
                    body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                    break
        elif 'body' in msg['payload'] and 'data' in msg['payload']['body']:
            body = base64.urlsafe_b64decode(msg['payload']['body']['data']).decode('utf-8')

        # Classify importance and spam
        important, critical_count = classify_email(subject)
        critical_email_count = critical_count
        is_spam = classify_spam(body or subject)  # Use subject if body is empty

        if is_spam:
            spam_messages.append({
                'subject': subject,
                'sender': sender,
                'body_preview': (body[:100] + '...') if body else 'No body content'
            })

        # Save to database
        if save_email_to_database(message_id, subject, sender, date,
body, important, is_spam):
            status = "✅ Processed"
        else:
            status = "⏩ Skipped"
        print(f"{status}: {subject[:50]}... | Importance: {important} | Spam: {is_spam}")

    # Display spam messages
    if spam_messages:
        print("\n🚨 SPAM MESSAGES DETECTED:")
        for i, spam in enumerate(spam_messages, 1):
            print(f"\n📌 Spam #{i}:")
            print(f"From: {spam['sender']}")
            print(f"Subject: {spam['subject']}")
            print(f"Preview: {spam['body_preview']}")
            print("-" * 50)
    else:
        print("\n✅ No spam messages detected")

    print(f"\n🚨 Total Emails with Critical Words: {critical_email_count}")

# 🔹 Main Execution
if __name__ == '__main__':
    initialize_mails_database()
    service = get_gmail_service()
    retrieve_emails(service)