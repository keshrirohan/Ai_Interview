import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, X } from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import ForgetPassword from "./auth/ForgetPassword";

gsap.registerPlugin(useGSAP);

const Navbar = () => {
  // =========================
  // States
  // =========================

  const [open, setOpen] = useState(false);

  // login | signup | null
  const [authModal, setAuthModal] = useState(null);

  // =========================
  // Refs
  // =========================

  const mobileRef = useRef();

  // =========================
  // Mobile Menu Animation
  // =========================

  useGSAP(() => {
    gsap.set(mobileRef.current, {
      x: "-100%",
    });
  });

  useGSAP(() => {
    gsap.to(mobileRef.current, {
      x: open ? "0%" : "-100%",
      duration: 0.4,
      ease: "power3.out",
    });
  }, [open]);

  // =========================
  // Navbar Links
  // =========================

  const links = ["Home", "Dashboard", "Profile", "Contact"];

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-zinc-200 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}

          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            EchoHire
            <span className="text-blue-500">AI</span>
          </h1>

          {/* Desktop Menu */}

          <ul className="hidden gap-8 md:flex">
            {links.map((item) => (
              <li
                key={item}
                className="cursor-pointer text-zinc-700 transition hover:text-blue-500 dark:text-zinc-300"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}

          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />

            <button
              onClick={() => setAuthModal("login")}
              className="font-medium text-zinc-700 transition hover:text-blue-500 dark:text-zinc-300"
            >
              Login
            </button>

            <button
              onClick={() => setAuthModal("signup")}
              className="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>

          {/* Mobile */}

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />

            <button onClick={() => setOpen(!open)}>
              {open ? (
                <X className="text-zinc-900 dark:text-white" />
              ) : (
                <Menu className="text-zinc-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}

        <div
          ref={mobileRef}
          className="absolute left-0 top-full h-screen w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:hidden"
        >
          <ul className="flex h-full flex-col items-center justify-center gap-8">
            {links.map((item) => (
              <li
                key={item}
                onClick={() => setOpen(false)}
                className="cursor-pointer text-lg text-zinc-700 transition hover:text-blue-500 dark:text-zinc-300"
              >
                {item}
              </li>
            ))}

            <button
              onClick={() => {
                setAuthModal("login");
                setOpen(false);
              }}
              className="font-medium text-zinc-700 dark:text-zinc-300"
            >
              Login
            </button>

            <button
              onClick={() => {
                setAuthModal("signup");
                setOpen(false);
              }}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white"
            >
              Get Started
            </button>
          </ul>
        </div>
      </nav>

      {/* =========================
          Authentication Modal
      ========================= */}

      {authModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-md ">
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            {/* Close Button */}

            <button
              onClick={() => setAuthModal(null)}
              className="fixed right-4 top-4 z-50 rounded-lg p-2 text-white transition hover:bg-white/10 sm:right-6 sm:top-6"
            >
              <X size={24} />
            </button>

            {authModal === "login" && (
              <Login
                openSignup={() => setAuthModal("signup")}
                openForgot={() => setAuthModal("forgot")}
              />
            )}

            {authModal === "signup" && (
              <Signup openLogin={() => setAuthModal("login")} />
            )}

            {authModal === "forgot" && (
              <ForgetPassword openLogin={() => setAuthModal("login")} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
