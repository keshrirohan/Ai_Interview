import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Star } from "lucide-react";

gsap.registerPlugin(useGSAP);

// ─── Static data ──────────────────────────────────────────────────────────────
// Defined outside the component so they are never recreated on re-render.

const TESTIMONIALS = [
  {
    name: "John Doe",
    title: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    testimonial:
      "EchoHire AI helped me prepare for technical interviews. The AI feedback was incredibly accurate and boosted my confidence.",
  },
  {
    name: "Sarah Wilson",
    title: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    testimonial:
      "The mock interviews felt realistic. I landed my dream job after just two weeks of practice.",
  },
  {
    name: "Michael Chen",
    title: "Product Manager",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    testimonial:
      "Resume analysis, AI feedback, and performance tracking are simply outstanding. Highly recommended!",
  },
];

// 4× duplication for the infinite-scroll illusion — computed once at module level
const SCROLL_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

// ─── Component ────────────────────────────────────────────────────────────────

const Testimonials = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Entrance animation for visible cards
    gsap.from(".testimonial-card", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });

    // Infinite horizontal scroll
    const container = containerRef.current;
    if (!container) return;

    gsap.to(container, {
      x: -(container.scrollWidth / 2),
      duration: 30,
      ease: "none",
      repeat: -1,
      force3D: true,  // GPU compositing for smooth animation
    });
  }, []);

  return (
    <section className="overflow-hidden bg-zinc-50 py-20 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Loved by <span className="text-blue-600">Developers</span>
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Thousands of candidates use EchoHire AI to ace interviews.
          </p>
        </div>

        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex w-max gap-6 will-change-transform"
          >
            {SCROLL_ITEMS.map((item, index) => (
              <div
                key={index}
                className="testimonial-card w-[300px] shrink-0 rounded-xl border border-zinc-200 bg-white p-6 shadow-md sm:w-[340px] dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Review */}
                <p className="min-h-[110px] text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  "{item.testimonial}"
                </p>

                {/* User */}
                <div className="mt-6 flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-center">
          <div>
            <h3 className="text-3xl font-bold text-blue-600">10K+</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Happy Candidates</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">4.9/5</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Average Rating</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">95%</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Interview Success</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
