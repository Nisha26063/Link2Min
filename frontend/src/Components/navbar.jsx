import React from "react";
import { FaBars, FaSearch, FaFilter } from "react-icons/fa";
import "../css/navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      {/* Left Section: Menu & Gmail Logo */}
      <div className="navbar-left">
        <FaBars className="icon" onClick={toggleSidebar} /> {/* Add onClick event */}
        <h1 className="gmail-logo">Link2Min</h1>
      </div>



      {/* Right Section: Icons */}
      <div className="navbar-right">
        <img src="https://via.placeholder.com/30" alt="Profile" className="profile-pic" />
      </div>
    </nav>
  );
};

export default Navbar;
