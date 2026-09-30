import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const isItemActive = (item) => {
  if (!item) return false;
  if (item.isFeatured === false) return false;
  if (item.isHidden === true) return false;
  if (item.status === "hidden" || item.status === "draft") return false;
  return true;
};

const DEFAULT_MASTER_TOGGLES = {
  testimonials: true,
  codingStats: true,
  certificates: true,
  education: true,
  experience: true,
  projects: true,
  skills: true,
};

const SectionVisibilityContext = createContext({
  visibility: {
    testimonials: true,
    certifications: true,
    education: true,
    codingStats: true,
    experience: true,
    projects: true,
    skills: true,
  },
  masterToggles: DEFAULT_MASTER_TOGGLES,
  hasTestimonials: true,
  hasCertifications: true,
  hasEducation: true,
  hasCodingStats: true,
  loading: true,
  refreshVisibility: () => {},
});

export const SectionVisibilityProvider = ({ children }) => {
  const [masterToggles, setMasterToggles] = useState(DEFAULT_MASTER_TOGGLES);
  const [visibility, setVisibility] = useState({
    testimonials: true,
    certifications: true,
    education: true,
    codingStats: true,
    experience: true,
    projects: true,
    skills: true,
  });
  const [loading, setLoading] = useState(true);

  const checkVisibility = async () => {
    try {
      const [settingsRes, testRes, certRes, eduRes, statsRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/settings/public`),
        fetch(`${API_BASE_URL}/testimonials`),
        fetch(`${API_BASE_URL}/certificates`),
        fetch(`${API_BASE_URL}/education`),
        fetch(`${API_BASE_URL}/coding-platforms`),
      ]);

      let currentMaster = { ...DEFAULT_MASTER_TOGGLES };
      if (settingsRes.status === "fulfilled" && settingsRes.value.ok) {
        const settingsData = await settingsRes.value.json();
        if (settingsData?.sectionVisibility) {
          currentMaster = {
            ...currentMaster,
            ...settingsData.sectionVisibility,
          };
        }
      }
      setMasterToggles(currentMaster);

      const updated = {
        testimonials: currentMaster.testimonials !== false,
        codingStats: currentMaster.codingStats !== false,
        certifications: currentMaster.certificates !== false,
        education: currentMaster.education !== false,
        experience: currentMaster.experience !== false,
        projects: currentMaster.projects !== false,
        skills: currentMaster.skills !== false,
      };

      // 1. Testimonials: Master toggle must be ON, and active items must exist
      if (currentMaster.testimonials === false) {
        updated.testimonials = false;
      } else if (testRes.status === "fulfilled" && testRes.value.ok) {
        const data = await testRes.value.json();
        const active = Array.isArray(data) ? data.filter(isItemActive) : [];
        updated.testimonials = active.length > 0;
      }

      // 2. Certificates: Master toggle must be ON, and active items must exist
      if (currentMaster.certificates === false) {
        updated.certifications = false;
      } else if (certRes.status === "fulfilled" && certRes.value.ok) {
        const data = await certRes.value.json();
        const active = Array.isArray(data) ? data.filter(isItemActive) : [];
        updated.certifications = active.length > 0;
      }

      // 3. Education: Master toggle must be ON, and active items must exist
      if (currentMaster.education === false) {
        updated.education = false;
      } else if (eduRes.status === "fulfilled" && eduRes.value.ok) {
        const data = await eduRes.value.json();
        const active = Array.isArray(data) ? data.filter(isItemActive) : [];
        updated.education = active.length > 0;
      }

      // 4. Coding Stats: Master toggle must be ON, and active items must exist
      if (currentMaster.codingStats === false) {
        updated.codingStats = false;
      } else if (statsRes.status === "fulfilled" && statsRes.value.ok) {
        const data = await statsRes.value.json();
        const active = Array.isArray(data) ? data.filter(isItemActive) : [];
        updated.codingStats = active.length > 0;
      }

      setVisibility(updated);
    } catch (err) {
      console.warn("Failed to check section visibility from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVisibility();

    // Check periodically (every 30s) or when tab regains focus
    const interval = setInterval(checkVisibility, 30000);
    const handleFocus = () => checkVisibility();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <SectionVisibilityContext.Provider
      value={{
        visibility,
        masterToggles,
        hasTestimonials: visibility.testimonials,
        hasCertifications: visibility.certifications,
        hasEducation: visibility.education,
        hasCodingStats: visibility.codingStats,
        loading,
        refreshVisibility: checkVisibility,
      }}
    >
      {children}
    </SectionVisibilityContext.Provider>
  );
};

export const useSectionVisibility = () => useContext(SectionVisibilityContext);
