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
  const isActive = currentRoom === roomId;
  const preset = lightingPresets[roomById[roomId].lightingPreset];

  const keyRef = useRef<PointLight>(null);
  const accentRef = useRef<PointLight>(null);
  const fillRef = useRef<PointLight>(null);

  const targetKey = isActive ? preset.activeIntensity : 0;
  const targetAccent = isActive ? preset.activeIntensity * 0.55 : 0;
  const targetFill = isActive ? preset.activeIntensity * 0.25 : 0;

  useFrame((_, delta) => {
    if (!isActive) {
      return;
    }

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

  if (!isActive) return null;

  return (
    <group>
      <pointLight
        ref={keyRef}
        position={[position[0], 3.6, position[2]]}
        color={preset.color}
        intensity={targetKey}
        distance={16}
        decay={1.65}
      />
      <pointLight
        ref={accentRef}
        position={[position[0] - 2.4, 2.4, position[2] - 1.8]}
        color={preset.accent}
        intensity={targetAccent}
        distance={11}
        decay={1.8}
      />
      <pointLight
        ref={fillRef}
        position={[position[0] + 2.4, 1.6, position[2] + 2.2]}
        color={preset.color}
        intensity={targetFill}
        distance={9}
        decay={1.9}
      />
    </group>
  );
}
