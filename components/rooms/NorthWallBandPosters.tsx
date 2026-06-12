"use client";

import { Suspense } from "react";
import { useTexture } from "@react-three/drei";

/**
 * Band posters on the north (wood) wall — flanking the LED TV.
 * Same wall plane as MediaWall (group z+1.0 → inner face ≈ -5.88).
 */

const CX = -14.5;
const TV_W = 4.40;
const TV_CY = 2.30;
const WZ = -6.88;
const GROUP_Z = 1.0;
const WALL_Z = WZ + GROUP_Z + 0.09; // just in front of screen plane

const POSTER_W = 1.85;
const POSTER_H = 1.85;
const FRAME_BORDER = 0.06;
const HALF_POSTER = POSTER_W / 2;

const TV_LEFT = CX - TV_W / 2;
const TV_RIGHT = CX + TV_W / 2;
/** Symmetric bezel gap — prior avg ~2.30 m, reduced 30% → 1.61 m each side. */
const TV_GAP = 2.3 * 0.7;

const LEFT_X = TV_LEFT - TV_GAP - HALF_POSTER;
const RIGHT_X = TV_RIGHT + TV_GAP + HALF_POSTER;
const POSTER_Y = TV_CY + 1.0;

const POSTERS = [
  { src: "/posters/goodamn-no-justice.png", x: LEFT_X },
  { src: "/posters/karman-riot-in-uniform.png", x: RIGHT_X },
] as const;

function BandPosterInner() {
  const textures = useTexture(POSTERS.map((p) => p.src));

  return (
    <group position={[0, 0, GROUP_Z]}>
      {POSTERS.map((poster, i) => (
        <group key={poster.src} position={[poster.x, POSTER_Y, WALL_Z]}>
          <mesh position={[0, 0, -0.018]}>
            <boxGeometry args={[POSTER_W + FRAME_BORDER * 2, POSTER_H + FRAME_BORDER * 2, 0.024]} />
            <meshStandardMaterial color="#0c0c0c" metalness={0.42} roughness={0.58} />
          </mesh>
          <mesh>
            <planeGeometry args={[POSTER_W, POSTER_H]} />
            <meshStandardMaterial map={textures[i]} roughness={0.82} metalness={0.02} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function NorthWallBandPosters() {
  return (
    <Suspense fallback={null}>
      <BandPosterInner />
    </Suspense>
  );
}
