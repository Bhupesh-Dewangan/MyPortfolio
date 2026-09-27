import React, { useState, useEffect } from "react";
import { useMaintenance } from "../context/MaintenanceContext";
import { useCredentials } from "../context/CredentialsContext";
import { Particles } from "./Particles";
import {
  Wrench,
  Clock,
  Mail,
  Linkedin,
  Github,
  MessageCircle,
  Check,
} from "lucide-react";

export const MaintenanceScreen = () => {
  const { maintenanceTitle, maintenanceMessage, estimatedEndTime } = useMaintenance();
  const { credentials } = useCredentials();

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // Live countdown timer if estimatedEndTime is specified
  useEffect(() => {
    if (!estimatedEndTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(estimatedEndTime) - new Date();
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, isPassed: true };
      }
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPassed: false,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [estimatedEndTime]);

  const handleCopyEmail = () => {
    const email = credentials?.email || "bhupeshdewangan160204@gmail.com";
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05070e] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      {/* Background Interactive Particle Canvas */}
      <Particles
        quantity={80}
        ease={70}
        color="#c084fc"
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Ambient Glowing Blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-lg h-128 bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white/3 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-12 shadow-2xl shadow-purple-950/40 text-center flex flex-col items-center space-y-7">
        {/* Pulsing Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          System Maintenance in Progress
        </div>

        {/* Futuristic Orbital Graphic */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-[spin_8s_linear_infinite]" />
          <div className="absolute -inset-2 rounded-full border border-dashed border-indigo-400/20 animate-[spin_12s_linear_infinite_reverse]" />
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-purple-600/30 to-indigo-600/20 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Wrench className="w-7 h-7 text-purple-300 animate-pulse" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3 max-w-lg">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-purple-100 to-purple-300">
            {maintenanceTitle || "Scheduled Upgrade Underway"}
          </h1>
          <p className="text-sm sm:text-base text-gray-300/90 leading-relaxed">
            {maintenanceMessage ||
              "We are currently updating our portfolio with fresh projects and performance enhancements. We'll be back online shortly!"}
          </p>
        </div>

        {/* Countdown Timer Display (if set) */}
        {timeLeft && !timeLeft.isPassed && (
          <div className="w-full bg-white/2 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-purple-300 uppercase tracking-wider font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Estimated Return Countdown
            </div>
            <div className="flex items-center gap-3 sm:gap-4 font-mono">
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-bold bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-14 shadow-inner text-white">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase text-gray-400 mt-1">Hours</span>
              </div>
              <span className="text-2xl font-bold text-purple-400 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-bold bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-14 shadow-inner text-white">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase text-gray-400 mt-1">Minutes</span>
              </div>
              <span className="text-2xl font-bold text-purple-400 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-bold bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-14 shadow-inner text-purple-300">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase text-gray-400 mt-1">Seconds</span>
              </div>
            </div>
          </div>
        )}

        {/* Direct Contact Links */}
        <div className="w-full pt-3 border-t border-white/10 space-y-4">
          <p className="text-xs text-gray-400 font-medium">
            Need to reach me immediately for work opportunities or questions?
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {credentials?.email && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-colors"
                title="Click to copy email"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            )}

            {credentials?.linkedinUrl && (
              <a
                href={credentials.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </a>
            )}

            {credentials?.githubUrl && (
              <a
                href={credentials.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-gray-300" />
                <span>GitHub</span>
              </a>
            )}

            {credentials?.whatsappUrl && (
              <a
                href={credentials.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Live Auto-Refresh Notice */}
        <p className="text-[11px] text-gray-400/80">
          This screen will automatically refresh as soon as maintenance is completed.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
