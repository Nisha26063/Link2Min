import React, { useState } from "react";
import { FaPen,  FaRegPaperPlane, FaRegFileAlt, FaPlus, FaAddressBook, FaClock } from "react-icons/fa";
import { MdInbox } from "react-icons/md";
import '../css/dashboard.css';
import Navbar from "../Components/navbar";
import { useNavigate } from "react-router-dom";
import { Mailbox } from "../Components/mailbox";



const Dashboard = () => {
    let navigate = useNavigate(); // Initialize useNavigate

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSchedule=()=>{
    navigate("/dashboard/schedule")
  }

  const handleMinutes=()=>
  {
    navigate("/dashboard/minutes")
  }

  const handleMeeting=()=>{
    navigate("/dashboard/meeting")
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
      <li className="listbtn">
        <FaAddressBook className="icon" />
        <button className="sidebarbtn" onClick={handleSchedule}>Schedule</button>
      </li>
      <li className="listbtn">
        <FaRegPaperPlane className="icon" />
        <button className="sidebarbtn"> Sent</button>
      </li>
      <li className="listbtn">
        <FaRegFileAlt className="icon" />
        <button className="sidebarbtn">Drafts</button>
        <span className="count">21</span>
      </li>
      <li className="listbtn">
        <FaPlus className="icon"/>
        <button className="sidebarbtn" onClick={handleMeeting}>Start Meeting</button>
      </li>
      <li className="listbtn">
        <FaClock className="icon"/>
        <button className="sidebarbtn" onClick={handleMinutes}>Minutes</button>
      </li>
    </ul>
  </aside>

  {/* Mailbox Section */}
  <div className="mailbox-container">
    <Mailbox />
  </div>
</div>

    </>
  );
};

export default Dashboard;
