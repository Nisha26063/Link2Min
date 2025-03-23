import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/minutes.css"; // Optional: Add styles for the component

const Minutes = () => {
  const [minutes, setMinutes] = useState([]); // State to store all minutes
  const [editableMinutes, setEditableMinutes] = useState({}); // State to track editable minutes
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  // Fetch all minutes from the backend
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/minutes")
      .then((response) => {
        console.log("Fetched minutes:", response.data); // Debugging
        setMinutes(response.data);
        // Initialize editableMinutes with the fetched minutes text
        const initialEditableMinutes = {};
        response.data.forEach((minute) => {
          initialEditableMinutes[minute.meeting_id] = minute.minutes_text;
        });
        setEditableMinutes(initialEditableMinutes);
        setLoading(false); // Data fetching is complete
      })
      .catch((error) => {
        console.error("Error fetching minutes:", error);
        setError("Failed to fetch minutes. Please try again later.");
        setLoading(false); // Data fetching failed
      });
  }, []);

  // Handle changes to the editable text box
  const handleMinutesChange = (meetingId, newText) => {
    setEditableMinutes({
      ...editableMinutes,
      [meetingId]: newText,
    });
  };

  // Handle saving the updated minutes
  const handleSaveMinutes = (meetingId) => {
    const updatedMinutes = editableMinutes[meetingId];
    axios.post("http://127.0.0.1:5000/api/update-minutes", {
      meeting_id: meetingId,
      minutes_text: updatedMinutes,
    })
    .then((response) => {
      alert(response.data.status); // Show success message
    })
    .catch((error) => {
      console.error("Error updating minutes:", error);
      alert("Failed to update minutes.");
    });
  };

  // Handle sending minutes via email
  const handleSendMinutes = (meetingId, participants, minutesText) => {
    axios.post("http://127.0.0.1:5000/api/send-minutes", {
      meeting_id: meetingId,
      participants: participants,
      minutes_text: minutesText,
    })
    .then((response) => {
      alert(response.data.status); // Show success message
    })
    .catch((error) => {
      console.error("Error sending minutes:", error);
      alert("Failed to send minutes.");
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading message
  }

  if (error) {
    return <div>{error}</div>; // Show an error message
  }

  return (
    <div className="minutes-container">
      <h1>Meeting Minutes</h1>
      <table>
        <thead>
          <tr>
            <th>SL No</th>
            <th>Date</th>
            <th>GMeet Title</th>
            <th>Participants</th>
            <th>Minutes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {minutes.map((minute, index) => (
            <tr key={minute.meeting_id}>
              <td>{index + 1}</td>
              <td>{minute.date}</td>
              <td>{minute.meeting_name}</td>
              <td>{minute.participants}</td>
              <td>
                <textarea
                  value={editableMinutes[minute.meeting_id] || ""}
                  onChange={(e) =>
                    handleMinutesChange(minute.meeting_id, e.target.value)
                  }
                  className="minutes-textarea"
                />
              </td>
              <td>
                <button
                  onClick={() => handleSaveMinutes(minute.meeting_id)}
                  className="save-button"
                >
                  Save
                </button>
                <button
                  onClick={() =>
                    handleSendMinutes(
                      minute.meeting_id,
                      minute.participants,
                      editableMinutes[minute.meeting_id]
                    )
                  }
                  className="send-button"
                >
                  Send
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Minutes; // Default export