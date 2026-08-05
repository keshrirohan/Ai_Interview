/**
 * interview.routes.js
 *
 * Express routes for all interview operations.
 * Each route is protected by authMiddleware (requires a valid JWT cookie).
 *
 * Routes:
 *   POST /start                   — create a new interview session
 *   GET  /:interviewId            — fetch interview details + AI-generated role
 *   POST /:interviewId/question   — get or generate the first question
 *   POST /:interviewId/process    — submit an answer and receive the next question
 */

import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  generateInterviewQuestion,
  processInterviewController,
  startInterviewController,
} from "../controller/interview.controller.js";
import { prisma } from "../../lib/prisma.js";
import { generateRole } from "../services/groq.service.js";

const router = express.Router();

// ─── POST /start ──────────────────────────────────────────────────────────────
router.post("/start", authMiddleware, startInterviewController);

// ─── GET /:interviewId ────────────────────────────────────────────────────────
router.get("/:interviewId", authMiddleware, async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.userId; // auth middleware sets userId

    // 1. Fetch interview first — null-check BEFORE any AI call
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    // 2. Generate role label only after we know the record exists
    const roleData = await generateRole(interview.jobDescription);

    return res.json({
      success: true,
      data: {
        ...interview,
        role: roleData.role,
      },
    });
  } catch (error) {
    console.error("[interview] GET /:interviewId error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ─── POST /:interviewId/question ──────────────────────────────────────────────
router.post(
  "/:interviewId/question",
  authMiddleware,
  generateInterviewQuestion,
);

// ─── POST /:interviewId/process ───────────────────────────────────────────────
router.post(
  "/:interviewId/process",
  authMiddleware,
  // Basic input validation before hitting the controller / AI
  (req, res, next) => {
    const { answer } = req.body;

    if (!answer || typeof answer !== "string" || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required and must be a non-empty string.",
      });
    }

    // Normalise whitespace so the service always gets clean input
    req.body.answer = answer.trim();
    next();
  },
  processInterviewController,
);

export default router;
