"use client";

/**
 * Three-seat sofa facing the media-wall TV (north wall).
 * Centre aligned with TV at x = -14.5; back faces south (+Z), seat faces north (−Z).
 */

import { scaleWorldZ } from "@/lib/roomLayout";

const CX = -14.5;
const CZ = scaleWorldZ(-2.35);
const FLOOR_Y = 0.10;

const LEATHER = "#2a2520";
const LEATHER_DARK = "#1a1612";
const LEATHER_LIGHT = "#3d3530";
const STITCH = "#8a7040";
const LEG = "#141210";

export function TvWatchCouch() {
  return (
    <group position={[CX, FLOOR_Y, CZ]}>
      {/* ── Base frame ───────────────────────────────────────────── */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[2.85, 0.22, 1.05]} />
        <meshStandardMaterial color={LEATHER_DARK} roughness={0.88} metalness={0.04} />
      </mesh>

      {/* Low legs */}
      {[
        [-1.28, -0.42],
        [1.28, -0.42],
        [-1.28, 0.42],
        [1.28, 0.42],
      ].map(([lx, lz], i) => (
        <mesh key={`leg-${i}`} position={[lx, 0.05, lz]}>
          <boxGeometry args={[0.10, 0.10, 0.10]} />
          <meshStandardMaterial color={LEG} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}

      {/* ── Seat cushions (3 sections) ─────────────────────────── */}
      {[-0.88, 0, 0.88].map((ox) => (
        <group key={`seat-${ox}`}>
          <mesh position={[ox, 0.38, -0.06]}>
            <boxGeometry args={[0.82, 0.20, 0.88]} />
            <meshStandardMaterial color={LEATHER} roughness={0.78} metalness={0.06} />
          </mesh>
          {/* Cushion seam */}
          <mesh position={[ox, 0.49, -0.06]}>
            <boxGeometry args={[0.78, 0.012, 0.82]} />
            <meshStandardMaterial color={LEATHER_LIGHT} roughness={0.82} metalness={0.04} />
          </mesh>
          {/* Stitch line */}
          <mesh position={[ox, 0.395, 0.38]}>
            <boxGeometry args={[0.70, 0.006, 0.006]} />
            <meshStandardMaterial color={STITCH} roughness={0.90} metalness={0.10} />
          </mesh>
        </group>
      ))}

      {/* ── Back cushions ────────────────────────────────────────── */}
      {[-0.88, 0, 0.88].map((ox) => (
        <mesh key={`back-${ox}`} position={[ox, 0.72, 0.38]}>
          <boxGeometry args={[0.82, 0.58, 0.22]} />
          <meshStandardMaterial color={LEATHER} roughness={0.80} metalness={0.05} />
        </mesh>
      ))}

      {/* Continuous back rail */}
      <mesh position={[0, 0.58, 0.40]}>
        <boxGeometry args={[2.78, 0.12, 0.18]} />
        <meshStandardMaterial color={LEATHER_DARK} roughness={0.85} metalness={0.04} />
      </mesh>

      {/* ── Armrests ─────────────────────────────────────────────── */}
      {[-1.38, 1.38].map((ox) => (
        <group key={`arm-${ox}`}>
          <mesh position={[ox, 0.52, 0.02]}>
            <boxGeometry args={[0.22, 0.52, 0.95]} />
            <meshStandardMaterial color={LEATHER_DARK} roughness={0.82} metalness={0.05} />
          </mesh>
          <mesh position={[ox, 0.78, 0.02]}>
            <boxGeometry args={[0.24, 0.08, 0.97]} />
            <meshStandardMaterial color={LEATHER} roughness={0.78} metalness={0.06} />
          </mesh>
        </group>
      ))}

      {/* ── Throw pillows ────────────────────────────────────────── */}
      <mesh position={[-0.45, 0.62, 0.22]} rotation={[0.15, 0.25, 0]}>
        <boxGeometry args={[0.32, 0.32, 0.14]} />
        <meshStandardMaterial color="#4a3020" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh position={[0.55, 0.64, 0.18]} rotation={[0.12, -0.2, 0.05]}>
        <boxGeometry args={[0.30, 0.30, 0.13]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.90} metalness={0.03} />
      </mesh>

      {/* ── Coffee table (viewing distance accent) ───────────────── */}
      <mesh position={[0, 0.22, -0.95]}>
        <boxGeometry args={[1.10, 0.04, 0.55]} />
        <meshStandardMaterial color="#241a10" roughness={0.55} metalness={0.12} />
      </mesh>
      {[[-0.48, -0.22], [0.48, -0.22], [-0.48, 0.22], [0.48, 0.22]].map(([tx, tz], i) => (
        <mesh key={`tleg-${i}`} position={[tx, 0.10, -0.95 + tz]}>
          <cylinderGeometry args={[0.025, 0.025, 0.20, 8]} />
          <meshStandardMaterial color={LEG} metalness={0.60} roughness={0.32} />
        </mesh>
      ))}
      <mesh position={[0.15, 0.26, -0.95]}>
        <cylinderGeometry args={[0.045, 0.042, 0.08, 12]} />
        <meshStandardMaterial color="#1c1917" roughness={0.70} metalness={0.08} />
      </mesh>

      {/* Soft fill light toward the TV — lounge ambience */}
      <pointLight position={[0, 1.2, -0.5]} color="#ffe8c0" intensity={0.35} distance={4} decay={2} />
    </group>
  );
}
