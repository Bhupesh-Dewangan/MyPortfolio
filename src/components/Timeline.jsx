"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
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
      <div ref={ref} className="relative mt-8 sm:mt-0">
        {data.map((item, index) => (
          <div key={index} className="relative flex justify-start pt-6 md:pt-10">
            <div className="absolute left-0 top-6 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-midnight md:hidden">
              <div className="h-3 w-3 rounded-full border border-neutral-700 bg-neutral-800 p-1.5" />
            </div>

            <div className="sticky top-24 z-40 hidden w-2/5 max-w-sm flex-col items-center self-start md:flex md:top-32 md:max-w-sm md:flex-row lg:max-w-md">
              <div className="absolute flex h-10 w-10 items-center justify-center rounded-full -left-3.75 bg-midnight">
                <div className="h-4 w-4 rounded-full border border-neutral-700 bg-neutral-800 p-2" />
              </div>
              <div className="flex flex-col gap-1 pl-16 text-lg font-bold text-neutral-300 md:gap-2 md:text-xl lg:pl-20 lg:text-3xl">
                <h3>{item.date}</h3>
                <h3 className="text-base text-neutral-400 md:text-lg">
                  {item.title}
                </h3>
                <h3 className="text-sm text-neutral-500 md:text-base">
                  {item.job}
                </h3>
              </div>
            </div>

            <div className="relative w-full pl-10 md:w-3/5 md:pl-4">
              <div className="mb-3 block text-left font-bold text-neutral-300 md:hidden">
                <h3 className="text-lg">{item.date}</h3>
                <h3 className="text-base text-neutral-400">{item.title}</h3>
                <h3 className="text-sm text-neutral-500">{item.job}</h3>
              </div>
              {item.contents.map((content, contentIndex) => (
                <p
                  className="mb-2 text-sm font-normal text-neutral-400 md:text-base"
                  key={contentIndex}
                >
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
          className="absolute left-3.5 top-0 w-0.5 overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-700 to-transparent to-99% mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-1"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 rounded-full bg-linear-to-t from-purple-500 via-lavender/50 to-transparent from-0% via-10%"
          />
        </div>
      </div>
    </div>
  );
};
