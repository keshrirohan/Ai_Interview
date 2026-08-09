/**
 * contact.service.js
 *
 * Handles contact form submissions:
 *   1. Save message to database (ContactMessage table)
 *   2. Send email notification to admin via Nodemailer (Gmail SMTP)
 *
 * Required env vars for email:
 *   CONTACT_EMAIL_USER  — your Gmail address (e.g. you@gmail.com)
 *   CONTACT_EMAIL_PASS  — Gmail App Password (NOT your real Gmail password)
 *                         Generate at: https://myaccount.google.com/apppasswords
 *   CONTACT_EMAIL_TO    — recipient email (defaults to CONTACT_EMAIL_USER)
 */

import { prisma } from "../../lib/prisma.js";
import nodemailer from "nodemailer";

// Build transporter lazily so missing env vars don't crash on startup
const getTransporter = () => {
  if (!process.env.CONTACT_EMAIL_USER || !process.env.CONTACT_EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  });
};

/**
 * Send an admin notification email for a new contact message.
 */
const sendContactNotificationEmail = async ({ name, email, subject, message }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Contact] Email not configured — skipping notification email.");
    return;
  }

  const to = process.env.CONTACT_EMAIL_TO || process.env.CONTACT_EMAIL_USER;

  const mailOptions = {
    from: `"EchoHire AI" <${process.env.CONTACT_EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `[EchoHire Contact] ${subject || "New message from " + name}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #e4e4e7; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #fff;">📬 New Contact Message</h1>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px; color: #fff;">EchoHire AI — Contact Form Submission</p>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-size: 13px; color: #a1a1aa; width: 100px;">From</td>
              <td style="padding: 10px 0; font-size: 14px; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 13px; color: #a1a1aa;">Email</td>
              <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #60a5fa;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 13px; color: #a1a1aa;">Subject</td>
              <td style="padding: 10px 0; font-size: 14px;">${subject || "General Inquiry"}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
          <p style="font-size: 13px; color: #a1a1aa; margin: 0 0 12px;">Message</p>
          <div style="background: #18181b; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
${message}
          </div>
          <div style="margin-top: 32px; text-align: center;">
            <a href="mailto:${email}" style="background: #3b82f6; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 13px; font-weight: 600; display: inline-block;">
              Reply to ${name}
            </a>
          </div>
        </div>
        <div style="padding: 16px 32px; background: #18181b; text-align: center; font-size: 12px; color: #52525b;">
          EchoHire AI · Automated Contact Notification
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`[Contact] Notification email sent to ${to}`);
};

/**
 * Main service: save to DB + send email notification.
 */
export const createContactMessageService = async (data, userId = null) => {
  const { name, email, subject, message } = data;

  if (!name || !email || !message) {
    throw new Error("Name, email, and message are required.");
  }

  // 1. Save to database
  const contactMessage = await prisma.contactMessage.create({
    data: {
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : "General Inquiry",
      message: message.trim(),
    },
  });

  // 2. Send email notification (non-blocking — don't let email failure kill the response)
  sendContactNotificationEmail({
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim(),
    message: message.trim(),
  }).catch((err) => {
    console.error("[Contact] Email notification failed:", err.message);
  });

  return contactMessage;
};
