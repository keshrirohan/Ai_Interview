import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import speechRoutes from "./routes/speech.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.Frontend_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ success: true, message: "🚀 Welcome to EchoHire AI Backend" });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/payment", paymentRoutes);

// ─── Global error handler ─────────────────────────────────────────────────────
// Catches any error passed via next(err) from routes / middleware
// Must have 4 parameters so Express recognises it as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[server] unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
