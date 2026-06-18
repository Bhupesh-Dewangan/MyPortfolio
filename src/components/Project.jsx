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
      <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:gap-8 sm:py-10">
        {preview && (
          <div className="w-full shrink-0 sm:w-44 md:w-56 lg:w-64">
            <img
              src={preview}
              alt={`${title} preview`}
              className="h-44 w-full rounded-lg border border-gray-800 object-cover shadow-lg sm:h-36 md:h-40"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-xl leading-snug sm:text-2xl">{title}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-sand sm:gap-5 sm:text-base">
              {tags.map((tag) => (
                <span key={tag.id}>{tag.name}</span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsHidden(true)}
            className="hover-animation flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-3 sm:w-auto"
          >
            Read More
            <img src="assets/arrow-right.svg" className="h-5 w-5" alt="" />
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
