/**
 * resume.controller.js
 *
 * Express route handlers for resume operations.
 * All routes require authentication (authMiddleware applied in resume.routes.js).
 *
 * Handlers:
 *   uploadResumeController — POST /api/resume/upload
 *   getResumeController    — GET  /api/resume
 *   deleteResumeController — DELETE /api/resume
 */

import {
  deleteResumeService,
  getResumeService,
  uploadResumeService,
} from "../services/resume.service.js";

// ─── POST /api/resume/upload ──────────────────────────────────────────────────
export const uploadResumeController = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const resume = await uploadResumeService(userId, req.file.buffer, req.file.originalname);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: { fileUrl: resume.fileUrl, uploadedAt: resume.uploadedAt },
    });
  } catch (error) {
    console.error("[resume] upload error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/resume ──────────────────────────────────────────────────────────
export const getResumeController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const resume = await getResumeService(userId);

    if (!resume) {
      return res.status(404).json({ success: false, message: "No resume found." });
    }

    return res.status(200).json({
      success: true,
      data: { fileUrl: resume.fileUrl, uploadedAt: resume.uploadedAt },
    });
  } catch (error) {
    console.error("[resume] get error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/resume ───────────────────────────────────────────────────────
export const deleteResumeController = async (req, res) => {
  try {
    const userId = req.user.userId;
    await deleteResumeService(userId);

    return res.status(200).json({ success: true, message: "Resume deleted." });
  } catch (error) {
    console.error("[resume] delete error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
