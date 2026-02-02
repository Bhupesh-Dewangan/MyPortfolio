import React, { useState, useEffect, useRef } from "react";
import { certificates } from "../constants";

const CertificateSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextCertificate = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === certificates.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevCertificate = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? certificates.length - 1 : prevIndex - 1,
    );
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);

  const getPosition = (index) => {
    const total = certificates.length;
    const diff = (index - currentIndex + total) % total;

    if (diff === 0) return "active";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    return "hidden";
  };

  const startAutoSlide = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(nextCertificate, 3000);
    }
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 bg-linear-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-heading mb-5">Certifications</h2>

        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-800/50 to-gray-900/50 p-6 md:p-8 border border-gray-700/50 backdrop-blur-sm">
          {/* Navigation Buttons */}
          <div
            onClick={prevCertificate}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-gray-800/80 hover:bg-gray-700/90 p-3 rounded-full transition-all duration-300 hover:scale-110 border border-gray-600/50 cursor-pointer"
            aria-label="Previous certificate"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={nextCertificate}
            onKeyDown={(e) => e.key === "Enter" && nextCertificate()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-gray-800/80 hover:bg-gray-700/90 p-3 rounded-full transition-all duration-300 hover:scale-110 border border-gray-600/50 cursor-pointer"
            aria-label="Next certificate"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Certificate Carousel */}
          <div
            className="relative h-100 md:h-112.5 flex items-center justify-center"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
          >
            {certificates.map((cert, index) => {
              const position = getPosition(index);

              return (
                <div
                  key={cert.id}
                  className={`absolute transition-all duration-500 ease-out transform ${
                    position === "active"
                      ? "translate-x-0 scale-100 opacity-100 z-20"
                      : position === "right"
                        ? "translate-x-full scale-75 opacity-30 z-10"
                        : position === "left"
                          ? "-translate-x-full scale-75 opacity-30 z-10"
                          : "opacity-0 scale-50"
                  }`}
                  style={{
                    width: "80%",
                    maxWidth: "600px",
                  }}
                >
                  <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
                    <div className="h-64 md:h-72 overflow-hidden">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-blue-300">
                        {cert.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-300">{cert.issuer}</p>
                          <p className="text-gray-400 text-sm">{cert.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {certificates.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to certificate ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center mt-10">
          <button className="px-1 py-4 text-md text-center text-black rounded-full font-bold bg-white w-48 cursor-pointer overflow-hidden hover:bg-gray-600 transition-all duration-300">
            View All Certificates
          </button>
        </div>
      </div>
    </section>
  );
};

export default CertificateSection;
