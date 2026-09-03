/**
 * Page404.jsx
 *
 * 404 Not Found page — rendered for any route that doesn't match.
 * Provides a Go Home button and a Go Back button so users can
 * recover without using the browser's back button.
 */

import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 */}

        <h1 className="text-8xl font-extrabold text-blue-600 sm:text-9xl">
          404
        </h1>

        {/* Heading */}

        <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white sm:text-5xl">
          Oops! Page Not Found
        </h2>

        {/* Description */}

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to preparing for your next interview.
        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105"
          >
            <Home size={20} />
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-all duration-300 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Decorative Glow */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>
    </section>
  );
};

export default NotFound;
