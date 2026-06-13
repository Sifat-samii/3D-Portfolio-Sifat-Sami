"use client";

import { Text } from "@react-three/drei";
import type { ReactNode } from "react";

export type AmpFacing = "east" | "north" | "studio";

export type AmpFrontLayout = {
  cabFrontX: number;
  headFrontX: number;
  cabY: number;
  headY: number;
  cabW: number;
  cabH: number;
  headW: number;
  headH: number;
  scale: number;
  facing?: AmpFacing;
  showAccentLight?: boolean;
};

/** −X wall stacks: mesh sits inside the face plane. */
export function slabX(frontX: number, depth: number) {
  return frontX - depth / 2;
}

/** Mesh centre on the front face for a given facing. */
export function frontSlabPosition(frontX: number, depth: number, facing: AmpFacing = "north") {
  return facing === "studio" ? frontX + depth / 2 : slabX(frontX, depth);
}

function frontTextX(frontX: number, facing: AmpFacing) {
  return facing === "studio" ? frontX + 0.028 : frontX - 0.03;
}

function frontTextYaw(facing: AmpFacing) {
  return facing === "studio" ? -Math.PI / 2 : Math.PI / 2;
}

function frontWeaveOffset(facing: AmpFacing) {
  return facing === "studio" ? 0.001 : -0.001;
}

/** Readable labels on the amp front plane. */
export function FrontText({
  frontX,
  y,
  z,
  size,
  color,
  facing = "north",
  children,
}: {
  frontX: number;
  y: number;
  z: number;
  size: number;
  color: string;
  facing?: AmpFacing;
  children: ReactNode;
}) {
  const scale = facing === "north" ? ([-1, 1, 1] as const) : ([1, 1, 1] as const);

  return (
    <Text
      position={[frontTextX(frontX, facing), y, z]}
      rotation={[0, frontTextYaw(facing), 0]}
      scale={scale}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      letterSpacing={-0.01}
      outlineWidth={0.003}
      outlineColor="#0a0a0a"
    >
      {children}
    </Text>
  );
}

export function FrontSlab({
  frontX,
  y,
  z = 0,
  w,
  h,
  depth = 0.02,
  color,
  emissive,
  emissiveIntensity = 0.2,
  facing = "north",
  roughness = 0.82,
  metalness = 0.06,
}: {
  frontX: number;
  y: number;
  z?: number;
  w: number;
  h: number;
  depth?: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  facing?: AmpFacing;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <mesh position={[frontSlabPosition(frontX, depth, facing), y, z]}>
      <boxGeometry args={[depth, h, w]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

export function GrilleCloth({
  frontX,
  y,
  z = 0,
  w,
  h,
  color = "#2e2c28",
  weave = "#141312",
  facing = "north",
}: {
  frontX: number;
  y: number;
  z?: number;
  w: number;
  h: number;
  color?: string;
  weave?: string;
  facing?: AmpFacing;
}) {
  const depth = 0.018;
  const cols = 9;
  const rows = Math.max(5, Math.round(h / 0.048));
  const slabPos = frontSlabPosition(frontX, depth, facing);
  const weaveOff = frontWeaveOffset(facing);

  return (
    <group position={[0, y, z]}>
      <FrontSlab
        frontX={frontX}
        y={0}
        w={w}
        h={h}
        depth={depth}
        color={color}
        emissive="#1a1814"
        emissiveIntensity={0.1}
        facing={facing}
      />
      {Array.from({ length: cols }, (_, i) => {
        const oz = -w / 2 + (i + 0.5) * (w / cols);
        return (
          <mesh key={`v-${i}`} position={[slabPos + weaveOff, 0, oz]}>
            <boxGeometry args={[0.003, h * 0.94, 0.003]} />
            <meshStandardMaterial color={weave} roughness={0.9} />
          </mesh>
        );
      })}
      {Array.from({ length: rows }, (_, i) => {
        const oy = -h / 2 + (i + 0.5) * (h / rows);
        return (
          <mesh key={`h-${i}`} position={[slabPos + weaveOff, oy, 0]}>
            <boxGeometry args={[0.003, 0.003, w * 0.94]} />
            <meshStandardMaterial color={weave} roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Rectangular piping lip — shared geometry for Marshall-style frames. */
export function PipingRect({
  frontX,
  y,
  w,
  h,
  color,
  emissive = "#4a443c",
  emissiveIntensity = 0.3,
  facing = "north",
}: {
  frontX: number;
  y: number;
  w: number;
  h: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  facing?: AmpFacing;
}) {
  const lip = 0.011;
  const depth = 0.013;
  const x = frontSlabPosition(frontX, depth, facing);
  const halfW = w / 2;
  const halfH = h / 2;

  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      roughness={0.45}
      metalness={0.12}
    />
  );

  return (
    <group>
      <mesh position={[x, y + halfH, 0]}>
        <boxGeometry args={[depth, lip, w + lip]} />
        {mat}
      </mesh>
      <mesh position={[x, y - halfH, 0]}>
        <boxGeometry args={[depth, lip, w + lip]} />
        {mat}
      </mesh>
      <mesh position={[x, y, -halfW]}>
        <boxGeometry args={[depth, h + lip, lip]} />
        {mat}
      </mesh>
      <mesh position={[x, y, halfW]}>
        <boxGeometry args={[depth, h + lip, lip]} />
        {mat}
      </mesh>
    </group>
  );
}
