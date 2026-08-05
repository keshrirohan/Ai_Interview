/**
 * InterviewControls.jsx
 *
 * Interview action controls.
 *
 * Pure UI component.
 * No business logic.
 *
 * Props:
 *  isRecording
 *  isPaused
 *  isSpeaking
 *  processing
 *
 *  startRecording
 *  stopRecording
 *  pauseRecording
 *  resumeRecording
 *
 *  processCurrentAnswer
 *  endInterview
 */

import { Mic, Pause, Play, Send, Square, LoaderCircle } from "lucide-react";

const InterviewControls = ({
  isRecording,
  isPaused,
  isSpeaking,
  processing,

  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,

  processCurrentAnswer,
  endInterview,
}) => {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      {/* Start Recording */}
      {!isRecording && !processing && !isSpeaking && (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          <Mic size={18} />
          Start Recording
        </button>
      )}

      {/* Pause */}
      {isRecording && !isPaused && (
        <button
          onClick={pauseRecording}
          disabled={processing}
          className="flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-white transition hover:bg-yellow-600 disabled:opacity-50"
        >
          <Pause size={18} />
          Pause
        </button>
      )}

      {/* Resume */}
      {isRecording && isPaused && (
        <button
          onClick={resumeRecording}
          disabled={processing}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          <Play size={18} />
          Resume
        </button>
      )}

      {/* Stop */}
      {isRecording && (
        <button
          onClick={stopRecording}
          disabled={processing}
          className="flex items-center gap-2 rounded-xl bg-zinc-800 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50"
        >
          <Square size={18} />
          Stop Recording
        </button>
      )}

      {/* Submit */}
      <button
        onClick={processCurrentAnswer}
        disabled={processing || isSpeaking}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Answer
          </>
        )}
      </button>

      {/* End Interview */}
      <button
        onClick={endInterview}
        disabled={processing}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        <Square size={18} />
        End Interview
      </button>
    </div>
  );
};

export default InterviewControls;
