import { useEffect, useRef, useState } from "react";
import { createSpeechRecognition } from "../utils/speechToText";

/**
 * useSpeechRecognition
 *
 * Responsible ONLY for microphone access and building a running transcript.
 * It does NOT know anything about the interview flow.
 *
 * Exposes:
 *   transcript    – accumulated text from the current listening session
 *   isListening   – true while the recognition engine is active
 *   startListening  – starts recognition (no-op if already active)
 *   stopListening   – stops recognition  (no-op if already idle)
 *   resetTranscript – clears the accumulated transcript
 */
const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  // ─── Setup ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    recognitionRef.current = createSpeechRecognition();

    const recognition = recognitionRef.current;

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => setIsListening(false);

    /**
     * Accumulate results across all segments that have arrived since the last
     * event (event.resultIndex … event.results.length).
     * We append to state so that every continuous utterance is captured in full.
     */
    recognition.onresult = (event) => {
      let newText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        newText += event.results[i][0].transcript;
      }

      setTranscript((prev) => prev + newText);
    };

    recognition.onerror = (event) => {
      console.error("[SpeechRecognition] error:", event.error);
      setIsListening(false);
    };

    // Cleanup: stop recognition when the consuming component unmounts
    return () => {
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.abort();
    };
  }, []);

  // ─── Controls ───────────────────────────────────────────────────────────────

  /** Start recognition. No-op if already active to prevent InvalidStateError. */
  const startListening = () => {
    if (isListening) return;
    setTranscript(""); // fresh transcript for each new listening session
    recognitionRef.current?.start();
  };

  /** Stop recognition. No-op if already idle. */
  const stopListening = () => {
    if (!isListening) return;
    recognitionRef.current?.stop();
  };

  /** Manually wipe the accumulated transcript (e.g. after submitting an answer). */
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
