import { useState } from "react";
import JDs from "../components/JDs";
import { useNavigate } from "react-router-dom";

const NewInterview = () => {
  const navigate = useNavigate();

  const [invdata, setInvdata] = useState({
    jobDescription: "",
    difficulty: "MEDIUM",
  });

  const handleonchange = (e) => {
    setInvdata({
      ...invdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateInterview = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/interview/start`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invdata),
      });
      const result = await response.json();
      console.log("Generate Interview response:", result);
      if (!result.success) {
        throw new Error(result.message || "Failed to generate interview");
      }
      console.log("Generate Interview response:", result.data);
      console.log("Before navigate");
      console.log("Navigating url:", `/interview/${result.data.id}`);
      navigate(`/interview/${result.data.id}`);
    } catch (error) {
      console.error("Error during interview generation:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-10 transition-colors duration-300 dark:bg-zinc-950">
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

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Job Description */}
          <div className="mb-6">
            <label className="mb-2 block font-medium text-zinc-800 dark:text-zinc-200">
              Job Description
            </label>

            <textarea
              rows={10}
              placeholder="Paste the complete job description here..."
              className="w-full resize-none rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              name="jobDescription"
              value={invdata.jobDescription}
              onChange={handleonchange}
            />
          </div>

          {/* Upload */}
          <div className="mb-6">
            <label className="mb-2 block font-medium text-zinc-800 dark:text-zinc-200">
              Upload Job Description
            </label>

            <input
              type="file"
              className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            />
          </div>

          <select
            required
            className="mb-6 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            name="difficulty"
            value={invdata.difficulty}
            onChange={handleonchange}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
              onClick={handleGenerateInterview}
            >
              Generate Interview
            </button>

            <button className="rounded-xl border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
              Clear
            </button>
          </div>
        </div>

        {/* Previous JDs */}
        <div className="mt-10">
          <JDs />
        </div>
      </div>
    </div>
  );
};

export default NewInterview;
