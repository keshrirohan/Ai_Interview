import { useCallback, useRef, useState } from "react";

/**
 * useMediaRecorder
 *
 * Responsibilities:
 * -----------------
 * - Record microphone audio
 * - Pause / Resume recording
 * - Stop recording and return Blob
 * - Reset recording
 * - Handle MediaRecorder lifecycle
 */

const useMediaRecorder = (stream) => {
  /* -------------------------------------------------------------------------- */
  /*                                   Refs                                     */
  /* -------------------------------------------------------------------------- */

  const recorderRef = useRef(null);

  const chunksRef = useRef([]);

  const mimeTypeRef = useRef("");

  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const [audioBlob, setAudioBlob] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [error, setError] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                              MIME Type Helper                              */
  /* -------------------------------------------------------------------------- */

  const getSupportedMimeType = () => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "";
  };

  /* -------------------------------------------------------------------------- */
  /*                              Start Recording                               */
  /* -------------------------------------------------------------------------- */

  const startRecording = useCallback(() => {
    if (!stream) {
      setError("Media stream not available.");
      return;
    }

    try {
      chunksRef.current = [];

      const mimeType = getSupportedMimeType();

      mimeTypeRef.current = mimeType;

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;

      recorder.onstart = () => {
        console.log("🎙 Recording Started");
      };

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = (event) => {
        console.error("Recorder Error:", event);

        setError("Recording failed.");
      };

      recorder.start();

      setAudioBlob(null);

      setIsRecording(true);

      setIsPaused(false);

      setError("");
    } catch (err) {
      console.error(err);

      setError(err.message);
    }
  }, [stream]);

  /* -------------------------------------------------------------------------- */
  /*                               Stop Recording                               */
  /* -------------------------------------------------------------------------- */

  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current;

      if (!recorder) {
        resolve(null);
        return;
      }

      if (recorder.state === "inactive") {
        resolve(audioBlob);
        return;
      }

      recorder.onstop = () => {
        try {
          const blob = new Blob(chunksRef.current, {
            type: mimeTypeRef.current || "audio/webm",
          });

          setAudioBlob(blob);

          chunksRef.current = [];

          setIsRecording(false);
          setIsPaused(false);

          console.log("✅ Recording Finished");
          console.log("Blob Size:", blob.size);

          resolve(blob);
        } catch (err) {
          reject(err);
        }
      };

      recorder.stop();
    });
  }, [audioBlob]);

  /* -------------------------------------------------------------------------- */
  /*                              Pause Recording                               */
  /* -------------------------------------------------------------------------- */

  const pauseRecording = useCallback(() => {
    const recorder = recorderRef.current;

    if (!recorder) return;

    if (recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              Resume Recording                              */
  /* -------------------------------------------------------------------------- */

  const resumeRecording = useCallback(() => {
    const recorder = recorderRef.current;

    if (!recorder) return;

    if (recorder.state === "paused") {
      recorder.resume();
      setIsPaused(false);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               Reset Recording                              */
  /* -------------------------------------------------------------------------- */

  const resetRecording = useCallback(() => {
    chunksRef.current = [];

    setAudioBlob(null);

    setIsRecording(false);

    setIsPaused(false);

    setError("");
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */

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
