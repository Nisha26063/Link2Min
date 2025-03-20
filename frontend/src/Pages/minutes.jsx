import React from "react";
import "../css/minutes.css"

export const Minutes = () => {
  return (

    <>
    
    <div className="container">
      {/* Meeting Info */}
      <div className="header">
        <h2 className="title">Meeting Title</h2>
        <span className="status">Status: Ongoing</span>
      </div>
      
      {/* Text Preview Box */}
      <textarea
        className="textarea"
        placeholder="Generated minutes preview..."
      > Generated Minute is shown here  </textarea>
      
      {/* Buttons */}
      <div className="button-container">
        <button className="button send">Send</button>
        <button className="button download">Download</button>
      </div>
    </div>
    </>
  );
};

export default Minutes;
