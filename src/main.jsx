import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter } from "react-router-dom";

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <App />
      <Footer />
    </BrowserRouter>
  </StrictMode>,
);
