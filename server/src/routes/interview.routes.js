import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {
  generateInterviewQuestion,
  processInterviewController,
  startInterviewController,
} from "../controller/interview.controller.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

router.post("/start", authMiddleware, startInterviewController);
router.get("/:interviewId", authMiddleware, async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.id;

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId,
      },
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

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
