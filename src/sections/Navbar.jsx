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
        ["#projects", "Projects"],
        ["#experience", "Experience"],
        ["#coding-stats", "Coding Stats"],
        ["#certifications", "Certifications"],
        ["#education", "Education"],
        ["#contact", "Contact"],
      ].map(([href, label]) => (
        <li className="nav-li" key={href}>
          <a
            className={`nav-link block py-2 ${
              currentPath === href ? "text-red-400 font-semibold" : ""
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
    <div className="fixed inset-x-0 z-20 w-full backdrop-blur-lg bg-primary/40">
      <div className="mx-auto c-space max-w-7xl">
        <div className="flex items-center justify-between py-3 sm:py-2">
          <a
            href="/"
            className="max-w-[58vw] truncate text-base font-bold text-neutral-400 transition-colors hover:text-white sm:max-w-none sm:text-xl"
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
