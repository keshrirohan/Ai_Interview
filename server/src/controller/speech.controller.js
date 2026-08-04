import { transcribeAudioService } from "../services/speech.service.js";

export const transcribeAudio = async (req, res) => {
  try {
    console.log("Controller req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio uploaded",
      });
    }

    const transcript = await transcribeAudioService(req.file);

    return res.status(200).json({
      success: true,
      transcript,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};