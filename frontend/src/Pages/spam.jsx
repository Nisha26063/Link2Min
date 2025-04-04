import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "../css/mailbox.css";

const SpamEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5002/spam")  // Changed endpoint to /spam
      .then((response) => response.json())
      .then((data) => {
        const updatedEmails = data.emails.map((email) => ({
          ...email,
          sender: email.sender.split(" <")[0],  // Clean sender name
          unread: true,
          starred: false,
        }));
        setEmails(updatedEmails);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching spam emails:", error);
        setLoading(false);
      });
  }, [emails]);

  const toggleStar = (index) => {
    const updatedEmails = emails.map((email, i) =>
      i === index ? { ...email, starred: !email.starred } : email
    );
    setEmails(updatedEmails);
  };

  return (
    <main className="inbox">
      <div className="inbox-header">
        <h2>Spam</h2>
        <div className="filter">
          <span>Spam <span className="spam">{emails.length}
detected</span></span>
          <span>Starred <span className="starred">{emails.filter(e =>
e.starred).length}</span></span>
        </div>
      </div>

      {loading ? (
        <p className="p-4">Loading spam emails...</p>
      ) : emails.length > 0 ? (
        <ul className="email-list">
          {emails.map((email, index) => (
            <li key={index} className={`email-item ${email.unread ?
"unread" : ""}`}>
              <div className="email-checkbox">
                <input type="checkbox" />
                <FaStar
                  className={`star ${email.starred ? "starred" : ""}`}
                  onClick={() => toggleStar(index)}
                />
              </div>
              <div className="sender">{email.sender}</div>
              <div className="subject">{email.subject}</div>
              <div className="time">{email.date}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-4">No spam emails detected. Your inbox is clean!</p>
      )}
    </main>
  );
};

export default SpamEmails;
