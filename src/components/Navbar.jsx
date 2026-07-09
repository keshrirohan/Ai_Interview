import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

gsap.registerPlugin(useGSAP);

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navRef = useRef();
  const mobileRef = useRef();
  useGSAP(
    () => {
      gsap.set(mobileRef.current, { x: "-100%" });
    },
    { scope: mobileRef },
  );

  useGSAP(() => {
    if (open) {
      gsap.to(mobileRef.current, {
        x: "0%",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(mobileRef.current, {
        x: "-100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [open]);

  const links = ["Home", "Dashboard", "Profile", "Contact"];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          EchoHire
          <span className="text-blue-500">AI</span>
        </h1>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8">
          {links.map((item) => (
            <li
              key={item}
              className="cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-blue-500 transition"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">
            Get Started
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => setOpen(!open)}
            className="text-zinc-900 dark:text-white"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      <div
        ref={mobileRef}
        className="md:hidden absolute top-full left-0 w-full h-screen bg-white  dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 "
      >
        <ul className="flex flex-col items-center justify-center h-full gap-6 py-6">
          {links.map((item) => (
            <li
              key={item}
              onClick={() => setOpen(false)}
              className="cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-blue-500 transition"
            >
              {item}
            </li>
          ))}

          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
            Get Started
          </button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
