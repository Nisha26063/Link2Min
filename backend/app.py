# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import time
import os
from selenium import webdriver
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import google.generativeai as genai
from datetime import datetime  # To capture the current date and time
from send import send_minutes_to_participants  # Import the send function

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Get the absolute path to the database file
db_path = os.path.abspath("data.db")
print(f"Database path: {db_path}")

# Directory to store .doc files (not used anymore, but kept for reference)
MINUTES_DIR = "minutes_files"
os.makedirs(MINUTES_DIR, exist_ok=True)  # Create the directory if it doesn't exist

# Configure Gemini API
genai.configure(api_key="AIzaSyDdphi9GL-bUV-4vtYKzw60GojymilnrYw")  # Replace with your Gemini API key
model = genai.GenerativeModel("gemini-1.5-pro-latest")  # Use the latest Gemini model

# Database Initialization
def init_db():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transcripts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                meeting_id TEXT,
                meeting_name TEXT,
                meet_url TEXT,
                transcript TEXT,
                date TEXT,
                participants TEXT
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS minutes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                meeting_id TEXT,
                meeting_name TEXT,
                meet_url TEXT,
                minutes_text TEXT,  -- Store the minutes text
                date TEXT,          -- Add date column
                participants TEXT  -- Add participants column
            )
        """)
        conn.commit()
        conn.close()
        print("Database initialized and 'transcripts' and 'minutes' tables created.")
    except Exception as e:
        print(f"Error initializing database: {e}")

init_db()  # Ensure DB is ready when the app starts

# Function to summarize the transcript using Gemini API
def summarize_transcript_with_gemini(transcript, date, participants):
    """Convert transcript into meeting minutes using Gemini API."""
    # Define the prompt
    prompt = f"""
    Format the following meeting transcript into structured minutes with these sections:

    Date: {date}
    Participants: {participants}

    Agenda:
    - [Summarize the main topic of the meeting]

    Discussion Points:
    1. [Key discussion points]
    2. [Additional discussion points]

    Decisions:
    - [Any decisions made during the meeting]

    Action Items:
    - [List of tasks assigned]

    Conclusion:
    - [Summary of the meeting]

    Transcript:
    {transcript}
    """

    try:
        # Call the Gemini API
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None

def start_meeting(meeting_id, meeting_name, url, participants):
    """Start a Google Meet session and extract captions until manually closed."""
    current_date_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    options = Options()
    options.add_argument("--use-fake-ui-for-media-stream")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-software-rasterizer")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--disable-notifications")
    options.add_argument("--start-maximized")

    # Remove the detach option and use keep_alive instead
    driver = uc.Chrome(
        options=options,
        use_subprocess=True,
        keep_alive=True  # This will help maintain the connection
    )
    driver.implicitly_wait(30)

    print(f"Opening Google Meet: {url}")
    driver.get(url)
    print("Google Meet page loaded.")

    # Rest of your function remains the same...
    transcript = ""
    last_captions_text = ""
    last_activity_time = time.time()
    no_captions_count = 0

    try:
        WebDriverWait(driver, 120).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div[aria-label="Captions"] div[jsname="tgaKEf"]'))
        )
        print("Captions container found. Starting transcript capture...")

        while True:
            try:
                if not driver.service.process:
                    print("Browser process terminated.")
                    break

                captions = driver.find_elements(By.CSS_SELECTOR, 'div[aria-label="Captions"] div[jsname="tgaKEf"]')
                
                if captions:
                    no_captions_count = 0
                    current_captions_text = " ".join([c.text for c in captions if c.text])

                    if current_captions_text:
                        current_lines = current_captions_text.split(". ")
                        last_lines = last_captions_text.split(". ")

                        for line in current_lines:
                            if line and line not in last_lines:
                                transcript += line + ". "
                                print("Captured Line:", line)
                                last_activity_time = time.time()

                        last_captions_text = current_captions_text
                else:
                    no_captions_count += 1
                    print(f"No captions found ({no_captions_count}/10)")
                    
                    if no_captions_count >= 10:
                        print("No captions for 10 consecutive attempts. Checking meeting status...")
                        try:
                            end_indicators = driver.find_elements(By.XPATH, "//*[contains(text(), 'Meeting ended') or contains(text(), 'Call ended')]")
                            if end_indicators:
                                print("Meeting has ended naturally.")
                                break
                            else:
                                no_captions_count = 0
                        except:
                            no_captions_count = 0

                if time.time() - last_activity_time > 300:
                    print("No new captions for 5 minutes. Meeting may be idle.")
                    try:
                        meeting_title = driver.title
                        if "Google Meet" not in meeting_title:
                            print("No longer in meeting. Exiting.")
                            break
                    except:
                        print("Unable to check meeting status. Continuing capture.")
                    
                    last_activity_time = time.time()

                time.sleep(5)

            except Exception as e:
                print(f"Error in captions loop: {e}")
                try:
                    driver.save_screenshot(f"error_{int(time.time())}.png")
                except:
                    pass
                
                try:
                    driver.title
                    print("Browser still responsive. Continuing...")
                    time.sleep(10)
                    continue
                except:
                    print("Browser not responsive. Exiting.")
                    break

    except Exception as e:
        print(f"Meet initialization error: {e}")
        driver.save_screenshot("initialization_error.png")
    finally:
        if transcript.strip():
            minutes = summarize_transcript_with_gemini(transcript, current_date_time, participants)
            
            if not minutes:
                print("Failed to generate minutes. Using raw transcript as fallback.")
                minutes = transcript

            print("Generated Minutes:")
            print(minutes)

            store_transcript(meeting_id, meeting_name, url, transcript, current_date_time, participants, minutes)
        else:
            print("No transcript captured. Skipping minutes generation.")

        print("Meeting capture complete. Browser will remain open until manually closed.")

def store_transcript(meeting_id, meeting_name, meet_url, transcript, date, participants, minutes_text):
    """Save extracted transcript and generated minutes in SQLite."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Store the transcript
        cursor.execute("""
            INSERT INTO transcripts (meeting_id, meeting_name, meet_url, transcript, date, participants) 
            VALUES (?, ?, ?, ?, ?, ?)
        """, (meeting_id, meeting_name, meet_url, transcript, date, participants))
        
        # Store the minutes text in the database
        cursor.execute("""
            INSERT INTO minutes (meeting_id, meeting_name, meet_url, minutes_text, date, participants) 
            VALUES (?, ?, ?, ?, ?, ?)
        """, (meeting_id, meeting_name, meet_url, minutes_text, date, participants))
        
        conn.commit()
        conn.close()
        print("Transcript and minutes text stored in the database.")
    except Exception as e:
        print(f"Error storing transcript and minutes: {e}")

# API Endpoint to fetch all minutes
@app.route('/api/minutes', methods=['GET'])
def get_all_minutes():
    """Fetch all minutes from the database."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM minutes")
        minutes = cursor.fetchall()
        conn.close()

        # Convert to a list of dictionaries
        minutes_list = []
        for minute in minutes:
            minutes_list.append({
                "id": minute[0],
                "meeting_id": minute[1],
                "meeting_name": minute[2],
                "meet_url": minute[3],
                "minutes_text": minute[4],
                "date": minute[5],          # Include date in the response
                "participants": minute[6]   # Include participants in the response
            })
        return jsonify(minutes_list)
    except Exception as e:
        print(f"Error fetching minutes: {e}")
        return jsonify({"error": str(e)}), 500

# API Endpoint to update minutes
@app.route('/api/update-minutes', methods=['POST'])
def update_minutes():
    """Update minutes text in the database."""
    data = request.json
    meeting_id = data.get("meeting_id")
    updated_minutes = data.get("minutes_text")

    if not meeting_id or not updated_minutes:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE minutes SET minutes_text = ? WHERE meeting_id = ?
        """, (updated_minutes, meeting_id))
        conn.commit()
        conn.close()
        return jsonify({"status": "Minutes updated successfully"})
    except Exception as e:
        print(f"Error updating minutes: {e}")
        return jsonify({"error": str(e)}), 500

# API Endpoint to start a new meeting
@app.route('/start-meet', methods=['POST'])
def handle_start_meeting():
    """API endpoint to receive Meet link and start transcript extraction."""
    data = request.json
    print("Received data:", data)  # Debugging: Print the request data

    if not data:
        return jsonify({"error": "No data provided"}), 400

    meeting_id = data.get("meeting_id")
    meeting_name = data.get("meeting_name")
    meet_url = data.get("url")
    participants = data.get("participants")

    if not all([meeting_id, meeting_name, meet_url, participants]):
        return jsonify({"error": "Missing required fields"}), 400

    start_meeting(meeting_id, meeting_name, meet_url, participants)
    return jsonify({"status": "Meeting started"})

# API Endpoint to download minutes (optional, not used in this implementation)
@app.route('/download-minutes/<meeting_id>', methods=['GET'])
def download_minutes(meeting_id):
    """Download minutes text for a given meeting ID."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT minutes_text FROM minutes WHERE meeting_id = ?
        """, (meeting_id,))
        result = cursor.fetchone()
        conn.close()

        if result:
            minutes_text = result[0]
            return jsonify({"minutes_text": minutes_text})
        return jsonify({"error": "Minutes not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API Endpoint to send minutes via email
@app.route('/api/send-minutes', methods=['POST'])
def send_minutes():
    """Send minutes to participants via email."""
    data = request.json
    meeting_id = data.get("meeting_id")
    participants = data.get("participants")
    minutes_text = data.get("minutes_text")

    if not all([meeting_id, participants, minutes_text]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Call the function from send.py
        send_minutes_to_participants(meeting_id, participants, minutes_text)
        return jsonify({"status": "Minutes sent successfully"})
    except Exception as e:
        print(f"Error sending minutes: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)