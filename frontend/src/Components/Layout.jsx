import React, { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
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
          <div className="layout-page-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout; 