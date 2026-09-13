import React from "react";

const DevBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 01 Sky Background */}
      <img
        src="/assets/dev/01-sky-bg.svg"
        alt="Sky Background"
        className="absolute inset-0 w-full h-full object-cover z-[1]"
      />

      {/* 02 Skyline Far */}
      <img
        src="/assets/dev/02-skyline-far.svg"
        alt="Skyline Far"
        className="absolute bottom-0 left-0 w-full object-cover sm:object-fill z-[2]"
      />

      {/* 03 Skyline Mid */}
      <img
        src="/assets/dev/03-skyline-mid.svg"
        alt="Skyline Mid"
        className="absolute bottom-0 right-0 w-full object-cover sm:object-fill z-[3]"
      />

      {/* 04 Rooftop Platform */}
      <img
        src="/assets/dev/04-rooftop-platform.svg"
        alt="Rooftop Platform"
        className="absolute bottom-0 right-0 w-full sm:w-[50%] md:w-[45%] lg:w-[42%] max-w-3xl object-contain z-[4]"
      />
    </div>
  );
};

export default DevBackground;
