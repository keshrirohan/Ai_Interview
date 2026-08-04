/**
 * useSpeechRecognition.js
 *
 * Custom hook responsible ONLY for microphone access and transcript building.
 * It does NOT know anything about the interview flow — that is handled by
 * useInterview.js, which calls this hook and uses what it returns.
 *
 * Key design decisions:
 *
 *   isListeningRef — mirrors the isListening state in a ref so that
 *     startListening() and stopListening() always read the current value
 *     instead of a stale closure. Without this, rapid calls can miss the
 *     guard and trigger InvalidStateError from the browser API.
 *
 *   Transcript accumulation — each onresult event appends new speech segments
 *     with setTranscript(prev => prev + newText) so no text is lost across
 *     continuous utterances.
 *
 *   startListening() clears the transcript — every new answer starts fresh.
 *
 *   "no-speech" error suppression — this fires when the user is simply silent
 *     and is not a real failure, so we ignore it to avoid noisy console output.
 *
 * Exposes:
 *   transcript       — accumulated text from the current listening session
 *   isListening      — true while the recognition engine is active
 *   startListening() — starts recognition (no-op if already active)
 *   stopListening()  — stops recognition  (no-op if already idle)
 *   resetTranscript() — clears the transcript manually
 */

import { useEffect, useRef, useState } from "react";
import { createSpeechRecognition } from "../utils/speechToText";

const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);

  // Ref that mirrors isListening state — used inside callbacks to avoid
  // stale closures. Always reflects the latest value immediately.
  const isListeningRef = useRef(false);

  const [transcript, setTranscript]   = useState("");
  const [isListening, setIsListening] = useState(false);

  // Helper to update both the state and the ref together
  const setListening = (value) => {
    isListeningRef.current = value;
    setIsListening(value);
  };

  // ─── Setup: create recognition instance and attach event handlers ──────────
  useEffect(() => {
    recognitionRef.current = createSpeechRecognition();
    const recognition = recognitionRef.current;

    // Called when the microphone successfully opens
    recognition.onstart = () => setListening(true);

    // Called when recognition stops (either manually or automatically)
    recognition.onend = () => setListening(false);

    // Called each time a new speech segment is ready.
    // We loop from resultIndex to capture only the NEW segment(s)
    // and append them to the existing transcript.
    recognition.onresult = (event) => {
      let newSegment = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        newSegment += event.results[i][0].transcript;
      }
      setTranscript((prev) => prev + newSegment);
    };

    recognition.onerror = (event) => {
      // "no-speech" is expected when the user pauses — not a real error
      if (event.error !== "no-speech") {
        console.error("[SpeechRecognition] error:", event.error);
      }
      setListening(false);
    };

    // Cleanup: detach handlers and abort on unmount to prevent memory leaks
    return () => {
      recognition.onstart  = null;
      recognition.onend    = null;
      recognition.onresult = null;
      recognition.onerror  = null;
      recognition.abort();
    };
  }, []);

  // ─── Controls ──────────────────────────────────────────────────────────────

  /**
   * Start microphone recording.
   * Reads from isListeningRef (not state) to avoid stale closure guard.
   * Clears the previous transcript so each answer starts fresh.
   */
  const startListening = () => {
    if (isListeningRef.current) return; // already recording — do nothing
    setTranscript("");
    recognitionRef.current?.start();
  };

  /**
   * Stop microphone recording.
   * Reads from isListeningRef to ensure the guard is always current.
   */
  const stopListening = () => {
    if (!isListeningRef.current) return; // already stopped — do nothing
    recognitionRef.current?.stop();
  };

  /** Clear the accumulated transcript manually (e.g. after answer submitted). */
  const resetTranscript = () => setTranscript("");

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
