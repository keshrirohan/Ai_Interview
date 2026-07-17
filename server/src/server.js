import express from "express";

import cors from "cors";

import dotenv from "dotenv";
import { prisma } from "../lib/prisma.js";
dotenv.config();

import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import interviewRouter from "./routes/interview.routes.js";

import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Welcome to EchoHire AI Backend",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
