import { motion } from "motion/react";
import { useState, useEffect } from "react";

const roles = [
  {
    preline: "Building scalable web apps as a",
    main: "Web",
    sub: "Developer",
    postline: "solving complex digital challenges",
  },
  {
    preline: "Crafting mobile experiences as an",
    main: "App",
    sub: "Developer",
    postline: "delivering seamless user solutions",
  },
];

const HeroText = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [preText, setPreText] = useState("");
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");
  const [postText, setPostText] = useState("");
  const [phase, setPhase] = useState("typing_pre");

  useEffect(() => {
    const current = roles[roleIndex];
    let timer;

    if (phase === "typing_pre") {
      if (preText.length < current.preline.length) {
        timer = setTimeout(() => {
          setPreText(current.preline.slice(0, preText.length + 1));
        }, 20);
      } else {
        setPhase("typing_main");
      }
    } else if (phase === "typing_main") {
      if (mainText.length < current.main.length) {
        timer = setTimeout(() => {
          setMainText(current.main.slice(0, mainText.length + 1));
        }, 30);
      } else {
        setPhase("typing_sub");
      }
    } else if (phase === "typing_sub") {
      if (subText.length < current.sub.length) {
        timer = setTimeout(() => {
          setSubText(current.sub.slice(0, subText.length + 1));
        }, 30);
      } else {
        setPhase("typing_post");
      }
    } else if (phase === "typing_post") {
      if (postText.length < current.postline.length) {
        timer = setTimeout(() => {
          setPostText(current.postline.slice(0, postText.length + 1));
        }, 20);
      } else {
        setPhase("pause");
      }
    } else if (phase === "pause") {
      timer = setTimeout(() => {
        setPhase("deleting");
      }, 1500);
    } else if (phase === "deleting") {
      if (postText.length > 0) {
        timer = setTimeout(() => {
          setPostText((t) => t.slice(0, -3));
        }, 10);
      } else if (subText.length > 0) {
        timer = setTimeout(() => {
          setSubText((t) => t.slice(0, -3));
        }, 10);
      } else if (mainText.length > 0) {
        timer = setTimeout(() => {
          setMainText((t) => t.slice(0, -3));
        }, 10);
      } else if (preText.length > 0) {
        timer = setTimeout(() => {
          setPreText((t) => t.slice(0, -4));
        }, 10);
      } else {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setPhase("typing_pre");
      }
    }

    return () => clearTimeout(timer);
  }, [preText, mainText, subText, postText, phase, roleIndex]);

  return (
    <div className="relative z-10 w-full max-w-3xl c-space pt-24 text-center sm:pt-28 md:pt-32 md:text-left lg:pt-40">
      <motion.h1
        className="text-2xl font-medium text-neutral-200 sm:text-3xl md:text-4xl"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        Hi, I'm <span className="font-bold text-white">Bhupesh Dewangan</span>
      </motion.h1>

      <div className="relative mt-2 min-h-55 sm:min-h-62.5 md:min-h-70 flex flex-col justify-center">
        <div className="flex flex-col items-center md:items-start">
          {/* Preline */}
          <p className="text-xl font-medium text-neutral-300 sm:text-2xl md:text-3xl min-h-9">
            {preText}
            {phase === "typing_pre" && (
              <span className="inline-block w-1.5 h-6 ml-1 bg-purple-400 animate-pulse align-middle" />
            )}
          </p>

          {/* Main & Sub Title */}
          <div className="my-2 flex flex-col items-center md:items-start min-h-22.5 sm:min-h-30">
            <span className="font-black leading-none text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]">
              {mainText}
              {phase === "typing_main" && (
                <span className="inline-block w-2.5 h-10 sm:h-12 md:h-14 ml-1 bg-purple-400 animate-pulse align-middle" />
              )}
            </span>
            <span className="font-black leading-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]">
              {subText}
              {phase === "typing_sub" && (
                <span className="inline-block w-2.5 h-10 sm:h-12 md:h-14 ml-1 bg-purple-400 animate-pulse align-middle" />
              )}
            </span>
          </div>

          {/* Postline */}
          <p className="text-xl font-medium text-neutral-300 sm:text-2xl md:text-3xl min-h-9">
            {postText}
            {(phase === "typing_post" || phase === "pause") && (
              <span className="inline-block w-1.5 h-6 ml-1 bg-purple-400 animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
