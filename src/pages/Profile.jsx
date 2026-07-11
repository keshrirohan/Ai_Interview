import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  Award,
  Pencil,
} from "lucide-react";

const Profile = () => {
  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          My Profile
        </h1>

        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your profile and track your interview performance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <div className="flex flex-col items-center">
            <img
              src="https://avatars.githubusercontent.com/u/105051168?v=4"
              alt=""
              className="h-32 w-32 rounded-full object-cover"
            />

            <h2 className="mt-5 text-2xl font-bold dark:text-white">
              Rohan Keshri
            </h2>

            <p className="mt-1 text-zinc-500">
              Frontend Developer
            </p>

            <button className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-white hover:bg-zinc-800 dark:bg-zinc-800">
              <Pencil size={18} />
              Edit Profile
            </button>
          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>rohan@example.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} />
              <span>+91 XXXXX XXXXX</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} />
              <span>Ranchi, India</span>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase size={18} />
              <span>Frontend Developer</span>
            </div>

          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-6">

          {/* About */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              About
            </h3>

            <p className="leading-7 text-zinc-600 dark:text-zinc-400">
              Passionate Frontend Developer with experience building modern
              React applications. Interested in AI-powered products,
              performance optimization, and beautiful user experiences.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Interviews"
              value="24"
            />

            <StatCard
              title="Completed"
              value="18"
            />

            <StatCard
              title="Average Score"
              value="87%"
            />

            <StatCard
              title="Certificates"
              value="6"
            />

          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

            <h3 className="mb-5 text-xl font-semibold dark:text-white">
              Skills
            </h3>

            <div className="flex flex-wrap gap-3">

              {[
                "React",
                "JavaScript",
                "TypeScript",
                "Node.js",
                "Express",
                "MongoDB",
                "Tailwind",
                "Git",
                "REST API",
                "Next.js",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-zinc-100 px-4 py-2 text-sm dark:bg-zinc-800"
                >
                  {skill}
                </span>
              ))}

            </div>
          </div>

          {/* Social */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

            <h3 className="mb-5 text-xl font-semibold dark:text-white">
              Social Links
            </h3>

            <div className="flex gap-4">

              <button className="rounded-xl border p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <Github />
              </button>

              <button className="rounded-xl border p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <Linkedin />
              </button>

              <button className="rounded-xl border p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <Globe />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <h2 className="text-3xl font-bold text-blue-600">
      {value}
    </h2>

    <p className="mt-2 text-zinc-500">
      {title}
    </p>
  </div>
);

export default Profile;