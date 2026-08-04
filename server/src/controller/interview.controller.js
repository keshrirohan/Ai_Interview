/**
 * interview.controller.js
 *
 * Express route handlers for interview operations.
 * Each controller is thin — it extracts data from req, calls a service
 * function, and sends the response. Business logic stays in the service.
 *
 * Handlers:
 *   startInterviewController    — POST /api/interview/start
 *   generateInterviewQuestion   — POST /api/interview/:interviewId/question
 *   processInterviewController  — POST /api/interview/:interviewId/process
 */

// Single import — previously startInterview was imported twice
import {
  startInterview,
  getFirstQuestion,
  processInterview,
} from "../services/interview.service.js";

// ─── POST /start ──────────────────────────────────────────────────────────────
export const startInterviewController = async (req, res) => {
  try {
    const newInterview = await startInterview(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Interview started successfully.",
      data: newInterview,
    });
  } catch (error) {
    console.error("[interview] startInterview error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── POST /:interviewId/question ──────────────────────────────────────────────
export const generateInterviewQuestion = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const questionData = await getFirstQuestion(interviewId);

    res.json({
      success: true,
      data: questionData,
    });
  } catch (error) {
    console.error("[interview] getFirstQuestion error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── POST /:interviewId/process ───────────────────────────────────────────────
export const processInterviewController = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { answer }      = req.body;

    // Note: answer is already validated and trimmed by the route middleware
    const result = await processInterview(interviewId, answer);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[interview] processInterview error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
