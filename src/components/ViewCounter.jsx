import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const START_COUNT = 111;
const STORAGE_KEY = "portfolio_views_counter_v2";
const SESSION_KEY = "portfolio_session_counted_v2";

const ViewCounter = ({ className = "" }) => {
  const [views, setViews] = useState(null);

  useEffect(() => {
    // 1. Get or initialize local visit count
    let localHits = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    const hasCountedInSession = sessionStorage.getItem(SESSION_KEY);

    if (!hasCountedInSession) {
      localHits += 1;
      localStorage.setItem(STORAGE_KEY, localHits.toString());
      sessionStorage.setItem(SESSION_KEY, "true");
    }

    // Default to at least 1 visit if first load
    const effectiveHits = Math.max(1, localHits);
    const fallbackCount = START_COUNT + effectiveHits;

    // 2. Fetch from Counter API
    const apiKey = "bhupesh_dewangan_portfolio_2026_views";
    const apiEndpoint = `https://api.codetabs.com/v1/counter/?key=${apiKey}`;

    fetch(apiEndpoint)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.text();
      })
      .then((text) => {
        const num = parseInt(text.trim(), 10);
        if (!isNaN(num) && num > 0) {
          setViews(START_COUNT + num);
        } else {
          setViews(fallbackCount);
        }
      })
      .catch(() => {
        setViews(fallbackCount);
      });
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur-md transition-all hover:border-purple-400/50 hover:bg-purple-500/20 ${className}`}
      title="Total Portfolio Views"
    >
      <Eye className="size-3.5 text-purple-400" />
      <span>
        {views !== null ? `${views.toLocaleString()} Views` : `${START_COUNT + 1} Views`}
      </span>
    </div>
  );
};

export default ViewCounter;
