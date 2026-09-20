import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { API_BASE_URL } from "../config/api";

const START_COUNT = 16;

const ViewCounter = ({ className = "" }) => {
  const [views, setViews] = useState(null);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/visitors/count`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.totalViews === "number") {
            setViews(START_COUNT + data.totalViews);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch view count from backend API:", err);
      }

      // Fallback if network or backend is unreachable
      setViews((prev) => (prev !== null ? prev : START_COUNT + 1));
    };

    fetchViewCount();

    // Refresh view count every 30 seconds
    const intervalId = setInterval(fetchViewCount, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`group relative inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-linear-to-r from-midnight/80 via-storm/40 to-midnight/80 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(122,87,219,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 ${className}`}
      title="Portfolio Views"
    >
      {/* Eye Icon */}
      <Eye className="size-3.5 text-purple-300 transition-transform duration-300 group-hover:scale-110" />

      {/* Label */}
      <span className="text-white font-medium">Portfolio Views:</span>

      {/* Counter Value */}
      <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
        {views !== null ? views.toLocaleString() : `${START_COUNT + 1}`}
      </span>
    </div>
  );
};

export default ViewCounter;
