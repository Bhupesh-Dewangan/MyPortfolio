import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Quote, UserCheck } from "lucide-react";

const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const defaultTestimonials = [
  {
    _id: "1",
    name: "Aman Sharma",
    role: "Lead Software Engineer",
    company: "Hindustaan Innovations",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    content:
      "Bhupesh is an exceptionally fast learner with strong DSA fundamentals. His work on real-time web applications and API optimization was outstanding during his internship.",
    linkedIn: "https://linkedin.com/",
    rating: 5,
  },
  {
    _id: "2",
    name: "Dr. R. K. Verma",
    role: "Head of Computer Science Dept",
    company: "SSIPMT Raipur",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    content:
      "Bhupesh consistently demonstrates exemplary problem-solving skills in competitive programming and maintains academic excellence in CS fundamentals.",
    linkedIn: "https://linkedin.com/",
    rating: 5,
  },
  {
    _id: "3",
    name: "Priya Patel",
    role: "Product Manager",
    company: "Tech Innovations Lab",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    content:
      "Working with Bhupesh was seamless. He delivers modern, responsive UI interfaces with clean state management and attention to detail.",
    linkedIn: "https://linkedin.com/",
    rating: 5,
  },
];

const Testimonials = () => {
  const [items, setItems] = useState(defaultTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      try {
        const res = await fetch(`${backendUrl}/testimonials`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setItems(data.filter((t) => t.isFeatured !== false));
          }
        }
      } catch (err) {
        console.warn("Could not fetch testimonials from backend API, using defaults.", err);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="c-space section-spacing relative" id="testimonials">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">Recommendations & Feedback</h2>
        <p className="subtext">
          What mentors, engineering leads, and project collaborators say about working with me.
        </p>
      </div>

      <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent mt-6 mb-12 h-px w-full" />

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item._id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-storm/40 via-indigo/30 to-midnight/50 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] hover:-translate-y-1"
          >
            {/* Ambient hover glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full bg-amber-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div>
              {/* Quote Icon & Rating */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating || 5)].map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="size-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    />
                  ))}
                </div>
                <Quote className="size-6 text-neutral-600 group-hover:text-amber-400/60 transition-colors" />
              </div>

              {/* Quote Text */}
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed italic">
                "{item.content}"
              </p>
            </div>

            {/* Profile Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full border border-white/10 bg-midnight flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="size-full object-cover" />
                  ) : (
                    <UserCheck className="size-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-400 mt-0.5">
                    {item.role}
                  </p>
                  <p className="text-[11px] text-neutral-400">{item.company}</p>
                </div>
              </div>

              {item.linkedIn && (
                <a
                  href={item.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-all hover:bg-white/10 hover:text-blue-400 hover:border-blue-400/40"
                  aria-label={`View ${item.name}'s LinkedIn`}
                >
                  <Linkedin className="size-4" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
