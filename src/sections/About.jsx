import { useEffect, useState } from "react";
import Globe from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import Frameworks from "../components/Frameworks";
import WorkShowCase from "../components/WorkShowCase";
import { Code2, MapPin, Clock, Sun, RotateCcw } from "lucide-react";

const About = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setTime(new Date().toLocaleTimeString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="c-space section-spacing" id="about">
      <h2 className="text-heading">About Me</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* Grid 1 */}
        <div
          className="relative flex flex-col justify-between grid-1 w-full rounded-3xl border border-white/8 overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-[0_25px_80px_rgba(0,0,0,0.45)] bg-[#080d20] isolate"
        >
          {/* ================= BACKGROUND DESIGN ================= */}

          {/* Main navy gradient */}
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_15%_42%,#172b68_0%,#101936_32%,#0b1128_62%,#060a18_100%)]" />

          {/* Large blue glow on left */}
          <div className="absolute -left-32 top-28 w-90 h-90 rounded-full bg-[#263eaa]/25 blur-[80px] -z-10 pointer-events-none" />

          {/* Subtle cyan/blue glow behind image */}
          <div className="absolute left-[42%] top-[8%] w-70 h-70 rounded-full bg-[#164c80]/20 blur-[90px] -z-10 pointer-events-none" />

          {/* Bottom-left curved decorative shape */}
          <div className="absolute -left-24 -bottom-32.5 w-107.5 h-75 rounded-[50%] bg-[#14275f]/55 blur-[1px] -z-10 pointer-events-none" />

          {/* Very subtle top highlight */}
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#18244a]/30 to-transparent -z-10 pointer-events-none" />

          {/* Inner glass highlight */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/2.5 pointer-events-none" />

          {/* ================= "BUILD COOL THINGS" DOODLE ================= */}

          <div className="absolute left-8 top-8 z-20 select-none pointer-events-none">
            <p className="handwritten text-[#5b6bf5] text-2xl leading-[0.85] -rotate-3">
              Build
              <br />
              Cool
              <br />
              Things
            </p>
            <svg
              width="56"
              height="46"
              viewBox="0 0 56 46"
              fill="none"
              className="mt-1 ml-2 text-[#5b6bf5]"
            >
              <path
                d="M2 6C14 4 34 8 44 22C46 25 47 30 45 34"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 5"
              />
              <path
                d="M36 32L46 36L42 25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* ================= PROFILE IMAGE ================= */}

          <div className="relative w-full flex items-center justify-center pt-14 pb-4 px-10">
            <div className="relative w-full max-w-56 aspect-square transition-transform duration-300 group-hover:scale-[1.02]">
              {/* Glow behind avatar */}
              <div className="absolute inset-[6%] rounded-[28px] bg-[#18e6a0]/10 blur-[55px] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Back frame: frosted glass card, tilted opposite direction */}
              <div
                className="absolute inset-0 rounded-[28px] bg-white/6 backdrop-blur-sm border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.4)]"
                style={{ transform: "rotate(6deg)" }}
              />

              {/* Front frame: green outline, holds the photo */}
              <div
                className="absolute inset-0 rounded-[28px] border-[3px] border-[#2ef9ac] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                style={{ transform: "rotate(-6deg)" }}
              >
                <img
                  src="/full-pic.png"
                  alt="Bhupesh Dewangan - Full-Stack MERN Developer"
                  className="w-full h-full object-cover select-none"
                  loading="lazy"
                />
              </div>

              {/* Code icon badge */}
              <div
                className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-[#0b1128] border-2 border-[#0b1128] flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                style={{ transform: "rotate(-6deg)" }}
              >
                <Code2 className="w-6 h-6 text-[#2ef9ac]" strokeWidth={2.4} />
              </div>
            </div>
          </div>

          {/* ================= TEXT CONTENT ================= */}

          <div className="relative z-10 px-6 sm:px-8 pb-8 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Hi, I'm
            </h3>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1 pb-1 bg-linear-to-r from-[#2ef9ac] via-[#2dd4bf] to-[#44bddc] bg-clip-text text-transparent">
              Bhupesh Dewangan
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#c8d2e5] leading-relaxed font-normal">
              I'm a full-stack developer with a strong focus in the MERN stack.
              I build robust applications from the ground up, focusing on
              intuitive user interfaces, clean architecture, and scalable
              backend systems. I continuously explore new technologies to
              sharpen my engineering and problem-solving skills.
            </p>
          </div>
        </div>

        {/* Grid 2 - Location & Time Zone */}
        <div className="relative flex flex-col justify-between grid-2 w-full rounded-2xl sm:rounded-3xl border border-blue-900/30 overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-[#050914] isolate p-5 sm:p-6 min-h-75">
          {/* Background navy radial gradient */}
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_80%_45%,#0d2254_0%,#081026_45%,#050914_100%)]" />

          {/* Blue atmosphere glow behind globe */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#1d4ed8]/20 blur-[90px] -z-10 pointer-events-none" />

          {/* Inner border highlight */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/5 pointer-events-none" />

          {/* Top-Right "Daytime in India" Badge */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 bg-[#09152e]/90 border border-[#f59e0b]/30 px-2.5 py-1 rounded-xl backdrop-blur-md shadow-md pointer-events-none">
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] shrink-0" />
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Daytime</p>
              <p className="text-[9px] sm:text-[10px] text-[#64748b] font-medium">in India</p>
            </div>
          </div>

          {/* Drag to rotate badge */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1.5 text-[10px] text-[#64748b] font-medium bg-[#050914]/80 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-xs pointer-events-none">
            <RotateCcw className="w-3 h-3 text-[#38bdf8]" />
            <span>Drag to rotate</span>
          </div>

          {/* Left Column Content */}
          <div className="relative z-10 w-full md:w-[55%] flex flex-col justify-between h-full gap-4">
            <div>
              {/* Available for Remote Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#062c20]/90 border border-[#10b981]/40 text-[#2ef9ac] text-xs font-medium shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                </span>
                <span>Available for Remote</span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl sm:text-xl lg:text-2xl font-bold tracking-tight text-white mt-3 sm:mt-4">
                Location &amp; Time Zone
              </h3>

              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mt-1.5 font-normal max-w-xs sm:max-w-sm">
                Based in <span className="text-white font-medium">Raipur, India</span>.
              </p>

              <ul className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mt-1.5 space-y-1 font-normal max-w-xs sm:max-w-sm">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#38bdf8] font-bold shrink-0">•</span>
                  <span>Open to remote &amp; global opportunities</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#38bdf8] font-bold shrink-0">•</span>
                  <span>Available for full-stack MERN projects &amp; collaborations</span>
                </li>
              </ul>
            </div>

            {/* Bottom 2-Column Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3.5 border-t border-white/10 mt-1.5 max-w-xs">
              {/* Col 1: Raipur, India */}
              <div className="flex items-start gap-1.5 pr-2 sm:pr-4 border-r border-white/10">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8] fill-[#38bdf8]/20 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Raipur, India</p>
                  <p className="text-[9px] sm:text-[10px] text-[#64748b] mt-0.5 font-medium">UTC +5:30</p>
                </div>
              </div>

              {/* Col 2: Live IST Time */}
              <div className="flex items-start gap-1.5 pl-2 sm:pl-4">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-white leading-tight">{time || "03:21 PM"}</p>
                  <p className="text-[9px] sm:text-[10px] text-[#64748b] mt-0.5 font-medium">IST · UTC+5:30</p>
                </div>
              </div>
            </div>
          </div>

          {/* Globe Figure (Centered Vertically on Right Side) */}
          <figure className="pointer-events-none absolute right-3 sm:right-3 md:right-3 top-1/2 -translate-y-1/2 z-0 size-44 sm:size-52 md:size-60 lg:size-64 flex items-center justify-center">
            <Globe className="pointer-events-auto size-full max-w-none" />
          </figure>
        </div>

        {/* Grid 3 - Work Showcase */}
        <div className="grid-new-color grid-3">
          <div className="flex flex-col items-center justify-center gap-4 size-full py-4 md:py-0">
            <WorkShowCase />
          </div>
        </div>

        {/* Grid 4 - Contact CTA */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full py-4 md:py-0">
            <p className="text-center headtext px-2">
              Do you want to start a project together?
            </p>
            <CopyEmailButton />
          </div>
        </div>

        {/* Grid 5 - Tech Stack */}
        <div className="grid-default-color grid-5 flex flex-col gap-6 pb-28 md:pb-6 md:block">
          <div className="z-10 w-full md:w-[50%]">
            <p className="headtext">Tech Stack</p>
            <p className="subtext">
              As a passionate developer, I'm actively working with modern web
              technologies to build full-stack applications.
              <br className="hidden sm:block" />
              <span className="sm:before:content-['']">
                {" "}
                I'm developing my expertise across the development lifecycle,
                from responsive interfaces to backend systems.
              </span>
            </p>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[60%] w-full h-96 md:inset-y-9 md:h-full md:start-[50%] md:scale-125 md:translate-x-0 md:translate-y-0">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
