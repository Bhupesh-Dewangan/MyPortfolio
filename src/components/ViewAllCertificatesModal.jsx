import React, { useState, useEffect } from "react";
import { certificatesAll } from "../constants";

const ViewAllCertificatesModal = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (selectedImage) {
          setSelectedImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, selectedImage]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-6xl rounded-2xl border border-gray-700/50 bg-linear-to-br from-gray-900 to-gray-950 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">
                All Certifications
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificatesAll.map((cert) => (
                <div
                  key={cert.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                  onClick={() => setSelectedImage(cert.image)}
                >
                  {/* Image Container */}
                  <div className="aspect-[1.414/1] overflow-hidden bg-black">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-25">
                  </div>

                  {/* Always Visible Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-blue-300">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-300">{cert.issuer}</p>
                    <p className="text-xs text-gray-400">{cert.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Fullscreen Image Viewer */}
            {selectedImage && (
              <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute right-6 top-6 rounded-full bg-gray-800/80 p-2 text-white hover:bg-gray-700/80 transition-colors"
                  aria-label="Close fullscreen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="relative h-[90vh] w-full max-w-4xl">
                  <img
                    src={selectedImage}
                    alt="Certificate full view"
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                    Click X or press ESC to close
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAllCertificatesModal;