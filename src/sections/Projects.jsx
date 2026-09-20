import { useState, useEffect } from "react";
import Project from "../components/Project";
import { myProjects as defaultProjects } from "../constants";
import { API_BASE_URL } from "../config/api";

const TOP_PROJECTS_COUNT = 4;

const Projects = () => {
  const [projectsList, setProjectsList] = useState(defaultProjects);
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

  const hasMoreProjects = projectsList.length > TOP_PROJECTS_COUNT;
  const displayedProjects = showAll
    ? projectsList
    : projectsList.slice(0, TOP_PROJECTS_COUNT);

  return (
    <section className="relative c-space section-spacing" id="projects">
      <h2 className="text-heading">Projects</h2>
      <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent mt-12 h-px w-full" />
      {displayedProjects.map((project, index) => (
        <Project key={project._id || project.id || index} {...project} />
      ))}
      {hasMoreProjects && (
        <div className="mt-6 text-center sm:mt-4">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="min-h-11 w-full max-w-xs rounded-full bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-300 sm:w-auto"
          >
            {showAll ? "Show Less" : "View More Projects"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
