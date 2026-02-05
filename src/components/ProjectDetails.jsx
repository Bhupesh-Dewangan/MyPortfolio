import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

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

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === image.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? image.length - 1 : prevIndex - 1,
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

  return (
    <>
      Main Modal
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden backdrop-blur-sm p-4">
        <motion.div
          className="relative max-w-4xl w-full h-[95vh] border shadow-sm rounded-2xl bg-linear-to-l from-midnight to-navy border-white/10 flex flex-col overflow-hidden"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={closeModal}
            className="absolute z-10 p-2 rounded-sm top-5 right-5 bg-midnight/80 hover:bg-gray-500"
          >
            <img src="assets/close.svg" className="w-6 h-6" alt="Close" />
          </button>

          {/* Image Section with Webpage Aspect Ratio */}
          <div className="relative w-full shrink-0" style={{ height: "55%" }}>
            <div
              className="relative w-full h-full cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              <img
                src={image[currentImageIndex]?.image}
                alt={image[currentImageIndex]?.name || title}
                className="w-full h-full object-contain bg-black"
                loading="lazy"
              />
            </div>

            {/* Navigation Buttons */}
            {image.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-50 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full border border-gray-600 transition"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-50 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full border border-gray-600 transition"
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}

            {/* Image Indicator Dots */}
            {image.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {image.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Current Image Name */}
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/70 px-3 py-1 rounded-lg">
              {image[currentImageIndex]?.name} ({currentImageIndex + 1}/
              {image.length})
            </div>
          </div>

          {/* Fixed Title Section */}
          <div className="shrink-0 px-6 pt-2  pb-2 flex items-center border-b border-white-500">
            <h5 className="text-2xl font-bold text-white">{title}</h5>
          </div>

          {/* Content and Tags Section - This will scroll if needed */}
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Scrollable Content Area (description only) */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <p className="mb-4 text-lg font-normal text-neutral-300">
                {description}
              </p>
              <div className="space-y-3 mb-1">
                {subDescription.map((subDesc, index) => (
                  <p
                    key={index}
                    className="font-normal text-neutral-400 flex items-start"
                  >
                    <span className="text-blue-400 mr-2">•</span>
                    {subDesc}
                  </p>
                ))}
              </div>
            </div>

            {/* Fixed Footer with Tags */}
            <div className="shrink-0 p-2 pt-0 px-4">
              <div className="border-t border-white/10 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-4">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex flex-col items-center group"
                        title={tag.name}
                      >
                        <img
                          src={tag.path}
                          alt={tag.name}
                          className="rounded-lg size-8 hover:scale-110 transition-transform duration-200"
                        />
                        <span className="text-xs mt-1 text-neutral-400">
                          {tag.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 font-light text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    View Project
                    <img
                      src="assets/arrow-up.svg"
                      className="size-4"
                      alt="External link"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Fullscreen Image Viewer */}
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
              className="absolute top-6 right-6 p-3 rounded-full bg-black/50 hover:bg-black/80"
            >
              <img
                src="assets/close.svg"
                className="w-8 h-8"
                alt="Close fullscreen"
              />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-50 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full border border-gray-600 transition"
              aria-label="Previous"
            >
              ‹
            </button>

            <div className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center p-4">
              <img
                src={image[currentImageIndex]?.image}
                alt={image[currentImageIndex]?.name || title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-50 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full border border-gray-600 transition"
              aria-label="Next"
            >
              ›
            </button>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-lg bg-black/50 px-4 py-2 rounded-lg">
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
