import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Cloud, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * CityHeroScene (Spider-Verse Cinematic Rooftop Edition)
 * Provides:
 * 1. Deep Midnight/Purple Sunset SkyDome Shader
 * 2. Background City Skyscrapers (far back z = -12..-30)
 * 3. Rooftop Ledge Platform aligned under Spider-Man's feet (y = -1.8)
 * 4. Spider-Verse Rim Lighting & Atmospheric Fog
 */

// Sky dome shader (Midnight Violet -> Deep Magenta -> Sunset Crimson Horizon)
function SkyDome() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color("#050714") },
      midColor: { value: new THREE.Color("#1a102f") },
      bottomColor: { value: new THREE.Color("#360d24") },
      offset: { value: 10 },
      exponent: { value: 0.7 },
    }),
    []
  );

  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[400, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 midColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            float t = max(pow(max(h, 0.0), exponent), 0.0);
            vec3 col = h > 0.1
              ? mix(midColor, topColor, clamp(t * 1.4, 0.0, 1.0))
              : mix(bottomColor, midColor, clamp((h + 0.2) / 0.35, 0.0, 1.0));
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// Procedural Skyscraper with emissive window matrices
function Building({ position, size, windowColor = "#38bdf8", windowDensity = 0.35, opacity = 1 }) {
  const [w, h, d] = size;

  const windows = useMemo(() => {
    const pts = [];
    const cols = Math.max(2, Math.floor(w * 1.8));
    const rows = Math.max(4, Math.floor(h * 1.2));
    const colors = ["#38bdf8", "#ff0055", "#ffd700", "#a855f7"];

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (Math.random() < windowDensity) {
          const col = colors[Math.floor(Math.random() * colors.length)];
          pts.push({
            pos: [
              -w / 2 + 0.35 + (x * (w - 0.7)) / Math.max(1, cols - 1),
              0.4 + (y * (h - 0.8)) / Math.max(1, rows - 1),
              d / 2 + 0.01,
            ],
            color: col,
          });
        }
      }
    }
    return pts;
  }, [w, h, d, windowDensity]);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#0c0e1a" roughness={0.8} metalness={0.2} transparent opacity={opacity} />
      </mesh>
      {windows.map((p, i) => (
        <mesh key={i} position={[p.pos[0], p.pos[1] - h / 2, p.pos[2]]}>
          <planeGeometry args={[0.14, 0.18]} />
          <meshBasicMaterial color={p.color} toneMapped={false} transparent opacity={opacity * 0.85} />
        </mesh>
      ))}
    </group>
  );
}

// Skyline layer generator
function Skyline({ count, xRange, zRange, heightRange, windowColor, opacity = 1, seed = 1 }) {
  const buildings = useMemo(() => {
    const rand = mulberry32(seed);
    return new Array(count).fill(0).map(() => {
      const w = 1.8 + rand() * 2.2;
      const d = 1.8 + rand() * 2.2;
      const h = heightRange[0] + rand() * (heightRange[1] - heightRange[0]);
      const x = xRange[0] + rand() * (xRange[1] - xRange[0]);
      const z = zRange[0] + rand() * (zRange[1] - zRange[0]);
      return { position: [x, h / 2 - 2, z], size: [w, h, d] };
    });
  }, [count, xRange, zRange, heightRange, seed]);

  return (
    <group>
      {buildings.map((b, i) => (
        <Building key={i} position={b.position} size={b.size} windowColor={windowColor} opacity={opacity} />
      ))}
    </group>
  );
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rooftop Platform grounded directly under Spider-Man (y = -1.95, top surface y = -1.8)
function RooftopPlatform() {
  const beaconRef = useRef();

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      beaconRef.current.material.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 4) * 1.0;
    }
  });

  return (
    <group position={[2.6, -1.95, 0]}>
      {/* Main Rooftop Slab */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[4.5, 0.3, 3.5]} />
        <meshStandardMaterial color="#0d0f1c" roughness={0.85} metalness={0.3} />
      </mesh>

      {/* Front Edge Parapet / Ledge Border */}
      <mesh position={[0, 0.05, 1.7]} receiveShadow>
        <boxGeometry args={[4.5, 0.1, 0.15]} />
        <meshStandardMaterial color="#161b2e" roughness={0.7} />
      </mesh>
      <mesh position={[-2.2, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.1, 3.5]} />
        <meshStandardMaterial color="#161b2e" roughness={0.7} />
      </mesh>

      {/* Neon Edge Highlight */}
      <mesh position={[0, 0.11, 1.76]}>
        <boxGeometry args={[4.5, 0.02, 0.02]} />
        <meshBasicMaterial color="#ff0055" toneMapped={false} />
      </mesh>

      {/* Rooftop Details (AC Unit & Antenna spire with blinking red warning light) */}
      <mesh position={[-1.6, 0.15, -1.0]} castShadow>
        <boxGeometry args={[0.7, 0.35, 0.5]} />
        <meshStandardMaterial color="#121626" roughness={0.6} />
      </mesh>
      <mesh position={[-1.6, 0.35, -1.0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
        <meshStandardMaterial color="#0b0e18" roughness={0.4} />
      </mesh>

      {/* Antenna Mast */}
      <mesh position={[-1.8, 0.6, -1.3]}>
        <cylinderGeometry args={[0.02, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#0a0c16" />
      </mesh>

      {/* Pulsing Beacon Light */}
      <mesh ref={beaconRef} position={[-1.8, 1.2, -1.3]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#ff2244" emissive="#ff2244" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight position={[-1.8, 1.2, -1.3]} color="#ff2244" intensity={1.5} distance={3} />
    </group>
  );
}

// Atmospheric Fog Controller
function Atmosphere() {
  useFrame(({ scene }) => {
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2("#0e081c", 0.03);
    }
  });
  return null;
}

export default function CityHeroScene() {
  return (
    <>
      <Atmosphere />
      <SkyDome />

      {/* Night Sky Stars */}
      <Stars radius={150} depth={60} count={1400} factor={2.5} saturation={0} fade speed={0.4} />

      {/* Lighting tuned specifically for Spider-Man & City Ledge */}
      <hemisphereLight args={["#6b21a8", "#0b0d18", 0.7]} />
      <directionalLight position={[-6, 8, 4]} intensity={1.6} color="#ffa500" castShadow />
      <directionalLight position={[6, 4, 3]} intensity={1.8} color="#0088ff" />
      <directionalLight position={[-4, 2, -4]} intensity={1.4} color="#ff0055" />
      <ambientLight intensity={0.4} />

      {/* Distant & Mid Skyscrapers (z = -12 to -25) */}
      <Skyline
        count={16}
        xRange={[-20, -4]}
        zRange={[-22, -10]}
        heightRange={[4, 12]}
        windowColor="#38bdf8"
        opacity={0.65}
        seed={12}
      />
      <Skyline
        count={14}
        xRange={[1, 18]}
        zRange={[-22, -10]}
        heightRange={[5, 14]}
        windowColor="#38bdf8"
        opacity={0.7}
        seed={5}
      />

      {/* Ground Rooftop Ledge under Spider-Man */}
      <RooftopPlatform />

      {/* Ambient Floating Embers & Cloud Atmosphere */}
      <Sparkles count={45} scale={[14, 6, 8]} size={2} speed={0.3} color="#f472b6" opacity={0.5} />
      <Cloud position={[-8, 3, -12]} opacity={0.2} speed={0.1} width={12} depth={1.5} segments={8} color="#3b0764" />
      <Cloud position={[8, 4, -15]} opacity={0.15} speed={0.08} width={10} depth={1.5} segments={8} color="#1e1b4b" />
    </>
  );
}
