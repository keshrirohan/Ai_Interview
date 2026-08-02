import { useParams } from "react-router-dom";
import { Mic, MicOff, Square } from "lucide-react";

import useInterview from "../hooks/useInterview";
import AiPreview from "../components/AiPreview";
import CameraPreview from "../components/CameraPreview";
import LoadingScreen from "../components/LoadingScreen";

/**
 * Interview
 *
 * Pure presentation component — no business logic lives here.
 * Everything is delegated to useInterview().
 *
 * Renders:
 *   • LoadingScreen while the first question is being fetched / generated
 *   • Interview details (role, difficulty, question counter)
 *   • AiPreview  – shows the current question + AI avatar
 *   • CameraPreview – shows the candidate's camera feed
 *   • Live transcript panel
 *   • Pause / Submit Answer / End Interview controls
 *   • Error banner when something goes wrong
 */
const Interview = () => {
  const { id: interviewId } = useParams();

  const {
    interview,
    loading,
    processing,
    currentQuestion,
    totalQuestions,
    question,
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    processCurrentAnswer,
    endInterview,
  } = useInterview(interviewId);

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen />;

  // ─── Derived display values ────────────────────────────────────────────────
  const role       = interview?.role       || "Job Role";
  const difficulty = interview?.difficulty || "Difficulty";

  const difficultyStyles = {
    EASY:   "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    HARD:   "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

        {/* ── Page heading ───────────────────────────────────────────────── */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            AI Mock Interview
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Answer the AI interviewer naturally. Your responses will be analysed
            for communication, confidence, and technical knowledge.
          </p>
        </div>

        {/* ── Error banner ───────────────────────────────────────────────── */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-500/10 dark:text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* ── Interview details + controls ───────────────────────────────── */}
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          {/* Meta row */}
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">

            {/* Job Role */}
            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Job Role
              </label>
              <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-5 py-3 font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                {role}
              </div>
            </div>

            {/* Difficulty */}
            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Difficulty
              </label>
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  difficultyStyles[difficulty] ?? difficultyStyles.HARD
                }`}
              >
                {difficulty}
              </span>
            </div>

            {/* Question counter */}
            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Question
              </label>
              <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-5 py-3 font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                {currentQuestion} / {totalQuestions}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

            {/* Pause / Resume microphone */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={processing}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              {isListening ? (
                <>
                  <MicOff size={18} />
                  Pause
                </>
              ) : (
                <>
                  <Mic size={18} />
                  Resume
                </>
              )}
            </button>

            {/* Submit answer and fetch next question */}
            <button
              onClick={processCurrentAnswer}
              disabled={processing || !transcript.trim()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? "Processing…" : "Submit Answer"}
            </button>

            {/* End interview early */}
            <button
              onClick={endInterview}
              disabled={processing}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              <Square size={18} />
              End Interview
            </button>
          </div>
        </div>

        {/* ── AI & Camera panels ─────────────────────────────────────────── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <AiPreview question={question} isListening={isListening} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <CameraPreview />
          </div>
        </div>

        {/* ── Live transcript ────────────────────────────────────────────── */}
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Your Answer
            </h2>

            {/* Mic activity indicator */}
            {isListening && (
              <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Listening…
              </span>
            )}
          </div>

          <p className="min-h-[60px] text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
            {transcript || (
              <span className="text-zinc-400 dark:text-zinc-600">
                Start speaking — your transcript will appear here.
              </span>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Interview;
