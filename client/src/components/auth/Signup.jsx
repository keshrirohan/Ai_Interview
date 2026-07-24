import { useState } from "react";

const Signup = ({ openLogin, closeModal }) => {
  // ==========================
  // Form State
  // ==========================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ==========================
  // Handle Input Change
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Handle Form Submit
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;
      console.log("Signup URL:", url);
      const response = await fetch(url, {
        method: "POST",
        credentials: "include", // Include credentials for cookie handling
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Signup failed");
      }
      closeModal();
      console.log("Signup response:", data);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      {/* ==========================
          Heading
      ========================== */}

      <h1 className="text-center text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
        Create Account 🚀
      </h1>

      <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
        Join EchoHire AI and start preparing for interviews with AI-powered mock
        sessions.
      </p>

      {/* ==========================
          Signup Form
      ========================== */}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* name */}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-300 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

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
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-300 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Confirm Password */}

        {/* <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-300 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div> */}

        {/* Signup Button */}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 active:scale-95"
        >
          Create Account
        </button>
      </form>

      {/* Divider */}

      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700"></div>

        <span className="mx-4 text-sm text-zinc-500 dark:text-zinc-400">
          OR
        </span>

        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700"></div>
      </div>

      {/* Google Signup */}

      <button
        type="button"
        className="w-full rounded-lg border border-zinc-300 bg-white py-3 text-sm font-medium text-zinc-800 transition-all duration-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
      >
        Continue with Google
      </button>

      {/* Login Link */}

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={openLogin}
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
