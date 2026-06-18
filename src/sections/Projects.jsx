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
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-6 py-3 rounded-full font-bold bg-white text-black hover:bg-gray-300 transition"
          >
            {showAll ? "Show Less" : "View More Projects"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
