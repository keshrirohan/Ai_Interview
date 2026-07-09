import { Briefcase, Building2, MapPin, Clock } from "lucide-react";

const JDCard = ({ jds }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {jds.map((jd, index) => (
        <div
          key={index}
          className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* Title */}
          <h3 className="min-h-[64px] text-2xl font-semibold text-zinc-900 dark:text-white">
            {jd.title}
          </h3>

          {/* Company */}
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Building2 size={16} />
            {jd.company}
          </div>

          {/* Details */}
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin size={15} />
              {jd.location}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={15} />
              {jd.experience}
            </span>

            <span className="flex items-center gap-1">
              <Briefcase size={15} />
              {jd.type}
            </span>
          </div>

          {/* Description */}
          <p className="mt-5 min-h-[96px] text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {jd.description}
          </p>

          {/* Skills */}
          <div className="mt-5 flex min-h-[120px] flex-wrap gap-2">
            {jd.requirements.map((skill, i) => (
              <span
                key={i}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-auto pt-6 flex gap-3">
            <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
              Start Interview
            </button>

            <button className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JDCard;
