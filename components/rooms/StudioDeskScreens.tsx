"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const FRAME = "#131110";
const BEZEL = "#08080a";
const BEZEL_EDGE = "#1a1a1e";
const GLASS = "#020407";
const CHROME = "#2a2a30";

const LANE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#ca8a04",
  "#db2777",
  "#4f46e5",
] as const;

const PLUGIN_COLORS = ["#155e75", "#3730a3", "#166534"] as const;

const bezelMat = new THREE.MeshStandardMaterial({
  color: BEZEL,
  metalness: 0.52,
  roughness: 0.24,
});

const screenMat = new THREE.MeshPhysicalMaterial({
  color: GLASS,
  emissive: "#0e1a32",
  emissiveIntensity: 0.9,
  roughness: 0.05,
  metalness: 0.38,
  clearcoat: 0.45,
  clearcoatRoughness: 0.06,
  reflectivity: 0.85,
});

const verticalScreenMat = new THREE.MeshPhysicalMaterial({
  color: GLASS,
  emissive: "#0a1628",
  emissiveIntensity: 0.75,
  roughness: 0.06,
  metalness: 0.32,
  clearcoat: 0.4,
  clearcoatRoughness: 0.08,
});

type StudioDeskScreensProps = {
  riserY: number;
};

export function StudioDeskScreens({ riserY }: StudioDeskScreensProps) {
  const screenY = riserY + 0.42;
  const faceX = -0.078;
  const bezelX = -0.102;
  const vertYaw = Math.PI / 2 + 0.18;

  return (
    <group>
      {/* Heavy monitor arm */}
      <mesh position={[-0.26, riserY + 0.10, 0]}>
        <boxGeometry args={[0.06, 0.20, 0.06]} />
        <meshStandardMaterial color={FRAME} metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh position={[-0.20, riserY + 0.26, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.035, 0.22, 0.035]} />
        <meshStandardMaterial color={FRAME} metalness={0.65} roughness={0.28} />
      </mesh>

      {/* Ultrawide chassis */}
      <RoundedBox
        args={[1.45, 0.62, 0.038]}
        radius={0.01}
        smoothness={6}
        position={[bezelX, screenY, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={bezelMat}
      />
      {/* Bottom chin */}
      <mesh position={[bezelX + 0.004, screenY - 0.298, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.38, 0.024, 0.012]} />
        <meshStandardMaterial color={BEZEL_EDGE} metalness={0.5} roughness={0.26} />
      </mesh>
      {/* Top lip */}
      <mesh position={[bezelX + 0.003, screenY + 0.302, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.40, 0.010, 0.008]} />
        <meshStandardMaterial color={CHROME} metalness={0.62} roughness={0.22} />
      </mesh>
      {/* Power LED */}
      <mesh position={[bezelX + 0.006, screenY - 0.278, 0.04]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.012, 0.006, 0.004]} />
        <meshStandardMaterial color="#050505" emissive="#3b82f6" emissiveIntensity={2.0} roughness={0.3} />
      </mesh>

      {/* Screen panel */}
      <mesh position={[faceX, screenY, 0]} rotation={[0, Math.PI / 2, 0]} material={screenMat}>
        <planeGeometry args={[1.36, 0.54]} />
      </mesh>

      {/* DAW menu / transport bar */}
      <mesh position={[faceX + 0.002, screenY + 0.248, 0.02]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.32, 0.038]} />
        <meshStandardMaterial color={GLASS} emissive="#141c2e" emissiveIntensity={1.1} roughness={0.12} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={`tr-${i}`}
          position={[faceX + 0.003, screenY + 0.248, -0.48 + i * 0.038]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.024, 0.018]} />
          <meshStandardMaterial
            color={GLASS}
            emissive={["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#a855f7", "#64748b"][i]}
            emissiveIntensity={1.3}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Track lanes */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`lane-${i}`}
          position={[faceX + 0.003, screenY + 0.19 - i * 0.056, 0.08]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[1.02, 0.036]} />
          <meshStandardMaterial
            color={GLASS}
            emissive={LANE_COLORS[i]}
            emissiveIntensity={0.92}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Mixer strip */}
      <mesh position={[faceX + 0.003, screenY, -0.56]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.18, 0.50]} />
        <meshStandardMaterial color={GLASS} emissive="#1e3a5f" emissiveIntensity={1.05} roughness={0.1} />
      </mesh>

      {/* Playhead */}
      <mesh position={[faceX + 0.004, screenY, 0.16]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.005, 0.52]} />
        <meshStandardMaterial color={GLASS} emissive="#fbbf24" emissiveIntensity={2.0} roughness={0.1} />
      </mesh>

      {/* Vertical secondary monitor */}
      <RoundedBox
        args={[0.44, 0.72, 0.032]}
        radius={0.008}
        smoothness={5}
        position={[-0.14, screenY - 0.02, 0.97]}
        rotation={[0, vertYaw, 0]}
        material={bezelMat}
      />
      <mesh
        position={[-0.118, screenY - 0.02, 0.964]}
        rotation={[0, vertYaw, 0]}
        material={verticalScreenMat}
      >
        <planeGeometry args={[0.38, 0.66]} />
      </mesh>

      {/* Plugin windows with title bars */}
      {[0.22, 0.0, -0.22].map((oy, i) => (
        <group key={`plug-${i}`}>
          <mesh position={[-0.114, screenY - 0.02 + oy, 0.958]} rotation={[0, vertYaw, 0]}>
            <planeGeometry args={[0.32, 0.15]} />
            <meshStandardMaterial
              color={GLASS}
              emissive={PLUGIN_COLORS[i]}
              emissiveIntensity={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-0.113, screenY - 0.02 + oy + 0.072, 0.959]} rotation={[0, vertYaw, 0]}>
            <planeGeometry args={[0.32, 0.018]} />
            <meshStandardMaterial color={GLASS} emissive="#0f172a" emissiveIntensity={1.2} roughness={0.12} />
          </mesh>
        </group>
      ))}

      <mesh position={[-0.24, riserY + 0.02, 0.97]}>
        <boxGeometry args={[0.04, 0.16, 0.04]} />
        <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Small cactus on the monitor riser shelf. */
export function RiserShelfCactus({ riserY }: { riserY: number }) {
  const riserTop = riserY + 0.035 / 2;
  const potH = 0.085;
  const potR = 0.05;

  return (
    <group position={[-0.22, riserTop + potH / 2, 0.74]}>
      <mesh>
        <cylinderGeometry args={[potR, 0.042, potH, 14]} />
        <meshStandardMaterial color="#4a3424" roughness={0.72} metalness={0.03} />
      </mesh>
      <mesh position={[0, potH / 2 + 0.004, 0]}>
        <cylinderGeometry args={[0.044, 0.044, 0.006, 14]} />
        <meshStandardMaterial color="#3a2818" roughness={0.8} metalness={0.02} />
      </mesh>
      {/* Main stem */}
      <mesh position={[0, potH / 2 + 0.055, 0]}>
        <cylinderGeometry args={[0.028, 0.032, 0.11, 10]} />
        <meshStandardMaterial color="#2d6b3a" roughness={0.78} metalness={0.0} />
      </mesh>
      {/* Side pads */}
      <mesh position={[0.034, potH / 2 + 0.04, 0.01]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.022, 0.018, 0.06, 8]} />
        <meshStandardMaterial color="#358544" roughness={0.8} metalness={0.0} />
      </mesh>
      <mesh position={[-0.028, potH / 2 + 0.07, -0.01]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.02, 0.016, 0.05, 8]} />
        <meshStandardMaterial color="#2a7a3c" roughness={0.8} metalness={0.0} />
      </mesh>
    </group>
  );
}
