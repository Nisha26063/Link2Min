import sqlite3

# Database file paths
MEETINGS_DB_FILE = 'meetings.db'
MAILS_DB_FILE = 'mails.db'

def initialize_database():
    """Initialize the SQLite database and create the meetings table if it doesn't exist."""
    conn = sqlite3.connect(MEETINGS_DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS meetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        attendees TEXT NOT NULL,
        meet_link TEXT NOT NULL
    )''')
    conn.commit()
    conn.close()



def save_to_database(title, date, start_time, end_time, attendees, meet_link):
    """Save meeting details to the meetings database."""
    conn = sqlite3.connect(MEETINGS_DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''INSERT INTO meetings (title, date, start_time, end_time, attendees, meet_link)
        VALUES (?, ?, ?, ?, ?, ?)''', (title, date, start_time, end_time, ', '.join(attendees), meet_link))
    conn.commit()
    conn.close()
    print("Meeting details saved to database.")

# database.py
import sqlite3

def initialize_mails_database():
    """Create the emails table if it doesn't exist"""
    conn = sqlite3.connect('mails.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            sender TEXT,
            date TEXT,
            body TEXT,
            important INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

def save_email_to_database(subject, sender, date, body, important):
    """Save email with classification to database"""
    conn = sqlite3.connect('mails.db')
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO emails (subject, sender, date, body, important)
            VALUES (?, ?, ?, ?, ?)
        ''', (subject, sender, date, body, important))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()


