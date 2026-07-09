import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Plan from "./components/Plan";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />

      <Hero />
      <Plan />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
