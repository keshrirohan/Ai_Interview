import Home from "../src/pages/Home";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
