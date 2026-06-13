"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const BODY = "#9a9590";
const BEZEL = "#141416";

const bodyMat = new THREE.MeshStandardMaterial({
  color: BODY,
  metalness: 0.68,
  roughness: 0.3,
});

const screenMat = new THREE.MeshPhysicalMaterial({
  color: "#020408",
  emissive: "#1a3050",
  emissiveIntensity: 0.78,
  roughness: 0.04,
  metalness: 0.38,
  clearcoat: 0.48,
  clearcoatRoughness: 0.06,
});

const bezelMat = new THREE.MeshStandardMaterial({
  color: BEZEL,
  metalness: 0.55,
  roughness: 0.35,
});

type DeskIpadProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
};

/** iPad Pro lying flat on the desk — space-gray chassis, lit display. */
export function DeskIpad({
  position,
  rotation = [0, -0.14, 0],
}: DeskIpadProps) {
  const w = 0.214;
  const d = 0.155;
  const h = 0.0055;

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox
        args={[w, h, d]}
        radius={0.011}
        smoothness={5}
        position={[0, h / 2, 0]}
        material={bodyMat}
      />

      {/* Display glass */}
      <mesh position={[0, h + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} material={screenMat}>
        <planeGeometry args={[w - 0.016, d - 0.013]} />
      </mesh>

      {/* Thin bezel ring */}
      <mesh position={[0, h + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={bezelMat}>
        <planeGeometry args={[w - 0.006, d - 0.004]} />
      </mesh>

      {/* Front camera */}
      <mesh position={[0, h + 0.0012, -d / 2 + 0.012]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.003, 10]} />
        <meshStandardMaterial color="#0a0a0c" metalness={0.6} roughness={0.25} />
      </mesh>

      {/* Home indicator */}
      <mesh position={[0, h + 0.001, d / 2 - 0.014]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.028, 0.003]} />
        <meshStandardMaterial color="#c8c8cc" emissive="#c8c8cc" emissiveIntensity={0.35} roughness={0.4} />
      </mesh>
    </group>
  );
}
