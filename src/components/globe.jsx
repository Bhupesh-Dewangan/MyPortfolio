"use client";

import createGlobe from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { twMerge } from "tailwind-merge";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG = {
  width: 1000,
  height: 1000,
  onRender: () => { },
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.2,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 20000,
  mapBrightness: 10,
  baseColor: [0.1, 0.25, 0.5],
  markerColor: [0.18, 0.98, 0.68],
  glowColor: [0.15, 0.5, 1],
  markers: [
    { location: [21.2514, 81.6296], size: 0.14 }, // Raipur, India
  ],
};

function Globe({ className, config = GLOBE_CONFIG }) {
  let phi = -0.6; // starts rotated toward India instead of the default 0
  let width = 0;
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updateWidth = () => {
      width = canvas.offsetWidth;
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(canvas);
    const globe = createGlobe(canvas, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005;
        state.phi = phi + rs.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => (canvas.style.opacity = "1"), 0);
    return () => {
      globe.destroy();
      resizeObserver.disconnect();
    };
  }, [rs, config]);

  return (
    <div className={twMerge("aspect-square size-full", className)}>
      <canvas
        className={twMerge(
          "h-full w-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}

export default Globe;