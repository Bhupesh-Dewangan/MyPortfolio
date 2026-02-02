import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experiences from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const onPageLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Additional delay for smooth transition
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
    }

    return () => window.removeEventListener("load", onPageLoad);
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      {!isLoading && (
        <div className="container mx-auto max-w-7xl">
          <Navbar />
          <Hero />
          <About />
          <Projects />
          <Experiences />
          <Contact />
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;

//TO Do
// 1. ENV Variable Setup for API keys
// 2. Project Detail Add
// 3. Project Image Adds 
// 4. Codolio Link Add 
// 5. GitHub Link Add 

// 6. About - Tech Stack Icons Add
// 6. About - Badgets Add



