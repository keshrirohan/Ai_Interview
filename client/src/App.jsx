import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import NewInterview from "./pages/NewInterview";
import Interview from "./pages/Interview";
import Profile from "./pages/Profile";
import NotFound from "./pages/Page404";

// Protected Route Component
import PrivateRoutes from "./utils/PrivateRoutes";

function App() {
  return (
    <Routes>
      {/* =======================
          Public Routes
          Anyone can access these pages
      ======================== */}

      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* Contact Page */}
      <Route path="/contact" element={<Contact />} />

      {/* =======================
          Protected Routes
          User must be logged in
      ======================== */}

      {/* 
        PrivateRoutes checks if the user is authenticated.
        If authenticated -> renders the child routes.
        Otherwise -> redirects to the login page.
      */}
      <Route element={<PrivateRoutes />}>
        {/* New Interview Page */}
        <Route path="/interview" element={<NewInterview />} />

        {/* Interview Page with Dynamic ID */}
        {/* Example: /interview/abc123 */}
        <Route path="/interview/:id" element={<Interview />} />

        {/* User Profile */}
        {/* Example: /profile/64f98c2 */}
        <Route path="/profile/:id" element={<Profile />} />
      </Route>

      {/* =======================
          404 Page
          If no route matches
      ======================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
