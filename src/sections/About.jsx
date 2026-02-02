import { useRef } from "react";
import Card from "../components/Card";
import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/FrameWorks";
import WorkShowCase from "../components/WorkShowCase";

const About = () => {
  const grid2Container = useRef();
  return (
    <section className="c-space section-spacing" id="about">
      <h2 className="text-heading">About Me</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* Grid 1 */}
        <div className="flex flex-col items-center grid-default-color grid-1 bg-black border border-gray-800 overflow-hidden">
          {/* Image container with controlled positioning */}
          <div className="relative w-full h-64 mb-6 flex items-center justify-center overflow-hidden">
            <img
              src="assets/Avatar.png"
              alt="Bhupesh"
              className="h-75 object-contain"
            />
          </div>

          {/* Text content */}
          <div className="z-10 px-4">
            <p className="headtext">Hi, I'm Bhupesh</p>
            <p className="subtext">
              My name is Bhupesh, and I am a web developer with a keen interest
              in full-stack development. I enjoy building applications from the
              ground up, focusing on both user-friendly interfaces and scalable
              backend systems. I am a continuous learner who enjoys exploring
              new technologies, improving existing projects, and sharpening my
              problem-solving abilities.
            </p>
          </div>
        </div>
        {/* Grid 2 */}
        <div className="grid-black-color grid-3">
          <div className="z-10 w-[50%]">
            <p className="headtext">Time Zone</p>
            <p className="subtext">
              I'm based in Mars, and open to remote work worldwide
            </p>
          </div>
          <figure className="absolute left-[30%] top-[10%]">
            <Globe />
          </figure>
        </div>
        {/* Grid 3 */}
        <div className="grid-new-color grid-3">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <WorkShowCase />
          </div>
        </div>
        {/* Grid 4 */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">
              Do you want to start a project together?
            </p>
            <CopyEmailButton />
          </div>
        </div>
        {/* Grid 5 */}
        <div className="grid-default-color grid-5">
          <div className="z-10 w-[50%]">
            <p className="headText">Teck Stack</p>
            <p className="subtext">
              I specialize in a variety of languages, frameworks, and tools taht
              allow me to build robust and scalable applications
            </p>
          </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
