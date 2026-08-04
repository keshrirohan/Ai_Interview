/**
 * ForgetPassword.jsx
 *
 * "Forgot password" form rendered inside the Navbar auth modal.
 *
 * Current state: UI-only. The backend reset endpoint is not yet implemented.
 * When it is ready, replace the TODO comment with the actual API call.
 *
 * Props:
 *   openLogin {Function} — switch the modal back to the Login view
 */

import { useState } from "react";

const ForgetPassword = ({ openLogin }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call POST /api/auth/forgot-password once the backend endpoint exists
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6 lg:p-8">

      {/* Heading */}
      <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
        Forgot Password?
      </h1>
      <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Enter your registered email and we'll send you a password reset link.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-300 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 active:scale-95"
        >
          Send Reset Link
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Remember your password?{" "}
        <button
          type="button"
          onClick={openLogin}
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Back to Login
        </button>
      </p>
    </div>
  );
};

export default ForgetPassword;
