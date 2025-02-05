import React, { useState } from "react";
import { FaPen, FaStar, FaRegPaperPlane, FaRegFileAlt, FaPlus } from "react-icons/fa";
import { MdInbox } from "react-icons/md";
import '../css/dashboard.css';
import Navbar from "../Components/navbar";
import { useNavigate } from "react-router-dom";


// Sample email data
const emails = [
  { sender: "Google Cloud", subject: "[Action Required] Mandatory multi-factor authentication", time: "6:20 AM", unread: true, starred: false },
  { sender: "Nisha26063", subject: "Nisha26063 invited you to Link2Min - GitHub home", time: "Jan 29", unread: false, starred: true },
  { sender: "no-reply-dwms@duk.a", subject: "Confirm your DWMS Account", time: "Jan 29", unread: false, starred: false },
  { sender: "Google Maps Platform", subject: "[Important Notification] Changes to Google Maps Platform", time: "Jan 29", unread: false, starred: false },
  { sender: "Paytm Payments Bank", subject: "Action required on your Inactive Paytm Payments Bank Wallet", time: "Jan 29", unread: false, starred: false },
  { sender: "The Millionaire Aca.", subject: "HOW TO MAKE MONEY IN 2025 - Tonight at 7PM GMT", time: "Jan 27", unread: false, starred: false },
];

const Dashboard = () => {
    let navigate = useNavigate(); // Initialize useNavigate

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSchedule=()=>{
    navigate("/dashboard/schedule")
  }

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="gmail-container">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarVisible ? "visible" : "hidden"}`}>
          <button className="compose-btn">
            <FaPen className="icon" /> Compose
          </button>
          <ul className="sidebar-menu">
            <li className="active">
              <MdInbox className="icon" /> Inbox <span className="count">2,236</span>
            </li>
            <li><FaPlus className="icon" /><button className="sidebarbtn" onClick={handleSchedule}>Schedule</button></li>
            <li><FaRegPaperPlane className="icon" /><button className="sidebarbtn"> Sent</button></li>
            <li><FaRegFileAlt className="icon" /> <button className="sidebarbtn">Drafts</button><span className="count">21</span></li>
          </ul>
        </aside>

        {/* Main Inbox Section */}
        <main className="inbox">
          <div className="inbox-header">
            <h2>Primary</h2>
            <div className="filter">
              <span>Promotions <span className="green">50 new</span></span>
              <span>Social <span className="blue">3 new</span></span>
              <span>Updates <span className="orange">1 new</span></span>
            </div>
          </div>

          {/* Email List */}
          <ul className="email-list">
            {emails.map((email, index) => (
              <li key={index} className={`email-item ${email.unread ? "unread" : ""}`}>
                <div className="email-checkbox">
                  <input type="checkbox" />
                  <FaStar className={`star ${email.starred ? "starred" : ""}`} />
                </div>
                <span className="sender">{email.sender}</span>
                <span className="subject">{email.subject}</span>
                <span className="time">{email.time}</span>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
