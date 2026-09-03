/**
 * ForgetPassword.jsx
 *
 * "Forgot password" form rendered inside the Navbar auth modal.
 *
 * Current state: the backend reset endpoint is not yet implemented.
 * When it is ready, replace the TODO block with the real API call and
 * remove the "not yet available" toast.
 *
 * Props:
 *   openLogin {Function} — switch the modal back to the Login view
 */

import { useState } from "react";
import { errorToast, successToast } from "../../utils/toast";

const ForgetPassword = ({ openLogin }) => {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      errorToast("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // TODO: replace this block with the real API call once the backend
      // endpoint POST /api/auth/forgot-password is implemented.
      // Example:
      //   const res  = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email }),
      //   });
      //   const data = await res.json();
      //   if (!data.success) throw new Error(data.message);
      //   successToast("Reset link sent! Check your inbox.");

      // Until the endpoint exists, tell the user clearly rather than silently doing nothing.
      errorToast("Password reset is not yet available. Please contact support.");
    } catch (err) {
      errorToast(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            htmlFor="fp-email"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email Address
          </label>
          <input
            id="fp-email"
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
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send Reset Link"}
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
