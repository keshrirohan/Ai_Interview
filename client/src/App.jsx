/**
 * App.jsx
 *
 * Defines all client-side routes.
 *
 * Route structure:
 *   /              → Home          (public)
 *   /home          → Home          (public alias)
 *   /contact       → Contact       (public)
 *   /interview     → NewInterview  (public — create a new interview)
 *   /interview/:id → Interview     (public — live interview session)
 *   /profile/:id   → Profile       (private — requires login)
 *   *              → NotFound 404
 *
 * PrivateRoutes wraps routes that require authentication.
 * If the user is not logged in, they are redirected to "/".
 */

import { Routes, Route } from "react-router-dom";

import Home         from "./pages/Home";
import Contact      from "./pages/Contact";
import NewInterview from "./pages/NewInterview";
import Interview    from "./pages/Interview";
import Profile      from "./pages/Profile";
import NotFound     from "./pages/Page404";

import PrivateRoutes from "./components/common/PrivateRoutes";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"            element={<Home />} />
      <Route path="/home"        element={<Home />} />
      <Route path="/contact"     element={<Contact />} />
      <Route path="/interview"   element={<NewInterview />} />
      <Route path="/interview/:id" element={<Interview />} />

      {/* Private routes — user must be logged in */}
      <Route element={<PrivateRoutes />}>
        <Route path="/profile/:id" element={<Profile />} />
      </Route>

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
