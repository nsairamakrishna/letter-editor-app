// backend/routes/auth.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// Google OAuth Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, name: req.user.name, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Store token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS required)
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour expiration
    });

    res.redirect("https://marvelous-cat-4b7d01.netlify.app/home"); // Redirect to home after login
  }
);

// Get Authenticated User (Read token from cookies)
router.get("/user", (req, res) => {
  const token = req.cookies.token; // Get JWT token from cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    res.json({ user: { id: decoded.id, name: decoded.name, email: decoded.email } });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
});

// Logout Route
router.get("/logout", (req, res, next) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
  
    req.logout(function (err) {
      if (err) return next(err);
  
      req.session.destroy(() => { // Ensure session is cleared
        res.json({ message: "Logged out successfully" }); // Send a response instead of redirecting
      });
    });
  });
  

module.exports = router;
