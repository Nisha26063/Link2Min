import React, {useState, useEffect} from "react";
import { FaPen,  FaRegFileAlt, FaPlus, FaAddressBook, FaClock } from "react-icons/fa";
import { MdInbox } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";

const Sidebar = ({ isSidebarVisible }) => {
  let navigate = useNavigate();
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
  

  useEffect(() => {
      fetchEmails(); // Initial fetch
  
      const interval = setInterval(() => {
        fetchEmails(); // Poll every 5 seconds
      }, 5000);
  
      return () => clearInterval(interval); // Cleanup
    }, []);

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

  const handleImportant = () => {
    navigate("/dashboard/important");
  };

  const handleSpam = ()=>{
    navigate("/dashboard/spam");
  };

  const handleSent= ()=>
    {
      navigate("/dashboard/sent");
    }

  return (
    <aside className={`sidebar ${isSidebarVisible ? "visible" : "hidden"}`}>
      <button className="compose-btn sidebarbtn" onClick={handleCompose}>
        <FaPen className="icon compose" />Compose
      </button>
      <ul className="sidebar-menu">


        <li className="listbtn">
          <MdInbox className="icon" /> 
          <button className="sidebarbtn" onClick={handleInbox}>Inbox</button>
          <span className="count">{emails.length}</span>
        </li>

        <li className="listbtn">
          <MdInbox className="icon" /> 
          <button className="sidebarbtn" onClick={handleSent}>Sent</button>
        </li>





        <li className="listbtn">
          <FaAddressBook className="icon" />
          <button className="sidebarbtn" onClick={handleSchedule}>Schedule</button>
        </li>

   
        <li className="listbtn">
          <FaPlus className="icon"/>
          <button className="sidebarbtn" onClick={handleMeeting}>Start Meeting</button>
        </li>
        <li className="listbtn">
          <FaClock className="icon"/>
          <button className="sidebarbtn" onClick={handleMinutes}>Minutes</button>
        </li>
        <li className="listbtn">
          <FaRegFileAlt className="icon"/>
          <button className="sidebarbtn" onClick={handleImportant}>Important</button>
        </li>
        
       <li className="listbtn">
          <FaClock className="icon"/>
          <button className="sidebarbtn" onClick={handleSpam}>Spam</button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
