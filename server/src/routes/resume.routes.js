/**
 * resume.routes.js
 *
 * Routes for resume upload, retrieval, and deletion.
 * All routes are protected by authMiddleware.
 *
 * Routes:
 *   POST   /api/resume/upload  — upload or replace resume (PDF/DOC/DOCX, max 10 MB)
 *   GET    /api/resume         — get the authenticated user's current resume URL
 *   DELETE /api/resume         — delete the authenticated user's resume
 *
 * File is stored on Cloudinary (not Render's ephemeral filesystem).
 */

import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  deleteResumeController,
  getResumeController,
  uploadResumeController,
} from "../controller/resume.controller.js";

const router = express.Router();

// Multer: memory storage, document types only, 10 MB max
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents (.pdf, .doc, .docx) are allowed."), false);
    }
  },
});

router.post(
  "/upload",
  authMiddleware,
  resumeUpload.single("resume"),   // field name in FormData must be "resume"
  uploadResumeController,
);

router.get(  "/", authMiddleware, getResumeController);
router.delete("/", authMiddleware, deleteResumeController);

export default router;
