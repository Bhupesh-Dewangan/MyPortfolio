import { useState } from "react";
import Project from "../components/Project";
import { myProjects } from "../constants";

const TOP_PROJECTS_COUNT = 4;

const Projects = () => {
  const [showAll, setShowAll] = useState(false);
  const hasMoreProjects = myProjects.length > TOP_PROJECTS_COUNT;
  const displayedProjects = showAll
    ? myProjects
    : myProjects.slice(0, TOP_PROJECTS_COUNT);

  return (
    <section className="relative c-space section-spacing" id="projects">
      <h2 className="text-heading">Projects</h2>
      <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent mt-12 h-px w-full" />
      {displayedProjects.map((project) => (
        <Project key={project.id} {...project} />
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
