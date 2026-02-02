import { motion } from "motion/react";
import { useState, useEffect } from "react";

const HeroText = () => {
  // Keep the original preline and postline arrays
  const preline = ["Building things as a", "Designing experiences as a"];
  const words = [
    ["MERN Stack", "Developer"], // Split into two array items
    ["UI/UX", "Designer"], // Split into two array items
  ];
  const postline = ["solving problems", "Craft user experiences"];

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  // Single state to control all rotations
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationIndex((prev) => (prev + 1) % 2); // Assuming 2 items each
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="z-10 mt-20 text-center md:mt-40 md:text-left rounded-3xl bg-clip-text">
      {/* Desktop View */}
      <div className="flex-col hidden md:flex c-space">
        <motion.h1
          className="text-4xl font-medium"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          Hi I'm Bhupesh
        </motion.h1>
        <div className="flex flex-col items-start">
          <motion.p
            className="text-4xl font-medium text-neutral-300"
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
            {/* Display the two lines for the title */}
            <div className="flex flex-col">
              <span className="font-black text-white text-7xl leading-none">
                {words[rotationIndex][0]}
              </span>
              <span className="font-black text-white text-7xl leading-mt-2">
                {words[rotationIndex][1]}
              </span>
            </div>
          </motion.div>
          <motion.p
            className="text-4xl font-medium text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            {postline[rotationIndex]}
          </motion.p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col space-y-6 md:hidden">
        <motion.p
          className="text-4xl font-medium"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          Hi I'm Bhupesh
        </motion.p>
        <div>
          <motion.p
            className="text-5xl font-black text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            I
          </motion.p>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            {/* Display the two lines for the title on mobile too */}
            <div className="flex flex-col">
              <span className="font-bold text-white text-7xl leading-tight">
                {words[rotationIndex][0]}
              </span>
              <span className="font-bold text-white text-7xl leading-tight">
                {words[rotationIndex][1]}
              </span>
            </div>
          </motion.div>
          <motion.p
            className="text-4xl font-black text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            building apps
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
