/**
 * speech.service.js
 *
 * Handles audio transcription via Groq Whisper.
 * Flow:
 *   1. Upload audio buffer → Cloudinary (cloud storage)
 *   2. Pass Cloudinary URL → Groq Whisper for transcription
 *   3. Delete audio from Cloudinary (cleanup)
 *   4. Return transcript text
 */

import { groqClient } from "./groq.service.js";
import { uploadAudioToCloudinary, deleteFromCloudinary } from "./cloudinary.service.js";

export const transcribeAudioService = async (file) => {
  let cloudinaryPublicId = null;

  try {
    console.log("☁️  Uploading audio to Cloudinary...");

    // Step 1 — Upload buffer to Cloudinary
    const { url, publicId } = await uploadAudioToCloudinary(
      file.buffer,
      file.originalname
    );
    cloudinaryPublicId = publicId;

    console.log("🎤 Sending audio to Groq Whisper...");

    // Step 2 — Transcribe via Groq Whisper using the Cloudinary URL
    const transcription = await groqClient.audio.transcriptions.create({
      file: await fetch(url).then(async (r) => {
        const blob = await r.blob();
        return new File([blob], file.originalname || "audio.webm", {
          type: file.mimetype || "audio/webm",
        });
      }),
      model: "whisper-large-v3-turbo",
      language: "en",
      response_format: "json",
    });

    console.log("✅ Transcript:", transcription.text);

    // Step 3 — Cleanup: delete from Cloudinary
    await deleteFromCloudinary(cloudinaryPublicId);

    return transcription.text;
  } catch (error) {
    // Cleanup on error too
    if (cloudinaryPublicId) {
      await deleteFromCloudinary(cloudinaryPublicId);
    }

    console.error("[Speech] Transcription error:", error);
    throw error;
  }
};
