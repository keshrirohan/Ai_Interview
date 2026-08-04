/**
 * Footer.jsx
 *
 * Site-wide footer displayed on every page.
 * Contains the brand name, tagline, copyright, and social links.
 * Rendered directly in main.jsx outside of <Routes> so it is always visible.
 */

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row">
        {/* Left */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            EchoHire AI
          </h2>

          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Practice smarter. Get hired faster.
          </p>
        </div>

        {/* Center */}
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} EchoHire AI. All rights reserved.
          <br />
          Made with ❤️ by{" "}
          <a
            href="https://github.com/keshrirohan"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            Rohan Keshri
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/keshrirohan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 transition hover:text-blue-600 dark:text-zinc-400"
          >
            <FaGithub size={20} />
          </a>

          <a
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 transition hover:text-blue-600 dark:text-zinc-400"
          >
            <FaLinkedin size={20} />
          </a>

          <a
            href="mailto:your@email.com"
            className="text-zinc-600 transition hover:text-blue-600 dark:text-zinc-400"
          >
            <FaEnvelope size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
