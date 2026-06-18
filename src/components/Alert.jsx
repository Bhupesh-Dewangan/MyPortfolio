import { motion, AnimatePresence } from "motion/react";

const Alert = ({ type, text }) => {
  const alertVarients = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.8 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-5 left-5 right-5 z-50 flex justify-center sm:left-auto sm:right-5 sm:max-w-md sm:justify-end"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={alertVarients}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className={`flex w-full items-center rounded-md p-4 leading-none text-indigo-100 sm:rounded-full sm:p-5 lg:inline-flex ${
            type === "danger" ? "bg-red-800" : "bg-royal"
          }`}
        >
          <p
            className={`mr-3 flex shrink-0 rounded-full px-2 py-1 text-xs font-semibold uppercase ${
              type === "danger" ? "bg-red-500" : "bg-lavender"
            }`}
          >
            {type === "danger" ? "Failed" : "Success"}
          </p>
          <p className="text-left text-sm sm:text-base">{text}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
