/**
 * InterviewControls.jsx
 *
 * The three action buttons for the interview session:
 *   Pause / Resume  — toggles the microphone on/off
 *   Submit Answer   — sends the transcript to the server and advances
 *   End Interview   — stops everything and navigates away
 *
 * All actions are passed in as props from Interview.jsx (which gets them
 * from useInterview). This component contains zero business logic.
 *
 * Props:
 *   isListening        {boolean}  — true while mic is recording
 *   processing         {boolean}  — true while /process API call is in-flight
 *   transcript         {string}   — current transcript text
 *   startListening     {Function} — open the microphone
 *   stopListening      {Function} — close the microphone
 *   processCurrentAnswer {Function} — submit answer and get next question
 *   endInterview       {Function} — stop everything and navigate away
 */

import { Mic, MicOff, Square } from "lucide-react";

const InterviewControls = ({
  isListening,
  processing,
  transcript,
  startListening,
  stopListening,
  processCurrentAnswer,
  endInterview,
}) => {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

      {/* Pause / Resume — toggles the microphone */}
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={processing}
        className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600"
      >
        {isListening ? (
          <><MicOff size={18} /> Pause</>
        ) : (
          <><Mic size={18} /> Resume</>
        )}
      </button>

      {/* Submit answer — disabled when transcript is empty or a request is in-flight */}
      <button
        onClick={processCurrentAnswer}
        disabled={processing || !transcript.trim()}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? "Processing…" : "Submit Answer"}
      </button>

      {/* End interview — disabled while a request is processing to avoid race conditions */}
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
