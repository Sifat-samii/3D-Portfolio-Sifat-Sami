"use client";

import { Suspense } from "react";
import { useTexture } from "@react-three/drei";
import { scaleWorldZ } from "@/lib/roomLayout";

/**
 * Executed Souls — Thy Crucifixion poster on the east wood wall,
 * centred above the Mesa/Boogie + ENGL stacks (north segment above the door).
 *
 * East inner face x ≈ -7.09; poster surface sits 90 mm into the room (−X).
 * Plane faces west (−X) → rotation [0, -π/2, 0].
 */

const POSTER_SRC = "/posters/executed-souls-thy-crucifixion.png";

const SCALE = 1.42;
const FLOOR_Y = 0.10;
const CAB_Y = 0.82;
const HEAD_Y = 0.28;

const EAST_STACK_Z = scaleWorldZ(-4.5);
const AMP_STACK_TOP_Y = FLOOR_Y + (CAB_Y + HEAD_Y) * SCALE;

/** Same footprint as the north-wall band posters (GOODAMN / KARMAN). */
const POSTER_W = 1.85;
const POSTER_H = 1.85;
const FRAME_BORDER = 0.06;
const AMP_CLEARANCE = 0.18;

const WALL_X = -7.09 - 0.09;
const POSTER_Y = AMP_STACK_TOP_Y + AMP_CLEARANCE + POSTER_H / 2;

function ExecutedSoulsPosterInner() {
  const texture = useTexture(POSTER_SRC);

  return (
    <group position={[WALL_X, POSTER_Y, EAST_STACK_Z]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.018]}>
        <boxGeometry args={[POSTER_W + FRAME_BORDER * 2, POSTER_H + FRAME_BORDER * 2, 0.024]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.42} roughness={0.58} />
      </mesh>
      {/* Plane normal faces local +Z → world −X (into the room from the east wall) */}
      <mesh>
        <planeGeometry args={[POSTER_W, POSTER_H]} />
        <meshStandardMaterial map={texture} roughness={0.82} metalness={0.02} />
      </mesh>
    </group>
  );
}

export function EastWallExecutedSoulsPoster() {
  return (
    <Suspense fallback={null}>
      <ExecutedSoulsPosterInner />
    </Suspense>
  );
}
