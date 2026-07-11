import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";

function CameraPreview() {
  // Reference to the <video> element
  const videoRef = useRef(null);
  const micRef = useRef(null);

  // Stores whether the camera is currently on or off
  const [cameraOn, setCameraOn] = useState(null);
  // Stores whether the microphone is currently on or off
  const [micOn, setMicOn] = useState(null);

  // ==========================
  // Start Camera
  // ==========================
  const handleCameraAccess = async () => {
    try {
      // Ask the user for camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      console.log("Camera access granted:", stream);

      // Attach the camera stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraOn(true);
      }
    } catch (error) {
      // Runs if the user denies permission or no camera is found
      console.error("Error accessing camera:", error);
      setCameraOn(false);
    }
  };

  // ==========================
  // Stop Camera
  // ==========================
  const handleStopCamera = () => {
    // Check if a stream is attached
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;

      // Stop every track (camera, microphone, etc.)
      stream.getTracks().forEach((track) => track.stop());

      // Remove the stream from the video
      videoRef.current.srcObject = null;
    }

    // Update UI state
    setCameraOn(false);
  };

  // ==========================
  // Toggle Camera
  // ==========================
  const handleToggleCamera = () => {
    if (cameraOn) {
      // Camera is already on → Turn it off
      handleStopCamera();
    } else {
      // Camera is off → Turn it on
      handleCameraAccess();
    }
  };

  // ==========================
  // Runs once when component mounts
  // ==========================
  useEffect(() => {
    // Automatically start the camera
    () => {
      handleCameraAccess();
    };
    // Cleanup when component unmounts
    return () => {
      handleStopCamera();
    };
  }, []);

  const handleMicAccess = async () => {
    try {
      // Ask the user for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("Microphone access granted:", stream);
      // Update UI state
      if (micRef.current) {
        micRef.current.srcObject = stream;
        setMicOn(true);
      }

      console.log("Microphone is now active.");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleMicStop = () => {
    // Check if a stream is attached
    if (micRef.current?.srcObject) {
      const stream = micRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      // Remove the stream from the video
      micRef.current.srcObject = null;
    }
    // Update UI state
    setMicOn(false);
    console.log("Microphone has been stopped.");
  };

  const handleToggleMic = () => {
    // Placeholder for microphone toggle functionality
    if (!micOn) {
      handleMicAccess();
    } else {
      handleMicStop();
    }
  };

  useEffect(() => {
    // Automatically start the microphone
    () => {
      handleMicAccess();
    };
    // Cleanup when component unmounts
    return () => {
      handleMicStop();
    };
  }, []);

  return (
    <section className="relative w-full h-full rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between  border-b border-zinc-200 dark:border-zinc-700">
        {/* Show "Live" badge only when camera is active */}
      </div>

      {/* Camera Preview */}
      <div className=" aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          // Mirror the preview like Zoom/Google Meet
          className={`w-full h-full object-cover scale-x-[-1] ${
            cameraOn ? "block" : "hidden"
          }`}
        />

        {/* Display when camera is off */}
        {!cameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <CameraOff size={48} />
            <p>Camera is Off</p>
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className="absolute bottom-0  right-0 flex gap-2 items-center justify-center p-2 ">
        <button
          onClick={handleToggleCamera}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 ${
            cameraOn
              ? "bg-red-400 hover:bg-red-700"
              : "bg-emerald-400 hover:bg-emerald-700"
          }`}
        >
          {/* Change button icon and text based on camera state */}
          {cameraOn ? (
            <>
              <CameraOff size={20} />
            </>
          ) : (
            <>
              <Camera size={20} />
            </>
          )}
        </button>
        <button
          onClick={handleToggleMic}
          ref={micRef}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 ${
            micOn
              ? "bg-red-400 hover:bg-red-700"
              : "bg-emerald-400 hover:bg-emerald-700"
          }`}
        >
          {/* Change button icon and text based on camera state */}
          {micOn ? (
            <>
              <MicOff size={20} />
             
            </>
          ) : (
            <>
              <Mic size={20} />
              
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export default CameraPreview;
