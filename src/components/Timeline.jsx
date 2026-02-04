"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const   containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="c-space section-spacing" ref={containerRef}>
      <h2 className="text-heading">Education</h2>
      <div ref={ref} className="relative">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-6 md:pt-10"
          >
            {/* LEFT COLUMN */}
            <div className="sticky z-40 flex flex-col items-center self-start w-1/3 md:w-2/5 max-w-xs md:max-w-sm md:flex-row top-24 md:top-32">
              <div className="absolute flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full -left-3 md:-left-3.75 bg-midnight">
                <div className="w-3 h-3 md:w-4 md:h-4 p-1.5 md:p-2 border rounded-full bg-neutral-800 border-neutral-700" />
              </div>
              <div className="flex-col hidden gap-1 md:gap-2 text-lg md:text-xl font-bold md:flex md:pl-16 lg:pl-20 lg:text-3xl text-neutral-300">
                <h3>{item.date}</h3>
                <h3 className="text-base md:text-lg text-neutral-400">{item.title}</h3>
                <h3 className="text-sm md:text-base text-neutral-500">{item.job}</h3>
              </div>
            </div>

            {/* RIGHT COLUMN - FIXED: Added width constraint */}
            <div className="relative w-2/3 md:w-3/5 pl-12 pr-4 md:pl-4">
              <div className="block mb-3 text-lg md:text-xl font-bold text-left text-neutral-300 md:hidden">
                <h3>{item.date}</h3>
                <h3 className="text-base text-neutral-400">{item.title}</h3>
                <h3 className="text-sm text-neutral-500">{item.job}</h3>
              </div>
              {item.contents.map((content, contentIndex) => (
                <p className="mb-2 text-sm md:text-base font-normal text-neutral-400" key={contentIndex}>
                  {content}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-1 md:left-1 top-0 overflow-hidden w-0.5 bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-700 to-transparent to-99% mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-linear-to-t from-purple-500 via-lavender/50 to-transparent from-0% via-10% rounded-full"
          />
        </div>
      </div>
    </div>
  );
};