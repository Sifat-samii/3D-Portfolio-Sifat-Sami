"use client";

import { Suspense } from "react";
import { useTexture } from "@react-three/drei";
import { scaleWorldZ } from "@/lib/roomLayout";

const z = scaleWorldZ;

/**
 * West (poster) wall — 12 m deep, at x = -22, inner face x ≈ -21.91
 *   Wall spans z: -5.91 (north) → 5.91 (south)
 *   Wall height: y 0.10 → 4.10
 *
 * Posters face EAST (+X) → group rotation [0, Math.PI/2, 0]
 *   PlaneGeometry width (local X) maps to world -Z after rotation
 *   PlaneGeometry height (local Y) stays world +Y
 *   Frame depth  (local Z) maps to world +X (protrudes into room) ✓
 *
 * Layout: split 6 + 6 clusters flush to both wall edges.
 *
 *   Left cluster (south edge): z = 5.26, 3.96, 2.66
 *   Right cluster (north edge): z = -2.66, -3.96, -5.26
 *
 * Poster size : 1.10 m wide (in z) × 1.60 m tall
 * Column gap  : 0.20 m
 * Row gap     : 0.30 m
 * Row centres : y = 1.15 (bottom / eye level)  |  y = 3.05 (top)
 *
 * Poster surface world x = -21.82 (0.09 m in front of inner wall face).
 * Frame sits 18 mm behind poster (local z = -0.018 → world -x).
 */

const POSTER_W   = 1.1;   // world Z span after Y-rotation
const POSTER_H   = 1.6;   // world Y span (unchanged)
const FRAME_BORDER = 0.055;
const WALL_X     = -21.82; // world x of poster surface

// Left/south edge columns — southernmost poster ~0.10 m inside south wall
const LEFT_COLS = [5.26, 3.96, 2.66].map(z) as [number, number, number];
// Right/north edge columns — northernmost poster ~0.10 m inside north wall
const RIGHT_COLS = [-2.66, -3.96, -5.26].map(z) as [number, number, number];

// Row y-centres (bottom → top)
const ROW_Y = [1.15, 3.05] as const;

/**
 * Left 6 posters stay on the left edge.
 * Right 6 posters are pushed to the right edge.
 */
const POSTERS: Array<{ src: string; colZ: number; row: 0 | 1 }> = [
  // ── Left cluster — bottom row ──────────────────────────────────────────
  { src: "/posters/pink-floyd.png",    colZ: LEFT_COLS[0], row: 0 },
  { src: "/posters/pantera.png",       colZ: LEFT_COLS[1], row: 0 },
  { src: "/posters/slayer.png",        colZ: LEFT_COLS[2], row: 0 },

  // ── Left cluster — top row ─────────────────────────────────────────────
  { src: "/posters/black-sabbath.png", colZ: LEFT_COLS[0], row: 1 },
  { src: "/posters/motorhead.png",     colZ: LEFT_COLS[1], row: 1 },
  { src: "/posters/death.png",         colZ: LEFT_COLS[2], row: 1 },

  // ── Right cluster — bottom row (moved to right edge) ──────────────────
  { src: "/posters/metallica-rtl.png",  colZ: RIGHT_COLS[0], row: 0 },
  { src: "/posters/megadeth.png",       colZ: RIGHT_COLS[1], row: 0 },
  { src: "/posters/metallica-ajfa.png", colZ: RIGHT_COLS[2], row: 0 },

  // ── Right cluster — top row (moved to right edge) ─────────────────────
  { src: "/posters/children-of-bodom.png", colZ: RIGHT_COLS[0], row: 1 },
  { src: "/posters/porcupine-tree.png",    colZ: RIGHT_COLS[1], row: 1 },
  { src: "/posters/opeth.png",             colZ: RIGHT_COLS[2], row: 1 },
];

const POSTER_SRCS: string[] = POSTERS.map((p) => p.src);

// ── Inner component (suspends until all 12 textures are ready) ────────────────

function PosterWallInner() {
  const textures = useTexture(POSTER_SRCS);

  return (
    <group>
      {POSTERS.map((poster, i) => {
        const y = ROW_Y[poster.row];
        const z = poster.colZ;

        return (
          /**
           * Group positioned on the west wall, rotated to face east (+X).
           * After rotation [0, π/2, 0]:
           *   local +X  → world -Z  (poster width spans z-axis)
           *   local +Y  → world +Y  (poster height spans y-axis)
           *   local +Z  → world +X  (depth protrudes into room)
           */
          <group
            key={poster.src}
            position={[WALL_X, y, z]}
            rotation={[0, Math.PI / 2, 0]}
          >
            {/* Thin dark metal frame — offset 18 mm "into" the wall */}
            <mesh position={[0, 0, -0.018]}>
              <boxGeometry
                args={[
                  POSTER_W + FRAME_BORDER * 2,
                  POSTER_H + FRAME_BORDER * 2,
                  0.022,
                ]}
              />
              <meshStandardMaterial
                color="#0c0c0c"
                metalness={0.40}
                roughness={0.60}
              />
            </mesh>

            {/* Poster plane — normal faces local +Z → world +X (east / into room) */}
            <mesh>
              <planeGeometry args={[POSTER_W, POSTER_H]} />
              <meshStandardMaterial
                map={textures[i]}
                roughness={0.85}
                metalness={0.0}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

export function MusicPosterWall() {
  return (
    <Suspense fallback={null}>
      <PosterWallInner />
    </Suspense>
  );
}
