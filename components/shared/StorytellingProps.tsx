"use client";

import { DoubleSide } from "three";
import type { Vector3Tuple } from "@/types/portfolio";

type BaseProps = {
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
  color?: string;
};

export function BookStack({ position, rotation = [0, 0, 0], color = "#7c2d12" }: BaseProps) {
  const palette = ["#7c2d12", "#92400e", "#1e3a8a", "#166534", "#581c87"];
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: 4 }).map((_, index) => (
        <mesh key={index} position={[0, 0.06 + index * 0.08, 0]} scale={[0.5, 0.07, 0.36]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={palette[index % palette.length]} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0.32, 0.06, 0]} scale={[0.06, 0.32, 0.32]} rotation={[0, 0, Math.PI / 2.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
    </group>
  );
}

export function CoffeeMug({ position, color = "#f5f5f4" }: BaseProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.16, 18]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh position={[0.085, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.045, 0.012, 8, 14, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.005, 16]} />
        <meshStandardMaterial color="#3f2410" roughness={0.4} emissive="#7c2d12" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

export function Plant({ position, color = "#166534" }: BaseProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.16, 0.13, 0.3, 18]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.28, 14, 14]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.62, 0.1]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-0.12, 0.6, -0.08]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

export function FloorLamp({ position, color = "#ffb84d" }: BaseProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.04, 18]} />
        <meshStandardMaterial color="#1c1917" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.1, 12]} />
        <meshStandardMaterial color="#1c1917" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.18, 0]}>
        <coneGeometry args={[0.32, 0.42, 18, 1, true]} />
        <meshStandardMaterial color="#1c1917" side={DoubleSide} roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fff7ed" emissive={color} emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 2.05, 0]} intensity={0.85} distance={4.5} color={color} decay={1.6} />
    </group>
  );
}

export function FramedArt({
  position,
  rotation = [0, 0, 0],
  width = 1,
  height = 1.4,
  color = "#fbbf24",
}: BaseProps & { width?: number; height?: number }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.05]} />
        <meshStandardMaterial color="#1c1917" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function StickyNote({ position, rotation = [0, 0, 0], color = "#facc15" }: BaseProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.22, 0.22]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.8} />
    </mesh>
  );
}

export function CablePile({ position, color = "#0f172a" }: BaseProps) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.025, 8, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.04, 0]} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[0.14, 0.022, 8, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Notebook({ position, rotation = [0, 0, 0], color = "#e2e8f0" }: BaseProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.02, 0]} scale={[0.42, 0.04, 0.32]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.045, 0]} scale={[0.4, 0.005, 0.3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Trophy({ position, color = "#facc15" }: BaseProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.04, 0]} scale={[0.18, 0.08, 0.18]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1c1917" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.14, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function ScreenPanel({
  position,
  rotation = [0, 0, 0],
  width = 1.6,
  height = 1,
  color = "#22d3ee",
}: BaseProps & { width?: number; height?: number }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.06]} />
        <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#020617" emissive={color} emissiveIntensity={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.08, 0]}>
        <boxGeometry args={[width * 0.6, 0.04, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function SpeakerStack({ position, color = "#1c1917" }: BaseProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.6, 0.9, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 0.27]}>
        <circleGeometry args={[0.18, 24]} />
        <meshStandardMaterial color="#27272a" emissive="#f43f5e" emissiveIntensity={0.25} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.25, 0.27]}>
        <circleGeometry args={[0.1, 18]} />
        <meshStandardMaterial color="#27272a" emissive="#f43f5e" emissiveIntensity={0.15} roughness={0.7} />
      </mesh>
    </group>
  );
}
