// ─── Load environment variables from .env file ───
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

// ─── Import route files ───
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware: Enable CORS so the React frontend can call this API ───
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allow cookies/session for auth
  })
);

// ─── Middleware: Parse incoming JSON request bodies ───
app.use(express.json());

// ─── Middleware: Session support (required for Passport.js) ───
app.use(
  session({
    secret: process.env.SESSION_SECRET || "chat-genius-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// ─── Initialize Passport.js for authentication ───
app.use(passport.initialize());
app.use(passport.session());

// ─── Register routes ───
app.use("/auth", authRoutes);   // Google OAuth routes
app.use("/chat", chatRoutes);   // ChatGPT API routes

// ─── Health check endpoint ───
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Chat Genius backend is running 🚀" });
});

// ─── Start the server ───
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
