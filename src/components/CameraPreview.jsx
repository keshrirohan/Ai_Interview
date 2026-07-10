import { Camera, CameraOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CameraPreview = () => {
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.log(error);
        setCameraOn(false);
      }
    };

    if (cameraOn) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraOn]);

  return (
    <div className="relative w-full h-full min-h-[450px] lg:min-h-[600px] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400">
          <CameraOff size={50} />

          <p className="text-lg font-semibold">Camera Off</p>

          <p className="text-sm">
            Turn on your camera to begin the interview.
          </p>
        </div>
      )}

      {/* Status */}
      <div
        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
          cameraOn
            ? "bg-emerald-500/20 text-emerald-500"
            : "bg-red-500/20 text-red-500"
        }`}
      >
        {cameraOn ? "● Live" : "● Offline"}
      </div>

      {/* Button */}
      <button
        onClick={() => setCameraOn(!cameraOn)}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-white transition hover:scale-105 dark:bg-white dark:text-black"
      >
        {cameraOn ? <CameraOff size={18} /> : <Camera size={18} />}

        <span className="hidden sm:block">
          {cameraOn ? "Stop Camera" : "Start Camera"}
        </span>
      </button>
    </div>
  );
};

export default CameraPreview;