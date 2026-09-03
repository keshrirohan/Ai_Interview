/**
 * textToSpeech.js
 *
 * Responsible ONLY for browser Speech Synthesis (AI voice).
 *
 * Uses a lazy getter for window.speechSynthesis so this module is safe to
 * import in non-browser environments (SSR, unit tests) without throwing.
 */

// ─── Browser support ─────────────────────────────────────────────────────────

/** Returns the synthesis engine, or null if the browser doesn't support it. */
const getSynth = () => {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
};

export const isSpeechSynthesisSupported = () => Boolean(getSynth());

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true while the browser synthesis engine is playing audio. */
export const isSpeaking = () => getSynth()?.speaking ?? false;

/**
 * Stop any in-progress speech immediately.
 * Safe to call even when nothing is playing or when unsupported.
 */
export const cancelSpeak = () => getSynth()?.cancel();

// ─── Main ─────────────────────────────────────────────────────────────────────

/**
 * Speak `text` using the browser Speech Synthesis API.
 *
 * - Cancels any in-flight utterance before starting (prevents duplicates).
 * - Calls the optional `onEnd` callback once the utterance finishes naturally.
 * - Silently no-ops when the browser doesn't support speech synthesis.
 *
 * @param {string}    text   - The text to speak.
 * @param {Function} [onEnd] - Callback fired when speech ends naturally.
 */
export const speak = (text, onEnd) => {
  const synth = getSynth();

  if (!synth || !text) {
    // If synthesis is unsupported, still call onEnd so the interview flow
    // (start listening) isn't permanently blocked.
    onEnd?.();
    return;
  }

  cancelSpeak();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang   = "en-US";
  utterance.rate   = 0.88; // Slightly slower reading speed for enhanced clarity
  utterance.pitch  = 1;
  utterance.volume = 1;

  if (onEnd) utterance.onend = onEnd;

  utterance.onerror = (event) => {
    // "interrupted" is expected whenever cancelSpeak() cuts a previous utterance
    if (event.error === "interrupted") return;
    console.error("[TTS] error:", event.error);
  };

  synth.speak(utterance);
};
