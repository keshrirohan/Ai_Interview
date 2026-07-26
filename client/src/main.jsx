import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/authContextProvider.jsx";
import { Toaster } from "react-hot-toast";

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
