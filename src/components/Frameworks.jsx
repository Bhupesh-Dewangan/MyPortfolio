import { useEffect, useState } from "react";
import { OrbitingCircles } from "./OrbitingCircles";

export function Frameworks() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const skills = [
    "c",
    "cpp",
    "c-sharp",
    "python",
    "html5",
    "css3",
    "javascript",
    "bootstrap",
    "tailwind",
    "react",
    "git",
    "github",
    "node",
    "express",
    "mongodb",
    "mysql",
    "canva",
    "figma",
    "postman",
  ];

  const outerRadius = isMobile ? 100 : 175;
  const outerIconSize = isMobile ? 24 : 40;
  const innerRadius = isMobile ? 70 : 100;
  const innerIconSize = isMobile ? 18 : 25;

  return (
    <div className="relative flex h-full w-full min-h-48 flex-col items-center justify-center overflow-visible md:overflow-hidden md:h-60">
      <OrbitingCircles iconSize={outerIconSize} radius={outerRadius}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.png`} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles
        iconSize={innerIconSize}
        radius={innerRadius}
        reverse
        speed={2}
      >
        {[...skills].reverse().map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.png`} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icon = ({ src }) => (
  <img src={src} className="duration-200 rounded-sm hover:scale-110" alt="" />
);