import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { transcribeAudio } from "../controller/speech.controller.js";

const router = express.Router();

/**
 * POST /api/speech/transcribe
 *
 * Upload recorded audio
 */
router.post("/transcribe", upload.single("audio"), transcribeAudio);

export default router;
