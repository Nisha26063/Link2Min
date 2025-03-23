import requests

# Define the URL for the /api/minutes endpoint
url = "http://127.0.0.1:5000/api/minutes"

try:
    # Send a GET request to the endpoint
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        minutes_data = response.json()
        print("Minutes data fetched successfully:")
        for minute in minutes_data:
            print(f"""
            ID: {minute['id']}
            Meeting ID: {minute['meeting_id']}
            Meeting Name: {minute['meeting_name']}
            Meet URL: {minute['meet_url']}
            Minutes Text: {minute['minutes_text']}
            """)
    else:
        # Handle errors
        print(f"Failed to fetch minutes. Status code: {response.status_code}")
        print(f"Response: {response.text}")
except Exception as e:
    # Handle exceptions
    print(f"An error occurred: {e}")