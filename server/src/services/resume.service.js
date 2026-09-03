/**
 * resume.service.js
 *
 * Handles resume file operations:
 *   - Upload PDF/DOC/DOCX to Cloudinary (raw resource type for documents)
 *   - Store file URL in the Resume model linked to the user
 *   - Retrieve the user's current resume
 *   - Replace existing resume (upsert pattern)
 *   - Delete resume
 *
 * Why Cloudinary for resumes?
 *   Render's filesystem is ephemeral — files written to disk are lost on
 *   every deploy or dyno restart. Cloudinary provides permanent storage.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { prisma } from "../../lib/prisma.js";

// Cloudinary is configured once in cloudinary.service.js but since services
// are independent modules we configure it here too (idempotent).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// ─── Upload document buffer to Cloudinary ────────────────────────────────────
const uploadResumeToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    // Use "raw" resource type for PDF/DOC files — not "image" or "video"
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder:        "echohire/resumes",
        public_id:     `resume_${Date.now()}`,
        overwrite:     true,
        invalidate:    true,
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Resume upload error:", error);
          return reject(error);
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// ─── Delete a raw Cloudinary asset ───────────────────────────────────────────
const deleteResumeFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      invalidate:    true,
    });
  } catch (err) {
    console.warn("[Cloudinary] Resume delete failed (non-fatal):", err.message);
  }
};

// ─── Derive public_id from a Cloudinary URL ──────────────────────────────────
// Cloudinary raw URLs look like: https://res.cloudinary.com/<cloud>/raw/upload/v.../echohire/resumes/resume_123
// We extract the path after "/upload/v<version>/" or after "/upload/"
const extractPublicId = (url) => {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  return match ? match[1] : null;
};

// ─── Service: Upload or replace resume ───────────────────────────────────────
export const uploadResumeService = async (userId, buffer, originalName) => {
  // Delete previous resume from Cloudinary if one exists
  const existing = await prisma.resume.findUnique({ where: { userId } });
  if (existing) {
    const oldPublicId = extractPublicId(existing.fileUrl);
    await deleteResumeFromCloudinary(oldPublicId);
  }

  // Upload new file
  const { url } = await uploadResumeToCloudinary(buffer, originalName);

  // Upsert the Resume record
  const resume = await prisma.resume.upsert({
    where:  { userId },
    update: { fileUrl: url, uploadedAt: new Date(), parsedText: "" },
    create: { userId, fileUrl: url, parsedText: "" },
  });

  return resume;
};

// ─── Service: Get user's resume ───────────────────────────────────────────────
export const getResumeService = async (userId) => {
  return prisma.resume.findUnique({ where: { userId } });
};

// ─── Service: Delete user's resume ───────────────────────────────────────────
export const deleteResumeService = async (userId) => {
  const existing = await prisma.resume.findUnique({ where: { userId } });
  if (!existing) throw new Error("No resume found.");

  const publicId = extractPublicId(existing.fileUrl);
  await deleteResumeFromCloudinary(publicId);

  await prisma.resume.delete({ where: { userId } });
  return { success: true };
};
