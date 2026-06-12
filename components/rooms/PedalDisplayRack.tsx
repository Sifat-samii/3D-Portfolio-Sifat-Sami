"use client";

import { LEFT_POSTER_BOTTOM_Y, LEFT_POSTER_X } from "@/components/rooms/NorthWallBandPosters";
import { scaleWorldZ } from "@/lib/roomLayout";

/**
 * Twin open-front pedal display racks under the left (KARMAN) poster.
 * Shorter height, deeper footprint, pedals canted forward for visibility.
 */

/** Depth baseline from media wall — extended forward for display. */
export const HT_DEPTH = 0.5;
const RACK_D = HT_DEPTH + 0.14;

const FRAME = "#141210";
const MESH = "#1c1a18";
const FLOOR_Y = 0.1;
const POSTER_W = 1.85;
const RACK_GAP = 0.05;
/** Wider than poster — extends ~0.38 m past each poster edge. */
const RACK_SPAN = POSTER_W + 0.76;
const RACK_W = (RACK_SPAN - RACK_GAP) / 2;
const REF_RACK_W = (POSTER_W - RACK_GAP) / 2;
/** Slightly shorter than before — more air under the poster. */
const RACK_H = Math.min(1.42, LEFT_POSTER_BOTTOM_Y - FLOOR_Y - 0.22);
const SHELF_COUNT = 6;
/** Steeper tilt so pedal faces aim into the room. */
const SHELF_TILT = 0.26;
const TUBE = 0.022;
/** Uniform scale bump for all stompboxes. */
const PEDAL_SCALE = 1.32;

const WALL_Z = scaleWorldZ(-5.88);
const RACK_Z = WALL_Z + RACK_D / 2 + 0.02;

type PedalSpec = {
  w: number;
  h: number;
  d: number;
  x: number;
  color: string;
  accent?: string;
  knob?: boolean;
};

function scalePedal(spec: PedalSpec): PedalSpec {
  const xSpread = RACK_W / REF_RACK_W;
  return {
    ...spec,
    w: spec.w * PEDAL_SCALE,
    h: spec.h * PEDAL_SCALE,
    d: spec.d * PEDAL_SCALE,
    x: spec.x * PEDAL_SCALE * xSpread,
  };
}

function OpenDisplayShelf({ y }: { y: number }) {
  const innerW = RACK_W - 0.1;
  const innerD = RACK_D - 0.08;
  const frontZ = innerD / 2 - 0.02;

  return (
    <group position={[0, y, 0]} rotation={[SHELF_TILT, 0, 0]}>
      {/* Cantilever tray — shallow, sits under pedals */}
      <mesh position={[0, -0.005, innerD * 0.08]}>
        <boxGeometry args={[innerW, 0.01, innerD * 0.72]} />
        <meshStandardMaterial color={MESH} roughness={0.86} metalness={0.32} />
      </mesh>
      {/* Low front lip only — does not block pedal faces */}
      <mesh position={[0, 0.008, frontZ]}>
        <boxGeometry args={[innerW, 0.016, 0.01]} />
        <meshStandardMaterial color={FRAME} metalness={0.58} roughness={0.4} />
      </mesh>
      {/* Sparse wire rungs (open mesh) */}
      {Array.from({ length: 5 }, (_, i) => {
        const ox = -innerW / 2 + 0.08 + i * ((innerW - 0.16) / 4);
        return (
          <mesh key={`wg-${i}`} position={[ox, 0.001, innerD * 0.05]}>
            <boxGeometry args={[0.003, 0.003, innerD * 0.55]} />
            <meshStandardMaterial color="#111" metalness={0.45} roughness={0.55} />
          </mesh>
        );
      })}
      {/* Under-shelf accent — helps read pedal silhouettes */}
      <mesh position={[0, -0.018, frontZ - 0.04]}>
        <boxGeometry args={[innerW - 0.06, 0.004, 0.012]} />
        <meshStandardMaterial color="#ffdcb0" emissive="#ffdcb0" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function StompPedal({ spec }: { spec: PedalSpec }) {
  const forwardZ = spec.d * 0.55;

  return (
    <group position={[spec.x, spec.h / 2 + 0.018, forwardZ]}>
      <mesh>
        <boxGeometry args={[spec.w, spec.h, spec.d]} />
        <meshStandardMaterial color={spec.color} roughness={0.48} metalness={0.28} />
      </mesh>
      {/* Beveled top highlight */}
      <mesh position={[0, spec.h / 2 + 0.002, -spec.d * 0.05]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[spec.w * 0.94, 0.003, spec.d * 0.9]} />
        <meshStandardMaterial color="#4a4640" roughness={0.28} metalness={0.42} />
      </mesh>
      {/* Footswitch — visible from room */}
      <mesh position={[0, spec.h / 2 + 0.012, spec.d * 0.22]}>
        <cylinderGeometry args={[spec.w * 0.14, spec.w * 0.14, 0.016, 12]} />
        <meshStandardMaterial color="#d4ccc0" metalness={0.72} roughness={0.22} />
      </mesh>
      {spec.knob !== false ? (
        <>
          <mesh position={[0, spec.h / 2 + 0.014, -spec.d * 0.12]}>
            <cylinderGeometry args={[0.018, 0.018, 0.016, 10]} />
            <meshStandardMaterial color="#c8c0b0" metalness={0.68} roughness={0.26} />
          </mesh>
          {[-0.028, 0.028].map((kz) => (
            <mesh key={kz} position={[-spec.w * 0.22, spec.h / 2 + 0.01, kz]}>
              <cylinderGeometry args={[0.01, 0.01, 0.014, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.42} roughness={0.42} />
            </mesh>
          ))}
        </>
      ) : null}
      {spec.accent ? (
        <mesh position={[spec.w * 0.34, spec.h / 2 + 0.01, spec.d * 0.08]}>
          <boxGeometry args={[0.009, 0.009, 0.009]} />
          <meshStandardMaterial color="#0a0a0a" emissive={spec.accent} emissiveIntensity={2.2} />
        </mesh>
      ) : null}
      <mesh position={[-spec.w / 2 - 0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.012, 6]} />
        <meshStandardMaterial color={FRAME} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function shelfLayouts(rackIndex: 0 | 1): PedalSpec[][] {
  const shift = rackIndex === 0 ? 0 : 0.03;
  const s = (x: number) => x * (rackIndex === 0 ? 1 : 0.94) + (rackIndex === 1 ? shift : 0);

  const raw: PedalSpec[][] = [
    [
      { w: 0.22, h: 0.062, d: 0.2, x: s(-0.17), color: "#2a2a2a", accent: "#22d3ee" },
      { w: 0.22, h: 0.062, d: 0.2, x: s(0.17), color: "#1f1f1f", accent: "#facc15" },
    ],
    [
      { w: 0.1, h: 0.054, d: 0.1, x: s(-0.24), color: "#7c2d12", accent: "#fb923c" },
      { w: 0.1, h: 0.054, d: 0.1, x: s(-0.08), color: "#1e3a8a", accent: "#60a5fa" },
      { w: 0.1, h: 0.054, d: 0.1, x: s(0.08), color: "#14532d", accent: "#4ade80" },
      { w: 0.1, h: 0.054, d: 0.1, x: s(0.24), color: "#450a0a", accent: "#f87171" },
    ],
    [
      { w: 0.12, h: 0.056, d: 0.12, x: s(-0.2), color: "#b45309", accent: "#fcd34d" },
      { w: 0.14, h: 0.06, d: 0.14, x: s(0.02), color: "#3f3f46", knob: false },
      { w: 0.1, h: 0.054, d: 0.1, x: s(0.22), color: "#166534", accent: "#86efac" },
    ],
    [
      { w: 0.17, h: 0.072, d: 0.15, x: s(-0.14), color: "#1c1917", accent: "#ef4444", knob: false },
      { w: 0.1, h: 0.054, d: 0.1, x: s(0.06), color: "#292524", accent: "#f97316" },
      { w: 0.1, h: 0.054, d: 0.1, x: s(0.22), color: "#1e1b4b", accent: "#818cf8" },
    ],
    [
      { w: 0.11, h: 0.056, d: 0.11, x: s(-0.22), color: "#44403c", accent: "#fcd34d" },
      { w: 0.11, h: 0.056, d: 0.11, x: s(-0.06), color: "#0c4a6e", accent: "#7dd3fc" },
      { w: 0.11, h: 0.056, d: 0.11, x: s(0.1), color: "#3f2c1f", accent: "#fdba74" },
      { w: 0.11, h: 0.056, d: 0.11, x: s(0.24), color: "#27272a", accent: "#f472b6" },
    ],
    [
      { w: 0.2, h: 0.064, d: 0.18, x: s(-0.15), color: "#262626", accent: "#fbbf24" },
      { w: 0.2, h: 0.064, d: 0.18, x: s(0.15), color: "#171717", accent: "#22d3ee" },
    ],
  ];

  return raw.map((row) => row.map(scalePedal));
}

function ShelfPedals({ shelfIndex, y, rackIndex }: { shelfIndex: number; y: number; rackIndex: 0 | 1 }) {
  const layouts = shelfLayouts(rackIndex);
  const pedals = layouts[shelfIndex] ?? layouts[1];

  return (
    <group position={[0, y, 0]} rotation={[SHELF_TILT, 0, 0]}>
      {pedals.map((spec, i) => (
        <StompPedal key={`${rackIndex}-${shelfIndex}-${i}`} spec={spec} />
      ))}
    </group>
  );
}

function PedalRackUnit({ rackIndex }: { rackIndex: 0 | 1 }) {
  const shelfYs = Array.from({ length: SHELF_COUNT }, (_, i) => {
    const margin = 0.14;
    const span = RACK_H - margin * 2;
    return margin + (span / (SHELF_COUNT - 1)) * i;
  });

  const halfW = RACK_W / 2;
  const halfD = RACK_D / 2;
  const backZ = -halfD + 0.02;
  const braceHeights = shelfYs.filter((_, i) => i % 2 === 1);

  return (
    <group>
      {/* Plinth — deeper footprint */}
      <mesh position={[0, 0.05, 0.04]}>
        <boxGeometry args={[RACK_W, 0.07, RACK_D]} />
        <meshStandardMaterial color="#1a1612" metalness={0.55} roughness={0.38} />
      </mesh>

      {/* Back panel only — open front */}
      <mesh position={[0, RACK_H / 2 + 0.04, backZ]}>
        <boxGeometry args={[RACK_W - 0.02, RACK_H, 0.01]} />
        <meshStandardMaterial color="#0e0c0a" roughness={0.92} metalness={0.15} />
      </mesh>

      {/* Rear side cheeks — front stays open */}
      {[-halfW + 0.01, halfW - 0.01].map((lx) => (
        <mesh key={`cheek-${lx}`} position={[lx, RACK_H / 2 + 0.04, backZ + RACK_D * 0.22]}>
          <boxGeometry args={[0.012, RACK_H, RACK_D * 0.44]} />
          <meshStandardMaterial color="#12100e" roughness={0.88} metalness={0.2} />
        </mesh>
      ))}

      {/* Corner posts — tall at back, short at front (display frame) */}
      {[
        [-halfW + 0.028, backZ + 0.02, RACK_H],
        [halfW - 0.028, backZ + 0.02, RACK_H],
        [-halfW + 0.028, halfD - 0.04, RACK_H * 0.42],
        [halfW - 0.028, halfD - 0.04, RACK_H * 0.42],
      ].map(([lx, lz, h], i) => (
        <mesh key={`post-${i}`} position={[lx, h / 2 + 0.04, lz]}>
          <boxGeometry args={[TUBE, h, TUBE]} />
          <meshStandardMaterial color={FRAME} metalness={0.64} roughness={0.36} />
        </mesh>
      ))}

      {/* Top rail — set toward back so front pedals stay clear */}
      <mesh position={[0, RACK_H + 0.05, backZ + RACK_D * 0.18]}>
        <boxGeometry args={[RACK_W, TUBE, RACK_D * 0.36]} />
        <meshStandardMaterial color={FRAME} metalness={0.62} roughness={0.38} />
      </mesh>

      {/* Rear cross-braces */}
      {braceHeights.map((by) => (
        <mesh key={`brace-${by}`} position={[0, by, backZ]}>
          <boxGeometry args={[RACK_W - 0.06, 0.01, 0.01]} />
          <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.42} />
        </mesh>
      ))}

      {shelfYs.map((y, i) => (
        <group key={`shelf-${i}`}>
          <OpenDisplayShelf y={y} />
          <ShelfPedals shelfIndex={i} y={y} rackIndex={rackIndex} />
        </group>
      ))}
    </group>
  );
}

export function PedalDisplayRack() {
  const offsetX = RACK_W / 2 + RACK_GAP / 2;

  return (
    <group position={[LEFT_POSTER_X, FLOOR_Y, RACK_Z]}>
      <group position={[-offsetX, 0, 0]}>
        <PedalRackUnit rackIndex={0} />
      </group>
      <group position={[offsetX, 0, 0]}>
        <PedalRackUnit rackIndex={1} />
      </group>
      <pointLight position={[0, RACK_H * 0.55, RACK_D * 0.55]} color="#ffe8c8" intensity={0.72} distance={3.2} decay={2} />
    </group>
  );
}
