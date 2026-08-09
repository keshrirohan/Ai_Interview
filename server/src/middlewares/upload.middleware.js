/**
 * upload.middleware.js
 *
 * Multer configuration for audio file uploads.
 * Uses memoryStorage (no disk I/O) — the audio buffer is held in
 * RAM and passed directly to Cloudinary for upload.
 */

import multer from "multer";

// Use memoryStorage — file goes to req.file.buffer, never touches disk
const storage = multer.memoryStorage();

// Accept audio and webm recordings
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("audio/") ||
    file.mimetype.startsWith("video/") ||
    file.mimetype === "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only audio recordings are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB — Cloudinary free tier supports this
  },
});

export default upload;