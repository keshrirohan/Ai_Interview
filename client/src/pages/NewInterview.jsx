/**
 * NewInterview.jsx
 *
 * Page where the user creates a new AI interview session.
 *
 * Responsibilities:
 *   - Accept a job description (text or file upload)
 *   - Accept a difficulty level
 *   - Submit to POST /api/interview/start
 *   - Navigate to the live interview page on success
 *   - Show error toasts on failure
 *   - Display past job descriptions via the JDs component
 *
 * No interview logic lives here — this page only handles form state
 * and the single API call to start a session.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JDs from "../components/home/JDs";
import { errorToast } from "../utils/toast";

const NewInterview = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobDescription: "",
    difficulty: "MEDIUM",
  });

  // Update a single form field by name
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset the form back to its empty default state
  const handleClear = () => {
    setFormData({ jobDescription: "", difficulty: "MEDIUM" });
  };

  const handleGenerateInterview = async (e) => {
    e.preventDefault();

    if (!formData.jobDescription.trim()) {
      errorToast("Please paste a job description before generating.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/interview/start`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (!result.success) {
        errorToast(result.message || "Failed to generate interview.");
        return;
      }

      // Navigate to the live interview session
      navigate(`/interview/${result.data.id}`);
    } catch (error) {
      // Single error toast — previously there were two calls here
      errorToast(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-10 pt-24 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Create Interview
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Paste a job description or upload one to generate an AI interview.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          {/* Job description textarea */}
          <div className="mb-6">
            <label className="mb-2 block font-medium text-zinc-800 dark:text-zinc-200">
              Job Description
            </label>
            <textarea
              rows={10}
              placeholder="Paste the complete job description here..."
              className="w-full resize-none rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
            />
          </div>

          {/* File upload (wired to state in a future iteration) */}
          <div className="mb-6">
            <label className="mb-2 block font-medium text-zinc-800 dark:text-zinc-200">
              Upload Job Description
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            />
          </div>

          {/* Difficulty selector */}
          <select
            required
            className="mb-6 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Action buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleGenerateInterview}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Generate Interview
            </button>

            <button
              onClick={handleClear}
              type="button"
              className="rounded-xl border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Past job descriptions */}
        <div className="mt-10">
          <JDs />
        </div>
      </div>
    </div>
  );
};

export default NewInterview;
