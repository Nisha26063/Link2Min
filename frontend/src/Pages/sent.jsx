import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "../css/mailbox.css";

const SentEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const response = await fetch("http://localhost:5004/api/sent");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch sent emails");
        }

        if (data.success) {
          const updatedEmails = data.emails.map((email) => ({
            ...email,
            sender: "Me", // Sent by current user
            unread: false, // Sent emails are read by default
            starred: false,
            date: email.sent_at, // Use already formatted date from backend
            to: email.recipient // Recipient information
          }));
          setEmails(updatedEmails);
        } else {
          setError(data.error || "No sent emails found");
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentEmails();
  }, []);

  const toggleStar = (index) => {
    const updatedEmails = emails.map((email, i) =>
      i === index ? { ...email, starred: !email.starred } : email
    );
    setEmails(updatedEmails);
  };

  if (error) {
    return (
      <main className="inbox">
        <div className="inbox-header">
          <h2>Sent</h2>
        </div>
        <p className="p-4 error-message">{error}</p>
      </main>
    );
  }

  return (
    <main className="inbox">
      <div className="inbox-header">
        <h2>Sent</h2>
        <div className="filter">
          <span>Sent <span className="sent">{emails.length}</span></span>
          <span>Starred <span className="starred">{emails.filter(e => e.starred).length}</span></span>
        </div>
      </div>

      {loading ? (
        <p className="p-4">Loading sent emails...</p>
      ) : emails.length > 0 ? (
        <ul className="email-list">
          {emails.map((email, index) => (
            <li key={email.message_id} className="email-item">
              <div className="email-checkbox">
                <input type="checkbox" />
                <FaStar
                  className={`star ${email.starred ? "starred" : ""}`}
                  onClick={() => toggleStar(index)}
                />
              </div>
              <div className="sender">To: {email.to}</div>
              <div className="subject">{email.subject}</div>
              <div className="time">{email.date}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-4">No sent emails found in your account.</p>
      )}
    </main>
  );
};

export default SentEmails;