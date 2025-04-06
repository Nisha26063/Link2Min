from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    db_path = os.path.abspath("sent_emails.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/sent", methods=["GET"])
def get_sent_emails():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First verify the table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='sent_emails'")
        if not cursor.fetchone():
            return jsonify({"success": False, "error": "sent_emails table doesn't exist"}), 404
        
        cursor.execute('''
            SELECT 
                id, 
                recipient, 
                subject, 
                message, 
                sent_at
            FROM sent_emails
            ORDER BY sent_at DESC
        ''')
        
        emails = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries with proper date formatting
        formatted_emails = []
        for email in emails:
            try:
                date_obj = datetime.strptime(email['sent_at'], "%Y-%m-%d %H:%M:%S")
                formatted_date = date_obj.strftime("%b %d, %Y %I:%M %p")
            except ValueError:
                formatted_date = email['sent_at']  # Fallback if parsing fails
            
            formatted_emails.append({
                "id": email['id'],
                "recipient": email['recipient'],
                "subject": email['subject'],
                "body": email['message'],
                "sent_at": formatted_date
                
            })
        
        return jsonify({
            "success": True,
            "emails": formatted_emails,
            "count": len(formatted_emails)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "emails": []
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004, debug=True)