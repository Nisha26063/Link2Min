import React from "react";
import { FaPen, FaRegPaperPlane, FaRegFileAlt, FaPlus, FaAddressBook, FaClock } from "react-icons/fa";
import { MdInbox } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";

const Sidebar = ({ isSidebarVisible }) => {
  let navigate = useNavigate();

  const handleInbox = () => {
    navigate("/dashboard");
  };

  const handleSchedule = () => {
    navigate("/dashboard/schedule");
  };

  const handleMinutes = () => {
    navigate("/dashboard/minutes");
  };

  const handleMeeting = () => {
    navigate("/dashboard/meeting");
  };

  const handleCompose = () => {
    navigate("/dashboard/compose");
  };

  return (
    <aside className={`sidebar ${isSidebarVisible ? "visible" : "hidden"}`}>
      <button className="compose-btn sidebarbtn" onClick={handleCompose}>
        <FaPen className="icon compose" /> Compose
      </button>
      <ul className="sidebar-menu">


        <li className="listbtn">
          <MdInbox className="icon" /> 
          <button className="sidebarbtn" onClick={handleInbox}>Inbox</button>
          <span className="count">2,236</span>
        </li>


        <li className="listbtn">
          <FaAddressBook className="icon" />
          <button className="sidebarbtn" onClick={handleSchedule}>Schedule</button>
        </li>


        <li className="listbtn">
          <FaRegPaperPlane className="icon" />
          <button className="sidebarbtn">Sent</button>
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
  );
};

export default Sidebar;
