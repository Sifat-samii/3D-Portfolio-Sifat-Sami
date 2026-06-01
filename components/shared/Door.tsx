"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial } from "three";
import type { DoorConfig } from "@/types/portfolio";
import { usePortfolioStore } from "@/store/usePortfolioStore";

type DoorProps = {
  door: DoorConfig;
};

export function Door({ door }: DoorProps) {
  const nearbyDoor = usePortfolioStore((state) => state.nearbyDoor);
  const isNearby = nearbyDoor === door.id;
  const accent = door.accentColor ?? "#38bdf8";

  const groupRef = useRef<Group>(null);
  const frameRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  const panelRef = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    const damping = 1 - Math.pow(0.0008, delta);
    const t = clock.getElapsedTime();
    const pulse = (Math.sin(t * 2.6) + 1) / 2;

    if (frameRef.current) {
      const target = isNearby ? 0.65 + pulse * 0.35 : 0.18;
      const material = frameRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = MathUtils.lerp(material.emissiveIntensity, target, damping);
    }
    if (panelRef.current) {
      const material = panelRef.current.material as MeshStandardMaterial;
      const target = isNearby ? 0.45 : 0.12;
      material.emissiveIntensity = MathUtils.lerp(material.emissiveIntensity, target, damping);
    }
    if (haloRef.current) {
      const target = isNearby ? 0.42 + pulse * 0.18 : 0;
      const material = haloRef.current.material as MeshStandardMaterial;
      material.opacity = MathUtils.lerp(material.opacity, target, damping);
      const scaleTarget = isNearby ? 1 + pulse * 0.06 : 0.95;
      const s = MathUtils.lerp(haloRef.current.scale.x, scaleTarget, damping);
      haloRef.current.scale.set(s, s, s);
    }
    if (groupRef.current) {
      const lift = isNearby ? 0.04 : 0;
      groupRef.current.position.y = MathUtils.lerp(
        groupRef.current.position.y,
        door.position[1] + lift,
        damping,
      );
    }
  });

  return (
    <group ref={groupRef} position={door.position} rotation={door.rotation ?? [0, 0, 0]}>
      <mesh ref={haloRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[2.4, 3.4]} />
        <meshBasicMaterial color={accent} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={frameRef}>
        <boxGeometry args={[1.5, 2.6, 0.14]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={accent}
          emissiveIntensity={0.18}
          roughness={0.55}
          metalness={0.2}
        />
      </mesh>
      <mesh ref={panelRef} position={[0, 0, -0.08]}>
        <boxGeometry args={[1.95, 2.95, 0.06]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.12}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      <mesh position={[0, 1.4, 0.085]}>
        <boxGeometry args={[1.2, 0.04, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, -1.4, 0.085]}>
        <boxGeometry args={[1.2, 0.04, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 1.75, 0.1]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        maxWidth={2.4}
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {door.label}
      </Text>
    </group>
  );
}
