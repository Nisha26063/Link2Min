import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "../css/mailbox.css";

export const Mailbox = () => {
  const [emails, setEmails] = useState([]);

  // Function to fetch all emails from backend
  const fetchEmails = async () => {
    try {
      const response = await fetch("http://localhost:5002/emails"); // Fetch normal emails
      const data = await response.json();
      setEmails(data.emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  // Fetch emails initially and set up polling
  useEffect(() => {
    fetchEmails(); // Initial fetch

    const interval = setInterval(() => {
      fetchEmails(); // Poll every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // Cleanup
  }, []);


  useEffect(
    ()=>{
      fetch("http://localhost:5002")
      .then((response)=> response.json())
      .then((data)=>{
        console.log(data);
      })

    },[]
  );

  // Function to toggle star
  const toggleStar = (index) => {
    setEmails((prevEmails) =>
      prevEmails.map((email, i) =>
        i === index ? { ...email, starred: !email.starred } : email
      )
    );
  };

  return (
    <main className="inbox">
      <div className="inbox-header">
        <h2>Primary</h2>
        <div className="filter">
          <span>All Emails <span className="important">{emails.length} new</span></span>
        </div>
      </div>

      {/* Email list */}
      <ul className="email-list">
        {emails.map((email, index) => (
          <li key={index} className="email-item">
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
    </main>
  );
};
