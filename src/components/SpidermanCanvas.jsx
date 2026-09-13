import React, { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Float, ContactShadows } from "@react-three/drei";
import { easing } from "maath";
import Loader from "./Loader";

function SpidermanModel({
  enableFloat = true,
  activeAnim = "",
  isPlaying = true,
  animSpeed = 1,
  onAnimationsLoaded,
  modelScale = 1.6,
  modelPositionX = 0,
  modelPositionY = -1.2,
  modelRotationY = 0,
  isSequenceMode = false,
  sequenceKey = 0,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/spiderman.glb");
  const { actions, names } = useAnimations(animations, group);
  const [isFinalIdle, setIsFinalIdle] = useState(false);

  // Enable shadow support on all meshes
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  // Notify parent of available animation clip names
  useEffect(() => {
    if (names && names.length > 0 && onAnimationsLoaded) {
      onAnimationsLoaded(names);
    }
  }, [names, onAnimationsLoaded]);

  // Handle Animation Playback (Supports both Sequence Mode and Manual Selection)
  useEffect(() => {
    if (!actions || !names || names.length === 0) return;

    if (
      isSequenceMode &&
      actions["hanging"] &&
      actions["braceDrop"] &&
      actions["stand"] &&
      actions["run"] &&
      (actions["jumpDown"] || actions["swingStart"]) &&
      actions["mixamo.com"]
    ) {
      // Sequence Mode:
      // Step 1: Upside Hang ('hanging', 2.5s)
      // Step 2: Forward Hero Impact ('braceDrop', 0.88s)
      // Step 3: Idle Standing ('stand', 2.0s)
      // Step 4: Spider Sprint ('run', 1.0s)
      // Step 5: Reverse Hero Impact ('braceDrop' backward, 0.88s)
      // Step 6: Descend Jump ('jumpDown', 1.4s)
      // Step 7: Action Pose ('mixamo.com', 2.0s)
      // Step 8: Final Idle Standing ('stand', stop float)
      Object.values(actions).forEach((action) => action?.stop());

      const hangingAction = actions["hanging"];
      const braceDropAction = actions["braceDrop"];
      const standAction = actions["stand"];
      const runAction = actions["run"];
      const jumpDownAction = actions["jumpDown"] || actions["swingStart"];
      const mixamoAction = actions["mixamo.com"];

      setIsFinalIdle(false);

      // Step 1: Start with Upside Hang ('hanging')
      hangingAction.reset().fadeIn(0.35).play();
      hangingAction.timeScale = animSpeed;
      hangingAction.paused = !isPlaying;

      // Step 2: Transition to Forward Hero Impact ('braceDrop')
      const timer1 = setTimeout(() => {
        hangingAction.fadeOut(0.3);

        braceDropAction.reset();
        braceDropAction.time = 0.25; // Crop initial slow windup
        braceDropAction.setLoop(THREE.LoopOnce, 1);
        braceDropAction.clampWhenFinished = true;
        braceDropAction.fadeIn(0.25).play();
        braceDropAction.timeScale = animSpeed * 1.15;
        braceDropAction.paused = !isPlaying;

        // Step 3: Transition to Idle Standing pose ('stand')
        const timer2 = setTimeout(() => {
          braceDropAction.fadeOut(0.35);
          standAction.reset().fadeIn(0.35).play();
          standAction.timeScale = animSpeed;
          standAction.paused = !isPlaying;

          // Step 4: After 2s of Idle Standing, transition to 1s Spider Sprint ('run')
          const timer3 = setTimeout(() => {
            standAction.fadeOut(0.3);
            runAction.reset().fadeIn(0.3).play();
            runAction.timeScale = animSpeed;
            runAction.paused = !isPlaying;

            // Step 5: After 1s of Sprint, play Reverse Hero Impact ('braceDrop' backward)
            const timer4 = setTimeout(() => {
              runAction.fadeOut(0.3);

              braceDropAction.reset();
              braceDropAction.time = 1.1; // Start from ground landing pose
              braceDropAction.setLoop(THREE.LoopOnce, 1);
              braceDropAction.clampWhenFinished = true;
              braceDropAction.fadeIn(0.25).play();
              braceDropAction.timeScale = -animSpeed * 1.15; // Negative timeScale plays in reverse!
              braceDropAction.paused = !isPlaying;

              // Step 6: Transition to Descend Jump ('jumpDown')
              const timer5 = setTimeout(() => {
                braceDropAction.fadeOut(0.3);
                jumpDownAction.reset().fadeIn(0.3).play();
                jumpDownAction.timeScale = animSpeed;
                jumpDownAction.paused = !isPlaying;

                // Step 7: Transition to Action Pose ('mixamo.com')
                const timer6 = setTimeout(() => {
                  jumpDownAction.fadeOut(0.4);
                  mixamoAction.reset().fadeIn(0.4).play();
                  mixamoAction.timeScale = animSpeed;
                  mixamoAction.paused = !isPlaying;

                  // Step 8: Transition to Idle Standing pose ('stand') as final position (Stop Float!)
                  const timer7 = setTimeout(() => {
                    mixamoAction.fadeOut(0.5);
                    standAction.reset().fadeIn(0.5).play();
                    standAction.timeScale = animSpeed;
                    standAction.paused = !isPlaying;
                    setIsFinalIdle(true);
                  }, 2000 / animSpeed);

                  return () => clearTimeout(timer7);
                }, 1400 / animSpeed);

                return () => clearTimeout(timer6);
              }, 880 / animSpeed);

              return () => clearTimeout(timer5);
            }, 1000 / animSpeed);

            return () => clearTimeout(timer4);
          }, 2000 / animSpeed);

          return () => clearTimeout(timer3);
        }, 880 / animSpeed);

        return () => clearTimeout(timer2);
      }, 2500 / animSpeed);

      return () => clearTimeout(timer1);
    } else {
      // Manual Animation Selection
      const targetName =
        activeAnim && actions[activeAnim]
          ? activeAnim
          : actions["stand"]
            ? "stand"
            : names[0];

      const currentAction = actions[targetName];

      setIsFinalIdle(targetName === "stand");

      Object.entries(actions).forEach(([name, action]) => {
        if (name !== targetName && action?.isRunning()) {
          action.fadeOut(0.35);
        }
      });

      if (currentAction) {
        currentAction.reset().fadeIn(0.35).play();
        currentAction.timeScale = animSpeed;
        currentAction.paused = !isPlaying;
      }
    }
  }, [actions, names, activeAnim, isPlaying, animSpeed, isSequenceMode, sequenceKey]);

  const shouldFloat = enableFloat && !isFinalIdle;
  const effectiveScale = isFinalIdle ? modelScale * 0.85 : modelScale * 0.90;

  return (
    <group ref={group} dispose={null}>
      {shouldFloat ? (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <primitive
            object={scene}
            scale={effectiveScale}
            position={[modelPositionX, modelPositionY, 0]}
            rotation={[0, modelRotationY, 0]}
          />
        </Float>
      ) : (
        <primitive
          object={scene}
          scale={effectiveScale}
          position={[modelPositionX, modelPositionY, 0]}
          rotation={[0, modelRotationY, 0]}
        />
      )}
    </group>
  );
}

// Camera Mouse Follow / Rigging
function CameraRig({ enableRig = true, cameraZ = 5.5 }) {
  useFrame((state, delta) => {
    if (!enableRig) return;
    easing.damp3(
      state.camera.position,
      [state.mouse.x * 0.8, 0.8 + state.mouse.y * 0.5, cameraZ],
      0.4,
      delta
    );
  });
}

export default function SpidermanCanvas({
  autoRotate = false,
  rotationSpeed = 1.5,
  enableFloat = true,
  enableMouseRig = true,
  lightingTheme = "spider-verse",
  activeAnim = "",
  isPlaying = true,
  animSpeed = 1,
  onAnimationsLoaded = () => { },
  modelScale = 2.2,
  modelPositionX = 0,
  modelPositionY = -1.8,
  modelRotationY = 0,
  cameraZ = 5.5,
  isSequenceMode = false,
  sequenceKey = 0,
}) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.8, cameraZ], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Ambient & Directional Lighting by Theme */}
        <ambientLight intensity={lightingTheme === "cyberpunk" ? 0.8 : 1.2} />

        {lightingTheme === "spider-verse" && (
          <>
            {/* Classic Red and Blue Spider-Verse Rim Lights */}
            <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ff2a4b" />
            <directionalLight position={[-5, 3, -2]} intensity={2.2} color="#0088ff" />
            <pointLight position={[0, -2, 3]} intensity={1.5} color="#a855f7" />
          </>
        )}

        {lightingTheme === "cyberpunk" && (
          <>
            <directionalLight position={[4, 6, 4]} intensity={2.5} color="#00ffcc" />
            <directionalLight position={[-4, -2, -3]} intensity={2.0} color="#ff007f" />
            <pointLight position={[0, 4, 0]} intensity={2} color="#ffe600" />
          </>
        )}

        {lightingTheme === "studio" && (
          <>
            <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" />
            <directionalLight position={[-5, 4, -4]} intensity={1.0} color="#e2e8f0" />
            <pointLight position={[0, 3, 3]} intensity={1.2} color="#ffffff" />
          </>
        )}

        <Suspense fallback={<Loader />}>
          <SpidermanModel
            enableFloat={enableFloat}
            activeAnim={activeAnim}
            isPlaying={isPlaying}
            animSpeed={animSpeed}
            onAnimationsLoaded={onAnimationsLoaded}
            modelScale={modelScale}
            modelPositionX={modelPositionX}
            modelPositionY={modelPositionY}
            modelRotationY={modelRotationY}
            isSequenceMode={isSequenceMode}
            sequenceKey={sequenceKey}
          />

          <ContactShadows
            position={[modelPositionX, modelPositionY - 0.01, 0]}
            opacity={0.8}
            scale={6}
            blur={1.5}
            far={3}
          />
        </Suspense>

        <CameraRig enableRig={enableMouseRig} cameraZ={cameraZ} />

        <ControlledOrbit autoRotate={autoRotate} rotationSpeed={rotationSpeed} />
      </Canvas>
    </div>
  );
}

// Custom OrbitControls that automatically returns the model back to front-facing pose (0) on release
function ControlledOrbit({ autoRotate, rotationSpeed }) {
  const controlsRef = useRef();
  const [isInteracting, setIsInteracting] = useState(false);

  useFrame((state, delta) => {
    if (controlsRef.current && !isInteracting && !autoRotate) {
      const currentAzimuth = controlsRef.current.getAzimuthalAngle();
      if (Math.abs(currentAzimuth) > 0.001) {
        controlsRef.current.setAzimuthalAngle(
          THREE.MathUtils.damp(currentAzimuth, 0, 6, delta)
        );
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={true}
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      autoRotate={autoRotate}
      autoRotateSpeed={rotationSpeed}
      onStart={() => setIsInteracting(true)}
      onEnd={() => setIsInteracting(false)}
      makeDefault
    />
  );
}

useGLTF.preload("/models/spiderman.glb");
