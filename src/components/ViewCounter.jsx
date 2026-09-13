import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { db } from "../firebase";
import { doc, setDoc, increment, onSnapshot } from "firebase/firestore";

const START_COUNT = 16;
const SESSION_KEY = "portfolio_session_counted_fb_v1";

const ViewCounter = ({ className = "" }) => {
  const [views, setViews] = useState(null);

  useEffect(() => {
    const docRef = doc(db, "analytics", "views");
    const hasCountedInSession = sessionStorage.getItem(SESSION_KEY);

    // 1. Increment Firestore count once per browser session
    if (!hasCountedInSession) {
      setDoc(docRef, { count: increment(1) }, { merge: true })
        .then(() => {
          sessionStorage.setItem(SESSION_KEY, "true");
        })
        .catch((err) => {
          console.error("Firestore view counter increment error:", err);
        });
    }

    // 2. Real-time listener for live count updates across all devices
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const rawCount = docSnap.data().count || 0;
          setViews(START_COUNT + rawCount);
        } else {
          setViews(START_COUNT + 1);
        }
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setViews(START_COUNT + 1);
      }
    );

    return () => unsubscribe();
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
