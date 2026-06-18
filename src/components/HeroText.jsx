import { motion } from "motion/react";
import { useState, useEffect } from "react";

const HeroText = () => {
  const preline = ["Building things as a","Building things as a"];
  const words = [
    ["MERN Stack", "Developer"],
    ["MERN Stack", "Developer"],
  ];
  const postline = ["solving problems", "solving problems"];

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationIndex((prev) => (prev + 1) % 2);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 w-full max-w-3xl px-5 pt-24 text-center sm:pt-28 md:px-10 md:pt-32 md:text-left lg:px-15 lg:pt-40">
      <motion.h1
        className="text-2xl font-medium sm:text-3xl md:text-4xl"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
      >
        Hi I'm Bhupesh
      </motion.h1>

      <div className="flex flex-col items-center md:items-start">
        <motion.p
          className="mt-4 text-xl font-medium text-neutral-300 sm:text-2xl md:mt-0 md:text-4xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
        >
          {preline[rotationIndex]}
        </motion.p>

        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.5 }}
        >
          <div className="flex flex-col">
            <span className="font-black leading-none text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {words[rotationIndex][0]}
            </span>
            <span className="font-black leading-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {words[rotationIndex][1]}
            </span>
          </div>
        </motion.div>

        <motion.p
          className="mt-2 text-xl font-medium text-neutral-300 sm:text-2xl md:text-4xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.8 }}
        >
          {postline[rotationIndex]}
        </motion.p>
      </div>
    </div>
  );
};

export default HeroText;
