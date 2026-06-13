"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial } from "three";
import type { DoorConfig } from "@/types/portfolio";
import { usePortfolioStore } from "@/store/usePortfolioStore";

type DoorProps = {
  door: DoorConfig;
  wallHeight?: number;
  openingWidth?: number;
};

const DEFAULT_OPENING_WIDTH = 2.4;
const DEFAULT_WALL_HEIGHT = 3.8;

export function Door({ door, wallHeight = DEFAULT_WALL_HEIGHT, openingWidth = DEFAULT_OPENING_WIDTH }: DoorProps) {
  const isOpen = usePortfolioStore((state) => state.openingDoorIds.includes(door.id));
  const accent = door.accentColor ?? "#38bdf8";

  const doorHeight = Math.min(wallHeight - 0.92, 2.9);
  const panelWidth = openingWidth / 2 - 0.05;
  const openSlide = openingWidth / 2 - 0.1;
  const frameBorder = 0.07;
  const headerHeight = Math.max(0.34, wallHeight - doorHeight - 0.42);
  const sillHeight = 0.08;

  const groupRef = useRef<Group>(null);
  const leftPanelRef = useRef<Group>(null);
  const rightPanelRef = useRef<Group>(null);
  const thresholdRef = useRef<Mesh>(null);
  const headerLedRef = useRef<Mesh>(null);
  const openAmountRef = useRef(0);

  useFrame(({ clock }, delta) => {
    const damping = 1 - Math.pow(0.0006, delta);
    const target = isOpen ? 1 : 0;
    openAmountRef.current = MathUtils.lerp(openAmountRef.current, target, damping);
    const open = openAmountRef.current;
    const pulse = (Math.sin(clock.getElapsedTime() * 3.2) + 1) / 2;

    if (leftPanelRef.current) {
      leftPanelRef.current.position.x = MathUtils.lerp(-panelWidth / 2, -openSlide, open);
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.position.x = MathUtils.lerp(panelWidth / 2, openSlide, open);
    }
    if (thresholdRef.current) {
      const material = thresholdRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = MathUtils.lerp(
        material.emissiveIntensity,
        open > 0.35 ? 0.55 + pulse * 0.25 : 0.08,
        damping,
      );
    }
    if (headerLedRef.current) {
      const material = headerLedRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = MathUtils.lerp(
        material.emissiveIntensity,
        open > 0.2 ? 0.75 + pulse * 0.2 : 0.22,
        damping,
      );
    }
    if (groupRef.current) {
      const lift = open > 0.5 ? 0.015 : 0;
      groupRef.current.position.y = MathUtils.lerp(
        groupRef.current.position.y,
        door.position[1] + lift,
        damping,
      );
    }
  });

  const doorBottomY = -doorHeight / 2;
  const headerY = doorHeight / 2 + headerHeight / 2;
  const centerLocalY = 0.32 - door.position[1] + doorHeight / 2;

  return (
    <group ref={groupRef} position={door.position} rotation={door.rotation ?? [0, 0, 0]}>
      <group position={[0, centerLocalY, 0]}>
      {/* Wall jambs */}
      <mesh position={[-openingWidth / 2 - frameBorder / 2, 0, 0]}>
        <boxGeometry args={[frameBorder, doorHeight + headerHeight + sillHeight, 0.14]} />
        <meshStandardMaterial color="#141820" roughness={0.28} metalness={0.82} />
      </mesh>
      <mesh position={[openingWidth / 2 + frameBorder / 2, 0, 0]}>
        <boxGeometry args={[frameBorder, doorHeight + headerHeight + sillHeight, 0.14]} />
        <meshStandardMaterial color="#141820" roughness={0.28} metalness={0.82} />
      </mesh>

      {/* Header lintel */}
      <mesh position={[0, headerY, 0]}>
        <boxGeometry args={[openingWidth + frameBorder * 2, headerHeight, 0.14]} />
        <meshStandardMaterial color="#10141c" roughness={0.32} metalness={0.78} />
      </mesh>
      <mesh ref={headerLedRef} position={[0, headerY - headerHeight * 0.18, 0.075]}>
        <boxGeometry args={[openingWidth * 0.92, 0.028, 0.018]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.22}
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>

      {/* Threshold */}
      <mesh ref={thresholdRef} position={[0, doorBottomY - sillHeight / 2, 0.06]}>
        <boxGeometry args={[openingWidth + frameBorder * 1.4, sillHeight, 0.18]} />
        <meshStandardMaterial
          color="#1c2430"
          emissive={accent}
          emissiveIntensity={0.08}
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Side sensors */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (openingWidth / 2 + 0.11), 0.1, 0.09]}>
          <boxGeometry args={[0.06, 0.22, 0.04]} />
          <meshStandardMaterial
            color="#0a0e14"
            emissive={accent}
            emissiveIntensity={isOpen ? 0.45 : 0.12}
            roughness={0.5}
            metalness={0.55}
          />
        </mesh>
      ))}

      {/* Sliding panels */}
      <group ref={leftPanelRef} position={[-panelWidth / 2, 0, 0]}>
        <mesh>
          <boxGeometry args={[panelWidth, doorHeight, 0.05]} />
          <meshStandardMaterial
            color="#1a2230"
            roughness={0.18}
            metalness={0.72}
            transparent
            opacity={0.94}
          />
        </mesh>
        <mesh position={[0, 0, 0.028]}>
          <boxGeometry args={[panelWidth * 0.88, doorHeight * 0.9, 0.008]} />
          <meshStandardMaterial
            color="#8eb4d8"
            roughness={0.05}
            metalness={0.1}
            transparent
            opacity={0.22}
          />
        </mesh>
        <mesh position={[panelWidth * 0.34, 0, 0.055]}>
          <boxGeometry args={[0.04, doorHeight * 0.55, 0.02]} />
          <meshStandardMaterial color="#2a3444" roughness={0.35} metalness={0.65} />
        </mesh>
      </group>

      <group ref={rightPanelRef} position={[panelWidth / 2, 0, 0]}>
        <mesh>
          <boxGeometry args={[panelWidth, doorHeight, 0.05]} />
          <meshStandardMaterial
            color="#1a2230"
            roughness={0.18}
            metalness={0.72}
            transparent
            opacity={0.94}
          />
        </mesh>
        <mesh position={[0, 0, 0.028]}>
          <boxGeometry args={[panelWidth * 0.88, doorHeight * 0.9, 0.008]} />
          <meshStandardMaterial
            color="#8eb4d8"
            roughness={0.05}
            metalness={0.1}
            transparent
            opacity={0.22}
          />
        </mesh>
        <mesh position={[-panelWidth * 0.34, 0, 0.055]}>
          <boxGeometry args={[0.04, doorHeight * 0.55, 0.02]} />
          <meshStandardMaterial color="#2a3444" roughness={0.35} metalness={0.65} />
        </mesh>
      </group>

      <Text
        position={[0, headerY + headerHeight * 0.08, 0.1]}
        fontSize={0.13}
        color="#f8fafc"
        anchorX="center"
        maxWidth={openingWidth - 0.2}
        outlineWidth={0.004}
        outlineColor="#000000"
      >
        {door.label}
      </Text>
      </group>
    </group>
  );
}
