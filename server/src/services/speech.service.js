import fs from "fs";
import { groqClient } from "./groq.service.js";

export const transcribeAudioService = async (file) => {
  try {
    console.log("🎤 Sending audio to Groq...");

    const transcription = await groqClient.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: "whisper-large-v3-turbo",
      language: "en",
      response_format: "json",
    });

    // Delete uploaded file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    console.log("Transcript:", transcription.text);

    return transcription.text;
  } catch (error) {
    // Delete uploaded file even if an error occurs
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    console.error("Groq API Error:");
    console.error(error);

    throw error;
  }
};
