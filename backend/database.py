import sqlite3

# Database file paths
MEETINGS_DB_FILE = 'meetings.db'
MAILS_DB_FILE = 'mails.db'

def initialize_database():
    """Initialize the SQLite database and create the meetings table if
it doesn't exist."""
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
    cursor.execute('''INSERT INTO meetings (title, date, start_time,
end_time, attendees, meet_link)
        VALUES (?, ?, ?, ?, ?, ?)''', (title, date, start_time,
end_time, ', '.join(attendees), meet_link))
    conn.commit()
    conn.close()
    print("Meeting details saved to database.")

# database.py
import sqlite3

def initialize_mails_database():
    """Create the emails table if it doesn't exist, with spam
classification support"""
    conn = sqlite3.connect('mails.db')
    cursor = conn.cursor()

    # First, check if the table exists and if it has the is_spam column
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

def save_email_to_database(message_id, subject, sender, date, body,
important, is_spam=0):
    """Save email with classification to database"""
    conn = sqlite3.connect('mails.db')
    cursor = conn.cursor()
    try:
        # First try to update if exists (though email_exists check should prevent this)
        cursor.execute('''
            INSERT OR REPLACE INTO emails
            (message_id, subject, sender, date, body, important, is_spam)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (message_id, subject, sender, date, body, important, is_spam))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()
