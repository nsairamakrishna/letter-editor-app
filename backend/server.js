// backend/server.js
require("./config/passport"); // Ensure Passport configuration is loaded first
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://letter-editor-frontend.onrender.com" // ✅ Change this to your Render frontend URL
    ],
    credentials: true, // Allow cookies, sessions, and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
  })
);
app.use(cookieParser());

// Session Store (MongoDB) - Fixes Memory Leak in Production
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: false, // Set to `true` in production (requires HTTPS)
      httpOnly: true, // Protects against XSS attacks
        //   maxAge: 1000 * 60 * 60 * 24 // 1 day
      sameSite: "lax",
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/letters", require("./routes/letters"));
app.use("/auth", require("./routes/auth"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
