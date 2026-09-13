import React from "react";
import { motion } from "motion/react";
import { Briefcase, Calendar, MapPin, ExternalLink, Folder } from "lucide-react";
import { experiences } from "../constants";

const Experience = () => {
  return (
    <section className="c-space section-spacing relative" id="experience">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">Work Experience</h2>
        <p className="subtext">
          My professional journey, internships, and full-stack software development experience.
        </p>
      </div>

      <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent mt-6 mb-12 h-px w-full" />

      <div className="relative">
        {/* Continuous vertical timeline connector line */}
        <div
          className="absolute left-4 sm:left-6 top-3 bottom-8 w-0.5 bg-linear-to-b from-purple-500 via-lavender/40 to-transparent"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-10">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex items-start gap-4 sm:gap-8"
            >
              {/* Timeline Icon Node */}
              <div className="relative z-10 flex size-9 sm:size-12 shrink-0 items-center justify-center rounded-full border border-purple-500/50 bg-midnight shadow-[0_0_20px_rgba(122,87,219,0.35)]">
                <Briefcase className="size-4 sm:size-5 text-purple-300" />
              </div>

              {/* Experience Card */}
              <div className="group relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-storm/40 via-indigo/30 to-midnight/50 p-5 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(122,87,219,0.12)]">
                {/* Glow highlight on hover */}
                <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-purple-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* Card Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                        {exp.title}
                      </h3>
                      {exp.type && (
                        <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                          {exp.type}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-base sm:text-lg font-semibold text-purple-400">
                      {exp.company}
                    </p>
                  </div>

                  {/* Metadata: Date and Location */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 sm:size-4 text-neutral-500" />
                      {exp.date}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 sm:size-4 text-neutral-500" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-white/5" />

                {/* Responsibilities */}
                <ul className="space-y-2.5">
                  {exp.responsibilities.map((item, respIndex) => (
                    <li
                      key={respIndex}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-neutral-300 leading-relaxed"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Key Projects / Projects Worked On */}
                {exp.projects && exp.projects.length > 0 && (
                  <div className="mt-5 border-t border-white/5 pt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-purple-300/90">
                      Projects Worked On
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      {exp.projects.map((proj, projIndex) => {
                        const targetHref = proj.href || proj.link || "#projects";
                        const isExternal = targetHref.startsWith("http");

                        return (
                          <a
                            key={projIndex}
                            href={targetHref}
                            title={proj.name}
                            aria-label={proj.name}
                            {...(isExternal
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            className="group/proj relative flex size-12 sm:size-14 items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer outline-none"
                          >
                            {proj.icon ? (
                              <img
                                src={proj.icon}
                                alt={proj.name}
                                className="size-full rounded-xl object-contain transition-all duration-300 group-hover/proj:drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                                loading="lazy"
                              />
                            ) : (
                              <Folder className="size-8 text-purple-400" />
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-5 border-t border-white/5 pt-4">
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300 transition-colors hover:border-purple-400/40 hover:bg-white/10"
                        >
                          {tech.icon && (
                            <img
                              src={tech.icon}
                              alt={tech.name}
                              className="size-3.5 sm:size-4 object-contain"
                              loading="lazy"
                            />
                          )}
                          <span>{tech.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
