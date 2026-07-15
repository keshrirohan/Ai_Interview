const AiPreview = () => {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-8 rounded-2xl border border-zinc-200 bg-zinc-100 p-6 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
      {/* AI Avatar */}
      <div className="relative flex aspect-square w-40 items-center justify-center rounded-full border border-zinc-300 bg-white shadow-xl transition-all duration-300 sm:w-52 md:w-64 lg:w-72 dark:border-zinc-700 dark:bg-black">
        {/* Animated Pulse */}
        <span className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />

        {/* AI Core */}
        <div className="flex h-4/5 w-4/5 items-center justify-center rounded-full bg-zinc-100 text-5xl sm:text-6xl md:text-7xl dark:bg-zinc-900">
          🤖
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
        AI is speaking...
      </div>
      {/* Question */}
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Interview Question
        </p>

        <h2 className="text-center text-lg font-semibold leading-relaxed text-zinc-900 sm:text-xl md:text-2xl dark:text-zinc-100">
          Tell me about yourself and explain why you're interested in this role.
        </h2>
      </div>
    </section>
  );
};

export default AiPreview;
