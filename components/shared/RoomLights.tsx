"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type PointLight } from "three";
import { lightingPresets } from "@/lib/lightingPresets";
import { roomById } from "@/lib/roomConfig";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import type { RoomId, Vector3Tuple } from "@/types/portfolio";

type RoomLightsProps = {
  roomId: RoomId;
  position: Vector3Tuple;
};

export function RoomLights({ roomId, position }: RoomLightsProps) {
  const currentRoom = usePortfolioStore((state) => state.currentRoom);
  const preset = lightingPresets[roomById[roomId].lightingPreset];
  const isActive = currentRoom === roomId;

  const keyRef = useRef<PointLight>(null);
  const accentRef = useRef<PointLight>(null);
  const fillRef = useRef<PointLight>(null);

  const targetKey = isActive ? preset.activeIntensity : preset.inactiveIntensity;
  const targetAccent = isActive ? preset.activeIntensity * 0.55 : preset.inactiveIntensity * 0.4;
  const targetFill = isActive ? preset.activeIntensity * 0.25 : preset.inactiveIntensity * 0.18;

  useFrame((_, delta) => {
    const damping = 1 - Math.pow(0.0025, delta);
    if (keyRef.current) {
      keyRef.current.intensity = MathUtils.lerp(keyRef.current.intensity, targetKey, damping);
    }
    if (accentRef.current) {
      accentRef.current.intensity = MathUtils.lerp(accentRef.current.intensity, targetAccent, damping);
    }
    if (fillRef.current) {
      fillRef.current.intensity = MathUtils.lerp(fillRef.current.intensity, targetFill, damping);
    }
  });

  return (
    <group>
      <pointLight
        ref={keyRef}
        position={[position[0], 3.6, position[2]]}
        color={preset.color}
        intensity={targetKey}
        distance={isActive ? 16 : 9}
        decay={1.65}
      />
      <pointLight
        ref={accentRef}
        position={[position[0] - 2.4, 2.4, position[2] - 1.8]}
        color={preset.accent}
        intensity={targetAccent}
        distance={isActive ? 11 : 6}
        decay={1.8}
      />
      <pointLight
        ref={fillRef}
        position={[position[0] + 2.4, 1.6, position[2] + 2.2]}
        color={preset.color}
        intensity={targetFill}
        distance={isActive ? 9 : 5}
        decay={1.9}
      />
    </group>
  );
}
