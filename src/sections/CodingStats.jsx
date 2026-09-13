import React from "react";
import { motion } from "motion/react";
import { ExternalLink, Code2, Flame, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { codingOverview, codingPlatforms } from "../constants";

// Custom branded platform icons
const PlatformIcon = ({ id, className = "size-7" }) => {
  switch (id) {
    case "leetcode":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path
            fill="#FFA116"
            d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.607 2.6 2.6 0 0 1 .388-.392l4.271-4.554 4.63-4.832c.532-.555.517-1.442-.036-1.982a1.377 1.377 0 0 0-.97-.417z"
          />
          <path
            fill="#B3B3B3"
            d="M9.833 10.924a1.377 1.377 0 0 0-1.945-.038L5.27 13.5c-.538.54-.538 1.414 0 1.954s1.414.54 1.952 0l2.618-2.614a1.377 1.377 0 0 0 0-1.916z"
          />
          <path
            fill="#FFFFFF"
            d="M20.617 12.012H8.383a1.38 1.38 0 1 0 0 2.76h12.234a1.38 1.38 0 1 0 0-2.76z"
          />
        </svg>
      );
    case "gfg":
      return (
        <div className="flex size-7 items-center justify-center rounded-md bg-[#2F8D46]/20 text-[#2F8D46] font-mono font-black text-sm border border-[#2F8D46]/40">
          {"{ }"}
        </div>
      );
    case "codechef":
      return (
        <div className="flex size-7 items-center justify-center rounded-md bg-amber-700/20 text-amber-500 font-bold text-xs border border-amber-600/40">
          👨‍🍳
        </div>
      );
    case "codolio":
      return (
        <img
          src="/assets/logos/Codolio.png"
          alt="Codolio"
          className="size-7 object-contain"
        />
      );
    default:
      return <Code2 className={className} />;
  }
};

const getOverviewIcon = (index) => {
  switch (index) {
    case 0:
      return <Code2 className="size-5 text-emerald-400" />;
    case 1:
      return <Flame className="size-5 text-amber-400" />;
    case 2:
      return <TrendingUp className="size-5 text-purple-400" />;
    case 3:
      return <Award className="size-5 text-cyan-400" />;
    default:
      return <Code2 className="size-5 text-purple-400" />;
  }
};

const CodingStats = () => {
  return (
    <section className="c-space section-spacing relative" id="coding-stats">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-heading">Coding Stats & Profiles</h2>
        <p className="subtext">
          My competitive programming metrics, problem-solving streaks, and multi-platform practice journey.
        </p>
      </div>

      <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent mt-6 mb-10 h-px w-full" />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {codingOverview.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border ${item.border} bg-linear-to-b ${item.accent} p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                {item.label}
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                {getOverviewIcon(index)}
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {item.value}
            </p>
            <p className="mt-1 text-xs text-neutral-400">{item.subtext}</p>
          </motion.div>
        ))}
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {codingPlatforms.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-storm/40 via-indigo/30 to-midnight/50 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(122,87,219,0.12)] hover:-translate-y-1"
          >
            {/* Ambient hover glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 size-48 rounded-full bg-purple-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            {/* Platform Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-midnight shadow-inner">
                  <PlatformIcon id={platform.id} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">
                    {platform.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-purple-400">
                    {platform.username}
                  </p>
                </div>
              </div>

              {/* View Profile external link */}
              <a
                href={platform.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-all hover:bg-white/10 hover:text-white hover:border-purple-400/50"
                aria-label={`View ${platform.name} Profile`}
              >
                <ExternalLink className="size-4" />
              </a>
            </div>

            {/* Badge */}
            {platform.badge && (
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-300">
                  <CheckCircle2 className="size-3.5 text-purple-400" />
                  {platform.badge}
                </span>
              </div>
            )}

            {/* Stats Pills */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {platform.stats.map((stat, statIndex) => (
                <div
                  key={statIndex}
                  className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/3 p-2.5 text-center transition-colors hover:bg-white/5"
                >
                  <span className="text-xs text-neutral-400 font-medium">
                    {stat.label}
                  </span>
                  <span className="mt-0.5 text-sm sm:text-base font-bold text-white">
                    {stat.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <ul className="mt-4 space-y-2 border-t border-white/5 pt-4 text-xs sm:text-sm text-neutral-300">
              {platform.highlights.map((highlight, hIndex) => (
                <li key={hIndex} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {/* Skills / Topics */}
            {platform.skills && (
              <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                {platform.skills.map((skill, sIndex) => (
                  <span
                    key={sIndex}
                    className="rounded-md bg-white/5 border border-white/5 px-2 py-0.5 text-[11px] text-neutral-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CodingStats;
