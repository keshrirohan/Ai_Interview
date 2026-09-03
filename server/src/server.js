/**
 * server.js
 *
 * Express application entry point.
 *
 * Production deployment notes:
 *   - Set NODE_ENV=production on Render
 *   - Set FRONTEND_URL=https://ai-interview-6iv5.onrender.com on Render
 *   - Render injects PORT automatically — do NOT hardcode it
 *   - Cookies require secure=true + sameSite=none for cross-origin Render deploys
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env explicitly from the server directory root
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config(); // fallback for standard process.cwd()

import authRouter      from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import speechRoutes    from "./routes/speech.routes.js";
import paymentRoutes   from "./routes/payment.routes.js";
import contactRoutes   from "./routes/contact.routes.js";
import adminRoutes     from "./routes/admin.routes.js";
import googleAuthRouter from "./routes/google.routes.js";
import resumeRoutes    from "./routes/resume.routes.js";

const app = express();

// ─── Trust proxy (required on Render / Heroku for secure cookies) ─────────────
// Render sits behind a reverse proxy — without this, req.ip is always the proxy IP
// and res.cookie secure flag may not be applied correctly.
app.set("trust proxy", 1);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// FRONTEND_URL must be set in Render environment variables for production.
// In development VITE runs on :5173 — always allowed.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.Frontend_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://localhost:3000",
].filter(Boolean);                     // remove undefined/empty if env var is missing

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // In development allow everything so local work is never blocked
      if (process.env.NODE_ENV !== "production") return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} is not allowed`), false);
    },
    credentials: true,                 // required for httpOnly cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ─── Core middleware ───────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Global rate limiters ──────────────────────────────────────────────────────
// Auth endpoints: 20 attempts per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
  skip: () => process.env.NODE_ENV !== "production", // only enforce in production
});

// AI endpoints: 60 requests per minute per IP (Groq has its own rate limits)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many AI requests. Please slow down." },
  skip: () => process.env.NODE_ENV !== "production",
});

// ─── Health check (no auth required — used by Render health checks) ───────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status:  "ok",
    service: "EchoHire AI Backend",
    timestamp: new Date().toISOString(),
  });
});

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ success: true, message: "🚀 Welcome to EchoHire AI Backend" });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRouter);
app.use("/api/auth",      googleAuthRouter);   // Google OAuth: /api/auth/google
app.use("/api/interview", interviewRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/speech",    speechRoutes);
app.use("/api/payment",   paymentRoutes);
app.use("/api/contact",   contactRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/resume",    resumeRoutes);

// ─── Global error handler ─────────────────────────────────────────────────────
// Must be 4-argument for Express to recognise it as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[server] unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
// Always use process.env.PORT — Render injects this automatically.
// Never hardcode 5000 for production.
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 EchoHire AI backend running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
