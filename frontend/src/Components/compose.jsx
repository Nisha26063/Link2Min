import React, { useState, useRef } from "react";
import {
  FaPaperclip,
  FaSmile,
  FaTrash,
  FaBold,
  FaItalic,
  FaUnderline,
} from "react-icons/fa";
import "../css/compose.css";
import { useNavigate } from "react-router-dom";

const ComposeEmail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeFormats, setActiveFormats] = useState([]);

  const messageRef = useRef(null);
  const navigate = useNavigate();

  const updateActiveFormats = () => {
    const formats = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    setActiveFormats(formats);
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
    updateActiveFormats();
    if (messageRef.current) {
      setMessage(messageRef.current.innerHTML);
    }
  };

  const handleSendEmail = async () => {
    // Trim message and remove empty HTML tags
    const cleanMessage = message.trim().replace(/<[^>]*>?/gm, "").trim();

    if (!to || !subject || !cleanMessage) {
      setError("Please fill in all fields");
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5003/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, message }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Server returned an unexpected response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      setSuccess(true);
      setTo("");
      setSubject("");
      setMessage("");
      if (messageRef.current) {
        messageRef.current.innerHTML = "";
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = err.message;
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Could not connect to the server. Please check your connection.";
      } else if (err.message.includes("<!DOCTYPE html>")) {
        errorMessage = "Server error occurred. Please try again later.";
      }
      setError(errorMessage);
      console.error("Email sending error:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="compose-wrapper">
      <div className="compose-container">
        <div className="compose-header">
          <h3>New Mail</h3>
          <button className="close-btn" onClick={handleClose} aria-label="Close compose window">
            ✖
          </button>
        </div>

        <div className="compose-body">
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="compose-input"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="compose-input"
            required
          />
          <div
            className="compose-textarea"
            contentEditable
            ref={messageRef}
            onInput={() => {
              setMessage(messageRef.current.innerHTML);
              updateActiveFormats();
            }}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Email sent successfully!</div>}

        <div className="compose-toolbar">
          <button
            className={`toolbar-button ${activeFormats.includes("bold") ? "active" : ""}`}
            title="Bold"
            onClick={() => formatText("bold")}
          >
            <FaBold />
          </button>
          <button
            className={`toolbar-button ${activeFormats.includes("italic") ? "active" : ""}`}
            title="Italic"
            onClick={() => formatText("italic")}
          >
            <FaItalic />
          </button>
          <button
            className={`toolbar-button ${activeFormats.includes("underline") ? "active" : ""}`}
            title="Underline"
            onClick={() => formatText("underline")}
          >
            <FaUnderline />
          </button>

          <button
            className="toolbar-button delete"
            title="Discard"
            onClick={() => {
              if (window.confirm("Are you sure you want to discard this email?")) {
                handleClose();
              }
            }}
          >
            <FaTrash />
          </button>
        </div>

        <div className="compose-footer">
          <button className="send-btn" onClick={handleSendEmail} disabled={isSending}>
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmail;