import React, { useState } from "react";
import { FaPaperclip, FaSmile, FaTrash, FaBold, FaItalic, FaUnderline,
FaImage, FaLock, FaPen } from "react-icons/fa";
import "../css/compose.css";

const ComposeEmail = ({ onClose }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSendEmail = async () => {
    // Basic validation
    if (!to || !subject || !message) {
      setError("Please fill in all fields");
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5003/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          message,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Server returned an unexpected response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Success case
      setSuccess(true);
      setTo("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Handle different error cases
      let errorMessage = err.message;

      if (err.message.includes('Failed to fetch')) {
        errorMessage = "Could not connect to the server. Please checkyour connection.";
      } else if (err.message.includes('<!DOCTYPE html>')) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      setError(errorMessage);
      console.error('Email sending error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="compose-wrapper">
      <div className="compose-container">
        <div className="compose-header">
          <h3>New Mail</h3>
          <button className="close-btn" onClick={onClose}
aria-label="Close compose window">
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
            aria-required="true"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="compose-input"
            required
            aria-required="true"
          />
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="compose-textarea"
            required
            aria-required="true"
          />
        </div>

        {/* Status messages */}
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="success-message" role="status">
            Email sent successfully!
          </div>
        )}

        <div className="compose-toolbar">
          <button className="toolbar-button" title="Bold">
            <FaBold />
          </button>
          <button className="toolbar-button" title="Italic">
            <FaItalic />
          </button>
          <button className="toolbar-button" title="Underline">
            <FaUnderline />
          </button>
          <button className="toolbar-button" title="Attach file">
            <FaPaperclip />
          </button>
          <button className="toolbar-button" title="Insert image">
            <FaImage />
          </button>
          <button className="toolbar-button" title="Insert emoji">
            <FaSmile />
          </button>
          <button className="toolbar-button" title="Encrypt">
            <FaLock />
          </button>
          <button className="toolbar-button" title="Signature">
            <FaPen />
          </button>
          <button
            className="toolbar-button delete"
            title="Discard"
            onClick={() => {
              if (window.confirm("Are you sure you want to discardthis email?")) {
                onClose();
              }
            }}
          >
            <FaTrash />
          </button>
        </div>

        <div className="compose-footer">
          <button
            className="send-btn"
            onClick={handleSendEmail}
            disabled={isSending}
            aria-busy={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmail;