"use client";

import { Suspense } from "react";
import { useTexture } from "@react-three/drei";
import { scaleWorldZ } from "@/lib/roomLayout";

/**
 * Band posters on the north (wood) wall — flanking the LED TV.
 * Same wall plane as MediaWall (group tracks scaled north wall).
 */

const CX = -14.5;
const TV_W = 4.40;
const TV_CY = 2.30;
/** MediaWall local Z — inner face of the north wood wall (group offsets to world space). */
const WZ = -6.88;
const GROUP_Z = scaleWorldZ(-5.88) - WZ;
/** Flush on the wood wall plane — group-local Z only (do not add GROUP_Z again). */
const WALL_Z = WZ + 0.09;

const POSTER_W = 1.85;
const POSTER_H = 1.85;
const FRAME_BORDER = 0.06;
const HALF_POSTER = POSTER_W / 2;

const TV_LEFT = CX - TV_W / 2;
const TV_RIGHT = CX + TV_W / 2;
/** Symmetric bezel gap — base 1.61 m each side, +20%, then +15% → ~2.22 m. */
export const TV_POSTER_GAP = 2.3 * 0.7 * 1.2 * 1.15;
const TV_GAP = TV_POSTER_GAP;

export const LEFT_POSTER_X = TV_LEFT - TV_GAP - HALF_POSTER;
export const RIGHT_POSTER_X = TV_RIGHT + TV_GAP + HALF_POSTER;
/** Upper wall zone — centred above the TV, still on the wood cladding. */
export const LEFT_POSTER_Y = TV_CY + 0.55;
export const LEFT_POSTER_BOTTOM_Y = LEFT_POSTER_Y - HALF_POSTER;

const POSTERS = [
  { src: "/posters/karman-riot-in-uniform.png", x: LEFT_POSTER_X },
  { src: "/posters/goodamn-no-justice.png", x: RIGHT_POSTER_X },
] as const;

function BandPosterInner() {
  const textures = useTexture(POSTERS.map((p) => p.src));

  return (
    <group position={[0, 0, GROUP_Z]}>
      {POSTERS.map((poster, i) => (
        <group key={poster.src} position={[poster.x, LEFT_POSTER_Y, WALL_Z]}>
          <mesh position={[0, 0, -0.018]}>
            <boxGeometry args={[POSTER_W + FRAME_BORDER * 2, POSTER_H + FRAME_BORDER * 2, 0.024]} />
            <meshStandardMaterial color="#0c0c0c" metalness={0.42} roughness={0.58} />
          </mesh>
          {/* Plane faces +Z → into the room from the north wood wall */}
          <mesh position={[0, 0, 0.006]} rotation={[0, 0, 0]}>
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
