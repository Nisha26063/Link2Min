import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "../css/mailbox.css";

// Sample email data
const initialEmails = [
  { sender: "Google Cloud", subject: "[Action Required] Mandatory multi-factor authentication", time: "6:20 AM", unread: true, starred: false },
  { sender: "Nisha26063", subject: "Nisha26063 invited you to Link2Min - GitHub home", time: "Jan 29", unread: false, starred: true },
  { sender: "no-reply-dwms@duk.a", subject: "Confirm your DWMS Account", time: "Jan 29", unread: false, starred: false },
  { sender: "Google Maps Platform", subject: "[Important Notification] Changes to Google Maps Platform", time: "Jan 29", unread: false, starred: false },
  { sender: "Paytm Payments Bank", subject: "Action required on your Inactive Paytm Payments Bank Wallet", time: "Jan 29", unread: false, starred: false },
  { sender: "The Millionaire Aca.", subject: "HOW TO MAKE MONEY IN 2025 - Tonight at 7PM GMT", time: "Jan 27", unread: false, starred: false },
];

export const Mailbox = () => {
  const [emails, setEmails] = useState(initialEmails);

  // Function to toggle star
  const toggleStar = (index) => {
    const updatedEmails = emails.map((email, i) =>
      i === index ? { ...email, starred: !email.starred } : email
    );
    setEmails(updatedEmails);
  };

  return (
    <main className="inbox">
      <div className="inbox-header">
        <h2>Primary</h2>
        <div className="filter">
          <span>Important <span className="important">50 new</span></span>
          <span>Starred <span className="starred"> 3 new</span></span>
        </div>
      </div>
      
      {/* Email list */}
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
            <div className="time">{email.time}</div>
          </li>
        ))}
      </ul>
    </main>
  );
};
