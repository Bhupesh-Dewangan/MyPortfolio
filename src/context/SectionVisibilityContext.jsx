import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const isItemActive = (item) => {
  if (!item) return false;
  if (item.isFeatured === false) return false;
  if (item.isHidden === true) return false;
  if (item.status === "hidden" || item.status === "draft") return false;
  return true;
};

const SectionVisibilityContext = createContext({
  visibility: {
    testimonials: true,
    certifications: true,
    education: true,
    codingStats: true,
  },
  hasTestimonials: true,
  hasCertifications: true,
  hasEducation: true,
  hasCodingStats: true,
  loading: true,
  refreshVisibility: () => {},
});

export const SectionVisibilityProvider = ({ children }) => {
  const [visibility, setVisibility] = useState({
    testimonials: true,
    certifications: true,
    education: true,
    codingStats: true,
  });
  const [loading, setLoading] = useState(true);

  const checkVisibility = async () => {
    try {
      const [testRes, certRes, eduRes, statsRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/testimonials`),
        fetch(`${API_BASE_URL}/certificates`),
        fetch(`${API_BASE_URL}/education`),
        fetch(`${API_BASE_URL}/coding-platforms`),
      ]);

      const updated = { ...visibility };

      if (testRes.status === "fulfilled" && testRes.value.ok) {
        const data = await testRes.value.json();
        const active = Array.isArray(data) ? data.filter(isItemActive) : [];
        updated.testimonials = active.length > 0;
      }

      if (certRes.status === "fulfilled" && certRes.value.ok) {
        const data = await certRes.value.json();
        const active = Array.isArray(data) ? data.filter(isItemActive) : [];
        updated.certifications = active.length > 0;
      }

      if (eduRes.status === "fulfilled" && eduRes.value.ok) {
        const data = await eduRes.value.json();
        const active = Array.isArray(data) ? data.filter(isItemActive) : [];
        updated.education = active.length > 0;
      }

      if (statsRes.status === "fulfilled" && statsRes.value.ok) {
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
  }, []);

  return (
    <SectionVisibilityContext.Provider
      value={{
        visibility,
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
