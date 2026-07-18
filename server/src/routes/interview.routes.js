import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {
  generateInterviewQuestion,
  processInterviewController,
  startInterviewController,
} from "../controller/interview.controller.js";

const router = express.Router();

router.post("/start", authMiddleware, startInterviewController);

router.post(
  "/:interviewId/question",
  authMiddleware,
  generateInterviewQuestion,
);

router.post(
  "/:interviewId/process",
  authMiddleware,
  processInterviewController,
);

export default router;
