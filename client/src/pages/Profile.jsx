/**
 * Profile.jsx
 *
 * User profile page showing personal info, interview statistics,
 * skills, and social links.
 *
 * Current state: static placeholder data.
 * TODO: replace placeholder values with real data from GET /api/dashboard
 *       and a dedicated GET /api/profile/:id endpoint once built.
 *
 * Note on layout: uses max-w-7xl with horizontal padding instead of
 * w-screen to prevent the horizontal overflow that w-screen causes.
 */

import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Pencil,
  Globe2,
  Award,
  FileText,
  Target,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// ─── Static placeholder data ──────────────────────────────────────────────────
// Replace these with real API data when the profile endpoint is ready

const STATS = [
  { title: "Interviews",    value: "24", icon: <FileText size={20} />, color: "text-blue-500"   },
  { title: "Completed",     value: "18", icon: <Award    size={20} />, color: "text-green-500"  },
  { title: "Average Score", value: "87%", icon: <Target  size={20} />, color: "text-yellow-500" },
  { title: "Certificates",  value: "6",  icon: <Award    size={20} />, color: "text-purple-500" },
];

const SKILLS = [
  "React", "Next.js", "JavaScript", "TypeScript",
  "Node.js", "Express", "MongoDB", "Tailwind CSS", "Git", "REST API",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

// A single info row in the left profile card (email, phone, location, etc.)
const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-zinc-100 dark:hover:bg-zinc-800">
    <div className="text-zinc-500 dark:text-zinc-400">{icon}</div>
    <span className="text-sm text-zinc-700 dark:text-zinc-300">{text}</span>
  </div>
);

// A single statistics card in the stats grid
const StatCard = ({ title, value, icon, color }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
    <div className={`mb-4 ${color}`}>{icon}</div>
    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{value}</h2>
    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
  </div>
);

// A single social media icon button
const SocialButton = ({ icon }) => (
  <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 text-xl text-zinc-700 transition hover:bg-zinc-100 hover:shadow-md dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
    {icon}
  </button>
);

// ─── Page component ───────────────────────────────────────────────────────────

const Profile = () => {
  return (
    // Fixed: was w-screen which caused horizontal overflow on all viewports.
    // Now uses a centred max-width container with horizontal padding instead.
    <div className="mx-auto min-h-screen max-w-7xl space-y-8 bg-white px-6 py-24 dark:bg-zinc-950">

      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          My Profile
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your profile and track your interview performance.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">

        {/* ── Left card: avatar, name, contact ─────────────────────────── */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-center">
            <img
              src="https://avatars.githubusercontent.com/u/105051168?v=4"
              alt="Profile avatar"
              className="h-32 w-32 rounded-full border-4 border-zinc-200 object-cover dark:border-zinc-700"
            />
            <h2 className="mt-5 text-2xl font-bold text-zinc-900 dark:text-white">
              Rohan Keshri
            </h2>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              Frontend Developer
            </p>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              <Pencil size={18} />
              Edit Profile
            </button>
          </div>

          {/* Contact info rows */}
          <div className="mt-8 space-y-3">
            <InfoRow icon={<Mail     size={18} />} text="rohan@example.com"   />
            <InfoRow icon={<Phone    size={18} />} text="+91 XXXXX XXXXX"     />
            <InfoRow icon={<MapPin   size={18} />} text="Ranchi, India"       />
            <InfoRow icon={<Briefcase size={18} />} text="Frontend Developer" />
          </div>
        </div>

        {/* ── Right column: about, stats, skills, social ───────────────── */}
        <div className="space-y-8 xl:col-span-2">

          {/* About section */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              About Me
            </h3>
            <p className="leading-8 text-zinc-600 dark:text-zinc-400">
              Passionate Full Stack Developer specialising in React, Next.js, Node.js,
              and modern web technologies. I enjoy building scalable, responsive, and
              AI-powered applications while continuously learning new technologies.
            </p>
          </section>

          {/* Interview stats */}
          <section>
            <h3 className="mb-5 text-xl font-semibold text-zinc-900 dark:text-white">
              Interview Statistics
            </h3>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {STATS.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-5 text-xl font-semibold text-zinc-900 dark:text-white">
              Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:scale-105 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Social links */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-5 text-xl font-semibold text-zinc-900 dark:text-white">
              Social Links
            </h3>
            <div className="flex gap-4">
              <SocialButton icon={<FaGithub />}  />
              <SocialButton icon={<FaLinkedin />} />
              <SocialButton icon={<Globe2 />}    />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
