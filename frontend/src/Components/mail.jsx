import React from 'react';
import '../css/mailview.css';
import {  FaPaperclip, FaFile, FaDownload } from 'react-icons/fa';

// Sample mail data
const sampleMail = {
    senderName: "Jesus",
    senderEmail: "Jesus@example.com",
    date: "2024-03-20T10:30:00",
    subject: "Meeting Minutes - Project Review",
    body: `Dear Team,

I hope this email finds you well. I wanted to share the minutes from our recent project review meeting.

Key Points Discussed:
1. Project Timeline
   - Phase 1 completion: On track
   - Phase 2 kickoff: Next week
   - Final delivery: Expected by end of Q2

2. Resource Allocation
   - Development team: Fully staffed
   - QA team: Need 2 additional members
   - Design team: Current capacity is sufficient

3. Budget Review
   - Current spending: Within 85% of allocated budget
   - Additional funds requested for new tools
   - ROI projections look promising

Action Items:
- Sarah: Complete the technical documentation by Friday
- Mike: Schedule follow-up with stakeholders
- Team: Review and update project risks

Please review these points and let me know if you have any questions or concerns.

Best regards,
John`,
    isImportant: true,
    
};

const Mail = ({ mail = sampleMail }) => {
    // Get first letter of sender's name for avatar
    const getInitial = (name) => name.charAt(0).toUpperCase();

    // Format date
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
                    {getInitial(mail.senderName)}
                </div>
                <div className="sender-info">
                    <div className="sender-name">{mail.senderName}</div>
                    <div className="sender-email">{mail.senderEmail}</div>
                </div>
                <div className="mail-meta">
                    <span>{formatDate(mail.date)}</span>
                    {mail.isImportant && <span className="important-badge">Important</span>}
                </div>
            </div>

            <div className="mail-content">
                <h1 className="mail-subject">{mail.subject}</h1>
                <div className="mail-body">
                    {mail.body}
                </div>

                {mail.attachments && mail.attachments.length > 0 && (
                    <div className="mail-attachments">
                        <h3 className="attachment-title">
                            <FaPaperclip /> Attachments
                        </h3>
                        <div className="attachment-list">
                            {mail.attachments.map((attachment, index) => (
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