/**
 * speechToText.js
 *
 * Factory for creating a configured SpeechRecognition instance.
 *
 * Why this exists as a separate utility:
 *   - Centralises all SpeechRecognition configuration in one place.
 *   - Uses lazy initialisation so this file is safe to import in
 *     non-browser environments (e.g. SSR, unit tests) without crashing.
 *   - useSpeechRecognition.js calls createSpeechRecognition() to get
 *     a ready-to-use instance without knowing the config details.
 *
 * Browser support: Chrome and Edge only.
 * Firefox and Safari do not support the Web Speech API.
 */

/**
 * Returns true if the current browser supports SpeechRecognition.
 * Always call this before createSpeechRecognition() to show a clear
 * error message instead of a cryptic crash.
 */
export const isSpeechRecognitionSupported = () => {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Creates and returns a configured SpeechRecognition instance.
 *
 * Settings:
 *   lang            = "en-US"  — English transcription
 *   continuous      = true     — keeps recording until .stop() is called
 *   interimResults  = true     — returns partial results so the transcript
 *                                updates in real-time while the user speaks
 *
 * @throws {Error} if the browser does not support SpeechRecognition
 */
export const createSpeechRecognition = () => {
  if (!isSpeechRecognitionSupported()) {
    throw new Error(
      "Speech Recognition is not supported in this browser. " +
        "Please use Chrome or Edge for the best experience.",
    );
  }

  // Accessed lazily inside the function — never at module load time
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.lang           = "en-US";
  recognition.continuous     = true;
  recognition.interimResults = true;

  return recognition;
};
