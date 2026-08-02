import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelSpeak, speak } from "../utils/textToSpeech";
import useSpeechRecognition from "./useSpeechRecognition";

/**
 * useInterview(interviewId)
 *
 * Owns ALL interview business logic:
 *   • Fetch interview details (with AbortController to prevent memory leaks)
 *   • Generate (or resume) the first question — guarded against double-call
 *   • Speak each question, then start listening once speech ends
 *   • Collect transcript, submit answer, receive next question
 *   • Track question counter, detect completion, navigate to report
 *   • Expose loading / processing / error states
 *   • Clean up TTS and microphone on unmount
 */
const useInterview = (interviewId) => {
  const navigate = useNavigate();

  // ─── Speech recognition ────────────────────────────────────────────────────
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // ─── Interview state ───────────────────────────────────────────────────────
  const [interview, setInterview] = useState(null);
  const [question, setQuestion] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);

  // ─── UI state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // ─── Guards ────────────────────────────────────────────────────────────────
  // Prevents double-call to /question in React Strict Mode
  const hasInitialized = useRef(false);
  // Prevents re-triggering TTS for the same question string on re-renders
  const lastSpokenQuestion = useRef("");

  // ─── 1. Fetch interview details ────────────────────────────────────────────
  useEffect(() => {
    if (!interviewId) return;

    // AbortController so an in-flight fetch doesn't update unmounted state
    const controller = new AbortController();

    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/interview/${interviewId}`,
          { credentials: "include", signal: controller.signal },
        );

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Failed to fetch interview details.");
        }

        setInterview(json.data);

        if (json.data?.maxQuestions) {
          setTotalQuestions(json.data.maxQuestions);
        }
      } catch (err) {
        if (err.name === "AbortError") return; // component unmounted — ignore
        console.error("[useInterview] fetchInterview:", err);
        setError(err.message);
        setLoading(false); // ensure spinner stops on error
      }
      // NOTE: setLoading(false) for the success path is handled in initQuestion's
      // finally block, so loading stays true until the first question is ready.
    };

    fetchInterview();

    return () => controller.abort();
  }, [interviewId]);

  // ─── 2. Generate or resume the first question ──────────────────────────────
  useEffect(() => {
    if (!interview) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const controller = new AbortController();

    const initQuestion = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/interview/${interviewId}/question`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(interview),
            signal: controller.signal,
          },
        );

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Failed to load interview question.");
        }

        setQuestion(json.data.question);
        setCurrentQuestion(json.data.currentQuestion ?? 1);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("[useInterview] initQuestion:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initQuestion();

    return () => controller.abort();
  }, [interview, interviewId]);

  // ─── 3. Speak question, then start listening ───────────────────────────────
  useEffect(() => {
    if (!question) return;
    if (question === lastSpokenQuestion.current) return;

    lastSpokenQuestion.current = question;

    speak(question, () => {
      startListening();
    });
  }, [question]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 4. Process current answer ─────────────────────────────────────────────
  /**
   * Reads transcript via a ref snapshot so the useCallback dependency array
   * stays stable and doesn't cause the effect to re-register on every keystroke.
   */
  const transcriptRef = useRef(transcript);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);
  // ─── 5. End interview ──────────────────────────────────────────────────────
  const endInterview = useCallback(() => {
    stopListening();
    cancelSpeak();
    // Navigate to the new-interview dashboard.
    // TODO: change to `/report/${interviewId}` once the Report page exists.
    navigate("/interview");
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps
  const processCurrentAnswer = useCallback(async () => {
    if (processing) return;

    stopListening();
    setProcessing(true);
    setError(null);

    // Capture via ref so this callback doesn't need transcript in its dep array
    const answer = transcriptRef.current.trim();
    resetTranscript();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/interview/${interviewId}/process`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer }),
        },
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to process answer.");
      }

      if (json.data.completed) {
        endInterview();
        return;
      }

      setQuestion(json.data.nextQuestion);
      setCurrentQuestion(json.data.currentQuestion ?? ((prev) => prev + 1));
    } catch (err) {
      console.error("[useInterview] processCurrentAnswer:", err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [processing, interviewId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 6. Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelSpeak();
      stopListening();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Public API ────────────────────────────────────────────────────────────
  return {
    interview,
    loading,
    processing,
    currentQuestion,
    totalQuestions,
    question,
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    processCurrentAnswer,
    endInterview,
  };
};

export default useInterview;
