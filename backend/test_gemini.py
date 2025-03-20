import google.generativeai as genai

# Configure API key
genai.configure(api_key="AIzaSyDdphi9GL-bUV-4vtYKzw60GojymilnrYw")

# Choose an available model
model = genai.GenerativeModel("gemini-1.5-pro-latest")  

def summarize_transcript_with_gemini(transcript):
    prompt = f"""
    Format the following meeting transcript into structured minutes with these sections:
    
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
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    dummy_transcript = """
    Okay, so good morning everybody. Today, we are going to start the meeting on the topic, how to create a Gmail presentation, okay? 
After you create an, you have to share the link to all the participants with whom you want to create the presentation. 
After that, what you have to do is you have to enter into the Google meet and wait for all the other participants. 
Once they have entered, you can start the meeting, you can discuss whatever you want to discuss. 
And after the meeting is complete, you can exit out from the meeting and then you can. 
Yeah, that's that's it. So, thank you everybody.
    """

    minutes = summarize_transcript_with_gemini(dummy_transcript)
    
    if minutes:
        print("Meeting Minutes:\n")
        print(minutes)

if __name__ == "__main__":
    main()
