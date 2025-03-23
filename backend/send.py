# send.py
import os
import pickle
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from base64 import urlsafe_b64encode
from docx import Document

# If modifying these SCOPES, delete the token.pickle file.
SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

def get_credentials():
    """Get OAuth2 credentials from token.pickle or create new ones."""
    creds = None
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)
    # If there are no valid credentials, prompt the user to log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)
    return creds

def generate_doc_file(minutes_text, filename):
    """Generate a .doc file from the minutes text."""
    doc = Document()
    doc.add_paragraph(minutes_text)
    doc.save(filename)

def create_message_with_attachment(sender, to, subject, message_text, file_path):
    """Create a message with an attachment."""
    message = MIMEMultipart()
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject

    # Add the message body
    msg = MIMEText(message_text)
    message.attach(msg)

    # Add the attachment
    with open(file_path, "rb") as attachment:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename={os.path.basename(file_path)}",
        )
        message.attach(part)

    # Encode the message
    raw_message = urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw_message}

def send_email_via_gmail(service, sender_email, recipient_emails, subject, body, attachment_path=None):
    """Send an email with the specified subject, body, and optional attachment."""
    for recipient in recipient_emails:
        if attachment_path:
            # Create a message with an attachment
            message = create_message_with_attachment(
                sender_email, recipient.strip(), subject, body, attachment_path
            )
        else:
            # Create a plain text message
            message = MIMEText(body)
            message['to'] = recipient.strip()
            message['from'] = sender_email
            message['subject'] = subject
            raw_message = urlsafe_b64encode(message.as_bytes()).decode()
            message = {'raw': raw_message}

        # Send the email
        service.users().messages().send(
            userId='me',
            body=message
        ).execute()
    print("Email sent successfully.")

def send_minutes_to_participants(meeting_id, participants, minutes_text):
    """Send minutes to participants via email."""
    # Generate a .doc file
    doc_filename = f"minutes_{meeting_id}.docx"
    generate_doc_file(minutes_text, doc_filename)

    # Authenticate and build the Gmail API service
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)

    # Send the email with the attachment
    send_email_via_gmail(
        service=service,
        sender_email=creds.id_token,  # Use the email from the credentials
        recipient_emails=participants.split(","),
        subject=f"Meeting Minutes for Meeting ID: {meeting_id}",
        body="Please find the attached meeting minutes.",
        attachment_path=doc_filename,
    )

    # Clean up the generated .doc file
    os.remove(doc_filename)