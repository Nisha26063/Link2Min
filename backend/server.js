const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
require("dotenv").config(); // For environment variables

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// SQLite Database Connection
const db = new sqlite3.Database("./meetings.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Google OAuth Configuration
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/auth/google/callback";
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Route to initiate Google OAuth
app.get("/auth/google", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        scope: ["profile", "email"], // Define scopes
    });
    res.redirect(authUrl);
});

// Callback route for Google OAuth
app.get("/auth/google/callback", async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Fetch user info
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const user = userInfo.data;
        // Here, you can save user info to your database or create a session
        console.log("User Info:", user);

        // For simplicity, we'll store a token in localStorage (client-side)
        const authToken = tokens.access_token; // In production, use JWT or session
        res.redirect(`http://localhost:3000/dashboard?token=${authToken}`);
    } catch (error) {
        console.error("Error in OAuth callback:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
});

// API to fetch meetings
app.get("/api/meetings", (req, res) => {
    const query = "SELECT * FROM meetings";
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            console.log("Fetched Meetings:", rows);
            res.json(rows);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
