"use client";

import type { Vector3Tuple } from "@/types/portfolio";

type BoxProps = {
  position: Vector3Tuple;
  scale: Vector3Tuple;
  color: string;
  emissive?: string;
};

export function FurnitureBox({ position, scale, color, emissive = "#000000" }: BoxProps) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissive === "#000000" ? 0 : 0.18} />
    </mesh>
  );
}

export function FurnitureCylinder({ position, scale, color, emissive = "#000000" }: BoxProps) {
  return (
    <mesh position={position} scale={scale}>
      <cylinderGeometry args={[0.5, 0.5, 1, 24]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissive === "#000000" ? 0 : 0.18} />
    </mesh>
  );
}
