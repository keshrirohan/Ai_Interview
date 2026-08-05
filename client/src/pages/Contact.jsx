import { useState } from "react";
import { Mail, Phone, MapPin, Send, Globe, CheckCircle2, LoaderCircle } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to send message.");
      }

      setSuccessMsg("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-zinc-50 px-6 py-24 dark:bg-zinc-950"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="font-semibold text-blue-600 uppercase tracking-wider">Contact Us</p>
          <h1 className="mt-3 text-4xl font-bold text-zinc-900 dark:text-white sm:text-5xl">
            Let's Build Something Amazing
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Have questions, suggestions, or partnership ideas? We'd love to hear
            from you. Fill out the form or reach us directly.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact Info */}
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
                  <p className="font-semibold text-zinc-900 dark:text-white">Email</p>
                  <p className="text-zinc-600 dark:text-zinc-400">support@echohire.ai</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">Phone</p>
                  <p className="text-zinc-600 dark:text-zinc-400">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">Location</p>
                  <p className="text-zinc-600 dark:text-zinc-400">India</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-12 flex gap-4">
              <button type="button" className="rounded-xl border border-zinc-200 p-3 transition hover:bg-blue-600 hover:text-white dark:border-zinc-700">
                <FaGithub />
              </button>
              <button type="button" className="rounded-xl border border-zinc-200 p-3 transition hover:bg-blue-600 hover:text-white dark:border-zinc-700">
                <FaLinkedin />
              </button>
              <button type="button" className="rounded-xl border border-zinc-200 p-3 transition hover:bg-blue-600 hover:text-white dark:border-zinc-700">
                <Globe />
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
              Send a Message
            </h2>

            {errorMsg && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            <div className="space-y-5">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />

              <input
                type="email"
                required
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />

              <input
                type="text"
                placeholder="Subject (Optional)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />

              <textarea
                rows={6}
                required
                placeholder="Write your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              ></textarea>

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                type="submit"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
