/**
 * cloudinary.service.js
 *
 * Cloudinary integration for EchoHire AI.
 * Used to upload audio recordings to Cloudinary before transcription,
 * then delete them after Groq Whisper processes the audio.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload an audio buffer to Cloudinary.
 * @param {Buffer} buffer - The audio file buffer (from multer memoryStorage)
 * @param {string} filename - Original filename for logging
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadAudioToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video", // Cloudinary uses "video" type for audio files
        folder: "echohire/audio",
        public_id: `audio_${Date.now()}`,
        format: "webm",
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Upload error:", error);
          return reject(error);
        }
        console.log(`[Cloudinary] Uploaded audio: ${filename} → ${result.secure_url}`);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    // Convert buffer to readable stream and pipe to Cloudinary
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Delete an audio file from Cloudinary after transcription.
 * @param {string} publicId - The Cloudinary public_id of the asset
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
      invalidate: true,
    });
    console.log(`[Cloudinary] Deleted asset: ${publicId} → ${result.result}`);
  } catch (error) {
    // Non-fatal — log but don't throw
    console.warn("[Cloudinary] Failed to delete asset:", publicId, error.message);
  }
};
