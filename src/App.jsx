import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import MaintenanceScreen from "./components/MaintenanceScreen";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import CertificateSection from "./sections/CertificateSection";
import Experience from "./sections/Experience";
import CodingStats from "./sections/CodingStats";
import Testimonials from "./sections/Testimonials";
import { CredentialsProvider } from "./context/CredentialsContext";
import { MaintenanceProvider, useMaintenance } from "./context/MaintenanceContext";
import useVisitorTracker from "./hooks/useVisitorTracker";

const PortfolioContent = () => {
  const { shouldShowMaintenance, isBypassed } = useMaintenance();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const onPageLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Additional delay for smooth transition
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
    }

    return () => {
      window.removeEventListener("load", onPageLoad);
    };
  }, []);

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

      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      <main className="relative w-full overflow-x-hidden">
        <Navbar />
        <Hero />
        <div className="container mx-auto max-w-7xl">
          <About />
          <Experience />
          <Projects />
          <CodingStats />
          <CertificateSection />
          <Education />
          <Testimonials />
          <Contact />
          <Footer />
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
        <PortfolioContent />
      </CredentialsProvider>
    </MaintenanceProvider>
  );
};

export default App;
