const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

// ---------- Middleware ----------
app.use(express.json());

// ---------- Hardcoded credentials ----------
const VALID_USERS = [
    { username: "admin", password: "admin123" },
    { username: "testuser", password: "pass456" },
    { username: "jmeter", password: "loadtest" },
    { username: "demo", password: "demo789" },
    { username: "qa_engineer", password: "quality1" },
];

// ---------- Helpers ----------

/** Returns a random integer between min and max (inclusive). */
function randomDelay(min = 50, max = 200) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------- Routes ----------

// POST /login — credential check with artificial latency
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }

    const delay = randomDelay();

    setTimeout(() => {
        const isValid = VALID_USERS.some(
            (u) => u.username === username && u.password === password
        );

        if (isValid) {
            return res.status(200).json({
                message: "Login Successful",
                token: "fake-jwt-token",
            });
        }

        return res.status(401).json({ message: "Invalid credentials" });
    }, delay);
});

// GET /health — liveness probe
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "API is running" });
});

// ---------- Start ----------
app.listen(PORT, () => {
    console.log(`Mock API listening on http://localhost:${PORT}`);
});
