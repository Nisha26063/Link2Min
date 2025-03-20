const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./meetings.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// API to fetch meetings
app.get("/api/meetings", (req, res) => {
    const query = "SELECT * FROM meetings";  // Ensure your table name is correct
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            console.log("Fetched Meetings:", rows);  // ✅ Debug: Check data structure
            res.json(rows);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
