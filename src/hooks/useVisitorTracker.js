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

const detectClientBrowser = async () => {
  try {
    // 1. Brave detection (Brave strips its identifier from userAgent to avoid fingerprinting)
    if (navigator.brave && typeof navigator.brave.isBrave === "function") {
      const isBrave = await navigator.brave.isBrave();
      if (isBrave) return "Brave";
    }
  } catch (_) {}

  // 2. UserAgentData Brands API (Most reliable in modern Chromium browsers: Chrome, Edge, Opera, etc.)
  if (navigator.userAgentData && Array.isArray(navigator.userAgentData.brands)) {
    const brands = navigator.userAgentData.brands.map((b) => (b.brand || "").toLowerCase());
    if (brands.some((b) => b.includes("microsoft edge") || b.includes("edge"))) return "Edge";
    if (brands.some((b) => b.includes("opera") || b.includes("opr"))) return "Opera";
    if (brands.some((b) => b.includes("brave"))) return "Brave";
    if (brands.some((b) => b.includes("samsung"))) return "Samsung Internet";
    if (brands.some((b) => b.includes("vivaldi"))) return "Vivaldi";
    if (brands.some((b) => b.includes("duckduckgo"))) return "DuckDuckGo";
    if (brands.some((b) => b.includes("yandex"))) return "Yandex";
  }

  const ua = navigator.userAgent || "";

  // 3. Specific browsers regex matching (order matters: check derived browsers before generic Chrome)
  if (/edg([ea]|ios)?\/|edge\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua) || (typeof window !== "undefined" && Boolean(window.opr))) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/vivaldi/i.test(ua)) return "Vivaldi";
  if (/yabrowser/i.test(ua)) return "Yandex";
  if (/duckduckgo/i.test(ua)) return "DuckDuckGo";
  if (/ucbrowser/i.test(ua)) return "UC Browser";
  if (
    typeof window !== "undefined" &&
    (window.arc ||
      Boolean(
        window.getComputedStyle &&
          getComputedStyle(document.documentElement).getPropertyValue("--arc-palette-title")
      ))
  ) {
    return "Arc";
  }
  if (/firefox|fxios/i.test(ua)) return "Firefox";

  // 4. Chrome / Chromium
  if (/chrome|crios/i.test(ua)) return "Chrome";

  // 5. Safari (Desktop or Mobile Safari without Chrome)
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return "Safari";

  return "Unknown";
};

const detectClientOS = () => {
  const ua = navigator.userAgent || "";
  if (/windows nt/i.test(ua) || /windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipod/i.test(ua)) return "iOS";
  if (/ipad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "iOS";
  if (/macintosh|mac os x/i.test(ua)) return "MacOS";
  if (/cros/i.test(ua)) return "ChromeOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown";
};

const detectClientDevice = () => {
  const ua = navigator.userAgent || "";
  if (/tablet|ipad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "Tablet";
  if (
    /mobile|iphone|ipod|android.*mobile/i.test(ua) ||
    (typeof window !== "undefined" && window.innerWidth <= 768 && navigator.maxTouchPoints > 0)
  ) {
    return "Mobile";
  }
  return "Desktop";
};

const extractElementDetails = (target) => {
  if (!target || typeof target.closest !== "function") return null;

  const el = target.closest('a, button, [role="button"], input[type="submit"], [data-track]');
  if (!el) return null;

  // 1. Label Extraction
  let label =
    el.getAttribute("data-track") ||
    el.getAttribute("aria-label") ||
    el.getAttribute("title");

  if (!label) {
    const rawText = el.innerText || el.textContent || "";
    const cleanText = rawText.trim().replace(/\s+/g, " ");
    if (cleanText && cleanText.length <= 60) {
      label = cleanText;
    }
  }

  // Check child image alt or svg
  if (!label) {
    const img = el.querySelector("img[alt]");
    if (img && img.alt) {
      label = img.alt;
    }
  }

  // Fallback to id, name, or href
  if (!label) {
    label = el.id || el.getAttribute("name") || el.getAttribute("href") || "Interactive Element";
  }

  // Clean label string
  label = String(label).trim().slice(0, 80);
  if (!label) return null;

  // 2. Element Type & Target URL
  const tagName = el.tagName.toLowerCase();
  const href = el.getAttribute("href") || "";
  let eventType = "click";

  if (
    el.hasAttribute("download") ||
    /\.(pdf|docx?|zip|rar|tar|gz|xlsx?)$/i.test(href) ||
    /resume|cv/i.test(label)
  ) {
    eventType = "download";
  } else if (href.startsWith("#")) {
    eventType = "navigation";
  } else if (/^https?:\/\//i.test(href)) {
    eventType = "click";
  }

  // 3. Section Extraction
  const sectionEl = el.closest("section[id], header, footer, nav, [role='dialog']");
  let section = "";
  if (sectionEl) {
    if (sectionEl.id) {
      section = `#${sectionEl.id}`;
    } else if (sectionEl.tagName) {
      section = `<${sectionEl.tagName.toLowerCase()}>`;
    }
  } else if (window.location.hash) {
    section = window.location.hash;
  }

  return {
    eventType,
    label,
    element: tagName === "a" ? "link" : "button",
    targetUrl: href.slice(0, 250),
    section: section.slice(0, 40),
    timestamp: new Date().toISOString(),
  };
};

export const useVisitorTracker = () => {
  const startTimeRef = useRef(Date.now());
  const sessionIdRef = useRef(getOrCreateSessionId());
  const eventBufferRef = useRef([]);
  const lastClickRef = useRef({ label: "", time: 0 });

  useEffect(() => {
    const sessionId = sessionIdRef.current;

    // Helper: calculate total elapsed seconds on site
    const getElapsedSeconds = () =>
      Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000));

    // 1. Initial Record Visit Call
    const recordVisit = async () => {
      try {
        const [browser] = await Promise.all([detectClientBrowser()]);
        const os = detectClientOS();
        const deviceType = detectClientDevice();

        await fetch(`${API_BASE_URL}/visitors/record-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            referrer: document.referrer || "Direct",
            userAgent: navigator.userAgent,
            browser,
            os,
            deviceType,
          }),
        });
      } catch (err) {
        console.warn("Failed to record visitor session:", err);
      }
    };

    recordVisit();

    // 2. Flush Buffered Events to Backend
    const flushEvents = async () => {
      if (eventBufferRef.current.length === 0) return;
      const batch = [...eventBufferRef.current];
      eventBufferRef.current = [];

      try {
        await fetch(`${API_BASE_URL}/visitors/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            events: batch,
          }),
        });
      } catch (err) {
        // Non-blocking: re-queue if temporary network failure and buffer not overloaded
        if (eventBufferRef.current.length < 30) {
          eventBufferRef.current.unshift(...batch);
        }
      }
    };

    // Periodic event flush every 4 seconds
    const eventIntervalId = setInterval(flushEvents, 4000);

    // 3. Periodic Heartbeat Timer (Every 15 Seconds)
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

    const heartbeatIntervalId = setInterval(sendHeartbeat, 15000);

    // 4. Global Click Listener for Clicks & Actions
    const handleGlobalClick = (e) => {
      try {
        const details = extractElementDetails(e.target);
        if (!details) return;

        // Debounce rapid duplicate clicks on the exact same label within 800ms
        const now = Date.now();
        if (
          lastClickRef.current.label === details.label &&
          now - lastClickRef.current.time < 800
        ) {
          return;
        }
        lastClickRef.current = { label: details.label, time: now };

        eventBufferRef.current.push(details);

        // Immediate flush if 4 or more actions accumulated
        if (eventBufferRef.current.length >= 4) {
          flushEvents();
        }
      } catch (err) {
        // Ignore tracking parse errors
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });

    // Expose global manual event dispatch for explicit events
    window.__trackVisitorEvent = (label, customDetails = {}) => {
      eventBufferRef.current.push({
        eventType: customDetails.eventType || "custom",
        label: String(label).slice(0, 80),
        element: customDetails.element || "button",
        targetUrl: customDetails.targetUrl || "",
        section: customDetails.section || window.location.hash || "",
        timestamp: new Date().toISOString(),
      });
      if (eventBufferRef.current.length >= 3) {
        flushEvents();
      }
    };

    // 5. Final Flush & Beacon on Page Leave / Visibility Hidden
    const sendFinalBeacon = () => {
      const durationSeconds = getElapsedSeconds();

      // Flush remaining buffered events
      if (eventBufferRef.current.length > 0) {
        const eventsPayload = JSON.stringify({
          sessionId,
          events: eventBufferRef.current,
        });
        const eventsUrl = `${API_BASE_URL}/visitors/events`;

        if (navigator.sendBeacon) {
          const blob = new Blob([eventsPayload], { type: "application/json" });
          navigator.sendBeacon(eventsUrl, blob);
        } else {
          fetch(eventsUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: eventsPayload,
            keepalive: true,
          }).catch(() => {});
        }
        eventBufferRef.current = [];
      }

      // Heartbeat duration beacon
      const durationPayload = JSON.stringify({ sessionId, durationSeconds });
      const heartbeatUrl = `${API_BASE_URL}/visitors/heartbeat`;

      if (navigator.sendBeacon) {
        const blob = new Blob([durationPayload], { type: "application/json" });
        navigator.sendBeacon(heartbeatUrl, blob);
      } else {
        fetch(heartbeatUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: durationPayload,
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
      clearInterval(eventIntervalId);
      clearInterval(heartbeatIntervalId);
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      window.removeEventListener("beforeunload", sendFinalBeacon);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      delete window.__trackVisitorEvent;
    };
  }, []);
};

export default useVisitorTracker;
