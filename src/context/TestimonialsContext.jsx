import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../config/api";

const isTestimonialVisible = (t) => {
  if (!t) return false;
  if (t.isFeatured === false) return false;
  if (t.isHidden === true) return false;
  if (t.status === "hidden" || t.status === "draft") return false;
  return true;
};

const TestimonialsContext = createContext({
  testimonials: [],
  visibleTestimonials: [],
  hasTestimonials: false,
  loading: true,
  refreshTestimonials: () => {},
});

export const TestimonialsProvider = ({ children }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setTestimonials(data);
          return;
        }
      }
      setTestimonials([]);
    } catch (error) {
      console.warn("Could not fetch testimonials from backend API:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const visibleTestimonials = useMemo(() => {
    return testimonials.filter(isTestimonialVisible);
  }, [testimonials]);

  const hasTestimonials = visibleTestimonials.length > 0;

  return (
    <TestimonialsContext.Provider
      value={{
        testimonials,
        visibleTestimonials,
        hasTestimonials,
        loading,
        refreshTestimonials: fetchTestimonials,
      }}
    >
      {children}
    </TestimonialsContext.Provider>
  );
};

export const useTestimonials = () => useContext(TestimonialsContext);
