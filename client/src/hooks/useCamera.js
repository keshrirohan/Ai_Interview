import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * useCamera
 *
 * Handles:
 * - Camera permission
 * - Microphone permission
 * - Media stream creation
 * - Camera toggle
 * - Microphone toggle
 * - Cleanup
 */

const useCamera = () => {
  const streamRef = useRef(null);

  const [stream, setStream] = useState(null);

  const {loading, setLoading} = useAuth(true);

  const [error, setError] = useState("");

  const [cameraEnabled, setCameraEnabled] = useState(true);

  const [micEnabled, setMicEnabled] = useState(true);

  /**
   * Request camera + microphone permission
   */
  const startCamera = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Stop previous stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      setCameraEnabled(true);
      setMicEnabled(true);
    } catch (err) {
      console.error(err);

      if (err.name === "NotAllowedError") {
        setError("Camera or microphone permission denied.");
      } else if (err.name === "NotFoundError") {
        setError("No camera or microphone found.");
      } else {
        setError("Unable to access camera.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Stop every media track
   */
  const stopCamera = useCallback(() => {
    if (!streamRef.current) return;

    streamRef.current.getTracks().forEach((track) => track.stop());

    streamRef.current = null;
    setStream(null);
  }, []);

  /**
   * Toggle camera
   */
  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    setCameraEnabled(videoTrack.enabled);
  };

  /**
   * Toggle microphone
   */
  const toggleMicrophone = () => {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMicEnabled(audioTrack.enabled);
  };

  /**
   * Start camera automatically
   */
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return {
    stream,

    loading,

    error,

    cameraEnabled,

    micEnabled,

    startCamera,

    stopCamera,

    toggleCamera,

    toggleMicrophone,
  };
};

export default useCamera;
