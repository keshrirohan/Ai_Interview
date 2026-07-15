const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 backdrop-blur">
            🚀 AI-Powered Interview Platform
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
            Ace Every
            <span className="block bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
              AI Interview
            </span>
            with EchoHire AI
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Practice real interview questions, receive instant AI feedback,
            improve your communication skills, and land your dream job with
            confidence.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/newinterview"
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-700"
            >
              Start Free Interview
            </a>

            <button className="rounded-xl border border-zinc-300 bg-white px-8 py-4 font-semibold text-zinc-800 transition-all duration-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
              <h3 className="text-3xl font-bold text-blue-600">10K+</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Mock Interviews
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
              <h3 className="text-3xl font-bold text-blue-600">95%</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Success Rate
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
              <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                AI Interview Coach
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
