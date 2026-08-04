/**
 * PlanCard.jsx
 *
 * A single pricing card used by Plan.jsx.
 *
 * Props:
 *   title    {string}   — plan name (e.g. "Free", "Pro")
 *   price    {string}   — display price (e.g. "$0", "$19")
 *   duration {string}   — billing period (e.g. "/month")
 *   features {string[]} — list of included features
 *   popular  {boolean}  — highlights the card in blue when true
 */

import { Check } from "lucide-react";

const PlanCard = ({
  title,
  price,
  duration,
  features,
  popular = false,
}) => {
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
      ${
        popular
          ? "scale-105 border-blue-600 bg-blue-600 text-white shadow-blue-500/30 shadow-2xl"
          : "border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
      }`}
    >
      {/* Popular Badge */}
      {popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-black">
          ⭐ Most Popular
        </span>
      )}

      {/* Plan Title */}
      <h2 className="text-2xl font-bold">{title}</h2>

      {/* Price */}
      <div className="mt-5 flex items-end gap-1">
        <span className="text-5xl font-extrabold">{price}</span>
        <span
          className={`mb-1 ${
            popular ? "text-blue-100" : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {duration}
        </span>
      </div>

      {/* Features */}
      <ul className="mt-8 space-y-4 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check
              size={18}
              className={popular ? "text-white" : "text-green-500"}
            />

            <span
              className={
                popular
                  ? "text-blue-50"
                  : "text-zinc-600 dark:text-zinc-300"
              }
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        className={`mt-10 w-full rounded-xl py-3 font-semibold transition duration-300
        ${
          popular
            ? "bg-white text-blue-600 hover:bg-zinc-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {title === "Free" ? "Get Started" : "Choose Plan"}
      </button>
    </div>
  );
};

export default PlanCard;