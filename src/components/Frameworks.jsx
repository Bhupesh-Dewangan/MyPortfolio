import { OrbitingCircles } from "./OrbitingCircles";

export function Frameworks() {
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
    "postman"
  ];
  return (
    <div className="relative flex h-60 w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={40}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.png`} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={25} radius={100} reverse speed={2}>
        {skills.reverse().map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.png`} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icon = ({ src }) => (
  <img src={src} className="duration-200 rounded-sm hover:scale-110" />
);
