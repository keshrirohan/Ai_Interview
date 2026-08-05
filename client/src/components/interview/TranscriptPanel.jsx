/**
 * TranscriptPanel.jsx
 *
 * Displays the candidate's spoken answer in real-time.
 *
 * Features:
 * - Live transcript
 * - Recording badge
 * - Auto scroll
 * - Word counter
 * - Empty state
 * - Professional UI
 */

import { useEffect, useMemo, useRef } from "react";
import { Mic } from "lucide-react";

const TranscriptPanel = ({ transcript, isRecording }) => {
  const transcriptRef = useRef(null);

  // Auto-scroll whenever transcript updates
  useEffect(() => {
    if (!transcriptRef.current) return;

    transcriptRef.current.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [transcript]);

  // Word count
  const wordCount = useMemo(() => {
    if (!transcript.trim()) return 0;

    return transcript.trim().split(/\s+/).length;
  }, [transcript]);

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Your Answer
          </h2>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Words: <span className="font-semibold">{wordCount}</span>
          </p>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <Mic size={14} />
            Recording Live
          </div>
        )}
      </div>

      {/* Transcript */}
      <div
        ref={transcriptRef}
        className="h-44 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950"
      >
        {transcript ? (
          <p className="whitespace-pre-wrap text-base leading-7 text-zinc-800 dark:text-zinc-200">
            {transcript}
          </p>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
              🎤 Waiting for your answer...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;
