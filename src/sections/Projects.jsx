import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Project from "../components/Project";
import { myProjects as defaultProjects } from "../constants";
import { API_BASE_URL } from "../config/api";

const TOP_PROJECTS_COUNT = 4;

const CATEGORIES = [
  "All",
  "Frontend",
  "Full Stack",
  "App",
  "Personal",
  "Company",
  "Group",
  "Client",
  "Other",
];

const Projects = () => {
  const [projectsList, setProjectsList] = useState(defaultProjects);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjectsList(data);
          }
        }
      } catch (err) {
        console.warn("Could not fetch projects from backend API, using defaults.", err);
      }
    };

    fetchProjects();
  }, []);

  const getCategoryCount = (category) => {
    if (category === "All") return projectsList.length;
    return projectsList.filter((p) => {
      const primary = p.category || "Other";
      const cats = Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : [primary];
      return primary === category || cats.includes(category);
    }).length;
  };

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projectsList;
    return projectsList.filter((p) => {
      const primary = p.category || "Other";
      const cats = Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : [primary];
      return primary === selectedCategory || cats.includes(selectedCategory);
    });
  }, [projectsList, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowAll(false);
  };

  const hasMoreProjects = filteredProjects.length > TOP_PROJECTS_COUNT;
  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, TOP_PROJECTS_COUNT);

  return (
    <section className="relative c-space section-spacing" id="projects">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-heading">Projects</h2>
          <p className="subtext mt-2">
            Explore my work across various technologies, domains, and project types
          </p>
        </div>
      </div>

      {/* Modern Animated Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const count = getCategoryCount(category);
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${isSelected
                  ? "text-black"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="activeProjectTab"
                  className="absolute inset-0 rounded-full bg-white shadow-md shadow-white/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
              <span
                className={`relative z-10 rounded-full px-1.5 py-0.2 text-[10px] sm:text-xs font-semibold ${isSelected
                    ? "bg-black/15 text-black"
                    : "bg-neutral-800 text-neutral-400"
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent mt-6 h-px w-full" />

      {/* Projects List with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {displayedProjects.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-neutral-400 text-base">
                No projects currently listed under <span className="text-white font-semibold">{selectedCategory}</span>.
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="mt-4 text-xs font-medium text-primary hover:underline"
              >
                View all projects
              </button>
            </div>
          ) : (
            displayedProjects.map((project, index) => (
              <Project key={project._id || project.id || index} {...project} />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {hasMoreProjects && (
        <div className="mt-8 text-center sm:mt-6">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="min-h-11 w-full max-w-xs rounded-full bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-300 sm:w-auto"
          >
            {showAll ? "Show Less" : `View More Projects (${filteredProjects.length - TOP_PROJECTS_COUNT} more)`}
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
