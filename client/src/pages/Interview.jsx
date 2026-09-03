/**
 * Interview.jsx
 *
 * Live interview page.
 *
 * Pure Presentation Component.
 * All interview logic lives inside useInterview().
 */

import { useParams } from "react-router-dom";

import useInterview from "../hooks/useInterview";

import LoadingScreen from "../components/common/LoadingScreen";

import InterviewHeader from "../components/interview/InterviewHeader";
import InterviewMeta from "../components/interview/InterviewMeta";
import InterviewControls from "../components/interview/InterviewControls";
import AiPreview from "../components/interview/AiPreview";
import CameraPreview from "../components/interview/CameraPreview";
import TranscriptPanel from "../components/interview/TranscriptPanel";

const Interview = () => {
  const { id: interviewId } = useParams();

  const {
    interview,
    loading,
    processing,
    error,
    question,
    transcript,
    currentQuestion,
    totalQuestions,
    stream,
    cameraLoading,
    cameraError,
    cameraEnabled,
    micEnabled,
    toggleCamera,
    toggleMicrophone,
    isRecording,
    isPaused,
    isSpeaking,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    processCurrentAnswer,
    endInterview,
  } = useInterview(interviewId);

  if (loading) {
    return <LoadingScreen />;
  }

  const role = interview?.role || "Job Role";
  const difficulty = interview?.difficulty || "—";

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Header */}
        <InterviewHeader error={error} />

        {/* Interview Info */}
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <InterviewMeta
            role={role}
            difficulty={difficulty}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
          />

          <InterviewControls
            isRecording={isRecording}
            isPaused={isPaused}
            isSpeaking={isSpeaking}
            processing={processing}
            transcript={transcript}
            startRecording={startRecording}
            stopRecording={stopRecording}
            pauseRecording={pauseRecording}
            resumeRecording={resumeRecording}
            processCurrentAnswer={processCurrentAnswer}
            endInterview={endInterview}
          />
        </div>
        {/* AI + Camera */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* AI Preview */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <AiPreview
              question={question}
              isRecording={isRecording}
              isSpeaking={isSpeaking}
            />
          </div>

          {/* Camera Preview */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <CameraPreview
              stream={stream}
              loading={cameraLoading}
              error={cameraError}
              cameraEnabled={cameraEnabled}
              micEnabled={micEnabled}
              toggleCamera={toggleCamera}
              toggleMicrophone={toggleMicrophone}
              isRecording={isRecording}
              isSpeaking={isSpeaking}
            />
          </div>
        </div>

        {/* Live Transcript */}
        <div className="mt-8">
          <TranscriptPanel transcript={transcript} isRecording={isRecording} />
        </div>
      </div>
    </div>
  );
};

export default Interview;
