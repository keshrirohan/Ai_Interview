/**
 * Upload recorded audio to the backend
 *
 * @param {Blob} audioBlob
 * @returns {Promise<Object>}
 */
export const uploadAudio = async (audioBlob) => {
  if (!audioBlob) {
    throw new Error("No audio available.");
  }

  const formData = new FormData();

  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/speech/transcribe`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  const data = await response.json();
  console.log("Upload response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload audio.");
  }

  return data;
};
