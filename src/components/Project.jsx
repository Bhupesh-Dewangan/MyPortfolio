import React, { useState } from "react";
import ProjectDetails from "../components/ProjectDetails";

const CATEGORY_THEMES = {
  Frontend: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Full Stack": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  App: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Personal: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  Company: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Group: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Client: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const Project = ({
  title,
  description,
  subDescription,
  preview,
  href,
  image,
  tags,
  category,
  categories,
  selectedTech,
  onTechClick,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const primaryCat = category || "Other";
  const allCategories = Array.isArray(categories) && categories.length > 0
    ? [...new Set([primaryCat, ...categories])]
    : [primaryCat];

  return (
    <>
      <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:gap-8 sm:py-10">
        {preview && (
          <div className="w-full shrink-0 sm:w-44 md:w-56 lg:w-84">
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
            {/* Category Badges */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {allCategories.map((cat, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${
                    CATEGORY_THEMES[cat] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-bold leading-snug text-white sm:text-2xl">{title}</h3>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              {Array.isArray(tags) &&
                tags.map((tag, idx) => {
                  const tagName = typeof tag === "string" ? tag : tag?.name || "";
                  if (!tagName) return null;
                  const isSelected =
                    Boolean(selectedTech) &&
                    selectedTech !== "All" &&
                    selectedTech.toLowerCase() === tagName.toLowerCase();

                  return (
                    <button
                      key={tag.id || `${tagName}-${idx}`}
                      type="button"
                      onClick={() => onTechClick && onTechClick(tagName)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "border-aqua/50 bg-aqua/20 text-aqua shadow-[0_0_10px_rgba(51,194,204,0.3)] font-semibold"
                          : "border-white/10 bg-white/5 text-sand hover:border-white/20 hover:bg-white/10 hover:text-white"
                      }`}
                      title={`Filter projects by ${tagName}`}
                    >
                      {tag.path && (
                        <img
                          src={tag.path}
                          alt=""
                          className="size-3.5 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <span>{tagName}</span>
                    </button>
                  );
                })}
            </div>
          </div>
          <button
            onClick={() => setIsHidden(true)}
            className="hover-animation flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-3 sm:w-auto"
          >
            Read More
            <img src="assets/arrow-right.svg" className="h-5 w-5" alt="" aria-hidden="true" />
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
