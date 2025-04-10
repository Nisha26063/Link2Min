import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "../css/mailbox.css";

const ImportantEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5002/important")
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
        console.error("Error fetching emails:", error);
        setLoading(false);
      });
  }, []);

  const toggleStar = (index) => {
    const updatedEmails = emails.map((email, i) =>
      i === index ? { ...email, starred: !email.starred } : email
    );
    setEmails(updatedEmails);
  };

  return (
    <main className="inbox">
      <div className="inbox-header">
        <h2>Important</h2>
        <div className="filter">
          <span>Important <span className="important">{emails.length} new</span></span>
          <span>Starred <span className="starred">{emails.filter(e => e.starred).length} new</span></span>
        </div>
      </div>

      {loading ? (
        <p className="p-4">Loading...</p>
      ) : emails.length > 0 ? (
        <ul className="email-list">
          {emails.map((email, index) => (
            <li key={index} className={`email-item ${email.unread ? "unread" : ""}`}>
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
        <p className="p-4">No important emails found.</p>
      )}
    </main>
  );
};

export default ImportantEmails;
