import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const Testimonials = () => {
  //testimonials data
  const testimonials = [
    {
      name: "John Doe",
      title: "CEO of Company",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      testimonial:
        "This product has changed the way we do business. Highly recommended!",
    },
    {
      name: "Jane Smith",
      title: "Marketing Manager",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      testimonial:
        "The team at EchoHire AI is amazing. Their support is top-notch!",
    },
    {
      name: "Mike Johnson",
      title: "Software Engineer",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      testimonial:
        "I can't imagine going back to the old way of doing things. This is a game-changer!",
    },
  ];
  // used to create a continuous scrolling effect by duplicating the testimonials array multiple times
  const allTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
    
  ];

  const containerRef = useRef(null);

  useGSAP(() => {
    // Entrance animation
    gsap.from(".testimonial-card", {
      opacity: 0,
      y: 40,
      stagger: 0.15, //  used to make the card appear one after another with a slight delay
      duration: 1,
      ease: "power2.out",
    });

    const container = containerRef.current;

    if (!container) return;

    const distance = container.scrollWidth / 2;

    gsap.to(container, {
      x: -distance,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <section className="overflow-hidden bg-zinc-100 py-16 dark:bg-zinc-800">
      <h2 className="mb-12 text-center text-3xl font-bold text-zinc-900 dark:text-white">
        What Our Users Say
        <span className="text-blue-500"> Testimonials</span>
      </h2>

      <div className="overflow-hidden">
        <div ref={containerRef} className="flex w-max gap-8 ">
          {allTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card w-[350px] shrink-0 rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900"
            >
              <div className="mb-4 flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {testimonial.name}
                  </h3>

                  <p className="text-blue-500">{testimonial.title}</p>
                </div>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400">
                "{testimonial.testimonial}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
