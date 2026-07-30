import { useParams } from "react-router-dom";
import AiPreview from "../components/AiPreview";
import CameraPreview from "../components/CameraPreview";
import { useEffect, useRef, useState } from "react";

const Interview = () => {
  // Get interview ID from the URL
  const { id } = useParams();
  const [question, setQuestion] = useState("hehehe");

  // Store interview details fetched from the backend
  const [result, setResult] = useState({});

  // Prevent multiple calls to the start interview API
  const hasStarted = useRef(false);

  /**
   * Fetch interview details using the interview ID.
   * This runs whenever the interview ID changes.
   */
  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/interview/${id}`,
          {
            credentials: "include",
          },
        );

        const info = await response.json();

        if (!info.success) {
          throw new Error(info.message || "Failed to fetch interview details");
        }

        // Save interview details in state
        setResult(info.data);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };

    fetchInterviewDetails();
  }, [id]);

  /**
   * Start the interview.
   *
   * This effect waits until the interview details are available.
   * It runs only once because of hasStarted.current.
   */
  useEffect(() => {
    // Wait until interview details are loaded
    if (!result) return;

    // Prevent duplicate API calls
    if (hasStarted.current) return;

    hasStarted.current = true;

    const generateFirstQuestion = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/interview/${id}/question`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
          },
        );
        const res = await response.json();
        if (!res.success) {
          throw new Error(res.message || "Failed to start interview");
        }
        // if (res.currentQuestion == 1) return;
        setQuestion(res.data.question);
        console.log("Start Interview Response:", res);
      } catch (error) {
        console.error("Error starting interview:", error);
      }
    };

    generateFirstQuestion();
  }, [result]);

  // Show difficulty after data is loaded
  const difficulty = result?.difficulty || "Difficulty";

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            AI Mock Interview
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Answer the AI interviewer naturally. Your responses will be analyzed
            for communication, confidence, and technical knowledge.
          </p>
        </div>

        {/* Interview Details */}
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
            {/* Job Role */}
            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Job Role
              </label>

              <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-5 py-3 font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                {result?.role || "Job Role"}
              </div>
            </div>

            {/* Difficulty */}
            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Difficulty
              </label>

              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  difficulty === "EASY"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : difficulty === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {difficulty}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="rounded-xl bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600">
              Pause Interview
            </button>

            <button className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700">
              End Interview
            </button>
          </div>
        </div>

        {/* AI & Camera Panels */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <AiPreview question={question} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <CameraPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
