import React, { useState } from "react";
import ProjectDetails from "../components/ProjectDetails";

const Project = ({
  title,
  description,
  subDescription,
  preview,
  href,
  image,
  tags,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <>
      <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:gap-8">
        {preview && (
          <div className="shrink-0 w-full sm:w-48 md:w-80">
            <img
              src={preview}
              alt={`${title} preview`}
              className="w-full h-40 sm:h-36 md:h-40 object-cover rounded-lg border border-gray-800 shadow-lg"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-wrap items-center justify-between gap-6 sm:gap-4">
          <div>
            <p className="text-2xl">{title}</p>
            <div className="flex flex-wrap gap-5 mt-2 text-sand">
              {tags.map((tag) => (
                <span key={tag.id}>{tag.name}</span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsHidden(true)}
            className="flex items-center gap-1 cursor-pointer hover-animation shrink-0"
          >
            Read More
            <img src="assets/arrow-right.svg" className="w-5" />
          </button>
        </div>
      </div>
      <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent h-px w-full" />
      {isHidden && (
        <ProjectDetails
          title={title}
          description={description}
          subDescription={subDescription}
          image={image}
          tags={tags}
          href={href}
          closeModal={() => setIsHidden(false)}
        />
      )}
    </>
  );
};

export default Project;