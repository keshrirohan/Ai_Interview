import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cancelSpeak, speak } from "../utils/textToSpeech";

import { useAuth } from "../context/AuthContext";

import useCamera from "./useCamera";
import useMediaRecorder from "./useMediaRecorder";

import { uploadAudio } from "../services/speech.service";

const useInterview = (interviewId) => {
  const navigate = useNavigate();

  const { loading, setLoading } = useAuth();

  /* -------------------------------------------------------------------------- */
  /*                                Camera Hook                                 */
  /* -------------------------------------------------------------------------- */

  const {
    stream,
    loading: cameraLoading,
    error: cameraError,
    cameraEnabled,
    micEnabled,
    toggleCamera,
    toggleMicrophone,
  } = useCamera();

  /* -------------------------------------------------------------------------- */
  /*                              Recorder Hook                                 */
  /* -------------------------------------------------------------------------- */

  const {
    isRecording,
    isPaused,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useMediaRecorder(stream);

  /* -------------------------------------------------------------------------- */
  /*                              Interview State                               */
  /* -------------------------------------------------------------------------- */

  const [interview, setInterview] = useState(null);

  const [question, setQuestion] = useState("");

  const [transcript, setTranscript] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(1);

  const [totalQuestions, setTotalQuestions] = useState(10);

  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState(null);

  const [isSpeaking, setIsSpeaking] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                  Refs                                      */
  /* -------------------------------------------------------------------------- */

  const hasInitialized = useRef(false);

  const lastSpokenQuestion = useRef("");

  // Mirror of `isRecording` kept in a ref so cleanup/unmount logic and
  // memoized callbacks always see the *latest* value instead of the value
  // that was captured when the effect/callback was first created.
  const isRecordingRef = useRef(false);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Same idea for `stream`, in case it's ever reassigned after mount.
  const streamRef = useRef(stream);
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  //Fetch Interview
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

        if (!res.ok || !json.success) {
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
    };

    fetchInterviewDetails();

    return () => controller.abort();
  }, [interviewId]); // eslint-disable-line react-hooks/exhaustive-deps

  //Fetch First Question
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

        if (!res.ok || !json.success) {
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
  }, [interview, interviewId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!question) return;
    if (question === lastSpokenQuestion.current) return;

    lastSpokenQuestion.current = question;
    setIsSpeaking(true);
    // Speak the question; when speech ends, automatically open the microphone
    speak(question, () => {
      setIsSpeaking(false);

      if (!processing) {
        resetRecording();
        startRecording();
      }
    });
  }, [question]); // eslint-disable-line react-hooks/exhaustive-deps

  const endInterview = useCallback(() => {
    if (isRecordingRef.current) {
      stopRecording();
    }
    resetRecording();
    setTranscript("");
    cancelSpeak();
    // TODO: navigate to `/report/${interviewId}` once the Report page is built
    streamRef.current?.getTracks().forEach((track) => track.stop());
    navigate("/interview");
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const processCurrentAnswer = useCallback(async () => {
    if (processing) return; // prevent double-submit if button clicked twice

    setProcessing(true);
    setError(null);

    try {
      // Single stop call — grabs the final blob directly, no need to
      // pre-check isRecording and call stopRecording() a second time.
      const blob = await stopRecording();

      if (!blob || blob.size === 0) {
        throw new Error("No audio recorded.");
      }

      const result = await uploadAudio(blob);
      if (!result?.transcript) {
        throw new Error("Transcription failed.");
      }

      setTranscript(result.transcript);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/interview/${interviewId}/process`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: result.transcript }),
        },
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to process answer.");
      }

      if (json.data.completed) {
        // Server says all questions are done — end the interview
        endInterview();
        return;
      }

      setTranscript("");
      resetRecording();
      setQuestion(json.data.nextQuestion);
      // Advance to the next question — TTS will fire via effect above
      setCurrentQuestion(json.data.currentQuestion ?? ((prev) => prev + 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [processing, interviewId, endInterview, stopRecording, resetRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      cancelSpeak();
      if (isRecordingRef.current) {
        stopRecording();
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    interview, // full interview record (role, difficulty, jobDescription…)
    loading, // true while fetching details + first question
    processing, // true while /process API call is in-flight
    currentQuestion, // current question number (1-based)
    totalQuestions, // total questions in this interview (default 10)
    question, // text of the current question being asked
    transcript, // live transcript of the candidate's spoken answer
    error,
    startRecording,
    stopRecording,
    processCurrentAnswer, // submit answer and get the next question
    endInterview, // stop everything and navigate away
    stream,
    cameraLoading,
    cameraError,
    cameraEnabled,
    micEnabled,
    toggleCamera,
    toggleMicrophone,
    isRecording,
    isPaused,
    pauseRecording,
    resumeRecording,
    isSpeaking,
  };
};

export default useInterview;
