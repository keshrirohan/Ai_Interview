import { useCallback, useEffect, useRef, useState } from "react";
import { cancelSpeak, speak } from "../utils/textToSpeech";
import useSpeechRecognition from "./useSpeechRecognition";

/**
 * useInterview(interviewId)
 *
 * Owns ALL interview business logic:
 *   • Fetch interview details
 *   • Generate (or resume) the first question
 *   • Speak each question, then start listening once speech ends
 *   • Collect transcript, submit answer, receive next question
 *   • Track question counter, detect completion, end interview
 *   • Expose loading / processing / error states
 *   • Clean up TTS and microphone on unmount
 *
 * Interview.jsx should call this hook and only deal with rendering.
 */
const useInterview = (interviewId) => {
  // ─── Speech recognition (microphone + transcript) ──────────────────────────
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // ─── Interview state ────────────────────────────────────────────────────────
  const [interview, setInterview]           = useState(null);   // full interview record
  const [question, setQuestion]             = useState("");     // current question text
  const [currentQuestion, setCurrentQuestion] = useState(1);   // 1-based counter for UI
  const [totalQuestions, setTotalQuestions] = useState(10);    // from interview.maxQuestions

  // ─── UI state ───────────────────────────────────────────────────────────────
  const [loading, setLoading]       = useState(true);   // initial fetch + first question
  const [processing, setProcessing] = useState(false);  // waiting for /process response
  const [error, setError]           = useState(null);   // any error message

  // ─── Guards ─────────────────────────────────────────────────────────────────
  /**
   * Prevents double-calling the /question endpoint on React Strict Mode
   * double-invocation or browser fast-refresh.
   */
  const hasInitialized = useRef(false);

  /**
   * Tracks the question text that has already been spoken so we never
   * trigger TTS twice for the same string (e.g. on a re-render).
   */
  const lastSpokenQuestion = useRef("");

  // ─── 1. Fetch interview details ─────────────────────────────────────────────
  useEffect(() => {
    if (!interviewId) return;

    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/interview/${interviewId}`,
          { credentials: "include" },
        );

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Failed to fetch interview details.");
        }

        setInterview(json.data);

        // Keep totalQuestions in sync with whatever the server says
        if (json.data?.maxQuestions) {
          setTotalQuestions(json.data.maxQuestions);
        }
      } catch (err) {
        console.error("[useInterview] fetchInterview:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  // ─── 2. Generate or resume the first question ───────────────────────────────
  /**
   * Runs once after the interview record is loaded.
   *
   * The server's getFirstQuestion() already handles the resume case:
   *   • If a conversation exists  → returns the last saved question (no AI call)
   *   • If no conversation yet    → generates question 1 via Groq
   *
   * We simply respect what the server returns.
   */
  useEffect(() => {
    if (!interview) return;
    if (hasInitialized.current) return; // strict-mode / fast-refresh guard
    hasInitialized.current = true;

    const initQuestion = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/interview/${interviewId}/question`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            // Body sends the interview record so the server has context
            body: JSON.stringify(interview),
          },
        );

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Failed to load interview question.");
        }

        // json.data = { question, expectedAnswer, currentQuestion }
        setQuestion(json.data.question);
        setCurrentQuestion(json.data.currentQuestion ?? 1);
      } catch (err) {
        console.error("[useInterview] initQuestion:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initQuestion();
  }, [interview, interviewId]);

  // ─── 3. Speak the current question, then start listening ────────────────────
  /**
   * Fires whenever `question` changes (first question + every subsequent one).
   *
   * Guard: `lastSpokenQuestion` ensures TTS is not triggered a second time
   * if the component re-renders with the same question string.
   */
  useEffect(() => {
    if (!question) return;
    if (question === lastSpokenQuestion.current) return;

    lastSpokenQuestion.current = question;

    speak(question, () => {
      // Start capturing the candidate's answer once AI finishes speaking
      startListening();
    });
  }, [question]); // eslint-disable-line react-hooks/exhaustive-deps
  // startListening is stable (defined in useSpeechRecognition with no deps)

  // ─── 4. Process current answer ──────────────────────────────────────────────
  /**
   * Called by the UI when the candidate wants to submit their answer
   * (e.g. clicking "Submit Answer" or an auto-stop trigger).
   *
   * Flow:
   *   stop listening → send transcript to /process →
   *   if completed  → endInterview()
   *   if not        → update question + counter → TTS fires via useEffect above
   */
  const processCurrentAnswer = useCallback(async () => {
    if (processing) return; // prevent double-submit

    stopListening();
    setProcessing(true);
    setError(null);

    // Capture transcript before resetTranscript clears it
    const answer = transcript.trim();
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

      // json.data = { completed, nextQuestion?, score?, feedback?, report? }
      if (json.data.completed) {
        // Server signals end-of-interview (all maxQuestions answered)
        endInterview();
        return;
      }

      // Advance to the next question
      setQuestion(json.data.nextQuestion);
      setCurrentQuestion((prev) => prev + 1);
    } catch (err) {
      console.error("[useInterview] processCurrentAnswer:", err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [transcript, processing, interviewId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 5. End interview ────────────────────────────────────────────────────────
  /**
   * Stops all audio/mic activity and marks the interview as done.
   * Called both by processCurrentAnswer (when completed === true)
   * and by the UI "End Interview" button.
   */
  const endInterview = useCallback(() => {
    stopListening();
    cancelSpeak();
    // TODO: navigate to results/report page, e.g. navigate(`/report/${interviewId}`)
    console.log("[useInterview] Interview ended.");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 6. Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // Cancel TTS so speech doesn't continue playing after navigation
      cancelSpeak();
      // stopListening is safe to call even when idle (guarded inside the hook)
      stopListening();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Public API ─────────────────────────────────────────────────────────────
  return {
    /** Full interview record (role, difficulty, jobDescription, etc.) */
    interview,

    /** True while fetching details or the first question */
    loading,

    /** True while waiting for /process to respond */
    processing,

    /** 1-based index of the question currently being asked */
    currentQuestion,

    /** Total number of questions for this interview (default 10) */
    totalQuestions,

    /** Text of the current interview question */
    question,

    /** Running transcript of the candidate's spoken answer */
    transcript,

    /** True while the microphone is actively recording */
    isListening,

    /** Any error message from API calls */
    error,

    /** Start the microphone manually (e.g. after a pause) */
    startListening,

    /** Stop the microphone manually (e.g. Pause button) */
    stopListening,

    /** Submit the current transcript as an answer and advance to the next question */
    processCurrentAnswer,

    /** Stop the interview immediately (called by End Interview button) */
    endInterview,
  };
};

export default useInterview;
