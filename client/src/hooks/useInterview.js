/**
 * useInterview.js
 *
 * Central hook that owns ALL interview business logic.
 * Interview.jsx calls this hook and only renders what it returns.
 *
 * Responsibilities:
 *   1. Fetch interview details from the server
 *   2. Generate or resume the first question (handles browser refresh)
 *   3. Speak each question via TTS, then auto-start microphone
 *   4. Collect the candidate's spoken answer as a transcript
 *   5. Submit the answer, receive the next question or final report
 *   6. Track the question counter and detect interview completion
 *   7. Navigate to the dashboard when the interview ends
 *   8. Cancel TTS and microphone on unmount to prevent resource leaks
 *
 * Why separate from Interview.jsx?
 *   Mixing API calls, timers, and speech logic inside a component makes it
 *   very hard to read, test, or reuse. This hook keeps the component clean.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelSpeak, speak } from "../utils/textToSpeech";
import useSpeechRecognition from "./useSpeechRecognition";
import { useAuth } from "../context/AuthContext";

const useInterview = (interviewId) => {
  const navigate = useNavigate();
  const { loading, setLoading } = useAuth(); // Get the authenticated user from AuthContext

  // ─── Speech recognition (mic + transcript) ────────────────────────────────
  // Delegated entirely to useSpeechRecognition — this hook only orchestrates
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // ─── Interview data ────────────────────────────────────────────────────────
  const [interview, setInterview] = useState(null); // full record from server
  const [question, setQuestion] = useState(""); // current question text
  const [currentQuestion, setCurrentQuestion] = useState(1); // 1-based counter for UI
  const [totalQuestions, setTotalQuestions] = useState(10); // from interview.maxQuestions

  // ─── UI state ──────────────────────────────────────────────────────────────

  const [processing, setProcessing] = useState(false); // true while waiting for /process
  const [error, setError] = useState(null); // error message string or null

  // ─── Internal refs (guards) ────────────────────────────────────────────────

  // Prevents calling /question twice in React Strict Mode's double-invocation
  const hasInitialized = useRef(false);

  // Prevents re-triggering TTS when the same question is set again on re-render
  const lastSpokenQuestion = useRef("");

  // Snapshot of transcript for use inside useCallback without adding it as a dep.
  // Without this, processCurrentAnswer would be recreated on every keystroke.
  const transcriptRef = useRef(transcript);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // ─── 1. Fetch interview details ────────────────────────────────────────────
  // Runs once when the component mounts with a valid interviewId.
  // Uses AbortController so a navigating-away user doesn't cause a state
  // update on an unmounted component.
  useEffect(() => {
    if (!interviewId) return;

    const controller = new AbortController();

    const fetchInterviewDetails = async () => {
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

        // Sync totalQuestions with the server value (default is 10)
        if (json.data?.maxQuestions) {
          setTotalQuestions(json.data.maxQuestions);
        }
      } catch (err) {
        if (err.name === "AbortError") return; // navigated away — ignore safely
        setError(err.message);
        setLoading(false); // stop spinner on error so user sees the error banner
      }
      // On success, loading stays true until initFirstQuestion sets it false
    };

    fetchInterviewDetails();

    return () => controller.abort();
  }, [interviewId]);

  // ─── 2. Generate or resume the first question ──────────────────────────────
  // Runs once after interview data is loaded.
  // The server handles the resume case: if a conversation already exists,
  // it returns the last saved question instead of generating a new one.
  // This means browser refresh is handled automatically.
  useEffect(() => {
    if (!interview) return;
    if (hasInitialized.current) return; // guard against Strict Mode double-run
    hasInitialized.current = true;

    const controller = new AbortController();

    const initFirstQuestion = async () => {
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
        setError(err.message);
      } finally {
        // Always turn off loading here — whether success or failure
        setLoading(false);
      }
    };

    initFirstQuestion();

    return () => controller.abort();
  }, [interview, interviewId]);

  // ─── 3. Speak the current question, then start listening ──────────────────
  // Fires whenever `question` changes (first question + every subsequent one).
  // The lastSpokenQuestion guard prevents TTS from re-firing for the same
  // question text on a re-render (e.g. React Strict Mode second render).
  useEffect(() => {
    if (!question) return;
    if (question === lastSpokenQuestion.current) return;

    lastSpokenQuestion.current = question;

    // Speak the question; when speech ends, automatically open the microphone
    speak(question, () => {
      startListening();
    });
  }, [question]); // eslint-disable-line react-hooks/exhaustive-deps
  // startListening is intentionally excluded — it is stable across renders

  // ─── 4. End interview ──────────────────────────────────────────────────────
  // Defined before processCurrentAnswer because processCurrentAnswer calls it.
  // Stops all audio/mic activity and navigates away.
  const endInterview = useCallback(() => {
    stopListening();
    cancelSpeak();
    // TODO: navigate to `/report/${interviewId}` once the Report page is built
    navigate("/interview");
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 5. Process the candidate's answer ────────────────────────────────────
  // Called when the user clicks "Submit Answer".
  // Reads transcript from a ref instead of state to keep this callback stable
  // and avoid it being recreated on every transcript change.
  const processCurrentAnswer = useCallback(async () => {
    if (processing) return; // prevent double-submit if button clicked twice

    stopListening();
    setProcessing(true);
    setError(null);

    // Snapshot the transcript now, then clear it for the next answer
    const candidateAnswer = transcriptRef.current.trim();
    resetTranscript();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/interview/${interviewId}/process`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: candidateAnswer }),
        },
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to process answer.");
      }

      if (json.data.completed) {
        // Server says all questions are done — end the interview
        endInterview();
        return;
      }

      // Advance to the next question — TTS will fire via effect #3 above
      setQuestion(json.data.nextQuestion);
      setCurrentQuestion(json.data.currentQuestion ?? ((prev) => prev + 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [processing, interviewId, endInterview]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 6. Cleanup on unmount ─────────────────────────────────────────────────
  // Cancels TTS and microphone when the user navigates away so audio doesn't
  // keep playing in the background after leaving the interview page.
  useEffect(() => {
    return () => {
      cancelSpeak();
      stopListening();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Public API ────────────────────────────────────────────────────────────
  return {
    interview, // full interview record (role, difficulty, jobDescription…)
    loading, // true while fetching details + first question
    processing, // true while /process API call is in-flight
    currentQuestion, // current question number (1-based)
    totalQuestions, // total questions in this interview (default 10)
    question, // text of the current question being asked
    transcript, // live transcript of the candidate's spoken answer
    isListening, // true while the microphone is recording
    error, // error message string, or null
    startListening, // call to resume mic after Pause
    stopListening, // call to pause the mic
    processCurrentAnswer, // submit answer and get the next question
    endInterview, // stop everything and navigate away
  };
};

export default useInterview;
