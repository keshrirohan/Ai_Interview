import { useState } from "react";
import AiPreview from "../components/AiPreview";
import CameraPreview from "../components/CameraPreview";

const Interview = () => {
  const [difficulty, setDifficulty] = useState("Medium");

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            AI Mock Interview
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Answer the AI interviewer naturally. Your responses will be analyzed
            for communication, confidence, and technical knowledge.
          </p>
        </div>

        {/* Interview Information */}
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Interview Info */}
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
            {/* Job Role */}
            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Job Role
              </label>

              <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-5 py-3 font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                Frontend Developer
              </div>
            </div>

            {/* Difficulty */}
            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Difficulty
              </label>

              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  difficulty === "Easy"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : difficulty === "Medium"
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

        {/* Interview Panels */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <AiPreview />
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <CameraPreview />
          </div>
        </div>

        {/* Bottom Controls */}
      </div>
    </div>
  );
};

export default Interview;
