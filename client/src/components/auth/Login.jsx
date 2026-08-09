import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { errorToast, successToast } from "../../utils/toast";
import { LoaderCircle } from "lucide-react";

const Login = ({ openSignup, openForgot, closeModal }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      errorToast("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!data.success) {
        errorToast(data.message || "Login failed. Please try again.");
        return;
      }

      login(data.user);
      successToast("Login successful!");
      closeModal();
    } catch (error) {
      console.error("[Login] error:", error);
      errorToast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      {/* Heading */}
      <h1 className="text-center text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
        Welcome Back 👋
      </h1>

      <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
        Login to continue your AI interview preparation journey.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-300 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <button
              type="button"
              onClick={openForgot}
              className="text-sm text-blue-600 transition hover:text-blue-700"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-300 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 active:scale-95"
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
        <span className="mx-4 text-sm text-zinc-500 dark:text-zinc-400">OR</span>
        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
      </div>

      {/* Google login placeholder */}
      <button
        type="button"
        className="w-full rounded-lg border border-zinc-300 bg-white py-3 text-sm font-medium text-zinc-800 transition-all duration-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={openSignup}
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
