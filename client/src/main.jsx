/**
 * main.jsx
 *
 * Application entry point.
 *
 * Sets up the global provider tree in this order:
 *   AuthProvider     — makes user/login/logout available to the entire app
 *   BrowserRouter    — enables client-side routing
 *   Navbar           — always visible at the top (outside <Routes>)
 *   App              — contains all route definitions
 *   Footer           — always visible at the bottom
 *   Toaster          — global toast notification container
 *
 * Why dark mode is set here:
 *   We add the "dark" class to <html> before React renders so the page
 *   never flashes in light mode on first load.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

// Start in dark mode by default
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <App />
        <Footer />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
