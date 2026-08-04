import { useCallback, useRef, useState } from "react";

/**
 * useMediaRecorder
 *
 * Responsibilities:
 * - Record microphone audio
 * - Pause / Resume recording
 * - Stop recording
 * - Return audio Blob
 * - Reset recording
 */

const useMediaRecorder = (stream) => {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [audioBlob, setAudioBlob] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [error, setError] = useState("");

  /**
   * Start Recording
   */
  const startRecording = useCallback(() => {
    if (!stream) {
      setError("No media stream available.");
      return;
    }

    try {
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        setAudioBlob(blob);

        chunksRef.current = [];
      };

      recorder.onerror = (event) => {
        console.error(event);
        setError("Recording failed.");
      };

      recorder.start();

      setIsRecording(true);
      setIsPaused(false);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, [stream]);

  /**
   * Stop Recording
   */
  const stopRecording = useCallback(() => {
    if (!recorderRef.current) return;

    if (recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }

    setIsRecording(false);
    setIsPaused(false);
  }, []);

  /**
   * Pause Recording
   */
  const pauseRecording = useCallback(() => {
    if (!recorderRef.current) return;

    if (recorderRef.current.state === "recording") {
      recorderRef.current.pause();

      setIsPaused(true);
    }
  }, []);

  /**
   * Resume Recording
   */
  const resumeRecording = useCallback(() => {
    if (!recorderRef.current) return;

    if (recorderRef.current.state === "paused") {
      recorderRef.current.resume();

      setIsPaused(false);
    }
  }, []);

  /**
   * Clear Recording
   */
  const resetRecording = () => {
    setAudioBlob(null);
    chunksRef.current = [];
  };

  return {
    audioBlob,

    isRecording,

    isPaused,

    error,

    startRecording,

    stopRecording,

    pauseRecording,

    resumeRecording,

    resetRecording,
  };
};

export default useMediaRecorder;
