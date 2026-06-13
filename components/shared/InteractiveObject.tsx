"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial } from "three";
import type { InteractiveObjectConfig } from "@/types/portfolio";
import { usePortfolioStore } from "@/store/usePortfolioStore";

type InteractiveObjectProps = {
  object: InteractiveObjectConfig;
};

export function InteractiveObject({ object }: InteractiveObjectProps) {
  const isNearby = usePortfolioStore((state) => state.nearbyObject === object.id);
  const accent = object.accentColor ?? "#38bdf8";

  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  const labelRef = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    const damping = 1 - Math.pow(0.0012, delta);
    const t = clock.getElapsedTime();
    const pulse = (Math.sin(t * 2.2 + object.position[0] * 0.3) + 1) / 2;
    const float = Math.sin(t * 1.4 + object.position[2] * 0.4) * 0.05;

    if (groupRef.current) {
      const targetY = object.position[1] + (isNearby ? 0.08 : 0) + float * 0.6;
      groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, targetY, damping);
    }
    if (meshRef.current) {
      const material = meshRef.current.material as MeshStandardMaterial;
      const target = isNearby ? 0.6 + pulse * 0.4 : 0.16;
      material.emissiveIntensity = MathUtils.lerp(material.emissiveIntensity, target, damping);
    }
    if (haloRef.current) {
      const material = haloRef.current.material as MeshStandardMaterial;
      const targetOpacity = isNearby ? 0.32 + pulse * 0.18 : 0;
      material.opacity = MathUtils.lerp(material.opacity, targetOpacity, damping);
      const scaleTarget = isNearby ? 1.1 + pulse * 0.08 : 0.85;
      const s = MathUtils.lerp(haloRef.current.scale.x, scaleTarget, damping);
      haloRef.current.scale.set(s, s, 1);
    }
    if (labelRef.current) {
      const targetScale = isNearby ? 1 : 0.86;
      const s = MathUtils.lerp(labelRef.current.scale.x, targetScale, damping);
      labelRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={object.position}>
      <mesh ref={haloRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 1.05, 36]} />
        <meshBasicMaterial color={accent} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={meshRef}>
        {object.shape === "sphere" ? (
          <sphereGeometry args={[0.55, 24, 24]} />
        ) : object.shape === "cylinder" ? (
          <cylinderGeometry args={[0.5, 0.5, 1.2, 24]} />
        ) : object.shape === "plane" ? (
          <boxGeometry args={[1.8, 1.15, 0.08]} />
        ) : (
          <boxGeometry args={[1.1, 0.8, 0.8]} />
        )}
        <meshStandardMaterial
          color="#dbeafe"
          emissive={accent}
          emissiveIntensity={0.18}
          roughness={0.45}
          metalness={0.18}
        />
      </mesh>
      <group ref={labelRef} position={[0, 1.05, 0]}>
        <Text
          fontSize={0.18}
          color={isNearby ? "#ffffff" : "#e2e8f0"}
          anchorX="center"
          maxWidth={2.2}
          outlineWidth={0.008}
          outlineColor={isNearby ? accent : "#000000"}
          outlineOpacity={isNearby ? 0.65 : 0.4}
        >
          {object.label}
        </Text>
      </group>
    </group>
  );
}
