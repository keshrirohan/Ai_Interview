import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useMediaRecorder
 *
 * Custom React hook for recording audio from a MediaStream.
 *
 * Key Features & Fixes:
 * 1. Audio Track Extraction: Automatically filters incoming MediaStreams to extract ONLY active audio tracks.
 *    Passing a combined Audio+Video MediaStream to MediaRecorder with an 'audio/*' MIME type causes
 *    browsers to throw NotSupportedError. Extracting an audio-only stream resolves this.
 * 2. Cross-Browser MIME Type Selection: Tests a comprehensive fallback list across Chrome, Edge, Firefox, and Safari,
 *    and falls back to browser default if no explicit MIME type is supported.
 * 3. Lifecycle & Race Condition Protection: Prevents duplicate start calls, cleans up previous recorders and listeners,
 *    and uses refs to avoid stale closure issues during React re-renders.
 * 4. Structured Async Operations: `stopRecording()` returns a Promise resolving to the recorded Blob.
 */

const useMediaRecorder = (stream) => {
  /* -------------------------------------------------------------------------- */
  /*                                   Refs                                     */
  /* -------------------------------------------------------------------------- */

  // Holds the active MediaRecorder instance
  const recorderRef = useRef(null);

  // Array to collect recorded MediaRecorder data chunks
  const chunksRef = useRef([]);

  // Store selected MIME type for Blob creation
  const mimeTypeRef = useRef("");

  // Ref mirror of isRecording state to avoid stale closure race conditions
  const isRecordingRef = useRef(false);

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

  /**
   * Evaluates browser support for various audio MIME types.
   * Priority order covers modern WebM (Chrome/Edge/Firefox), MP4/AAC (Safari/iOS), and OGG.
   * Returns empty string if no explicit type matches, allowing browser to choose default.
   */
  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === "undefined") return "";

    const candidateTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
      "audio/aac",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ];

    for (const type of candidateTypes) {
      try {
        if (MediaRecorder.isTypeSupported(type)) {
          console.log(`[useMediaRecorder] Found supported MIME type: ${type}`);
          return type;
        }
      } catch (e) {
        // Some browsers throw on invalid format strings
      }
    }

    console.log("[useMediaRecorder] No explicit candidate MIME type supported. Falling back to browser default.");
    return "";
  };

  /* -------------------------------------------------------------------------- */
  /*                              Helper: Cleanup                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Safely stops and detaches event handlers from existing recorder instance.
   */
  const cleanupRecorder = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder) {
      console.log("[useMediaRecorder] Cleaning up previous MediaRecorder instance...");
      recorder.onstart = null;
      recorder.ondataavailable = null;
      recorder.onerror = null;
      recorder.onstop = null;
      recorder.onpause = null;
      recorder.onresume = null;

      if (recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch (e) {
          console.warn("[useMediaRecorder] Error stopping recorder during cleanup:", e);
        }
      }
      recorderRef.current = null;
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              Start Recording                               */
  /* -------------------------------------------------------------------------- */

  const startRecording = useCallback(() => {
    console.log("[useMediaRecorder] startRecording called");

    // 1. Check stream availability
    if (!stream) {
      const msg = "Media stream is not available.";
      console.error(`[useMediaRecorder] Error: ${msg}`);
      setError(msg);
      return;
    }

    // 2. Prevent starting if recorder is already active
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      console.warn("[useMediaRecorder] MediaRecorder is already active. Current state:", recorderRef.current.state);
      return;
    }

    // 3. Validate and extract ONLY active audio tracks
    const audioTracks = stream.getAudioTracks().filter(
      (track) => track.readyState === "live" && track.enabled
    );

    if (audioTracks.length === 0) {
      const msg = "No active or enabled audio tracks found in stream.";
      console.error(`[useMediaRecorder] Error: ${msg}`);
      setError(msg);
      return;
    }

    console.log(`[useMediaRecorder] Found ${audioTracks.length} active audio track(s). Track label: "${audioTracks[0].label}"`);

    // 4. Create an audio-only MediaStream
    // IMPORTANT: Passing video tracks alongside audio MIME type causes NotSupportedError in MediaRecorder!
    const audioStream = new MediaStream(audioTracks);

    try {
      cleanupRecorder();

      chunksRef.current = [];

      // 5. Select MIME type
      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;

      const options = mimeType ? { mimeType } : {};
      console.log("[useMediaRecorder] Initializing MediaRecorder with options:", options);

      const recorder = new MediaRecorder(audioStream, options);
      recorderRef.current = recorder;

      // 6. Set up event handlers
      recorder.onstart = () => {
        console.log("🎙 [useMediaRecorder] Recording started successfully");
        setIsRecording(true);
        isRecordingRef.current = true;
        setIsPaused(false);
        setError("");
      };

      recorder.ondataavailable = (event) => {
        console.log("[useMediaRecorder] Data available event. Blob size:", event.data ? event.data.size : 0);
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = (event) => {
        console.error("[useMediaRecorder] MediaRecorder error event:", event);
        const errMessage = event.error ? event.error.name || event.error.message : "Recording error occurred";
        setError(`Recording failed: ${errMessage}`);
        setIsRecording(false);
        isRecordingRef.current = false;
      };

      recorder.onpause = () => {
        console.log("[useMediaRecorder] Recording paused");
        setIsPaused(true);
      };

      recorder.onresume = () => {
        console.log("[useMediaRecorder] Recording resumed");
        setIsPaused(false);
      };

      // Reset state prior to start call
      setAudioBlob(null);
      setError("");

      // 7. Start recording
      console.log("[useMediaRecorder] Calling recorder.start()...");
      recorder.start(250); // Collect slice every 250ms for smooth chunking
    } catch (err) {
      console.error("[useMediaRecorder] Exception during startRecording:", err);
      setError(`Failed to start recording: ${err.message || err.name}`);
      setIsRecording(false);
      isRecordingRef.current = false;
      cleanupRecorder();
    }
  }, [stream, cleanupRecorder]);

  /* -------------------------------------------------------------------------- */
  /*                               Stop Recording                               */
  /* -------------------------------------------------------------------------- */

  const stopRecording = useCallback(() => {
    console.log("[useMediaRecorder] stopRecording called");
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current;

      if (!recorder) {
        console.log("[useMediaRecorder] No recorder instance found on stop.");
        setIsRecording(false);
        isRecordingRef.current = false;
        resolve(audioBlob);
        return;
      }

      if (recorder.state === "inactive") {
        console.log("[useMediaRecorder] Recorder is already inactive.");
        setIsRecording(false);
        isRecordingRef.current = false;
        resolve(audioBlob);
        return;
      }

      recorder.onstop = () => {
        try {
          console.log("[useMediaRecorder] MediaRecorder stopped. Total chunks collected:", chunksRef.current.length);
          const finalMimeType = mimeTypeRef.current || recorder.mimeType || "audio/webm";
          const blob = new Blob(chunksRef.current, { type: finalMimeType });

          setAudioBlob(blob);
          chunksRef.current = [];

          setIsRecording(false);
          isRecordingRef.current = false;
          setIsPaused(false);

          console.log("✅ [useMediaRecorder] Recording finished. Final Blob size:", blob.size, "Type:", finalMimeType);
          resolve(blob);
        } catch (err) {
          console.error("[useMediaRecorder] Error creating final audio blob:", err);
          reject(err);
        }
      };

      try {
        recorder.stop();
      } catch (err) {
        console.error("[useMediaRecorder] Error stopping MediaRecorder:", err);
        setIsRecording(false);
        isRecordingRef.current = false;
        reject(err);
      }
    });
  }, [audioBlob]);

  /* -------------------------------------------------------------------------- */
  /*                              Pause Recording                               */
  /* -------------------------------------------------------------------------- */

  const pauseRecording = useCallback(() => {
    console.log("[useMediaRecorder] pauseRecording called");
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") {
      try {
        recorder.pause();
      } catch (err) {
        console.error("[useMediaRecorder] Error pausing recorder:", err);
      }
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              Resume Recording                              */
  /* -------------------------------------------------------------------------- */

  const resumeRecording = useCallback(() => {
    console.log("[useMediaRecorder] resumeRecording called");
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "paused") {
      try {
        recorder.resume();
      } catch (err) {
        console.error("[useMediaRecorder] Error resuming recorder:", err);
      }
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               Reset Recording                              */
  /* -------------------------------------------------------------------------- */

  const resetRecording = useCallback(() => {
    console.log("[useMediaRecorder] resetRecording called");
    cleanupRecorder();
    chunksRef.current = [];
    setAudioBlob(null);
    setIsRecording(false);
    isRecordingRef.current = false;
    setIsPaused(false);
    setError("");
  }, [cleanupRecorder]);

  /* -------------------------------------------------------------------------- */
  /*                               Unmount Cleanup                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      console.log("[useMediaRecorder] Hook unmounting, cleaning up...");
      cleanupRecorder();
    };
  }, [cleanupRecorder]);

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
