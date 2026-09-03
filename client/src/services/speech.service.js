/**
 * speech.service.js
 *
 * Client-side service for uploading recorded audio to the backend
 * transcription endpoint.
 *
 * Why the Authorization header is included:
 *   The /api/speech/transcribe route is protected by authMiddleware, which
 *   accepts the JWT from either the httpOnly cookie OR the Authorization
 *   header. Including the header as a fallback ensures transcription works
 *   even in browsers or environments where cookies are blocked (e.g. some
 *   cross-origin setups, Incognito with strict cookie settings).
 */

import { API_BASE } from "../config/api";

/**
 * @param {Blob} audioBlob — the raw audio from useMediaRecorder
 * @returns {Promise<{ transcript: string }>}
 * @throws {Error} if the blob is empty or the API returns an error
 */
export const uploadAudio = async (audioBlob) => {
  if (!audioBlob) {
    throw new Error("No audio available.");
  }

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  // Include the JWT from localStorage as a fallback in case the httpOnly
  // cookie is not sent automatically (cross-origin or cookie-blocked env).
  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(
    `${API_BASE}/api/speech/transcribe`,
    {
      method: "POST",
      credentials: "include",
      headers: authHeaders,   // Content-Type is intentionally omitted — the
      body: formData,         // browser sets it automatically with the correct
    },                        // multipart boundary when body is FormData
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload audio.");
  }

  return data;
};
