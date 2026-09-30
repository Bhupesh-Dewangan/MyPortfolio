import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  FileText,
  Download,
  Mail,
  Check,
  Send,
  Copy,
  ExternalLink,
  Code2,
  FolderGit2,
  Sparkles,
  Layers,
  GraduationCap,
  Award,
  Terminal,
  MessageSquare,
  User,
  Briefcase,
  Home,
  CornerDownLeft,
  Navigation,
  Share2,
} from "lucide-react";
import { useCredentials } from "../context/CredentialsContext";
import { useSectionVisibility } from "../context/SectionVisibilityContext";
import { myProjects as defaultProjects } from "../constants";
import { API_BASE_URL } from "../config/api";

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);
  const [projectsList, setProjectsList] = useState(defaultProjects);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const { credentials } = useCredentials();
  const { visibility } = useSectionVisibility();

  // Load latest projects from backend API with fallback to defaults
  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setProjectsList(data);
          }
        }
      } catch (_) {
        // Fallback to constants
      }
    };
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Track telemetry event
  const trackAction = (label, targetUrl = "") => {
    if (typeof window !== "undefined" && typeof window.__trackVisitorEvent === "function") {
      window.__trackVisitorEvent(`Command: ${label}`, {
        eventType: "action",
        element: "command_palette",
        targetUrl,
        section: "command_palette",
      });
    }
  };

  // Copy helper with feedback
  const handleCopy = (text, key, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    trackAction(`Copy ${label}`, text);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId, label) => {
    setIsOpen(false);
    trackAction(`Jump to ${label}`, `#${sectionId}`);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const navHeight = 70;
        const targetTop = el.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
        window.history.pushState(null, "", `#${sectionId}`);
      }
    }, 120);
  };

  // Build master list of commands
  const allCommands = useMemo(() => {
    const list = [];

    // --- GROUP 1: QUICK ACTIONS ---
    list.push({
      id: "action-view-resume",
      group: "Quick Actions",
      title: "View Resume",
      subtitle: "Open official curriculum vitae in a new tab",
      icon: FileText,
      keywords: ["resume", "cv", "pdf", "bio", "experience", "hire", "curriculum vitae"],
      badge: "PDF",
      action: () => {
        setIsOpen(false);
        const url = credentials?.resumeUrl || "https://res.cloudinary.com/djoybtphx/image/upload/v1770306336/Bhupesh_Dewangan_Resume_zppcik.pdf";
        trackAction("View Resume", url);
        window.open(url, "_blank", "noopener,noreferrer");
      },
    });

    list.push({
      id: "action-download-resume",
      group: "Quick Actions",
      title: "Download Resume",
      subtitle: "Directly download PDF resume to your device",
      icon: Download,
      keywords: ["download", "save", "resume", "cv", "pdf", "file"],
      badge: "Download",
      action: () => {
        setIsOpen(false);
        const url = credentials?.resumeUrl || "https://res.cloudinary.com/djoybtphx/image/upload/v1770306336/Bhupesh_Dewangan_Resume_zppcik.pdf";
        trackAction("Download Resume", url);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Bhupesh_Dewangan_Resume.pdf";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
    });

    list.push({
      id: "action-copy-email",
      group: "Quick Actions",
      title: copiedKey === "email" ? "Email Copied!" : "Copy Email Address",
      subtitle: credentials?.email || "bhupeshdewangan160204@gmail.com",
      icon: copiedKey === "email" ? Check : Mail,
      keywords: ["email", "mail", "copy", "contact", "hire", "message", "reach"],
      badge: copiedKey === "email" ? "Copied" : "Copy",
      action: () => {
        handleCopy(credentials?.email || "bhupeshdewangan160204@gmail.com", "email", "Email Address");
      },
    });

    list.push({
      id: "action-send-message",
      group: "Quick Actions",
      title: "Send a Message",
      subtitle: "Jump to contact form to discuss projects & opportunities",
      icon: Send,
      keywords: ["contact", "send", "message", "inquiry", "hire", "email", "talk", "reach"],
      badge: "Form",
      action: () => {
        scrollToSection("contact", "Contact Section");
        setTimeout(() => {
          const input = document.getElementById("name");
          if (input) input.focus();
        }, 600);
      },
    });

    list.push({
      id: "action-copy-link",
      group: "Quick Actions",
      title: copiedKey === "portfolio" ? "Link Copied!" : "Share Portfolio Link",
      subtitle: typeof window !== "undefined" ? window.location.origin : "https://bhupesh.in",
      icon: copiedKey === "portfolio" ? Check : Share2,
      keywords: ["share", "copy", "url", "link", "website", "portfolio"],
      badge: copiedKey === "portfolio" ? "Copied" : "Copy",
      action: () => {
        const url = typeof window !== "undefined" ? window.location.origin : "https://bhupesh.in";
        handleCopy(url, "portfolio", "Portfolio URL");
      },
    });

    // --- GROUP 2: NAVIGATION & SECTIONS ---
    list.push({
      id: "nav-home",
      group: "Navigation",
      title: "Home",
      subtitle: "Hero introduction & greeting",
      icon: Home,
      keywords: ["home", "hero", "intro", "start", "top", "welcome"],
      badge: "#home",
      action: () => scrollToSection("home", "Home"),
    });

    list.push({
      id: "nav-about",
      group: "Navigation",
      title: "About Me",
      subtitle: "Biography, background, and core skills",
      icon: User,
      keywords: ["about", "bio", "skills", "tech stack", "technologies", "background", "who"],
      badge: "#about",
      action: () => scrollToSection("about", "About"),
    });

    list.push({
      id: "nav-experience",
      group: "Navigation",
      title: "Work Experience",
      subtitle: "Professional roles, internships, and career timeline",
      icon: Briefcase,
      keywords: ["experience", "work", "job", "career", "internship", "company"],
      badge: "#experience",
      action: () => scrollToSection("experience", "Experience"),
    });

    list.push({
      id: "nav-projects",
      group: "Navigation",
      title: "Featured Projects",
      subtitle: "Interactive web applications & software creations",
      icon: Code2,
      keywords: ["projects", "apps", "portfolio", "work", "fullstack", "frontend", "backend"],
      badge: "#projects",
      action: () => scrollToSection("projects", "Projects"),
    });

    if (visibility?.codingStats) {
      list.push({
        id: "nav-coding-stats",
        group: "Navigation",
        title: "Coding Profiles & Stats",
        subtitle: "LeetCode, Codeforces, GitHub, and DSA problem solving metrics",
        icon: Terminal,
        keywords: ["coding", "stats", "leetcode", "codeforces", "dsa", "algorithms", "problem solving", "gfg"],
        badge: "#coding-stats",
        action: () => scrollToSection("coding-stats", "Coding Stats"),
      });
    }

    if (visibility?.certifications) {
      list.push({
        id: "nav-certifications",
        group: "Navigation",
        title: "Certifications & Credentials",
        subtitle: "Verified tech certificates and professional credentials",
        icon: Award,
        keywords: ["certificates", "certifications", "licenses", "credentials", "badges", "courses"],
        badge: "#certifications",
        action: () => scrollToSection("certifications", "Certifications"),
      });
    }

    if (visibility?.education) {
      list.push({
        id: "nav-education",
        group: "Navigation",
        title: "Education & Academics",
        subtitle: "B.Tech Computer Science and academic background",
        icon: GraduationCap,
        keywords: ["education", "academics", "btech", "degree", "college", "school", "university", "ssipmt"],
        badge: "#education",
        action: () => scrollToSection("education", "Education"),
      });
    }

    if (visibility?.testimonials) {
      list.push({
        id: "nav-testimonials",
        group: "Navigation",
        title: "Client & Colleague Reviews",
        subtitle: "Feedback, recommendations, and testimonials",
        icon: MessageSquare,
        keywords: ["testimonials", "reviews", "feedback", "recommendations", "clients", "ratings"],
        badge: "#testimonials",
        action: () => scrollToSection("testimonials", "Testimonials"),
      });
    }

    list.push({
      id: "nav-contact",
      group: "Navigation",
      title: "Contact",
      subtitle: "Get in touch or hire me for your next project",
      icon: Mail,
      keywords: ["contact", "hire", "email", "touch", "inquiry", "connect", "reach"],
      badge: "#contact",
      action: () => scrollToSection("contact", "Contact"),
    });

    // --- GROUP 3: PROJECTS DIRECTORY ---
    (projectsList || []).forEach((p) => {
      const tagNames = Array.isArray(p.tags)
        ? p.tags.map((t) => (typeof t === "string" ? t : t?.name || "")).filter(Boolean)
        : [];
      const category = p.category || (Array.isArray(p.categories) ? p.categories[0] : "Project");

      list.push({
        id: `project-${p.id || p._id || p.title}`,
        group: "Projects",
        title: p.title,
        subtitle: `${category} • ${tagNames.slice(0, 3).join(", ")}${tagNames.length > 3 ? "..." : ""}`,
        icon: Layers,
        keywords: [
          p.title,
          category,
          ...tagNames,
          ...(p.description ? p.description.split(" ").slice(0, 8) : []),
        ],
        badge: category,
        externalUrl: p.href,
        action: () => {
          scrollToSection("projects", `Project: ${p.title}`);
        },
      });
    });

    // --- GROUP 4: DEVELOPER PROFILES & SOCIALS ---
    const socials = [
      {
        id: "social-github",
        title: "GitHub Profile",
        subtitle: "@Bhupesh-Dewangan • Open Source Code & Repositories",
        url: credentials?.githubUrl || "https://github.com/Bhupesh-Dewangan",
        keywords: ["github", "git", "code", "repo", "opensource", "commits"],
        badge: "GitHub",
      },
      {
        id: "social-linkedin",
        title: "LinkedIn Profile",
        subtitle: "Connect on LinkedIn for professional networking",
        url: credentials?.linkedinUrl || "https://www.linkedin.com/in/bhupesh--dewangan/",
        keywords: ["linkedin", "network", "connect", "professional", "career", "profile"],
        badge: "LinkedIn",
      },
      {
        id: "social-codolio",
        title: "Codolio CP Profile",
        subtitle: "Unified competitive programming tracker",
        url: credentials?.codolioUrl || "https://codolio.com/profile/BhupeshD",
        keywords: ["codolio", "cp", "competitive", "dsa", "ratings", "tracker"],
        badge: "Codolio",
      },
      {
        id: "social-whatsapp",
        title: "WhatsApp Chat",
        subtitle: "Direct instant messaging for quick inquiries",
        url: credentials?.whatsappUrl || "https://wa.me/8982828605",
        keywords: ["whatsapp", "chat", "direct", "call", "instant", "message"],
        badge: "Chat",
      },
      {
        id: "social-instagram",
        title: "Instagram Profile",
        subtitle: "Personal updates and tech life highlights",
        url: credentials?.instagramUrl || "https://www.instagram.com/bhupesh_dewangan_16/",
        keywords: ["instagram", "social", "media", "photos"],
        badge: "Instagram",
      },
    ];

    socials.forEach((s) => {
      list.push({
        id: s.id,
        group: "Social & Connect",
        title: s.title,
        subtitle: s.subtitle,
        icon: ExternalLink,
        keywords: s.keywords,
        badge: s.badge,
        action: () => {
          setIsOpen(false);
          trackAction(s.title, s.url);
          window.open(s.url, "_blank", "noopener,noreferrer");
        },
      });
    });

    return list;
  }, [credentials, visibility, projectsList, copiedKey]);

  // Filter commands by active query
  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCommands;

    return allCommands.filter((cmd) => {
      if (cmd.title.toLowerCase().includes(q)) return true;
      if (cmd.subtitle.toLowerCase().includes(q)) return true;
      if (cmd.group.toLowerCase().includes(q)) return true;
      if (cmd.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [allCommands, query]);

  // Group commands by category for visually distinct sections
  const groupedCommands = useMemo(() => {
    const groups = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-scroll selected element into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  // Global hotkey listeners (Ctrl+K, Cmd+K, Esc, Arrow Keys, Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle palette: Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // If palette is closed, ignore other keys
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredCommands.length > 0 ? (prev - 1 + filteredCommands.length) % filteredCommands.length : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Custom DOM event listener for navbar triggers
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleToggle = () => setIsOpen((prev) => !prev);

    window.addEventListener("open-command-palette", handleOpen);
    window.addEventListener("toggle-command-palette", handleToggle);

    return () => {
      window.removeEventListener("open-command-palette", handleOpen);
      window.removeEventListener("toggle-command-palette", handleToggle);
    };
  }, []);

  // Lock body scroll when palette is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  let runningIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="relative w-full max-w-2xl bg-midnight/95 border border-white/10 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(122,87,219,0.25)] backdrop-blur-2xl overflow-hidden mt-[6vh] sm:mt-[10vh] flex flex-col z-10"
          >
            {/* Top Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/2 gap-3">
              <Search className="w-5 h-5 text-lavender shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, search projects, or jump to section..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
                autoComplete="off"
                spellCheck="false"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-neutral-500 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-neutral-400 bg-white/5 border border-white/10 rounded-md">
                ESC
              </kbd>
            </div>

            {/* Scrollable Results List */}
            <div
              ref={listRef}
              className="max-h-[58vh] overflow-y-auto p-2 space-y-4 focus:outline-none"
              tabIndex="-1"
            >
              {filteredCommands.length === 0 ? (
                <div className="py-14 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-neutral-500 mx-auto animate-pulse" />
                  <p className="text-sm font-semibold text-neutral-300">
                    No results found for "{query}"
                  </p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Try searching for "projects", "resume", "react", or "contact".
                  </p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([groupTitle, items]) => (
                  <div key={groupTitle} className="space-y-1">
                    {/* Category Header */}
                    <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                      <span>{groupTitle}</span>
                      <span className="text-[10px] text-neutral-600 font-mono">
                        {items.length}
                      </span>
                    </div>

                    {/* Items in this Category */}
                    <div className="space-y-0.5">
                      {items.map((cmd) => {
                        const itemIndex = runningIndex++;
                        const isSelected = itemIndex === selectedIndex;
                        const Icon = cmd.icon;

                        return (
                          <div
                            key={cmd.id}
                            data-active={isSelected}
                            onClick={() => cmd.action()}
                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                              isSelected
                                ? "bg-linear-to-r from-royal/35 via-lavender/15 to-transparent border-l-2 border-aqua text-white shadow-sm pl-2.5"
                                : "text-neutral-300 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? "bg-royal text-aqua shadow-[0_0_12px_rgba(51,194,204,0.4)]"
                                    : "bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm truncate text-white">
                                    {cmd.title}
                                  </span>
                                  {cmd.badge && (
                                    <span
                                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                                        isSelected
                                          ? "bg-aqua/20 text-aqua border border-aqua/30"
                                          : "bg-white/5 text-neutral-400 border border-white/5"
                                      }`}
                                    >
                                      {cmd.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-400 truncate mt-0.5">
                                  {cmd.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* Right Action Hint */}
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              {cmd.externalUrl && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                    window.open(cmd.externalUrl, "_blank", "noopener,noreferrer");
                                  }}
                                  className="text-neutral-500 hover:text-aqua p-1 rounded transition-colors"
                                  title="Open live link"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <kbd
                                className={`hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded transition-opacity ${
                                  isSelected
                                    ? "text-aqua bg-aqua/10 border border-aqua/30 opacity-100"
                                    : "text-neutral-600 opacity-0 group-hover:opacity-100"
                                }`}
                              >
                                <CornerDownLeft className="w-3 h-3" />
                              </kbd>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Keyboard Navigation Helper Bar */}
            <div className="px-4 py-2.5 border-t border-white/10 bg-white/2 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
              <div className="flex items-center gap-4 text-[11px]">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">
                    ↓
                  </kbd>
                  <span className="text-neutral-500">Navigate</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">
                    ↵
                  </kbd>
                  <span className="text-neutral-500">Select</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">
                    ESC
                  </kbd>
                  <span className="text-neutral-500">Close</span>
                </span>
              </div>

              <div className="text-[11px] text-neutral-500 font-mono hidden sm:block">
                Press <span className="text-neutral-300">Ctrl + K</span> anytime
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
