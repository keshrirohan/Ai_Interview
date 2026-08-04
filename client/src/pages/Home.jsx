/**
 * Home.jsx
 *
 * Landing page. Assembles three homepage sections:
 *   Hero         — headline, CTA buttons, and stats
 *   Plan         — pricing cards (Free / Pro / Enterprise)
 *   Testimonials — infinite-scroll review carousel
 *
 * This page contains no logic — it is purely compositional.
 */

import Hero         from "../components/home/Hero";
import Plan         from "../components/home/Plan";
import Testimonials from "../components/home/Testimonials";

function Home() {
  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-zinc-950">
      <Hero />
      <Plan />
      <Testimonials />
    </div>
  );
}

export default Home;
