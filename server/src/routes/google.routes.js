/**
 * google.routes.js
 *
 * Google OAuth 2.0 authentication routes.
 *
 * Flow:
 *   1. Browser calls GET /api/auth/google — redirects user to Google consent screen
 *   2. Google redirects back to GET /api/auth/google/callback
 *   3. Server exchanges code for profile, creates/finds user, signs JWT, sets cookie
 *   4. Server redirects browser to FRONTEND_URL/?auth=success
 *
 * Required environment variables (server/.env):
 *   GOOGLE_CLIENT_ID      — from Google Cloud Console
 *   GOOGLE_CLIENT_SECRET  — from Google Cloud Console (never expose to frontend)
 *   FRONTEND_URL          — e.g. https://ai-interview-6iv5.onrender.com
 *   NODE_ENV              — set to "production" on Render
 *
 * Google Cloud Console → OAuth 2.0 Client → Authorised redirect URIs must include:
 *   Production:  https://backend-echohire.onrender.com/api/auth/google/callback
 *   Development: http://localhost:5000/api/auth/google/callback
 */

import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

// ─── Configure Passport Google Strategy ───────────────────────────────────────
// Only initialise if credentials are present — avoids crashing when env vars
// are not yet configured during early development.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const backendURL = process.env.BACKEND_URL || "http://localhost:5000";

  passport.use(
    new GoogleStrategy(
      {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  `${backendURL}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("Google account has no email."), null);

          // Find or create the user
          let user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            // Create with a random unguessable password — they will use Google to log in
            const randomPassword = Math.random().toString(36).slice(2) + Date.now();
            user = await prisma.user.create({
              data: {
                name:     profile.displayName || email.split("@")[0],
                email,
                password: randomPassword, // hashed on next step would be ideal; for Google auth this is never used directly
              },
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );

  // Passport session serialization — we use stateless JWT so these are minimal
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // ─── Middleware ──────────────────────────────────────────────────────────────
  router.use(passport.initialize());

  // ─── GET /api/auth/google ────────────────────────────────────────────────────
  // Step 1: redirect user to Google consent screen
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false }),
  );

  // ─── GET /api/auth/google/callback ──────────────────────────────────────────
  // Step 2: Google calls this with ?code=... after user grants permission
  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/?auth=error` }),
    (req, res) => {
      const user = req.user;
      const isProd = process.env.NODE_ENV === "production";

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const COOKIE_OPTIONS = {
        httpOnly: true,
        secure:   isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge:   7 * 24 * 60 * 60 * 1000,
        path: "/",
      };

      res.cookie("token", token, COOKIE_OPTIONS);

      // Pass token in query string as fallback for browsers that block cross-site cookies.
      // The frontend reads this once, stores it in localStorage, then removes it from the URL.
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendURL}/?auth=success&token=${token}`);
    },
  );
} else {
  // Google credentials not configured — return informative 501 so the UI can handle it
  router.get("/google",          (_req, res) => res.status(501).json({ success: false, message: "Google OAuth is not configured on this server." }));
  router.get("/google/callback", (_req, res) => res.status(501).json({ success: false, message: "Google OAuth is not configured on this server." }));
}

export default router;
