import { useEffect, useRef, useState } from "react";
import { createSpeechRecognition } from "../utils/speechToText";

/**
 * useSpeechRecognition
 *
 * Responsible ONLY for microphone access and building a running transcript.
 *
 * Key design decisions:
 *   - isListeningRef mirrors the isListening state so startListening /
 *     stopListening guards never read stale closure values.
 *   - transcript is also mirrored in a ref so callers can snapshot it
 *     synchronously without adding it to useCallback dep arrays.
 */
const useSpeechRecognition = () => {
  const recognitionRef   = useRef(null);
  const isListeningRef   = useRef(false);   // ref mirror — always current value

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Keep the ref in sync with the state
  const setListening = (val) => {
    isListeningRef.current = val;
    setIsListening(val);
  };

  // ─── Setup ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    recognitionRef.current = createSpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.onstart = () => setListening(true);

    recognition.onend = () => setListening(false);

    // Accumulate — append new segments rather than overwriting
    recognition.onresult = (event) => {
      let newText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        newText += event.results[i][0].transcript;
      }
      setTranscript((prev) => prev + newText);
    };

    recognition.onerror = (event) => {
      // "no-speech" is expected when the user is silent — not a real error
      if (event.error !== "no-speech") {
        console.error("[SpeechRecognition] error:", event.error);
      }
      setListening(false);
    };

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
   * Start recognition.
   * Uses isListeningRef (not state) so the guard is never stale.
   */
  const startListening = () => {
    if (isListeningRef.current) return;
    setTranscript("");           // fresh transcript for each new answer
    recognitionRef.current?.start();
  };

  /**
   * Stop recognition.
   * Uses isListeningRef so rapid calls can't cause InvalidStateError.
   */
  const stopListening = () => {
    if (!isListeningRef.current) return;
    recognitionRef.current?.stop();
  };

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
