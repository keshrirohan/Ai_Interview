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
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/interview" element={<NewInterview />} />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
