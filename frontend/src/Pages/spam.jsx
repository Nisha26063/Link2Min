import React, { useEffect, useState } from "react";

import "../css/mailbox.css";
import { useNavigate } from "react-router-dom";

const SpamEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  let navigate=useNavigate();
  
  const handleMail=(data)=>
    {
      console.log(data)
      navigate("/dashboard/mail", { state: { message: data } });
    }

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
            <li key={index} onClick={()=>handleMail({subject:email.subject,sender:email.sender,date:email.date,body:""})} className={`email-item ${email.unread ?
"unread" : ""}` }>
              <div className="email-checkbox">
                <input type="checkbox" />

              </div>
              <div className="sender" >{email.sender}</div>
              <div className="subject" >{email.subject}</div>
              <div className="time" >{email.date}</div>
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
