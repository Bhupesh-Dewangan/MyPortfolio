import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import { Astronaut } from "../components/Astronaut";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense } from "react";
import Loader from "../components/Loader";
import ParallaxBackground from "../components/ParallaxBackground";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden pb-40 md:items-start md:justify-center md:pb-0"
      id="home"
    >
      <ParallaxBackground />
      <figure className="pointer-events-none absolute inset-0 h-full w-full">
        <Canvas camera={{ position: [0, 1, 3] }}>
          <Suspense fallback={<Loader />}>
            <Float>
              <Astronaut
                scale={isMobile ? 0.2 : 0.28}
                position={isMobile ? [0, -1.8, 0] : [2, -0.5, 0]}
              />
            </Float>
            <Rig />
          </Suspense>
        </Canvas>
      </figure>
      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl">
          <HeroText />
        </div>
      </div>
    </section>

  );
};

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
      0.5,
      delta
    );
  });
}

export default Hero;
