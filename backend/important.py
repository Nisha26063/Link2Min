from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
