import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const ProjectDetails = ({
  title,
  description,
  subDescription,
  image,
  tags,
  href,
  closeModal,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? image.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = () => {
    if (image[currentImageIndex]?.image) {
      setIsFullscreen(true);
    }
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const navButtonClass =
    "absolute top-1/2 z-50 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-600 bg-gray-800/90 transition hover:bg-gray-700";

  return (
    <>
      <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-hidden p-3 backdrop-blur-sm sm:p-4">
        <motion.div
          className="relative flex h-[92vh] sm:h-[95vh] max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-linear-to-l from-midnight to-navy shadow-sm"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-sm bg-midnight/80 hover:bg-gray-500 sm:top-5 sm:right-5"
            aria-label="Close project details"
          >
            <img src="assets/close.svg" className="h-6 w-6" alt="" />
          </button>

          <div className="relative h-44 w-full shrink-0 sm:h-52 md:h-[45%] lg:h-[55%]">
            <div
              className="relative h-full w-full cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              <img
                src={image[currentImageIndex]?.image}
                alt={image[currentImageIndex]?.name || title}
                className="h-full w-full bg-black object-contain"
                loading="lazy"
              />
            </div>

            {image.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className={`${navButtonClass} left-2 sm:left-3`}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className={`${navButtonClass} right-2 sm:right-3`}
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}

            {image.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 sm:bottom-4">
                {image.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-full"
                    aria-label={`Go to image ${index + 1}`}
                  >
                    <span
                      className={`block h-2.5 w-2.5 rounded-full ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-lg bg-black/70 px-2 py-1 text-xs text-white sm:bottom-4 sm:left-4 sm:max-w-none sm:px-3 sm:text-sm">
              {image[currentImageIndex]?.name} ({currentImageIndex + 1}/
              {image.length})
            </div>
          </div>

          <div className="flex shrink-0 items-center border-b border-white-500 px-4 py-3 sm:px-6 sm:pt-2 sm:pb-2">
            <h5 className="pr-10 text-lg font-bold text-white sm:text-2xl">
              {title}
            </h5>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-4 pt-3 sm:p-6 sm:pt-4">
              <p className="mb-4 text-base font-normal text-neutral-300 sm:text-lg">
                {description}
              </p>
              <div className="mb-1 space-y-3">
                {subDescription.map((subDesc, index) => (
                  <p
                    key={index}
                    className="flex items-start text-sm font-normal text-neutral-400 sm:text-base"
                  >
                    <span className="mr-2 text-blue-400">•</span>
                    {subDesc}
                  </p>
                ))}
              </div>
            </div>

            <div className="shrink-0 p-3 px-4 pt-0 sm:p-2">
              <div className="border-t border-white/10 pt-3 sm:pt-2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="group flex flex-col items-center"
                        title={tag.name}
                      >
                        <img
                          src={tag.path}
                          alt={tag.name}
                          className="size-8 rounded-lg transition-transform duration-200 hover:scale-110"
                        />
                        <span className="mt-1 text-xs text-neutral-400">
                          {tag.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-light text-white transition-colors hover:bg-blue-700 sm:w-auto"
                  >
                    View Project
                    <img
                      src="assets/arrow-up.svg"
                      className="size-4"
                      alt=""
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md"
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/50 hover:bg-black/80 sm:top-6 sm:right-6"
              aria-label="Close fullscreen"
            >
              <img src="assets/close.svg" className="h-8 w-8" alt="" />
            </button>

            <button
              onClick={prevImage}
              className={`${navButtonClass} left-2 sm:left-3`}
              aria-label="Previous"
            >
              ‹
            </button>

            <div className="relative flex h-full max-h-[85vh] w-full max-w-7xl items-center justify-center p-4">
              <img
                src={image[currentImageIndex]?.image}
                alt={image[currentImageIndex]?.name || title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <button
              onClick={nextImage}
              className={`${navButtonClass} right-2 sm:right-3`}
              aria-label="Next"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 max-w-[90vw] -translate-x-1/2 truncate rounded-lg bg-black/50 px-3 py-2 text-sm text-white sm:bottom-6 sm:px-4 sm:text-lg">
              {image[currentImageIndex]?.name} ({currentImageIndex + 1}/
              {image.length})
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetails;
