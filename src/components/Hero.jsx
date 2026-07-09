const Hero = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <section className="h-screen flex items-center justify-center flex flex-col gap-6 text-center px-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome to <span className="text-blue-500">EchoHire AI</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
          Revolutionizing the hiring process with AI-powered solutions.
        </p>
        <div className="btn flex gap-4 ">
          <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">
            Get Started
          </button>
          <button className="px-5 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-900 transition">
            Demo
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
