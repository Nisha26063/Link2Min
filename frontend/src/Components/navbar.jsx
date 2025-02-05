import React from "react";
import { FaBars, FaSearch, FaCog, FaRegQuestionCircle, FaFilter } from "react-icons/fa";
import { MdApps } from "react-icons/md";
import "../css/navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      {/* Left Section: Menu & Gmail Logo */}
      <div className="navbar-left">
        <FaBars className="icon" onClick={toggleSidebar} /> {/* Add onClick event */}
        <h1 className="gmail-logo">Link2Min</h1>
      </div>

      {/* Center Section: Search Bar */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search mail" className="search-input" />
        <FaFilter className="filter-icon" />
      </div>

      {/* Right Section: Icons */}
      <div className="navbar-right">
        <FaRegQuestionCircle className="icon" />
        <FaCog className="icon" />
        <span className="sparkle-icon">✦</span>
        <MdApps className="icon" />
        <img src="https://via.placeholder.com/30" alt="Profile" className="profile-pic" />
      </div>
    </nav>
  );
};

export default Navbar;
