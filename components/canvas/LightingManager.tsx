"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, MathUtils, type AmbientLight, type DirectionalLight, type Fog, type HemisphereLight } from "three";
import { lightingPresets } from "@/lib/lightingPresets";
import { roomById } from "@/lib/roomConfig";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export function LightingManager() {
  const currentRoom = usePortfolioStore((state) => state.currentRoom);
  const room = roomById[currentRoom];
  const preset = lightingPresets[room.lightingPreset];
  const [roomX, , roomZ] = room.position;

  const ambientRef = useRef<AmbientLight>(null);
  const hemiRef = useRef<HemisphereLight>(null);
  const fogRef = useRef<Fog>(null);
  const directionalRef = useRef<DirectionalLight>(null);
  const tmpColor = useRef(new Color());

  useFrame((_, delta) => {
    const damping = 1 - Math.pow(0.001, delta);
    const swatch = tmpColor.current;

    if (ambientRef.current) {
      swatch.set(preset.color);
      ambientRef.current.color.lerp(swatch, damping);
      ambientRef.current.intensity = MathUtils.lerp(
        ambientRef.current.intensity,
        preset.ambient,
        damping,
      );
    }

    if (hemiRef.current) {
      swatch.set(preset.hemiSky);
      hemiRef.current.color.lerp(swatch, damping);
      swatch.set(preset.hemiGround);
      hemiRef.current.groundColor.lerp(swatch, damping);
      hemiRef.current.intensity = MathUtils.lerp(
        hemiRef.current.intensity,
        preset.hemiIntensity,
        damping,
      );
    }

    if (fogRef.current) {
      swatch.set(preset.fogColor);
      fogRef.current.color.lerp(swatch, damping);
      fogRef.current.near = MathUtils.lerp(fogRef.current.near, preset.fogNear, damping);
      fogRef.current.far = MathUtils.lerp(fogRef.current.far, preset.fogFar, damping);
    }

    if (directionalRef.current) {
      directionalRef.current.position.x = MathUtils.lerp(directionalRef.current.position.x, roomX + 6, damping);
      directionalRef.current.position.z = MathUtils.lerp(directionalRef.current.position.z, roomZ + 8, damping);
    }
  });

  return (
    <>
      <fog
        ref={fogRef}
        attach="fog"
        args={[preset.fogColor, preset.fogNear, preset.fogFar]}
      />
      <ambientLight ref={ambientRef} color={preset.color} intensity={preset.ambient} />
      <hemisphereLight
        ref={hemiRef}
        color={preset.hemiSky}
        groundColor={preset.hemiGround}
        intensity={preset.hemiIntensity}
      />
      <directionalLight
        ref={directionalRef}
        position={[roomX + 6, 14, roomZ + 8]}
        intensity={0.55}
        color="#ffffff"
      />
    </>
  );
}
