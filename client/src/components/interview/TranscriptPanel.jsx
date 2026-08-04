/**
 * TranscriptPanel.jsx
 *
 * Displays the candidate's live spoken answer as it is transcribed.
 *
 * When the microphone is active, a pulsing "Listening…" badge appears
 * in the top-right corner so the user knows their voice is being captured.
 *
 * When no transcript exists yet, a placeholder hint is shown.
 *
 * Props:
 *   transcript  {string}  — accumulated transcript text from useSpeechRecognition
 *   isListening {boolean} — true while the microphone is recording
 */

const TranscriptPanel = ({ transcript, isListening }) => {
  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      {/* Header row: label on the left, listening badge on the right */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Your Answer
        </h2>

        {/* Pulsing badge — only visible while mic is active */}
        {isListening && (
          <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Listening…
          </span>
        )}
      </div>

      {/* Transcript text — placeholder shown when nothing has been spoken yet */}
      <p className="min-h-[60px] text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
        {transcript || (
          <span className="text-zinc-400 dark:text-zinc-600">
            Start speaking — your transcript will appear here.
          </span>
        )}
      </p>
    </div>
  );
};

export default TranscriptPanel;
