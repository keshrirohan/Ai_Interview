/**
 * Interview.jsx
 *
 * Live interview session page.
 *
 * This is a PURE PRESENTATION component — it contains zero business logic.
 * All state, API calls, speech synthesis, and speech recognition are managed
 * inside useInterview(). This page only assembles the sub-components.
 *
 * Component tree:
 *   Interview
 *   ├── LoadingScreen          (while interview + first question load)
 *   ├── InterviewHeader        (title, description, error banner)
 *   ├── InterviewMeta          (role, difficulty, question counter)
 *   │   └── InterviewControls  (Pause, Submit Answer, End Interview)
 *   ├── AiPreview              (AI avatar + question text)
 *   ├── CameraPreview          (candidate webcam + mic toggle)
 *   └── TranscriptPanel        (live transcript + listening badge)
 */

import { useParams } from "react-router-dom";

import useInterview       from "../hooks/useInterview";
import LoadingScreen      from "../components/common/LoadingScreen";
import InterviewHeader    from "../components/interview/InterviewHeader";
import InterviewMeta      from "../components/interview/InterviewMeta";
import InterviewControls  from "../components/interview/InterviewControls";
import AiPreview          from "../components/interview/AiPreview";
import CameraPreview      from "../components/interview/CameraPreview";
import TranscriptPanel    from "../components/interview/TranscriptPanel";

const Interview = () => {
  const { id: interviewId } = useParams();

  // Destructure everything from the hook — this page owns no logic
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

  // Show spinner until interview details and first question are both ready
  if (loading) return <LoadingScreen />;

  // Fallback display values in case interview data hasn't settled yet
  const role       = interview?.role       || "Job Role";
  const difficulty = interview?.difficulty || "—";

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

        {/* Title + error banner */}
        <InterviewHeader error={error} />

        {/* Role / difficulty / question counter + action buttons */}
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <InterviewMeta
            role={role}
            difficulty={difficulty}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
          />
          <InterviewControls
            isListening={isListening}
            processing={processing}
            transcript={transcript}
            startListening={startListening}
            stopListening={stopListening}
            processCurrentAnswer={processCurrentAnswer}
            endInterview={endInterview}
          />
        </div>

        {/* AI avatar and candidate camera — side by side on large screens */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <AiPreview question={question} isListening={isListening} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <CameraPreview />
          </div>
        </div>

        {/* Live transcript of the candidate's spoken answer */}
        <TranscriptPanel transcript={transcript} isListening={isListening} />

      </div>
    </div>
  );
};

export default Interview;
