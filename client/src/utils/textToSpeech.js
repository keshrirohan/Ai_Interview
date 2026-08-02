/**
 * textToSpeech.js
 *
 * Responsible ONLY for browser Speech Synthesis (AI voice).
 * Does not know anything about the interview flow.
 *
 * Exports:
 *   speak(text, onEnd)  – cancel any ongoing speech, then speak `text`.
 *                         Calls `onEnd` when the utterance finishes.
 *   cancelSpeak()       – cancel any ongoing speech immediately.
 *   isSpeaking()        – returns true if the synthesis engine is active.
 */

const synth = window.speechSynthesis;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns true while the browser synthesis engine is playing audio.
 * Useful as a guard before calling speak() again.
 */
export const isSpeaking = () => synth.speaking;

/**
 * Stop any in-progress speech immediately.
 * Safe to call even when nothing is playing.
 */
export const cancelSpeak = () => synth.cancel();

// ─── Main ─────────────────────────────────────────────────────────────────────

/**
 * Speak `text` using the browser's Speech Synthesis API.
 *
 * - Cancels any currently playing utterance before starting (prevents
 *   duplicate / overlapping TTS when the question changes or the hook
 *   re-runs).
 * - Calls the optional `onEnd` callback once the utterance has finished.
 *
 * @param {string}    text  - The text to speak.
 * @param {Function} [onEnd] - Callback fired when speech ends naturally.
 */
export const speak = (text, onEnd) => {
  if (!text) return;

  // Cancel any in-flight speech first to prevent duplicates
  cancelSpeak();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang   = "en-US";
  utterance.rate   = 1;
  utterance.pitch  = 1;
  utterance.volume = 1;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  utterance.onerror = (event) => {
    // "interrupted" fires when cancelSpeak() cuts a previous utterance;
    // it is not a real error — suppress it silently.
    if (event.error === "interrupted") return;
    console.error("[TTS] Speech synthesis error:", event.error);
  };

  synth.speak(utterance);
};

// Keep the old name as an alias so any other callers don't break
export const stopSpeaking = cancelSpeak;
