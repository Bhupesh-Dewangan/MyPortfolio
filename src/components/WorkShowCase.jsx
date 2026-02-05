import { motion } from "motion/react";

const WorkShowCase = () => {
  const githubUrl = "https://github.com/Bhupesh-Dewangan";
  const behanceUrl = "https://www.behance.net/bhupeshdewangan3";
  const codolioURL = "https://codolio.com/profile/BhupeshD";
  const resumeUrl =
    "https://res.cloudinary.com/djoybtphx/image/upload/v1770306336/Bhupesh_Dewangan_Resume_zppcik.pdf";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Main Text */}
      <p className="text-center headtext mb-8">
        Explore my work and credentials
      </p>

      {/* Three Portfolio Links */}
      <div className="flex gap-4 mb-4 flex-wrap justify-center">
        {/* GitHub Button */}
        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative px-1 py-4 text-sm text-center rounded-full font-extralight bg-primary w-40 cursor-pointer"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-center gap-2">
            <img
              src="../assets/logos/github.png"
              className="w-6"
              alt="GitHub Icon"
            />
            GitHub
          </div>
        </motion.a>

        {/* Behance Button */}
        <motion.a
          href={behanceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative px-1 py-4 text-sm text-center rounded-full font-extralight bg-primary w-40 cursor-pointer"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-center gap-2">
            <img
              src="../assets/logos/Behance.png"
              className="w-6"
              alt="Behance Icon"
            />
            Behance
          </div>
        </motion.a>

        {/* Codefolio Button */}
        <motion.a
          href={codolioURL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative px-1 py-4 text-sm text-center rounded-full font-extralight bg-primary w-40 cursor-pointer"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-center gap-2">
            <img
              src="../assets/logos/Codolio.png"
              className="w-6"
              alt="Codolio Icon"
            />
            Codolio
          </div>
        </motion.a>
      </div>

      {/* Hire & Resume Section */}
      <div className="flex flex-col items-center">
        <p className="text-center headtext mb-8">Want to Hire me?</p>

        <motion.a
          href={resumeUrl}
          target="_blank"
          download="Bhupesh_Dewangan_Resume.pdf"
          className="relative px-5 py-5 text-sm text-center rounded-full font-medium bg-black text-white w-52 cursor-pointer hover:bg-gray-800 transition-colors"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Resume
          </div>
        </motion.a>
      </div>
    </div>
  );
};

export default WorkShowCase;
