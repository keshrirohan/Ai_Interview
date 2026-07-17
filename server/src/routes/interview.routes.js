import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {
  generateInterviewQuestion,
  startInterviewController,
} from "../controller/interview.controller.js";

const router = express.Router();

router.post("/start", authMiddleware, startInterviewController);

router.post("/question", authMiddleware, generateInterviewQuestion);

export default router;
