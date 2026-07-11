import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";

function CameraPreview() {
  const videoRef = useRef(null);

  const cameraStream = useRef(null);
  const micStream = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  // Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      cameraStream.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
    } catch (err) {
      console.error(err);
      setCameraOn(false);
    }
  };

  const stopCamera = () => {
    cameraStream.current?.getTracks().forEach((track) => track.stop());
    cameraStream.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  // Mic
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      micStream.current = stream;
      setMicOn(true);
    } catch (err) {
      console.error(err);
      setMicOn(false);
    }
  };

  const stopMic = () => {
    micStream.current?.getTracks().forEach((track) => track.stop());
    micStream.current = null;
    setMicOn(false);
  };

  useEffect(() => {
    startCamera();
    startMic();

    return () => {
      stopCamera();
      stopMic();
    };
  }, []);

  return (
    <section className="relative flex h-full w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Camera */}
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover scale-x-[-1] ${
            cameraOn ? "block" : "hidden"
          }`}
        />

        {!cameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400">
            <CameraOff size={56} />
            <p className="text-lg font-medium">Camera is Off</p>
          </div>
        )}

        {/* Live Badge */}
        {cameraOn && (
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Live
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-white/80 p-3 shadow-xl backdrop-blur dark:bg-zinc-900/80">
          <button
            onClick={() => (cameraOn ? stopCamera() : startCamera())}
            className={`rounded-full p-4 transition ${
              cameraOn
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {cameraOn ? <CameraOff size={22} /> : <Camera size={22} />}
          </button>

          <button
            onClick={() => (micOn ? stopMic() : startMic())}
            className={`rounded-full p-4 transition ${
              micOn
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {micOn ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
        </div>
      </div>
    </section>
  );
}

export default CameraPreview;
