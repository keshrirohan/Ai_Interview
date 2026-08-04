/**
 * JDs.jsx
 *
 * Displays a list of past/sample job descriptions on the NewInterview page.
 * Each card lets the user start a new interview for that role.
 *
 * Current state: static placeholder data.
 * TODO: replace with real data fetched from GET /api/interview (user history).
 */

import JDCard from "./JDCard";

const JDs = () => {
  const jds = [
    {
      title: "Frontend Developer (React)",
      company: "TechNova Inc.",
      experience: "1-3 Years",
      location: "Remote",
      type: "Full-Time",
      description:
        "We're looking for a Frontend Developer to build modern, responsive web applications using React. You'll collaborate with designers and backend engineers to create high-quality user experiences.",

      requirements: [
        "Strong knowledge of React.js and JavaScript (ES6+)",
        "Experience with Tailwind CSS or Bootstrap",
        "Understanding of REST APIs",
        "Git & GitHub workflow",
        "Responsive web design",
      ],
    },

    {
      title: "MERN Stack Developer",
      company: "ByteMinders",
      experience: "0-2 Years",
      location: "Hybrid",
      type: "Internship",

      description:
        "Join our engineering team to develop scalable MERN applications. Work on APIs, authentication, dashboards, and AI-powered features.",

      requirements: [
        "React.js & Node.js",
        "Express.js and MongoDB",
        "JWT Authentication",
        "REST API Development",
        "Basic Docker knowledge",
      ],
    },

    {
      title: "AI/ML Engineer",
      company: "EchoHire AI",
      experience: "2+ Years",
      location: "Remote",
      type: "Full-Time",

      description:
        "Build AI-powered interview systems using LLMs, speech recognition, and machine learning. Improve interview analysis and candidate evaluation.",

      requirements: [
        "Python",
        "Machine Learning",
        "LLMs (Gemini/OpenAI)",
        "TensorFlow or PyTorch",
        "Prompt Engineering",
      ],
    },
  ];

  return (
    <section className="mt-12">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Recent Job Descriptions
          </h2>

          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Continue practicing interviews from your saved job descriptions.
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700">
          + New Job Description
        </button>
      </div>

      <JDCard jds={jds} />
    </section>
  );
};

export default JDs;