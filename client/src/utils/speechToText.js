/**
 * speechToText.js
 *
 * Responsible ONLY for creating a configured SpeechRecognition instance.
 *
 * Lazy-initialises the constructor reference inside the factory function so
 * this module is safe to import in non-browser environments (SSR, unit tests).
 */

/**
 * Returns true if the current browser supports the Web Speech API.
 */
export const isSpeechRecognitionSupported = () => {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Creates and returns a configured SpeechRecognition instance.
 * Throws a clear error when the browser does not support the API so callers
 * (e.g. useSpeechRecognition) can surface a user-friendly message.
 */
export const createSpeechRecognition = () => {
  if (!isSpeechRecognitionSupported()) {
    throw new Error(
      "Speech Recognition is not supported in this browser. " +
      "Please use Chrome or Edge for the best experience.",
    );
  }

  // Accessed lazily — safe in non-browser builds
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.lang            = "en-US";
  recognition.continuous      = true;
  recognition.interimResults  = true;

  return recognition;
};
