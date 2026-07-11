import Home from "../src/pages/Home";
import { Routes, Route } from "react-router-dom";
import NewInterview from "./pages/NewInterview";
import Interview from "./pages/Interview";
import Profile from "./pages/Profile";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/NewInterview" element={<NewInterview />} />
      <Route path="/interview" element={<NewInterview />} />
      <Route path="/interview/:id" element={<Interview />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
