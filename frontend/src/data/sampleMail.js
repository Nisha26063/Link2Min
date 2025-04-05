export const sampleMail = {
    senderName: "John Smith",
    senderEmail: "john.smith@example.com",
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
    attachments: [
        { 
            name: "Project_Timeline.pdf", 
            size: 2048576, // 2MB
            type: "application/pdf"
        },
        { 
            name: "Budget_Report.xlsx", 
            size: 1048576, // 1MB
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        },
        { 
            name: "Meeting_Notes.docx", 
            size: 524288, // 512KB
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
    ]
};

// Sample mail list for inbox
export const mailList = [
    {
        id: 1,
        senderName: "John Smith",
        senderEmail: "john.smith@example.com",
        date: "2024-03-20T10:30:00",
        subject: "Meeting Minutes - Project Review",
        preview: "I wanted to share the minutes from our recent project review meeting...",
        isImportant: true,
        isRead: false
    },
    {
        id: 2,
        senderName: "Sarah Johnson",
        senderEmail: "sarah.j@example.com",
        date: "2024-03-20T09:15:00",
        subject: "Design Assets Ready for Review",
        preview: "The latest design assets for the homepage are ready for your review...",
        isImportant: false,
        isRead: true
    },
    {
        id: 3,
        senderName: "Mike Wilson",
        senderEmail: "mike.w@example.com",
        date: "2024-03-19T16:45:00",
        subject: "Client Feedback on Latest Prototype",
        preview: "We've received positive feedback from the client on the latest prototype...",
        isImportant: true,
        isRead: false
    }
]; 