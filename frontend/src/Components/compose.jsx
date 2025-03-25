import React, { useState } from "react";
import { FaPaperclip, FaSmile, FaTrash, FaBold, FaItalic, FaUnderline, FaImage } from "react-icons/fa";
import "../css/compose.css";
import {useNavigate} from "react-router-dom"

const ComposeEmail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);


  const navigate = useNavigate();


  const insertTextAtCursor = (text) => {
    const textarea = document.getElementById("editor");
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    const beforeText = message.substring(0, startPos);
    const afterText = message.substring(endPos, message.length);

    setMessage(beforeText + text + afterText);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
      textarea.focus();
    }, 0);
  };

  const handleFormatClick = (formatType) => {
    if (formatType === "bold") {
      setIsBold(!isBold);
    } else if (formatType === "italic") {
      setIsItalic(!isItalic);
    } else if (formatType === "underline") {
      setIsUnderline(!isUnderline);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      insertTextAtCursor(` [File: ${file.name}] `);
      alert("File Uploaded")

    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      insertTextAtCursor(` ![Image: ${file.name}] `);
      alert("Image Uploaded")
    }
  };

  const handleInsertEmoji = () => {
    insertTextAtCursor(" 😊 ");
  };

  const handleClearText = () => {
    setMessage("");
    setTo("");
    setSubject("");
  };

  const handleSubmit=()=>{
    alert("Message Send")
    setMessage("");
    setTo("");
    setSubject("");
    
  }


  return (
    <div className="compose-wrapper">
      <div className="compose-container">
        <div className="compose-header">
          <h3>New Mail</h3>
          <button className="close-btn" onClick={()=>{ navigate("/dashboard")}}>✖</button>
        </div>


        <form onSubmit={handleSubmit}>

        <div className="compose-body">
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="compose-input"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="compose-input"
          />


          <textarea
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="compose-textarea"
        required
        style={{
          fontWeight: isBold ? "bold" : "normal",
          fontStyle: isItalic ? "italic" : "normal",
          textDecoration: isUnderline ? "underline" : "none",
        }}
      />
        </div>

        <div className="compose-toolbar">
        <FaBold className="toolbar-icon" onClick={() => handleFormatClick("bold")} />
        <FaItalic className="toolbar-icon" onClick={() => handleFormatClick("italic")} />
        <FaUnderline className="toolbar-icon" onClick={() => handleFormatClick("underline")} />
        
        <label>
          <FaPaperclip className="toolbar-icon" />
          <input type="file" style={{ display: "none" }} onChange={handleFileUpload} />
        </label>

        <label>
          <FaImage className="toolbar-icon" />
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        </label>

        <FaSmile className="toolbar-icon" onClick={handleInsertEmoji} />
        <FaTrash className="toolbar-icon delete" onClick={handleClearText} />
      </div>

        <div className="compose-footer">
          <button type="submit" className="send-btn">Send</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeEmail;
