import { motion } from "motion/react";

const WorkShowCase = () => {
  const githubUrl = "https://github.com/Bhupesh-Dewangan";
  const codolioURL = "https://codolio.com/profile/BhupeshD";
  const resumeUrl =
    "https://res.cloudinary.com/djoybtphx/image/upload/v1770306336/Bhupesh_Dewangan_Resume_zppcik.pdf";

  const linkClass =
    "relative flex min-h-11 w-full max-w-44 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-extralight sm:w-40";

  return (
    <div className="flex w-full flex-col items-center justify-center px-2">
      <p className="headtext mb-6 text-center text-lg sm:mb-8 sm:text-xl">
        Explore my work and credentials
      </p>

      <div className="mb-6 flex w-full max-w-sm flex-wrap justify-center gap-3 sm:gap-4">
        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-center gap-2">
            <img
              src="assets/logos/github.png"
              className="w-6"
              alt="GitHub Icon"
            />
            GitHub
          </div>
        </motion.a>

        <motion.a
          href={codolioURL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-center gap-2">
            <img
              src="assets/logos/Codolio.png"
              className="w-6"
              alt="Codolio Icon"
            />
            Codolio
          </div>
        </motion.a>
      </div>

      <div className="flex w-full flex-col items-center">
        <p className="headtext mb-4 text-center text-lg sm:mb-6 sm:text-xl">
          Want to Hire me?
        </p>

        <motion.a
          href={resumeUrl}
          target="_blank"
          download="Bhupesh_Dewangan_Resume.pdf"
          className="relative flex min-h-11 w-full max-w-56 items-center justify-center rounded-full bg-black px-5 py-4 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 shrink-0"
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
