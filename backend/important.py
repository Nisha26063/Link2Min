from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

# Function to fetch spam emails
def get_spam_emails():
    db_path = os.path.abspath("mails.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT message_id, subject, sender, date, body 
        FROM emails 
        WHERE is_spam=1
        ORDER BY date DESC
    """)
    emails = cursor.fetchall()
    conn.close()
    return [{
        "message_id": row[0],
        "subject": row[1],
        "sender": row[2],
        "date": row[3],
        "body": row[4]
    } for row in emails]

# Function to fetch important emails
def get_important_emails():
    db_path = os.path.abspath("mails.db")
    conn = sqlite3.connect(db_path)  # Adjust database name if needed
    cursor = conn.cursor()
    cursor.execute("SELECT subject, sender, date FROM emails WHERE important=1")
    emails = cursor.fetchall()
    conn.close()
    return [{"subject": row[0], "sender": row[1], "date": row[2]} for row in emails]

@app.route("/important", methods=["GET"])
def fetch_important_emails():
    return jsonify({"emails": get_important_emails()})

# fetch all emails --------------------------------------
@app.route("/emails", methods=["GET"])
def fetch_all_emails():
    db_path = os.path.abspath("mails.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT subject, sender, date FROM emails")  # Fetch all emails
    emails = cursor.fetchall()
    conn.close()
    return jsonify({"emails": [{"subject": row[0], "sender": row[1], "date": row[2]} for row in emails]})

# --------------------------------------------
@app.route("/spam", methods=["GET"])
def fetch_spam_emails():
    try:
        return jsonify({"emails": get_spam_emails()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
