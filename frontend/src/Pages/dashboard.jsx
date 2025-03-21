import React, { useState } from "react";
import "../css/dashboard.css";
import Navbar from "../Components/navbar";
import { Mailbox } from "../Components/mailbox";
import Sidebar from "../Components/sidebar";

const Dashboard = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="gmail-container">
        <Sidebar isSidebarVisible={isSidebarVisible} />
        <div className={`mailbox-container ${!isSidebarVisible ? 'sidebar-hidden' : ''}`}>
          <Mailbox />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
