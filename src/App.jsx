import React, { lazy, Suspense } from "react";
import MaintenanceScreen from "./components/MaintenanceScreen";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import { CredentialsProvider } from "./context/CredentialsContext";
import { MaintenanceProvider, useMaintenance } from "./context/MaintenanceContext";
import { TestimonialsProvider } from "./context/TestimonialsContext";
import useVisitorTracker from "./hooks/useVisitorTracker";

// Below-the-fold sections lazy-loaded to keep initial JS bundle small
const About = lazy(() => import("./sections/About"));
const Experience = lazy(() => import("./sections/Experience"));
const Projects = lazy(() => import("./sections/Projects"));
const CodingStats = lazy(() => import("./sections/CodingStats"));
const CertificateSection = lazy(() => import("./sections/CertificateSection"));
const Education = lazy(() => import("./sections/Education"));
const Testimonials = lazy(() => import("./sections/Testimonials"));
const Contact = lazy(() => import("./sections/Contact"));
const Footer = lazy(() => import("./sections/Footer"));

const SectionSkeleton = () => (
  <div className="w-full py-16 flex items-center justify-center" aria-hidden="true">
    <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin opacity-40" />
  </div>
);

const PortfolioContent = () => {
  const { shouldShowMaintenance, isBypassed } = useMaintenance();

  if (shouldShowMaintenance) {
    return <MaintenanceScreen />;
  }

  return (
    <>
      {isBypassed && (
        <div className="fixed top-3 right-3 z-50 bg-rose-600/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 border border-rose-400/40">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          Admin Preview Mode (Maintenance Active)
        </div>
      )}

      <main className="relative w-full overflow-x-hidden">
        <Navbar />
        <Hero />
        <div className="container mx-auto max-w-7xl">
          <Suspense fallback={<SectionSkeleton />}>
            <About />
            <Experience />
            <Projects />
            <CodingStats />
            <CertificateSection />
            <Education />
            <Testimonials />
            <Contact />
            <Footer />
          </Suspense>
        </div>
      </main>
    </>
  );
};

const App = () => {
  useVisitorTracker();

  return (
    <MaintenanceProvider>
      <CredentialsProvider>
        <TestimonialsProvider>
          <PortfolioContent />
        </TestimonialsProvider>
      </CredentialsProvider>
    </MaintenanceProvider>
  );
};

export default App;
