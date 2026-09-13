import React, { useState, useEffect } from "react";
import {
  RotateCw,
  Play,
  Pause,
  Zap,
  Sparkles,
  Activity,
  ZoomIn,
  ZoomOut,
  Clapperboard,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import Navbar from "../sections/Navbar";
import HeroText from "../components/HeroText";
import SpidermanCanvas from "../components/SpidermanCanvas";
import ParallaxBackground from "../components/ParallaxBackground";

const ANIMATION_LABELS = {
  stand: "Idle Stance",
  run: "Spider Sprint",
  hanging: "Upside Hang",
  swingStart: "Swing Launch",
  swingEnd: "Swing Landing",
  braceDrop: "Hero Impact",
  jumpDown: "Descend Jump",
  strafeLeft: "Evasion Left",
  starfeRight: "Evasion Right",
  "mixamo.com": "Action Pose",
};

const Development = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [enableFloat, setEnableFloat] = useState(true);
  const [lightingTheme, setLightingTheme] = useState("spider-verse");
  const [activeAnim, setActiveAnim] = useState("stand");
  const [isPlaying, setIsPlaying] = useState(true);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [modelScale, setModelScale] = useState(2.2);
  const [loadedAnimations, setLoadedAnimations] = useState([]);
  const [isSequenceMode, setIsSequenceMode] = useState(true);
  const [sequenceKey, setSequenceKey] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const handleAnimationsLoaded = (names) => {
    setLoadedAnimations(names);
    if (!names.includes(activeAnim) && names.length > 0) {
      const defaultAnim = names.includes("stand") ? "stand" : names[0];
      setActiveAnim(defaultAnim);
    }
  };

  const handleSelectAnim = (animName) => {
    setIsSequenceMode(false);
    setActiveAnim(animName);
    setIsPlaying(true);
  };

  const handlePlaySequence = () => {
    setIsSequenceMode(true);
    setSequenceKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  const zoomIn = () => setModelScale((prev) => Math.min(3.2, parseFloat((prev + 0.2).toFixed(1))));
  const zoomOut = () => setModelScale((prev) => Math.max(0.8, parseFloat((prev - 0.2).toFixed(1))));
  const resetZoom = () => setModelScale(2.2);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-primary text-white selection:bg-red-500 selection:text-white">
      {/* Background Parallax Atmosphere */}
      <ParallaxBackground />

      {/* Main Site Header / Navbar */}
      <Navbar />

      {/* Hero Text Overlay (Left Positioned) */}
      <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto max-w-2xl">
            <HeroText />
          </div>
        </div>
      </div>

      {/* Optional Top Right Environment Controls (When Controllers Open) */}
      {showControls && (
        <div className="absolute top-20 right-6 z-30 flex items-center gap-2 pointer-events-auto bg-black/75 backdrop-blur-md border border-white/10 p-1.5 rounded-full shadow-2xl animate-fade-in">
          {/* Lighting Theme Toggles */}
          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
            <button
              onClick={() => setLightingTheme("spider-verse")}
              title="Spider-Verse Red/Blue Rim Light"
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                lightingTheme === "spider-verse"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Spider-Verse
            </button>
            <button
              onClick={() => setLightingTheme("cyberpunk")}
              title="Neon Cyan & Magenta"
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                lightingTheme === "cyberpunk"
                  ? "bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/40"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Cyberpunk
            </button>
            <button
              onClick={() => setLightingTheme("studio")}
              title="Clean Studio Light"
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                lightingTheme === "studio"
                  ? "bg-white text-black font-semibold shadow-md shadow-white/40"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Studio
            </button>
          </div>

          {/* Auto Spin Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
              autoRotate
                ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                : "bg-transparent border-transparent text-neutral-400 hover:text-white"
            }`}
            title="Toggle 360 Spin"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
            Spin
          </button>

          {/* Float Toggle */}
          <button
            onClick={() => setEnableFloat(!enableFloat)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
              enableFloat
                ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                : "bg-transparent border-transparent text-neutral-400 hover:text-white"
            }`}
            title="Toggle Floating Animation"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Float
          </button>
        </div>
      )}

      {/* Main Full-Screen Spider-Man 3D Canvas (Right Positioned on Desktop) */}
      <main className="w-full h-full relative z-10 pt-16">
        <SpidermanCanvas
          autoRotate={autoRotate}
          rotationSpeed={1.5}
          enableFloat={enableFloat}
          enableMouseRig={true}
          lightingTheme={lightingTheme}
          activeAnim={activeAnim}
          isPlaying={isPlaying}
          animSpeed={animSpeed}
          onAnimationsLoaded={handleAnimationsLoaded}
          modelScale={modelScale}
          modelPositionX={isMobile ? 0 : 2.6}
          modelPositionY={-1.8}
          modelRotationY={0}
          cameraZ={5.5}
          isSequenceMode={isSequenceMode}
          sequenceKey={sequenceKey}
        />
      </main>

      {/* Floating Toggle Button for Controllers (When Hidden) */}
      {!showControls ? (
        <div className="absolute bottom-6 right-6 z-30">
          <button
            onClick={() => setShowControls(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-black/75 hover:bg-black/90 text-white border border-white/15 backdrop-blur-xl shadow-2xl transition-all duration-200 group hover:scale-105"
            title="Open 3D Controls & Animation Switcher"
          >
            <SlidersHorizontal className="w-4 h-4 text-red-500 transition-transform group-hover:rotate-90" />
            3D Controls
          </button>
        </div>
      ) : (
        /* Bottom Interactive Control Dock (When Shown) */
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-4xl flex flex-col items-center gap-3 animate-fade-in">
          {/* Keyframe Animation Selector Bar */}
          <div className="w-full bg-black/80 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl shadow-2xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Keyframe Motion Clips ({loadedAnimations.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sequence Play Button */}
                <button
                  onClick={handlePlaySequence}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                    isSequenceMode
                      ? "bg-linear-to-r from-red-600 to-blue-600 text-white font-semibold shadow-md shadow-red-600/40"
                      : "bg-white/5 text-neutral-300 hover:text-white border border-white/10 hover:bg-white/10"
                  }`}
                  title="Play Intro Animation Sequence"
                >
                  <Clapperboard className="w-3.5 h-3.5 text-red-400" />
                  Intro Sequence
                </button>

                {/* Close Controls Button */}
                <button
                  onClick={() => setShowControls(false)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all border border-white/10"
                  title="Hide Controls"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Animation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-red-500/30">
              {loadedAnimations.length > 0
                ? loadedAnimations.map((animName) => {
                    const isActive = !isSequenceMode && activeAnim === animName;
                    const label = ANIMATION_LABELS[animName] || animName;
                    return (
                      <button
                        key={animName}
                        onClick={() => handleSelectAnim(animName)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border ${
                          isActive
                            ? "bg-linear-to-r from-red-600 to-blue-600 text-white border-white/30 shadow-lg shadow-red-600/30 scale-105"
                            : "bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5 hover:border-white/20"
                        }`}
                      >
                        {isActive && <Zap className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />}
                        {label}
                      </button>
                    );
                  })
                : ["Idle", "Sprint", "Web Hang", "Swing"].map((placeholder, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 rounded-xl text-xs bg-white/5 text-neutral-500 animate-pulse border border-white/5"
                    >
                      {placeholder}...
                    </div>
                  ))}
            </div>
          </div>

          {/* Playback Controls, Speed Bar & Zoom Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 bg-black/85 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full shadow-2xl">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-full transition-all ${
                isPlaying
                  ? "bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/40"
                  : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/40"
              }`}
              title={isPlaying ? "Pause Animation" : "Play Animation"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <div className="h-4 w-px bg-white/10"></div>

            {/* Speed Presets */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <span className="text-neutral-400 mr-1 hidden sm:inline">Speed:</span>
              {[0.5, 1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAnimSpeed(speed)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    animSpeed === speed
                      ? "bg-white text-black font-bold shadow"
                      : "text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-white/10"></div>

            {/* Zoom Level Controls */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <span className="text-neutral-400 mr-1 hidden sm:inline">Size:</span>
              <button
                onClick={zoomOut}
                className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all border border-white/5"
                title="Zoom Out Model"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetZoom}
                className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all border border-white/5 font-mono text-[11px]"
                title="Reset Model Scale"
              >
                {modelScale.toFixed(1)}x
              </button>
              <button
                onClick={zoomIn}
                className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all border border-white/5"
                title="Zoom In Model"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Development;
