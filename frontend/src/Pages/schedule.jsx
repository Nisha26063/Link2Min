import { useState, useEffect } from "react";
import axios from "axios";

const Schedule = () => {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/meetings")
            .then((response) => {
                setMeetings(response.data);
            })
            .catch((error) => {
                console.error("Error fetching meetings:", error);
            });
    }, []);

    const handleMeetingClick = (meetingId, meetLink, meetingName, participants) => {
        axios.post("http://127.0.0.1:5000/start-meet", {
            meeting_id: meetingId,
            meeting_name: meetingName,
            url: meetLink,
            participants: participants  // Include participants in the request
        })
        .then((response) => {
            console.log("Scraping started:", response.data);
            alert(`Scraping started for meeting: ${meetingName}`);
        })
        .catch((error) => {
            console.error("Error scraping transcript:", error);
            alert("There was an error starting the scraping process.");
        });
    };

    return (
        <div>
            <h2>Meeting Schedule</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Meeting Name</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Participants</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meetings.map((meeting, index) => (
                        <tr key={index}>
                            <td>{meeting.title}</td>
                            <td>{meeting.date}</td>
                            <td>{meeting.start_time}</td>
                            <td>{meeting.end_time}</td>
                            <td>{meeting.attendees}</td>
                            <td>
                                <button onClick={() => handleMeetingClick(meeting.id, meeting.meet_link, meeting.title, meeting.attendees)}>
                                    Start Scraping
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Schedule;