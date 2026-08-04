import { useEffect, useRef } from "react";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";

const CameraPreview = ({
  stream,
  loading,
  error,
  cameraEnabled,
  micEnabled,
  toggleCamera,
  toggleMicrophone,
}) => {
  const videoRef = useRef(null);

  // Attach media stream to video
  useEffect(() => {
    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-900">
      {/* Camera */}
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-zinc-400">
          {loading ? "Starting Camera..." : "Camera Not Available"}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute top-4 left-4 rounded-lg bg-red-600 px-3 py-2 text-sm text-white">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-5 flex gap-4">
        {/* Camera */}
        <button
          onClick={toggleCamera}
          className={`rounded-full p-3 transition ${
            cameraEnabled
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {cameraEnabled ? (
            <Camera className="h-5 w-5 text-white" />
          ) : (
            <CameraOff className="h-5 w-5 text-white" />
          )}
        </button>

        {/* Microphone */}
        <button
          onClick={toggleMicrophone}
          className={`rounded-full p-3 transition ${
            micEnabled
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {micEnabled ? (
            <Mic className="h-5 w-5 text-white" />
          ) : (
            <MicOff className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraPreview;
