import { useEffect, useRef } from "react";
import { API_BASE_URL } from "../config/api";

const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem("visitor_session_id");
  if (!sessionId) {
    sessionId = `v_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("visitor_session_id", sessionId);
  }
  return sessionId;
};

export const useVisitorTracker = () => {
  const startTimeRef = useRef(Date.now());
  const sessionIdRef = useRef(getOrCreateSessionId());

  useEffect(() => {
    const sessionId = sessionIdRef.current;

    // Helper: calculate total elapsed seconds on site
    const getElapsedSeconds = () =>
      Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000));

    // 1. Initial Record Visit Call
    const recordVisit = async () => {
      try {
        await fetch(`${API_BASE_URL}/visitors/record-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            referrer: document.referrer || "Direct",
            userAgent: navigator.userAgent,
          }),
        });
      } catch (err) {
        console.warn("Failed to record visitor session:", err);
      }
    };

    recordVisit();

    // 2. Periodic Heartbeat Timer (Every 15 Seconds)
    const sendHeartbeat = async () => {
      const durationSeconds = getElapsedSeconds();
      try {
        await fetch(`${API_BASE_URL}/visitors/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            durationSeconds,
          }),
        });
      } catch (err) {
        // Silently ignore heartbeat fail on network glitches
      }
    };

    const intervalId = setInterval(sendHeartbeat, 15000);

    // 3. Final Beacon on Page Leave / Visibility Change
    const sendFinalBeacon = () => {
      const durationSeconds = getElapsedSeconds();
      const payload = JSON.stringify({ sessionId, durationSeconds });
      const url = `${API_BASE_URL}/visitors/heartbeat`;

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendFinalBeacon();
      }
    };

    window.addEventListener("beforeunload", sendFinalBeacon);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", sendFinalBeacon);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useVisitorTracker;
