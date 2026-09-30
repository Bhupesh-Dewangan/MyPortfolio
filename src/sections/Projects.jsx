import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Code2, RotateCcw, Sparkles } from "lucide-react";
import Project from "../components/Project";
import { myProjects as defaultProjects } from "../constants";
import { API_BASE_URL } from "../config/api";

const TOP_PROJECTS_COUNT = 4;
const INITIAL_TECH_DISPLAY_COUNT = 10;

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
  const [selectedTech, setSelectedTech] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showAllTech, setShowAllTech] = useState(false);

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

  // Extract all unique technology tags across all loaded projects, sorted by frequency
  const allTechTags = useMemo(() => {
    const counts = {};
    projectsList.forEach((p) => {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      tags.forEach((tag) => {
        const name = typeof tag === "string" ? tag.trim() : (tag?.name || "").trim();
        if (name) {
          counts[name] = (counts[name] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [projectsList]);

  // Limit displayed tech pills unless expanded
  const displayedTechTags = showAllTech
    ? allTechTags
    : allTechTags.slice(0, INITIAL_TECH_DISPLAY_COUNT);

  const getCategoryCount = (category) => {
    if (category === "All") return projectsList.length;
    return projectsList.filter((p) => {
      const primary = p.category || "Other";
      const cats = Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : [primary];
      return primary === category || cats.includes(category);
    }).length;
  };

  // Combined Multi-Dimensional Filtering: Category + Tech Tag + Search Query
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projectsList.filter((p) => {
      // 1. Category Matching
      if (selectedCategory !== "All") {
        const primary = p.category || "Other";
        const cats = Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : [primary];
        const categoryMatches = primary === selectedCategory || cats.includes(selectedCategory);
        if (!categoryMatches) return false;
      }

      // 2. Tech Tag Matching
      const projectTags = Array.isArray(p.tags)
        ? p.tags.map((t) => (typeof t === "string" ? t.trim().toLowerCase() : (t?.name || "").trim().toLowerCase()))
        : [];

      if (selectedTech !== "All") {
        const targetTech = selectedTech.toLowerCase();
        const techMatches = projectTags.some((t) => t === targetTech || t.includes(targetTech));
        if (!techMatches) return false;
      }

      // 3. Search Query Matching (title, description, subDescriptions, tags, categories)
      if (query) {
        const titleMatches = (p.title || "").toLowerCase().includes(query);
        const descMatches = (p.description || "").toLowerCase().includes(query);
        const subDescMatches = Array.isArray(p.subDescription)
          ? p.subDescription.some((sub) => (sub || "").toLowerCase().includes(query))
          : false;
        const tagsMatch = projectTags.some((t) => t.includes(query));
        const categoryMatch = (p.category || "").toLowerCase().includes(query);

        if (!titleMatches && !descMatches && !subDescMatches && !tagsMatch && !categoryMatch) {
          return false;
        }
      }

      return true;
    });
  }, [projectsList, selectedCategory, selectedTech, searchQuery]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowAll(false);
  };

  const handleTechSelect = (techName) => {
    setSelectedTech((prev) => (prev.toLowerCase() === techName.toLowerCase() ? "All" : techName));
    setShowAll(false);
  };

  const handleResetAllFilters = () => {
    setSelectedCategory("All");
    setSelectedTech("All");
    setSearchQuery("");
    setShowAll(false);
  };

  const isFiltered =
    selectedCategory !== "All" || selectedTech !== "All" || searchQuery.trim().length > 0;

  const hasMoreProjects = filteredProjects.length > TOP_PROJECTS_COUNT;
  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, TOP_PROJECTS_COUNT);

  return (
    <section className="relative c-space section-spacing" id="projects">
      {/* Header with Title & Integrated Responsive Search Box */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-heading">Projects</h2>
          <p className="subtext mt-2">
            Explore my work across various technologies, domains, and project types
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72 md:w-84 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder="Search by title, keyword, tech..."
            className="w-full rounded-full border border-white/10 bg-midnight/80 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-white placeholder-neutral-500 backdrop-blur-md transition-all focus:border-aqua/50 focus:outline-none focus:ring-1 focus:ring-aqua/40 shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const count = getCategoryCount(category);
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm cursor-pointer ${
                isSelected
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
                className={`relative z-10 rounded-full px-1.5 py-0.2 text-[10px] sm:text-xs font-semibold ${
                  isSelected
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

      {/* Clickable Technology Pills Rail */}
      {allTechTags.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/5 bg-linear-to-r from-card/30 via-white/2 to-card/30 p-3.5 sm:p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
              <Code2 className="size-4 text-aqua" />
              <span>Filter by Tech Stack:</span>
              {selectedTech !== "All" && (
                <span className="text-[11px] text-aqua font-semibold">
                  (Filtering by {selectedTech})
                </span>
              )}
            </div>

            {allTechTags.length > INITIAL_TECH_DISPLAY_COUNT && (
              <button
                type="button"
                onClick={() => setShowAllTech((prev) => !prev)}
                className="text-[11px] font-semibold text-aqua hover:underline cursor-pointer transition-colors"
              >
                {showAllTech ? "Show Less" : `View All (${allTechTags.length})`}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* "All Tech" Pill */}
            <button
              type="button"
              onClick={() => handleTechSelect("All")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                selectedTech === "All"
                  ? "bg-aqua/20 text-aqua border border-aqua/40 shadow-[0_0_12px_rgba(51,194,204,0.3)] font-semibold"
                  : "bg-white/5 text-neutral-400 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <span>All Tech</span>
            </button>

            {/* Individual Technology Pills */}
            {displayedTechTags.map(({ name, count }) => {
              const isSelected = selectedTech.toLowerCase() === name.toLowerCase();

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleTechSelect(name)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-aqua/25 text-aqua border border-aqua/50 shadow-[0_0_14px_rgba(51,194,204,0.35)] font-semibold scale-105"
                      : "bg-white/5 text-neutral-400 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/10"
                  }`}
                  title={`Filter projects by ${name}`}
                >
                  <span>{name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected
                        ? "bg-aqua/30 text-white font-bold"
                        : "bg-white/10 text-neutral-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Chips & Result Count Bar */}
      {isFiltered && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-midnight/60 px-4 py-2.5 text-xs backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400">
              Showing <strong className="text-white font-semibold">{filteredProjects.length}</strong> of {projectsList.length} projects:
            </span>

            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[11px] text-blue-300 border border-blue-500/30">
                Category: <strong>{selectedCategory}</strong>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="hover:text-white cursor-pointer"
                  title="Remove category filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {selectedTech !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-aqua/15 px-2.5 py-0.5 text-[11px] text-aqua border border-aqua/35">
                Tech: <strong>{selectedTech}</strong>
                <button
                  type="button"
                  onClick={() => setSelectedTech("All")}
                  className="hover:text-white cursor-pointer"
                  title="Remove tech filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[11px] text-purple-300 border border-purple-500/30">
                Query: "<strong>{searchQuery}</strong>"
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-white cursor-pointer"
                  title="Clear search query"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetAllFilters}
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer underline underline-offset-2"
          >
            <RotateCcw className="size-3" />
            <span>Reset filters</span>
          </button>
        </div>
      )}

      <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent mt-6 h-px w-full" />

      {/* Projects List with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${selectedTech}-${searchQuery}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {displayedProjects.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-400">
                <Search className="size-7 text-neutral-500" />
              </div>
              <p className="text-white font-semibold text-lg">No matching projects found</p>
              <p className="mt-1 text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                {searchQuery.trim() ? (
                  <>
                    No results found for "<span className="text-neutral-200">{searchQuery}</span>"
                    {selectedCategory !== "All" && ` under ${selectedCategory}`}
                    {selectedTech !== "All" && ` with ${selectedTech}`}.
                  </>
                ) : (
                  <>
                    No projects found
                    {selectedCategory !== "All" && ` under ${selectedCategory}`}
                    {selectedTech !== "All" && ` matching ${selectedTech}`}.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-black transition hover:bg-neutral-200 cursor-pointer shadow-lg shadow-white/10"
              >
                <RotateCcw className="size-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : (
            displayedProjects.map((project, index) => (
              <Project
                key={project._id || project.id || index}
                {...project}
                selectedTech={selectedTech}
                onTechClick={handleTechSelect}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Show More / Show Less Pagination Button */}
      {hasMoreProjects && (
        <div className="mt-8 text-center sm:mt-6">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="min-h-11 w-full max-w-xs rounded-full bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-300 sm:w-auto cursor-pointer shadow-md shadow-white/10"
          >
            {showAll
              ? "Show Less"
              : `View More Projects (${filteredProjects.length - TOP_PROJECTS_COUNT} more)`}
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
