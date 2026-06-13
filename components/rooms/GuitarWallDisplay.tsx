"use client";

import { WallMountedGuitar, type GuitarFinish, type GuitarShape } from "@/components/rooms/WallMountedGuitar";
import { WALL_GUITAR_SCALE, WALL_GUITAR_SCALE_LARGE } from "@/lib/guitarDisplayScale";
import { DEPTH_SCALE, scaleWorldZ } from "@/lib/roomLayout";

const z = scaleWorldZ;

/**
 * East (door) wall guitar gallery — room interior x ∈ [-22, -7].
 * Inner wall face ≈ -7.09; guitars protrude westward (more negative x).
 * Door gap: layout z -3.2 → -0.8 (skipped; world coords scaled).
 */

const WX = -7.09;
const FACE_X = WX - 0.13;

/** South wall segment — first guitar just below the door. */
const WALL_GUITAR_COUNT = 6;
const WALL_Z_DOOR = 0.35;
/** Layout Z of the south wall inner edge. */
const WALL_SOUTH_EDGE = 6.2;
/** Wide clearance before the south wall edge (after the last guitar). */
const EDGE_GAP = 1.05;
/** Equal centre-to-centre spacing between adjacent guitars. */
const GUITAR_GAP =
  (WALL_SOUTH_EDGE - EDGE_GAP - WALL_Z_DOOR) / (WALL_GUITAR_COUNT - 1);

function wallZ(index: number): number {
  return WALL_Z_DOOR + index * GUITAR_GAP;
}

type WallGuitar = {
  shape: GuitarShape;
  finish: GuitarFinish;
  scale?: number;
};

/** Six guitars evenly spaced door → south edge (Iron Label removed; Flying V added). */
const WALL_GUITAR_SPECS: WallGuitar[] = [
  {
    shape: "deanMl",
    scale: WALL_GUITAR_SCALE_LARGE,
    finish: {
      body: "#8a9098",
      bodyAccent: "#141210",
      neck: "#2a2a2a",
      fretboard: "#1c1009",
      inlay: "#c0c0c0",
    },
  },
  {
    shape: "flyingV",
    scale: WALL_GUITAR_SCALE_LARGE,
    finish: {
      body: "#8a5a28",
      neck: "#3a2410",
      fretboard: "#1c1009",
      inlay: "#d4c8b4",
    },
  },
  {
    shape: "rhoads",
    scale: WALL_GUITAR_SCALE_LARGE,
    finish: {
      body: "#f0ece4",
      neck: "#0a0a0a",
      fretboard: "#1c1009",
      inlay: "#141210",
    },
  },
  {
    shape: "deanMl",
    scale: WALL_GUITAR_SCALE,
    finish: {
      body: "#141210",
      bodyAccent: "#141210",
      neck: "#1a1a1a",
      fretboard: "#1c1009",
      inlay: "#141210",
    },
  },
  {
    shape: "flyingV",
    scale: WALL_GUITAR_SCALE,
    finish: {
      body: "#2a2218",
      neck: "#1c140c",
      fretboard: "#0e0804",
      inlay: "#c0c0c0",
    },
  },
  {
    shape: "rhoads",
    scale: WALL_GUITAR_SCALE_LARGE,
    finish: {
      body: "#141210",
      neck: "#0a0a0a",
      fretboard: "#1c1009",
      inlay: "#141210",
    },
  },
];

const WALL_GUITARS = WALL_GUITAR_SPECS.map((spec, i) => ({
  ...spec,
  z: wallZ(i),
}));

export function GuitarWallDisplay() {
  const trackCenterZ = (WALL_Z_DOOR + WALL_SOUTH_EDGE) / 2;
  const trackDepth = (WALL_SOUTH_EDGE - WALL_Z_DOOR + 0.4) * DEPTH_SCALE;

  return (
    <group>
      {/* Ceiling track along the south east-wall segment */}
      <mesh position={[WX - 0.06, 3.88, z(trackCenterZ)]}>
        <boxGeometry args={[0.06, 0.05, trackDepth]} />
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
          z={z(guitar.z)}
          scale={guitar.scale ?? WALL_GUITAR_SCALE}
        />
      ))}
    </group>
  );
}
