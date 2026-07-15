import Hero from "../components/Hero";

import Testimonials from "../components/Testimonials";

import Plan from "../components/Plan";

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Hero />
      <Plan />
      <Testimonials />
    </div>
  );
}

export default Home;
