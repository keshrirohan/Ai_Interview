/**
 * test-services.mjs
 * Quick smoke test for Cloudinary + email config.
 * Run: node scripts/test-services.mjs
 */
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";

// ─── Cloudinary ping ──────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary: connected →", result.status);
  } catch (e) {
    console.error("❌ Cloudinary: FAILED →", e.message);
  }
}

// ─── Email ping ───────────────────────────────────────────────────────────────
async function testEmail() {
  if (!process.env.CONTACT_EMAIL_USER || !process.env.CONTACT_EMAIL_PASS) {
    console.warn("⚠️  Email: env vars not set, skipping.");
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.CONTACT_EMAIL_USER, pass: process.env.CONTACT_EMAIL_PASS },
  });
  try {
    await transporter.verify();
    console.log("✅ Email (Gmail SMTP): connected as", process.env.CONTACT_EMAIL_USER);
  } catch (e) {
    console.error("❌ Email: FAILED →", e.message);
  }
}

await testCloudinary();
await testEmail();
