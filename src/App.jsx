import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
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
import Development from "./sections/Development";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

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

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("pushstate", handleLocationChange);

    return () => {
      window.removeEventListener("load", onPageLoad);
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate", handleLocationChange);
    };
  }, []);

  const normalizedPath = currentPath.toLowerCase();
  const isDevelopment = normalizedPath === "/development" || normalizedPath === "/development/";

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      {isDevelopment ? (
        <Development />
      ) : (
        <main className="relative w-full overflow-x-hidden">
          <Navbar />
          <Hero />
          <div className="container mx-auto max-w-7xl">
            <About />
            <Experience />
            <Projects />
            <CodingStats />
            <CertificateSection />
            {/* <Achievements /> */}
            <Education />
            <Contact />
            <Footer />
          </div>
        </main>
      )}
    </>
  );
};

export default App;
