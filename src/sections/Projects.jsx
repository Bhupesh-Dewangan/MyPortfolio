import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, RotateCcw, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
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

const SORT_OPTIONS = [
  { value: "default", label: "Featured / Default" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "alpha-asc", label: "Title: A to Z" },
  { value: "alpha-desc", label: "Title: Z to A" },
];

const Projects = () => {
  const [projectsList, setProjectsList] = useState(defaultProjects);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
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

  // Combined Multi-Dimensional Filtering: Category + Search Query
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

      // 2. Search Query Matching (title, description, subDescriptions, tags, categories)
      if (query) {
        const projectTags = Array.isArray(p.tags)
          ? p.tags.map((t) => (typeof t === "string" ? t.trim().toLowerCase() : (t?.name || "").trim().toLowerCase()))
          : [];
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
  }, [projectsList, selectedCategory, searchQuery]);

  // Sorting
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];

    switch (sortBy) {
      case "newest":
        list.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (b.order ?? b.id ?? 0) - (a.order ?? a.id ?? 0);
        });
        break;
      case "oldest":
        list.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
          return (a.order ?? a.id ?? 0) - (b.order ?? b.id ?? 0);
        });
        break;
      case "alpha-asc":
        list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "alpha-desc":
        list.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      case "default":
      default:
        // Keep natural fetched/constant order
        break;
    }

    return list;
  }, [filteredProjects, sortBy]);

  const handleResetAllFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("default");
    setShowAll(false);
  };

  const isFiltered = selectedCategory !== "All" || searchQuery.trim().length > 0 || sortBy !== "default";

  const hasMoreProjects = sortedProjects.length > TOP_PROJECTS_COUNT;
  const displayedProjects = showAll
    ? sortedProjects
    : sortedProjects.slice(0, TOP_PROJECTS_COUNT);

  return (
    <section className="relative c-space section-spacing" id="projects">
      {/* Header with Title */}
      <div>
        <h2 className="text-heading">Projects</h2>
        <p className="subtext mt-2">
          Explore my work across various technologies, domains, and project types
        </p>
      </div>

      {/* Standard (Searchbar + Filter + Sort) Controls Toolbar */}
      <div className="mt-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-midnight/70 p-3 sm:p-4 backdrop-blur-xl shadow-xl">
        {/* Searchbar */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder="Search projects by title, tech stack, keyword..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-white placeholder-neutral-500 backdrop-blur-md transition-all focus:border-aqua/50 focus:outline-none focus:ring-1 focus:ring-aqua/40 shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setShowAll(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded"
              title="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter and Sort Dropdown Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Category Filter Select */}
          <div className="relative flex items-center min-w-44 rounded-xl border border-white/10 bg-white/5 transition-all hover:border-white/20 focus-within:border-aqua/50 focus-within:ring-1 focus-within:ring-aqua/40">
            <Filter className="absolute left-3 size-4 text-aqua pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setShowAll(false);
              }}
              className="w-full appearance-none bg-transparent py-2.5 pl-9 pr-8 text-xs sm:text-sm font-medium text-white focus:outline-none cursor-pointer [&>option]:bg-midnight [&>option]:text-white"
              title="Filter by category"
            >
              <option value="All">All Categories ({projectsList.length})</option>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => {
                const count = getCategoryCount(cat);
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-3 size-3.5 text-neutral-400 pointer-events-none" />
          </div>

          {/* Sort Order Select */}
          <div className="relative flex items-center min-w-44 rounded-xl border border-white/10 bg-white/5 transition-all hover:border-white/20 focus-within:border-aqua/50 focus-within:ring-1 focus-within:ring-aqua/40">
            <ArrowUpDown className="absolute left-3 size-4 text-aqua pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setShowAll(false);
              }}
              className="w-full appearance-none bg-transparent py-2.5 pl-9 pr-8 text-xs sm:text-sm font-medium text-white focus:outline-none cursor-pointer [&>option]:bg-midnight [&>option]:text-white"
              title="Sort projects"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 size-3.5 text-neutral-400 pointer-events-none" />
          </div>

          {/* Reset Button (only visible when filters or non-default sort are active) */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl border border-white/10 bg-white/5 text-xs text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shrink-0"
              title="Reset all search, category and sort filters"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips & Result Count Bar */}
      {isFiltered && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-midnight/60 px-4 py-2.5 text-xs backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400">
              Showing <strong className="text-white font-semibold">{sortedProjects.length}</strong> of {projectsList.length} projects:
            </span>

            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[11px] text-blue-300 border border-blue-500/30">
                Category: <strong>{selectedCategory}</strong>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="hover:text-white cursor-pointer ml-0.5"
                  title="Remove category filter"
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
                  className="hover:text-white cursor-pointer ml-0.5"
                  title="Clear search query"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {sortBy !== "default" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-aqua/15 px-2.5 py-0.5 text-[11px] text-aqua border border-aqua/30">
                Sort: <strong>{SORT_OPTIONS.find((o) => o.value === sortBy)?.label || sortBy}</strong>
                <button
                  type="button"
                  onClick={() => setSortBy("default")}
                  className="hover:text-white cursor-pointer ml-0.5"
                  title="Reset sort order"
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
          key={`${selectedCategory}-${searchQuery}-${sortBy}`}
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
                    {selectedCategory !== "All" && ` under ${selectedCategory}`}.
                  </>
                ) : (
                  <>
                    No projects found
                    {selectedCategory !== "All" && ` under ${selectedCategory}`}.
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
              : `View More Projects (${sortedProjects.length - TOP_PROJECTS_COUNT} more)`}
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
