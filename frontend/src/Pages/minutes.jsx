import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/minutes.css"; // Optional: Add styles for the component

const Minutes = () => {
  const [minutes, setMinutes] = useState([]); // State to store all minutes
  const [editableMinutes, setEditableMinutes] = useState({}); // State to track editable minutes
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  const [modalOpen, setModalOpen] = useState(false); // Controls modal visibility
  const [currentMinuteId, setCurrentMinuteId] = useState(null); // Track which meeting is open in modal
  const [modalText, setModalText] = useState(""); // Text inside the modal

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/minutes")
      .then((response) => {
        console.log("Fetched minutes:", response.data);
        setMinutes(response.data);
        const initialEditableMinutes = {};
        response.data.forEach((minute) => {
          initialEditableMinutes[minute.meeting_id] = minute.minutes_text;
        });
        setEditableMinutes(initialEditableMinutes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching minutes:", error);
        setError("Failed to fetch minutes. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleMinutesChange = (meetingId, newText) => {
    setEditableMinutes({
      ...editableMinutes,
      [meetingId]: newText,
    });
  };

  const handleSaveMinutes = () => {
    axios
      .post("http://127.0.0.1:5000/api/update-minutes", {
        meeting_id: currentMinuteId,
        minutes_text: modalText,
      })
      .then((response) => {
        alert(response.data.status);
        setEditableMinutes((prev) => ({
          ...prev,
          [currentMinuteId]: modalText,
        }));
        setModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating minutes:", error);
        alert("Failed to update minutes.");
      });
  };

  const handleSendMinutes = (meetingId, participants, minutesText) => {
    axios
      .post("http://127.0.0.1:5000/api/send-minutes", {
        meeting_id: meetingId,
        participants: participants,
        minutes_text: minutesText,
      })
      .then((response) => {
        alert(response.data.status);
      })
      .catch((error) => {
        console.error("Error sending minutes:", error);
        alert("Failed to send minutes.");
      });
  };

  const openModal = (meetingId) => {
    setCurrentMinuteId(meetingId);
    setModalText(editableMinutes[meetingId] || "");
    setModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
                  readOnly
                  onClick={() => openModal(minute.meeting_id)}
                  className="minutes-textarea"
                />
              </td>
              <td>
                {/* Removed Save Button Here */}
                <button
                  onClick={() =>
                    handleSendMinutes(
                      minute.meeting_id,
                      minute.participants,
                      editableMinutes[minute.meeting_id]
                    )
                  }
                  className="save-button"
                >
                  Send
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Minutes</h3>
            <textarea
              className="modal-textarea"
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleSaveMinutes} className="save-button">
                Save
              </button>
              <button onClick={() => setModalOpen(false)} className="cancel-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minutes;