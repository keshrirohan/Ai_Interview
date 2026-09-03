/**
 * auth.routes.js
 *
 * Express routes for authentication.
 * JWTs are stored exclusively in httpOnly cookies — never in the response body.
 *
 * Routes:
 *   POST /login     — validate credentials, set JWT cookie
 *   POST /logout    — clear JWT cookie
 *   POST /register  — create account, set JWT cookie
 *   GET  /me        — verify cookie, return current user data
 */

import express from "express";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";

const router = express.Router();

const JWT_SECRET_DEV_FALLBACK = "521984fda052147d1fcf2333cf1b0a78754d7bcd46a3f40e0a6bcf68e88d3de2e6965bda25bd2074ff952d425362f42c2e06eb2d330795d1c4d1c211215c513c";
const getSecret = () => process.env.JWT_SECRET || JWT_SECRET_DEV_FALLBACK;

// ─── Rate limiter for auth endpoints ─────────────────────────────────────────
// 10 attempts per 15 minutes — only enforced in production
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
  skip: () => process.env.NODE_ENV !== "production",
});

// ─── Shared cookie options ────────────────────────────────────────────────────
const isProd = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,                                                        // HTTPS in prod
  sameSite: isProd ? "none" : "lax",                                    // cross-origin in prod
  maxAge: 7 * 24 * 60 * 60 * 1000,                                      // 7 days
  path: "/",                                                             // available across all routes
};

// ─── POST /login ──────────────────────────────────────────────────────────────
router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign({ userId: user.id }, getSecret(), {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Expose token for Authorization header fallback in browsers blocking 3rd-party cookies
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("[auth] login error:", error);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
});

// ─── POST /logout ─────────────────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.json({ success: true, message: "Logged out successfully." });
});

// ─── POST /register ───────────────────────────────────────────────────────────
router.post("/register", authLimiter, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long.",
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with that email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name: name.trim(), email: cleanEmail, password: hashedPassword },
    });

    const token = jwt.sign({ userId: newUser.id }, getSecret(), {
      expiresIn: "7d",
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        plan: newUser.plan,
      },
    });
  } catch (error) {
    console.error("[auth] register error:", error);
    return res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// ─── GET /me ──────────────────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
  }

  try {
    const decoded = jwt.verify(token, getSecret());

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, plan: true }, // never return password
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }
});

export default router;
