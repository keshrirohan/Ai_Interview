/**
 * InterviewMeta.jsx
 *
 * Displays the three interview info badges:
 *   - Job Role   (derived from the AI-generated role label)
 *   - Difficulty (EASY / MEDIUM / HARD with color coding)
 *   - Question   (e.g. "3 / 10")
 *
 * Props:
 *   role            {string} — job role label from the server
 *   difficulty      {string} — "EASY" | "MEDIUM" | "HARD"
 *   currentQuestion {number} — current 1-based question index
 *   totalQuestions  {number} — total questions in this interview
 */

// Maps each difficulty level to its Tailwind color classes
const DIFFICULTY_STYLES = {
  EASY:   "bg-green-100  text-green-700  dark:bg-green-500/10  dark:text-green-400",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  HARD:   "bg-red-100    text-red-700    dark:bg-red-500/10    dark:text-red-400",
};

const InterviewMeta = ({ role, difficulty, currentQuestion, totalQuestions }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">

      {/* Job Role */}
      <div className="w-full sm:w-auto">
        <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Job Role
        </p>
        <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-5 py-3 font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
          {role}
        </div>
      </div>

      {/* Difficulty badge */}
      <div className="w-full sm:w-auto">
        <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Difficulty
        </p>
        <span
          className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
            DIFFICULTY_STYLES[difficulty] ?? DIFFICULTY_STYLES.HARD
          }`}
        >
          {difficulty}
        </span>
      </div>

      {/* Question counter */}
      <div className="w-full sm:w-auto">
        <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Question
        </p>
        <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-5 py-3 font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
          {currentQuestion} / {totalQuestions}
        </div>
      </div>
    </div>
  );
};

export default InterviewMeta;
