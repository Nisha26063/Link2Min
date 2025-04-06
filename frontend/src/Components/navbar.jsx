import React from "react";
import { FaBars } from "react-icons/fa";
import "../css/navbar.css";
import img from "../Assets/amail.png"
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session (e.g., localStorage or auth tokens)
    localStorage.removeItem('authToken'); 

    // Redirect to login page
    navigate('/');
  };
  return (
    <nav className="navbar">
      {/* Left Section: Menu & Gmail Logo */}
      <div className="navbar-left">
        <FaBars className="icon" onClick={toggleSidebar} /> {/* Add onClick event */}
        <h1 className="gmail-logo">Link2Min</h1>
      </div>



      {/* Right Section: Icons */}
      <div className="navbar-right">
      <button onClick={handleLogout} className="logout-btn">
      Log out
      </button>
      <img src={img} alt="Profile" className="profile-pic" />
      </div>
    </nav>
  );
};

export default Navbar;
