import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTestimonials } from "../context/TestimonialsContext";

function Navigation({ onNavigate = () => { }, isMobile = false }) {
  const [activeSection, setActiveSection] = useState("#home");
  const { hasTestimonials } = useTestimonials();

  const navItems = [
    ["#home", "Home"],
    ["#about", "About"],
    ["#experience", "Experience"],
    ["#projects", "Projects"],
    ["#coding-stats", "Coding Stats"],
    ["#certifications", "Certifications"],
    ["#education", "Education"],
    ...(hasTestimonials ? [["#testimonials", "Testimonials"]] : []),
    ["#contact", "Contact"],
  ];

  useEffect(() => {
    // Collect all valid section elements
    const sectionIds = navItems.map(([href]) => href.replace("#", ""));
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observerCallback = (entries) => {
      const intersecting = entries.filter((entry) => entry.isIntersecting);
      if (intersecting.length > 0) {
        // Pick the entry with the highest intersection ratio
        const bestEntry = intersecting.reduce((prev, curr) =>
          curr.intersectionRatio > prev.intersectionRatio ? curr : prev
        );
        if (bestEntry?.target?.id) {
          setActiveSection(`#${bestEntry.target.id}`);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-15% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.5, 0.75],
    });

    elements.forEach((el) => observer.observe(el));

    // Handle extreme edges (very top and very bottom)
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY < 80) {
        setActiveSection("#home");
        return;
      }

      if (windowHeight + scrollY >= docHeight - 50) {
        setActiveSection("#contact");
        return;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasTestimonials]);

  const handleClick = (e, href) => {
    onNavigate();
    if (href.startsWith("#")) {
      e.preventDefault();
      setActiveSection(href);
      const targetId = href.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navHeight = 65;
        const targetTop =
          targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    }
  };

  const indicatorId = isMobile ? "activeNavIndicatorMobile" : "activeNavIndicatorDesktop";

  return (
    <ul className="nav-ul">
      {navItems.map(([href, label]) => {
        const isActive = activeSection === href;
        return (
          <li className="nav-li relative" key={href}>
            <a
              className={`nav-link relative block py-1.5 px-2 transition-colors duration-200 ${
                isActive
                  ? "text-white font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
              href={href}
              onClick={(e) => handleClick(e, href)}
            >
              <span className="relative z-10">{label}</span>
              {isActive && (
                <motion.span
                  layoutId={indicatorId}
                  className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-linear-to-r from-aqua via-white to-aqua shadow-[0_0_10px_rgba(51,194,204,0.7)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="fixed top-0 inset-x-0 z-50 w-full backdrop-blur-lg bg-primary/40 border-b border-white/5">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between py-3">
          <a
            href="/"
            className="max-w-[58vw] truncate text-sm font-bold tracking-tight text-neutral-200 transition-colors hover:text-white sm:max-w-none sm:text-base md:text-lg"
          >
            Bhupesh Dewangan
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-neutral-400 hover:text-white focus:outline-none sm:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <img
              src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
              className="h-6 w-6"
              alt=""
              aria-hidden="true"
            />
          </button>
          <nav className="hidden sm:flex">
            <Navigation />
          </nav>
        </div>
      </div>
      {isOpen && (
        <motion.div
          className="block overflow-hidden border-t border-white/10 text-center sm:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25 }}
        >
          <nav className="pb-5 pt-2">
            <Navigation onNavigate={closeMenu} isMobile={true} />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
