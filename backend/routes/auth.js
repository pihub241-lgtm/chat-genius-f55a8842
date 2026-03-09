// ─── Google OAuth 2.0 Authentication Routes ───

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();

// ─── Configure Google OAuth Strategy ───
// You need GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from:
// https://console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client IDs
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Called after successful Google login
      // In production, you'd save the user to a database here
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value,
      };
      return done(null, user);
    }
  )
);

// ─── Serialize/Deserialize user for session storage ───
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ─── Route: Start Google OAuth login flow ───
// Frontend should redirect or link to: http://localhost:5000/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ─── Route: Google OAuth callback (Google redirects here after login) ───
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    // On success, redirect to the React frontend
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(frontendURL + "/");
  }
);

// ─── Route: Get the currently logged-in user ───
router.get("/user", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// ─── Route: Log out the current user ───
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

// ─── Route: Login failure ───
router.get("/failure", (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

module.exports = router;
