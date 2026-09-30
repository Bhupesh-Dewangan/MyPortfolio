import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { useSectionVisibility } from "../context/SectionVisibilityContext";

function Navigation({ onNavigate = () => { }, isMobile = false }) {
  const [activeSection, setActiveSection] = useState("#home");
  const { visibility } = useSectionVisibility();

  const navItems = [
    ["#home", "Home"],
    ["#about", "About"],
    ["#experience", "Experience"],
    ["#projects", "Projects"],
    ...(visibility.codingStats ? [["#coding-stats", "Coding Stats"]] : []),
    ...(visibility.certifications ? [["#certifications", "Certifications"]] : []),
    ...(visibility.education ? [["#education", "Education"]] : []),
    ...(visibility.testimonials ? [["#testimonials", "Testimonials"]] : []),
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
  }, [visibility]);

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
              className={`nav-link relative block py-1.5 px-2 transition-colors duration-200 ${isActive
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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Command Palette Trigger */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-lavender/50 text-neutral-400 hover:text-white transition-all text-xs cursor-pointer shadow-xs backdrop-blur-sm group"
              aria-label="Open Command Palette (Ctrl + K)"
              title="Open Command Palette (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-lavender group-hover:text-aqua transition-colors" />
              <span className="text-[12px] text-neutral-400 group-hover:text-neutral-200">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-neutral-300">
                Ctrl K
              </kbd>
            </button>

            <nav className="hidden sm:flex">
              <Navigation />
            </nav>

            {/* Mobile / Tablet Quick Search Icon */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="flex md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Search and command palette"
              title="Search and command palette"
            >
              <Search className="w-4 h-4 text-lavender" />
            </button>

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
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          className="block overflow-hidden border-t border-white/10 text-center sm:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25 }}
        >
          <div className="px-4 pt-3 pb-1">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                window.dispatchEvent(new CustomEvent("open-command-palette"));
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/4 border border-white/10 text-neutral-300 hover:text-white text-xs cursor-pointer active:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-lavender" />
                <span>Search projects, skills & sections</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px]">
                Ctrl K
              </kbd>
            </button>
          </div>
          <nav className="pb-5 pt-2">
            <Navigation onNavigate={closeMenu} isMobile={true} />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
