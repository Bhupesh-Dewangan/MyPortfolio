import { useState, useEffect } from "react";
import { motion } from "motion/react";

function Navigation({ onNavigate = () => { } }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const updatePath = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", updatePath);
    window.addEventListener("pushstate", updatePath);
    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("pushstate", updatePath);
    };
  }, []);

  const handleClick = (e, href) => {
    onNavigate();
    if (href.startsWith("#")) {
      if (currentPath !== "/") {
        e.preventDefault();
        window.location.href = `/${href}`;
      }
    } else {
      e.preventDefault();
      window.history.pushState({}, "", href);
      window.dispatchEvent(new Event("pushstate"));
      window.dispatchEvent(new Event("popstate"));
    }
  };

  return (
    <ul className="nav-ul">
      {[
        ["#home", "Home"],
        ["#about", "About"],
        ["#experience", "Experience"],
        ["#projects", "Projects"],
        ["#coding-stats", "Coding Stats"],
        ["#certifications", "Certifications"],
        ["#education", "Education"],
        ["#testimonials", "Testimonials"],
        ["#contact", "Contact"],
      ].map(([href, label]) => (
        <li className="nav-li" key={href}>
          <a
            className={`nav-link block py-1 ${currentPath === href ? "text-white font-semibold border-b-2 border-primary" : ""
              }`}
            href={href}
            onClick={(e) => handleClick(e, href)}
          >
            {label}
          </a>
        </li>
      ))}
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
            <Navigation onNavigate={closeMenu} />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
