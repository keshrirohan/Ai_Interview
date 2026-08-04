/**
 * Interview.jsx
 *
 * Live interview session page.
 *
 * Pure presentation component.
 * All business logic is handled by useInterview(), useCamera(), and useRecorder().
 */

import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import useInterview from "../hooks/useInterview";
import useCamera from "../hooks/useCamera";

import LoadingScreen from "../components/common/LoadingScreen";

import InterviewHeader from "../components/interview/InterviewHeader";
import InterviewMeta from "../components/interview/InterviewMeta";
import InterviewControls from "../components/interview/InterviewControls";
import AiPreview from "../components/interview/AiPreview";
import CameraPreview from "../components/interview/CameraPreview";
import TranscriptPanel from "../components/interview/TranscriptPanel";
import useMediaRecorder from "../hooks/useMediaRecorder";
import { uploadAudio } from "../services/speech.service";

const Interview = () => {
  const { id: interviewId } = useParams();
  const { loading } = useAuth();

  const {
    stream,
    loading: cameraLoading,
    error: cameraError,
    cameraEnabled,
    micEnabled,
    toggleCamera,
    toggleMicrophone,
  } = useCamera();

  const {
    audioBlob,
    isRecording,
    isPaused,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useMediaRecorder(stream);
  /**
   * Camera + microphone stream
   */

  /**
   * Media recorder
   */

  /**
   * Interview business logic
   */
  const {
    interview,
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

  if (loading) {
    return <LoadingScreen />;
  }

  const handleUpload = async () => {
    if (!audioBlob) return;

    try {
      const data = await uploadAudio(audioBlob);

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

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
            isListening={isListening}
            processing={processing}
            transcript={transcript}
            startListening={startListening}
            stopListening={stopListening}
            processCurrentAnswer={processCurrentAnswer}
            endInterview={endInterview}
          />
        </div>

        {/* Temporary Recording Test */}
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <button onClick={startRecording}>Start</button>

          <button onClick={pauseRecording}>Pause</button>

          <button onClick={resumeRecording}>Resume</button>

          <button onClick={stopRecording}>Stop</button>

          <button onClick={resetRecording}>Reset</button>
          <button onClick={handleUpload}>Upload Audio</button>

          {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
        </div>

        {/* AI + Camera */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <AiPreview question={question} isListening={isListening} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <CameraPreview
              stream={stream}
              loading={cameraLoading}
              error={cameraError}
              cameraEnabled={cameraEnabled}
              micEnabled={micEnabled}
              toggleCamera={toggleCamera}
              toggleMicrophone={toggleMicrophone}
            />
          </div>
        </div>

        {/* Transcript */}
        <TranscriptPanel transcript={transcript} isListening={isListening} />
      </div>
    </div>
  );
};

export default Interview;
