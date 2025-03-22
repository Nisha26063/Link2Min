import React, { useState } from "react";
import { FaPaperclip, FaSmile, FaTrash, FaBold, FaItalic, FaUnderline, FaImage, FaLock, FaPen } from "react-icons/fa";
import "../css/compose.css";

const ComposeEmail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="compose-wrapper">
      <div className="compose-container">
        <div className="compose-header">
          <h3>New Mail</h3>
          <button className="close-btn">✖</button>
        </div>

        <div className="compose-body">
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="compose-input"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="compose-input"
          />
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="compose-textarea"
          />
        </div>

        <div className="compose-toolbar">
          <FaBold className="toolbar-icon" />
          <FaItalic className="toolbar-icon" />
          <FaUnderline className="toolbar-icon" />
          <FaPaperclip className="toolbar-icon" />
          <FaImage className="toolbar-icon" />
          <FaSmile className="toolbar-icon" />
          <FaLock className="toolbar-icon" />
          <FaPen className="toolbar-icon" />
          <FaTrash className="toolbar-icon delete" />
        </div>

        <div className="compose-footer">
          <button className="send-btn">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmail;
