import React from 'react';
import '../css/mailview.css';
import { FaPaperclip, FaFile, FaDownload } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Mail = () => {
    const location = useLocation();
    const { message } = location.state || {};

    if (!message) {
        return <div>No email data available</div>;
    }

    // Helper to extract name and email from "Name <email>" format
    const parseSender = (senderStr) => {
        const match = senderStr.match(/(.*?)\s*<(.+?)>/);
        if (match) {
            return {
                name: match[1].trim(),
                email: match[2].trim()
            };
        }
        return {
            name: senderStr,
            email: ''
        };
    };

    const { name: senderName, email: senderEmail } = parseSender(message.sender);

    const getInitial = (name) => name.charAt(0).toUpperCase();

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="mail-view-container">
            <div className="mail-header">
                <div className="sender-avatar">
                    {getInitial(senderName)}
                </div>
                <div className="sender-info">
                    <div className="sender-name">{senderName}</div>
                    <div className="sender-email">{senderEmail}</div>
                </div>
                <div className="mail-meta">
                    <span>{formatDate(message.date)}</span>
                    {message.isImportant && <span className="important-badge">Important</span>}
                </div>
            </div>

            <div className="mail-content">
                <h1 className="mail-subject">{message.subject}</h1>
                <div className="mail-body">
                    {message.body || 'No content available.'}
                </div>

                {message.attachments && message.attachments.length > 0 && (
                    <div className="mail-attachments">
                        <h3 className="attachment-title">
                            <FaPaperclip /> Attachments
                        </h3>
                        <div className="attachment-list">
                            {message.attachments.map((attachment, index) => (
                                <div key={index} className="attachment-item">
                                    <span className="attachment-icon">
                                        <FaFile />
                                    </span>
                                    <span className="attachment-name">{attachment.name}</span>
                                    <button className="action-button" title="Download">
                                        <FaDownload />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mail;
