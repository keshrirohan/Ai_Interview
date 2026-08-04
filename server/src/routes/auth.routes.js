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

const router = express.Router();

// ─── Shared cookie options ────────────────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,                                        // not accessible via JS
  secure: process.env.NODE_ENV === "production",        // HTTPS only in prod
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,                     // 7 days in ms
};

// ─── POST /login ──────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in an httpOnly cookie — never expose it in the response body
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[auth] login error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /logout ─────────────────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.json({ success: true, message: "Logged out successfully." });
});

// ─── POST /register ───────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with that email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("[auth] register error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── GET /me ──────────────────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true }, // never return password
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
