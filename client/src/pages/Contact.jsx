/**
 * Contact.jsx
 *
 * Contact page with info cards and a message form.
 * Purely presentational — the form submit button has no handler yet.
 * TODO: wire form to POST /api/contact once the endpoint is built.
 */

import { Mail, Phone, MapPin, Send, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  return (
    <section
      id="contact"
      className="min-h-screen bg-zinc-50 px-6 py-24 dark:bg-zinc-950"
    >
      <div className="mx-auto max-w-7xl">
        {/* ==========================
            Heading
        ========================== */}

        <div className="mb-16 text-center">
          <p className="font-semibold text-blue-600">CONTACT US</p>

          <h1 className="mt-3 text-4xl font-bold text-zinc-900 dark:text-white sm:text-5xl">
            Let's Build Something Amazing
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Have questions, suggestions, or partnership ideas? We'd love to hear
            from you. Fill out the form or reach us directly.
          </p>
        </div>

        {/* ==========================
            Main Grid
        ========================== */}

        <div className="grid gap-10 lg:grid-cols-2">
          {/* ==========================
              Contact Info
          ========================== */}

          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Get in Touch
            </h2>

            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Whether you're preparing for interviews or looking to collaborate,
              we're always happy to connect.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
                  <Mail size={22} />
                </div>

                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Email
                  </p>

                  <p className="text-zinc-600 dark:text-zinc-400">
                    support@echohire.ai
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
                  <Phone size={22} />
                </div>

                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Phone
                  </p>

                  <p className="text-zinc-600 dark:text-zinc-400">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
                  <MapPin size={22} />
                </div>

                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Location
                  </p>

                  <p className="text-zinc-600 dark:text-zinc-400">India</p>
                </div>
              </div>
            </div>

            {/* Socials */}

            <div className="mt-12 flex gap-4">
              <button className="rounded-xl border border-zinc-200 p-3 transition hover:bg-blue-600 hover:text-white dark:border-zinc-700">
                <FaGithub />
              </button>

              <button className="rounded-xl border border-zinc-200 p-3 transition hover:bg-blue-600 hover:text-white dark:border-zinc-700">
                <FaLinkedin />
              </button>

              <button className="rounded-xl border border-zinc-200 p-3 transition hover:bg-blue-600 hover:text-white dark:border-zinc-700">
                <Globe />
              </button>
            </div>
          </div>

          {/* ==========================
              Contact Form
          ========================== */}

          <form className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
              Send a Message
            </h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />

              <textarea
                rows={6}
                placeholder="Write your message..."
                className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              ></textarea>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                type="submit"
              >
                <Send size={18} />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
