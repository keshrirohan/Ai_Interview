/**
 * Navbar.jsx
 *
 * Fixed top navigation bar rendered on every page via main.jsx.
 *
 * Responsibilities:
 *   - Render nav links (Home, Interview, Contact) using React Router <Link>
 *   - Show Login / Get Started buttons when logged out
 *   - Show User avatar + Logout button when logged in
 *   - Render the auth modal (Login / Signup / ForgotPassword) as an overlay
 *   - Animate the mobile menu slide-in with GSAP
 *
 * Auth state comes from useAuth() (AuthContext).
 * The mobile menu uses a ref + GSAP instead of CSS transitions for
 * smoother performance on lower-end devices.
 */

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, User, X } from "lucide-react";

import ThemeToggle from "../common/ThemeToggle";
import Signup from "../auth/Signup";
import Login from "../auth/Login";
import ForgetPassword from "../auth/ForgetPassword";
import { useAuth } from "../../context/AuthContext";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "Home",      to: "/"         },
  { label: "Interview", to: "/interview" },
  { label: "Contact",   to: "/contact"  },
];

const Navbar = () => {
  const [open, setOpen]           = useState(false);
  const [authModal, setAuthModal] = useState(null); // "login" | "signup" | "forgot" | null
  const { user, logout }          = useAuth();
  const mobileRef                 = useRef();

  // ─── Mobile menu slide animation ──────────────────────────────────────────
  useGSAP(() => {
    gsap.set(mobileRef.current, { x: "-100%" });
  });

  useGSAP(() => {
    gsap.to(mobileRef.current, {
      x: open ? "0%" : "-100%",
      duration: 0.4,
      ease: "power3.out",
    });
  }, [open]);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        { method: "POST", credentials: "include" },
      );
      if (!res.ok) throw new Error("Logout failed");
      logout();
    } catch (error) {
      console.error("[Navbar] logout error:", error);
    }
  };

  const closeMenu = () => setOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-zinc-200 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-zinc-900 dark:text-white">
            EchoHire<span className="text-blue-500">AI</span>
          </Link>

          {/* Desktop nav links — key on <Link>, not inner <li> */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="cursor-pointer text-zinc-700 transition hover:text-blue-500 dark:text-zinc-300"
                >
                  {label}
                </Link>
              </li>
            ))}
            {user && user.role === "ADMIN" && (
              <li>
                <Link
                  to="/admin"
                  className="cursor-pointer font-bold text-red-600 transition hover:text-red-500 dark:text-red-400"
                >
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop auth controls */}
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to={`/profile/${user.id}`}
                  title="My Profile"
                  className="rounded-lg bg-zinc-200 p-2 text-zinc-900 transition hover:scale-110 dark:bg-zinc-800 dark:text-white"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            {user && (
              <Link
                to={`/profile/${user.id}`}
                title="My Profile"
                className="rounded-lg bg-zinc-200 p-2 text-zinc-900 dark:bg-zinc-800 dark:text-white"
              >
                <User size={18} />
              </Link>
            )}
            <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
              {open
                ? <X className="text-zinc-900 dark:text-white" />
                : <Menu className="text-zinc-900 dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — links now use <Link> so they actually navigate */}
        <div
          ref={mobileRef}
          className="absolute left-0 top-full h-screen w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:hidden"
        >
          <ul className="flex h-full flex-col items-center justify-center gap-8">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  onClick={closeMenu}
                  className="text-lg text-zinc-700 transition hover:text-blue-500 dark:text-zinc-300"
                >
                  {label}
                </Link>
              </li>
            ))}

            {user ? (
              <li>
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => { setAuthModal("login"); closeMenu(); }}
                    className="font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setAuthModal("signup"); closeMenu(); }}
                    className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                  >
                    Get Started
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Auth modal */}
      {authModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-md">
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <button
              onClick={() => setAuthModal(null)}
              className="fixed right-4 top-4 z-50 rounded-lg p-2 text-white transition hover:bg-white/10 sm:right-6 sm:top-6"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {authModal === "login"  && (
              <Login
                openSignup={() => setAuthModal("signup")}
                openForgot={() => setAuthModal("forgot")}
                closeModal={() => setAuthModal(null)}
              />
            )}
            {authModal === "signup" && (
              <Signup
                openLogin={() => setAuthModal("login")}
                closeModal={() => setAuthModal(null)}
              />
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
