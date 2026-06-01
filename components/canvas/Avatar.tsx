"use client";

import { forwardRef, type RefObject } from "react";
import type { Group } from "three";
import { usePlayerMovement } from "@/components/systems/usePlayerMovement";

export const Avatar = forwardRef<Group>(function Avatar(_, ref) {
  const playerRef = ref as RefObject<Group | null>;
  usePlayerMovement(playerRef);

  return (
    <group ref={ref} position={[0, 0.7, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 6, 12]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.45} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.15, 0.28]}>
        <boxGeometry args={[0.5, 0.12, 0.25]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
});
