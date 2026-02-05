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

  return (
    <>
      <section className="py-16 px-4 md:px-8 text-white section-spacing" id="certifications">
        <h2 className="text-heading mb-10">Certifications</h2>

        {/* OUTER CARD */}
        <div className="relative mx-auto max-w-6xl rounded-2xl border border-gray-700/50 bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 md:p-8">
          {/* PREV BUTTON */}
          <button
            onClick={prevCertificate}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full border border-gray-600 transition"
            aria-label="Previous"
          >
            ‹
          </button>

          {/* NEXT BUTTON */}
          <button
            onClick={nextCertificate}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-50 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full border border-gray-600 transition"
            aria-label="Next"
          >
            ›
          </button>

          {/* VIEWPORT */}
          <div
            className="relative overflow-hidden px-20 min-h-145 flex items-center justify-center"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
          >
            {certificates.map((cert, index) => {
              const pos = getPosition(index);

              return (
                <div
                  key={cert.id}
                  className={`absolute transition-all duration-500 ease-out
                    ${
                      pos === "active"
                        ? "translate-x-0 scale-100 opacity-100 z-30"
                        : pos === "left"
                          ? "-translate-x-[70%] scale-75 opacity-30 z-20"
                          : pos === "right"
                            ? "translate-x-[70%] scale-75 opacity-30 z-20"
                            : "opacity-0 scale-50 z-10"
                    }`}
                  style={{ width: "80%", maxWidth: "600px" }}
                >
                  <div className="rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl bg-gray-900">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="aspect-[1.414/1] w-full object-contain bg-black"
                      loading="lazy"
                    />

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-blue-300">
                        {cert.title}
                      </h3>
                      <p className="text-gray-300">{cert.issuer}</p>
                      <p className="text-gray-400 text-sm">{cert.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-2 mt-8">
            {certificates.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === currentIndex
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full font-bold bg-white text-black hover:bg-gray-300 transition"
          >
            View All Certificates
          </button>
        </div>
      </section>

      {/* Modal */}
      <ViewAllCertificatesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CertificateSection;
