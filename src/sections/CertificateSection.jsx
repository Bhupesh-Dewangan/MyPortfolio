import React, { useEffect, useRef, useState } from "react";
import { certificates } from "../constants";
import ViewAllCertificatesModal from "../components/ViewAllCertificatesModal";

const CertificateSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef(null);

  const nextCertificate = () => {
    setCurrentIndex((i) => (i + 1) % certificates.length);
  };

  const prevCertificate = () => {
    setCurrentIndex((i) => (i === 0 ? certificates.length - 1 : i - 1));
  };

  const startAutoSlide = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(nextCertificate, 3000);
    }
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const getPosition = (index) => {
    const total = certificates.length;
    const diff = (index - currentIndex + total) % total;

    if (diff === 0) return "active";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    return "hidden";
  };

  const navButtonClass =
    "absolute top-1/2 z-50 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-600 bg-gray-800/90 transition hover:bg-gray-700";

  return (
    <>
      <section
        className="c-space section-spacing py-10 text-white sm:py-16"
        id="certifications"
      >
        <h2 className="text-heading mb-8 sm:mb-10">Certifications</h2>

        <div className="relative mx-auto max-w-6xl rounded-2xl border border-gray-700/50 bg-linear-to-br from-gray-800/50 to-gray-900/50 p-4 backdrop-blur-sm sm:p-6 md:p-8">
          <button
            onClick={prevCertificate}
            className={`${navButtonClass} left-1 sm:left-3`}
            aria-label="Previous"
          >
            ‹
          </button>

          <button
            onClick={nextCertificate}
            className={`${navButtonClass} right-1 sm:right-3`}
            aria-label="Next"
          >
            ›
          </button>

          <div
            className="relative flex min-h-[18rem] items-center justify-center overflow-hidden px-10 sm:min-h-145 sm:px-14 md:px-20"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
          >
            {certificates.map((cert, index) => {
              const pos = getPosition(index);

              return (
                <div
                  key={cert.id}
                  className={`absolute transition-all duration-500 ease-out ${
                    pos === "active"
                      ? "z-30 translate-x-0 scale-100 opacity-100"
                      : pos === "left"
                        ? "z-20 hidden -translate-x-[70%] scale-75 opacity-30 sm:block"
                        : pos === "right"
                          ? "z-20 hidden translate-x-[70%] scale-75 opacity-30 sm:block"
                          : "z-10 scale-50 opacity-0"
                  }`}
                  style={{ width: "92%", maxWidth: "600px" }}
                >
                  <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900 shadow-2xl">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="aspect-[1.414/1] w-full bg-black object-contain"
                      loading="lazy"
                    />

                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg font-bold text-blue-300 sm:text-xl">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-gray-300 sm:text-base">
                        {cert.issuer}
                      </p>
                      <p className="text-xs text-gray-400 sm:text-sm">
                        {cert.date}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center gap-2 sm:mt-8">
            {certificates.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`min-h-5 min-w-5 rounded-full p-2 transition ${
                  i === currentIndex
                    ? "scale-125 bg-blue-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full ${
                    i === currentIndex ? "bg-white" : "bg-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center sm:mt-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="min-h-11 w-full max-w-xs rounded-full bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-300 sm:w-auto"
          >
            View All Certificates
          </button>
        </div>
      </section>

      <ViewAllCertificatesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CertificateSection;
