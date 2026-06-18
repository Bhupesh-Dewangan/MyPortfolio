import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/FrameWorks";
import WorkShowCase from "../components/WorkShowCase";

const About = () => {
  return (
    <section className="c-space section-spacing" id="about">
      <h2 className="text-heading">About Me</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* Grid 1 */}
        <div className="flex flex-col items-center grid-default-color grid-1 bg-black border border-gray-800 overflow-hidden">
          <div className="relative w-full h-48 sm:h-56 md:h-64 mb-4 md:mb-6 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="assets/Avatar.png"
              alt="Bhupesh"
              className="h-full max-h-56 object-contain"
            />
          </div>

          <div className="z-10 px-4 pb-4">
            <p className="headtext">Hi, I'm Bhupesh</p>
            <p className="subtext ">
              My name is Bhupesh, and I am a web developer with a keen interest
              in full-stack development. I enjoy building applications from the
              ground up, focusing on both user-friendly interfaces and scalable
              backend systems. I am a continuous learner who enjoys exploring
              new technologies, improving existing projects, and sharpening my
              problem-solving abilities.
            </p>
          </div>
        </div>

        {/* Grid 2 - Time Zone */}
        <div className="grid-black-color grid-3 flex flex-col gap-4 md:block">
          <div className="z-10 w-full md:w-[50%]">
            <p className="headtext">Time Zone</p>
            <p className="subtext">
              I'm based in Mars, and open to remote work worldwide
            </p>
          </div>
          <figure className="relative flex justify-center md:absolute md:left-[30%] md:top-[10%]">
            <Globe className="max-w-40 sm:max-w-48 md:max-w-150" />
          </figure>
        </div>

        {/* Grid 3 - Work Showcase */}
        <div className="grid-new-color grid-3">
          <div className="flex flex-col items-center justify-center gap-4 size-full py-4 md:py-0">
            <WorkShowCase />
          </div>
        </div>

        {/* Grid 4 - Contact CTA */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full py-4 md:py-0">
            <p className="text-center headtext px-2">
              Do you want to start a project together?
            </p>
            <CopyEmailButton />
          </div>
        </div>

        {/* Grid 5 - Tech Stack */}
        <div className="grid-default-color grid-5 flex flex-col gap-6 md:block">
          <div className="z-10 w-full md:w-[50%]">
            <p className="headtext">Tech Stack</p>
            <p className="subtext">
              As a passionate developer, I'm actively working with modern web
              technologies to build full-stack applications.
              <br className="hidden sm:block" />
              <span className="sm:before:content-['']">
                {" "}
                I'm developing my expertise across the development lifecycle,
                from responsive interfaces to backend systems.
              </span>
            </p>
          </div>
          <div className="relative h-48 w-full md:absolute md:inset-y-9 md:h-full md:start-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
