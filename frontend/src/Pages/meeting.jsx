import React, { useState } from "react";
import "../css/meetingform.css";

export const Meeting = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    participants: [],
  });

  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddParticipant = () => {
    if (email && !formData.participants.includes(email)) {
      setFormData({
        ...formData,
        participants: [...formData.participants, email],
      });
      setEmail(""); // Clear input after adding
    }
  };

  const handleRemoveParticipant = (emailToRemove) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter((email) => email !== emailToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Meeting Details:", formData);

    const requestData = {
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      participants: formData.participants,
    };

    try {
      const response = await fetch("http://localhost:5001/create_meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(`Meeting created! Google Meet Link: ${data.meet_link}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="meeting-container">
      <h2>Schedule a Meeting</h2>
      <form onSubmit={handleSubmit} className="meeting-form">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Start Time:</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <label>End Time:</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <label>Participants (Email ID):</label>
        <div className="participant-input">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
          />
          <button type="button" onClick={handleAddParticipant}>
            Add
          </button>
        </div>

        <ul className="participant-list">
          {formData.participants.map((participant, index) => (
            <li key={index}>
              {participant}
              <button type="button" onClick={() => handleRemoveParticipant(participant)}>
                ❌
              </button>
            </li>
          ))}
        </ul>

        <button type="submit" className="start-button">Start</button>
      </form>
    </div>
  );
};
