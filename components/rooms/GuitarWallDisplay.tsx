"use client";

import { WallMountedGuitar, type GuitarFinish, type GuitarShape } from "@/components/rooms/WallMountedGuitar";

/**
 * East (door) wall guitar gallery — room interior x ∈ [-22, -7].
 * Inner wall face ≈ -7.09; guitars protrude westward (more negative x).
 * Door gap: z -3.2 → -0.8 (skipped).
 */

const WX = -7.09;
const FACE_X = WX - 0.13;

type WallGuitar = {
  shape: GuitarShape;
  finish: GuitarFinish;
  z: number;
  scale?: number;
};

/** Seven guitars spaced across both wall segments (above & below door). */
const WALL_GUITARS: WallGuitar[] = [
  // Upper segment (north of door)
  {
    shape: "rg",
    z: -5.5,
    finish: {
      body: "#3a2414",
      neck: "#241407",
      fretboard: "#1c1009",
    },
  },
  {
    shape: "rhoads",
    z: -4.0,
    scale: 2.05,
    finish: {
      body: "#f0ece4",
      bodyAccent: "#141210",
      neck: "#141210",
      fretboard: "#1c1009",
      inlay: "#141210",
    },
  },
  // Lower segment (south of door)
  {
    shape: "deanMl",
    z: 0.0,
    scale: 2.05,
    finish: {
      body: "#8a9098",
      bodyAccent: "#c41e1e",
      neck: "#2a2a2a",
      fretboard: "#1c1009",
      inlay: "#c0c0c0",
    },
  },
  {
    shape: "rg",
    z: 1.3,
    finish: {
      body: "#141210",
      neck: "#0a0a0a",
      fretboard: "#1c1009",
      inlay: "#c0c0c0",
    },
  },
  {
    shape: "rhoads",
    z: 2.6,
    scale: 2.05,
    finish: {
      body: "#141210",
      neck: "#0a0a0a",
      fretboard: "#1c1009",
      inlay: "#c41e1e",
    },
  },
  {
    shape: "deanMl",
    z: 3.9,
    scale: 2.05,
    finish: {
      body: "#141210",
      bodyAccent: "#c41e1e",
      neck: "#1a1a1a",
      fretboard: "#1c1009",
      inlay: "#c41e1e",
    },
  },
  {
    shape: "rg",
    z: 5.2,
    finish: {
      body: "#6b1a1a",
      neck: "#241407",
      fretboard: "#1c1009",
      inlay: "#ffd060",
    },
  },
];

export function GuitarWallDisplay() {
  return (
    <group>
      {/* Ceiling track along the full east wall */}
      <mesh position={[WX - 0.06, 3.88, -0.5]}>
        <boxGeometry args={[0.06, 0.05, 11.4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.75}
          roughness={0.35}
          emissive="#3a2a10"
          emissiveIntensity={0.15}
        />
      </mesh>

      {WALL_GUITARS.map((guitar, i) => (
        <WallMountedGuitar
          key={`wall-guitar-${i}`}
          shape={guitar.shape}
          finish={guitar.finish}
          wallX={WX}
          faceX={FACE_X}
          z={guitar.z}
          scale={guitar.scale ?? 2.0}
        />
      ))}
    </group>
  );
}
