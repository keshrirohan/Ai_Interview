/**
 * InterviewHeader.jsx
 *
 * Renders the top section of the interview page:
 *   - Page title and description
 *   - Error banner (only shown when `error` is not null)
 *
 * Props:
 *   error {string | null} — error message from useInterview, or null
 */

const InterviewHeader = ({ error }) => {
  return (
    <div>
      {/* Page title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          AI Mock Interview
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Answer the AI interviewer naturally. Your responses will be analysed
          for communication, confidence, and technical knowledge.
        </p>
      </div>

      {/* Error banner — only rendered when there is an active error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-500/10 dark:text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default InterviewHeader;
