import { useEffect, useState } from "react";
import { OrbitingCircles } from "./OrbitingCircles";
import { API_BASE_URL } from "../config/api";

const DEFAULT_SKILLS = [
  { name: "C", src: "assets/logos/c.png" },
  { name: "C++", src: "assets/logos/cpp.png" },
  { name: "C#", src: "assets/logos/c-sharp.png" },
  { name: "Python", src: "assets/logos/python.png" },
  { name: "HTML5", src: "assets/logos/html5.png" },
  { name: "CSS3", src: "assets/logos/css3.png" },
  { name: "JavaScript", src: "assets/logos/javascript.png" },
  { name: "Bootstrap", src: "assets/logos/bootstrap.png" },
  { name: "Tailwind", src: "assets/logos/tailwind.png" },
  { name: "React", src: "assets/logos/react.png" },
  { name: "Git", src: "assets/logos/git.png" },
  { name: "GitHub", src: "assets/logos/github.png" },
  { name: "Node.js", src: "assets/logos/node.png" },
  { name: "Express", src: "assets/logos/express.png" },
  { name: "MongoDB", src: "assets/logos/mongodb.png" },
  { name: "MySQL", src: "assets/logos/mysql.png" },
  { name: "Canva", src: "assets/logos/canva.png" },
  { name: "Figma", src: "assets/logos/figma.png" },
  { name: "Postman", src: "assets/logos/postman.png" },
];

function Frameworks() {
  const [isMobile, setIsMobile] = useState(false);
  const [skills, setSkills] = useState(DEFAULT_SKILLS);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const fetchDynamicSkills = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/skills`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Filter skills explicitly selected by admin for orbital circle
            const orbitalSkills = data.filter((s) => s.inFrameworksCircle);
            const activeSkills = orbitalSkills.length > 0 ? orbitalSkills : data.filter((s) => s.isFeatured);
            
            const formatted = activeSkills.map((s) => {
              let rawSrc = s.iconUrl || `assets/logos/${s.name.toLowerCase()}.png`;
              if (rawSrc.includes('cdn.jsdelivr.net/gh/devicon/devicon/')) {
                rawSrc = rawSrc.replace(
                  'cdn.jsdelivr.net/gh/devicon/devicon/',
                  'cdn.jsdelivr.net/gh/devicons/devicon@latest/'
                );
              }
              return {
                name: s.name,
                src: rawSrc,
              };
            });
            if (formatted.length > 0) {
              setSkills(formatted);
            }
          }
        }
      } catch (err) {
        // Silently keep default fallback skills if backend is offline
      }
    };

    fetchDynamicSkills();
  }, []);

  const outerRadius = isMobile ? 100 : 175;
  const outerIconSize = isMobile ? 24 : 40;
  const innerRadius = isMobile ? 70 : 100;
  const innerIconSize = isMobile ? 18 : 25;

  return (
    <div className="relative flex h-full w-full min-h-48 flex-col items-center justify-center overflow-visible md:overflow-hidden md:h-60">
      <OrbitingCircles iconSize={outerIconSize} radius={outerRadius}>
        {skills.map((skill, index) => (
          <Icon key={index} src={skill.src} name={skill.name} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles
        iconSize={innerIconSize}
        radius={innerRadius}
        reverse
        speed={2}
      >
        {[...skills].reverse().map((skill, index) => (
          <Icon key={index} src={skill.src} name={skill.name} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icon = ({ src, name }) => (
  <img
    src={src}
    className="duration-200 rounded-sm hover:scale-110 object-contain w-full h-full"
    alt={name ? `${name} logo` : "Technology logo"}
    loading="lazy"
    onError={(e) => {
      // Fallback if SVG URL fails
      e.target.style.opacity = '0.5';
    }}
  />
);

export default Frameworks;