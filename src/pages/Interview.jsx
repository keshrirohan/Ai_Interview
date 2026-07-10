
import CameraPreview from "../components/CameraPreview";

const Interview = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            AI Mock Interview
          </h1>

          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Answer the AI interviewer naturally. Your responses will be analyzed
            for communication, confidence, and technical knowledge.
          </p>
        </div>

        {/* Interview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Interviewer */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg p-6">
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-5xl">
                🤖
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-zinc-900 dark:text-white">
                AI Interviewer
              </h2>

              <span className="mt-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Speaking...
              </span>
            </div>

            <div className="mt-8 rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-5">
              <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Tell me about yourself and explain a challenging project you've
                worked on recently.
              </p>
            </div>
          </div>

          {/* User Camera */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg p-6">
            <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              {/* Replace with webcam component */}
              <span className="text-zinc-500 dark:text-zinc-400">
               
                <CameraPreview />
              </span>
            </div>

            {/* Status */}

            {/* Transcript */}
            <div className="mt-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-5 min-h-36">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">
                Your Response
              </h3>

              <p className="text-zinc-600 dark:text-zinc-400">
                Your live transcript will appear here...
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700">
            Next Question
          </button>

          <button className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700">
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
