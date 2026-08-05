import { useEffect, useRef } from "react";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  LoaderCircle,
  Circle,
  Bot,
} from "lucide-react";

const CameraPreview = ({
  stream,
  loading,
  error,

  cameraEnabled,
  micEnabled,

  toggleCamera,
  toggleMicrophone,

  isRecording,
  isSpeaking,
}) => {
  const videoRef = useRef(null);

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
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          {loading ? (
            <>
              <LoaderCircle className="h-8 w-8 animate-spin" />
              <p>Starting Camera...</p>
            </>
          ) : (
            <>
              <CameraOff className="h-10 w-10" />
              <p>Camera Not Available</p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute left-4 top-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
          {error}
        </div>
      )}

      {/* Recording Badge */}
      {isRecording && (
        <div className="absolute left-4 bottom-24 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          <Circle className="h-3 w-3 fill-white animate-pulse" />
          Recording...
        </div>
      )}

      {/* AI Speaking Badge */}
      {isSpeaking && (
        <div className="absolute right-4 bottom-24 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          <Bot className="h-4 w-4" />
          AI Speaking...
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
          disabled={isRecording}
          className={`rounded-full p-3 transition disabled:cursor-not-allowed disabled:opacity-50 ${
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
