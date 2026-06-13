"use client";

import { RoundedBox } from "@react-three/drei";
import { LEFT_POSTER_BOTTOM_Y, LEFT_POSTER_X } from "@/components/rooms/NorthWallBandPosters";
import { scaleWorldZ } from "@/lib/roomLayout";
import * as THREE from "three";

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
const TOP_SHELF_TILT = 0.18;
const TUBE = 0.022;
/** Uniform scale bump for all stompboxes. */
const PEDAL_SCALE = 1.32;

const WALL_Z = scaleWorldZ(-5.88);
const RACK_Z = WALL_Z + RACK_D / 2 + 0.02;

const frameMat = new THREE.MeshStandardMaterial({
  color: FRAME,
  metalness: 0.64,
  roughness: 0.36,
});

const meshMat = new THREE.MeshStandardMaterial({
  color: MESH,
  roughness: 0.84,
  metalness: 0.34,
});

const plinthMat = new THREE.MeshStandardMaterial({
  color: "#1a1612",
  metalness: 0.58,
  roughness: 0.36,
});

const backMat = new THREE.MeshStandardMaterial({
  color: "#0e0c0a",
  roughness: 0.9,
  metalness: 0.14,
});

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
      <RoundedBox
        args={[innerW, 0.01, innerD * 0.72]}
        radius={0.003}
        smoothness={6}
        position={[0, -0.005, innerD * 0.08]}
        material={meshMat}
      />
      <RoundedBox
        args={[innerW, 0.014, 0.01]}
        radius={0.003}
        smoothness={6}
        position={[0, 0.008, frontZ]}
        material={frameMat}
      />
      {Array.from({ length: 5 }, (_, i) => {
        const ox = -innerW / 2 + 0.08 + i * ((innerW - 0.16) / 4);
        return (
          <mesh key={`wg-${i}`} position={[ox, 0.001, innerD * 0.05]}>
            <boxGeometry args={[0.003, 0.003, innerD * 0.55]} />
            <meshStandardMaterial color="#111" metalness={0.48} roughness={0.52} />
          </mesh>
        );
      })}
    </group>
  );
}

function StompPedal({ spec }: { spec: PedalSpec }) {
  const forwardZ = spec.d * 0.55;

  return (
    <group position={[spec.x, spec.h / 2 + 0.018, forwardZ]}>
      <RoundedBox
        args={[spec.w, spec.h, spec.d]}
        radius={0.012}
        smoothness={8}
        castShadow
      >
        <meshStandardMaterial color={spec.color} roughness={0.44} metalness={0.3} />
      </RoundedBox>
      <mesh position={[0, spec.h / 2 + 0.002, -spec.d * 0.05]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[spec.w * 0.92, 0.003, spec.d * 0.88]} />
        <meshStandardMaterial color="#4a4640" roughness={0.26} metalness={0.44} />
      </mesh>
      <mesh position={[0, spec.h / 2 + 0.012, spec.d * 0.22]}>
        <cylinderGeometry args={[spec.w * 0.14, spec.w * 0.14, 0.016, 16]} />
        <meshStandardMaterial color="#d4ccc0" metalness={0.74} roughness={0.2} />
      </mesh>
      {spec.knob !== false ? (
        <>
          <mesh position={[0, spec.h / 2 + 0.014, -spec.d * 0.12]}>
            <cylinderGeometry args={[0.018, 0.018, 0.016, 12]} />
            <meshStandardMaterial color="#c8c0b0" metalness={0.7} roughness={0.24} />
          </mesh>
          {[-0.028, 0.028].map((kz) => (
            <mesh key={kz} position={[-spec.w * 0.22, spec.h / 2 + 0.01, kz]}>
              <cylinderGeometry args={[0.01, 0.01, 0.014, 10]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.44} roughness={0.4} />
            </mesh>
          ))}
        </>
      ) : null}
      {spec.accent ? (
        <mesh position={[spec.w * 0.34, spec.h / 2 + 0.01, spec.d * 0.08]}>
          <boxGeometry args={[0.009, 0.009, 0.009]} />
          <meshStandardMaterial color="#0a0a0a" emissive={spec.accent} emissiveIntensity={1.6} />
        </mesh>
      ) : null}
      <mesh position={[-spec.w / 2 - 0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.012, 8]} />
        <meshStandardMaterial color={FRAME} metalness={0.72} roughness={0.28} />
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

function topShelfLayouts(rackIndex: 0 | 1): PedalSpec[] {
  const shift = rackIndex === 0 ? 0 : 0.02;
  const s = (x: number) => x * (rackIndex === 0 ? 1 : 0.94) + (rackIndex === 1 ? shift : 0);

  const raw: PedalSpec[] =
    rackIndex === 0
      ? [
          { w: 0.18, h: 0.06, d: 0.16, x: s(-0.14), color: "#2a2a2a", accent: "#22d3ee" },
          { w: 0.11, h: 0.054, d: 0.11, x: s(0.04), color: "#7c2d12", accent: "#fb923c" },
          { w: 0.11, h: 0.054, d: 0.11, x: s(0.2), color: "#1e3a8a", accent: "#60a5fa" },
        ]
      : [
          { w: 0.14, h: 0.058, d: 0.13, x: s(-0.13), color: "#b45309", accent: "#fcd34d" },
          { w: 0.2, h: 0.064, d: 0.18, x: s(0.02), color: "#262626", accent: "#fbbf24" },
          { w: 0.1, h: 0.054, d: 0.1, x: s(0.2), color: "#450a0a", accent: "#f87171" },
        ];

  return raw.map(scalePedal);
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

function TopShelfPedals({ rackIndex }: { rackIndex: 0 | 1 }) {
  const pedals = topShelfLayouts(rackIndex);
  const halfD = RACK_D / 2;

  return (
    <group position={[0, RACK_H + 0.075, halfD * 0.12]} rotation={[TOP_SHELF_TILT, 0, 0]}>
      <RoundedBox
        args={[RACK_W - 0.08, 0.012, RACK_D * 0.52]}
        radius={0.004}
        smoothness={8}
        position={[0, 0, 0]}
        material={meshMat}
      />
      <RoundedBox
        args={[RACK_W - 0.08, 0.014, 0.01]}
        radius={0.003}
        smoothness={6}
        position={[0, 0.008, RACK_D * 0.24]}
        material={frameMat}
      />
      {pedals.map((spec, i) => (
        <StompPedal key={`top-${rackIndex}-${i}`} spec={spec} />
      ))}
    </group>
  );
}

function RackPost({
  lx,
  lz,
  h,
}: {
  lx: number;
  lz: number;
  h: number;
}) {
  return (
    <mesh position={[lx, h / 2 + 0.04, lz]} material={frameMat} castShadow>
      <cylinderGeometry args={[TUBE, TUBE, h, 12]} />
    </mesh>
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
      <RoundedBox
        args={[RACK_W, 0.07, RACK_D]}
        radius={0.018}
        smoothness={8}
        position={[0, 0.05, 0.04]}
        material={plinthMat}
        castShadow
      />

      <mesh position={[0, RACK_H / 2 + 0.04, backZ]} material={backMat}>
        <boxGeometry args={[RACK_W - 0.02, RACK_H, 0.01]} />
      </mesh>

      {[-halfW + 0.01, halfW - 0.01].map((lx) => (
        <mesh key={`cheek-${lx}`} position={[lx, RACK_H / 2 + 0.04, backZ + RACK_D * 0.22]}>
          <boxGeometry args={[0.012, RACK_H, RACK_D * 0.44]} />
          <meshStandardMaterial color="#12100e" roughness={0.86} metalness={0.22} />
        </mesh>
      ))}

      <RackPost lx={-halfW + 0.028} lz={backZ + 0.02} h={RACK_H} />
      <RackPost lx={halfW - 0.028} lz={backZ + 0.02} h={RACK_H} />
      <RackPost lx={-halfW + 0.028} lz={halfD - 0.04} h={RACK_H * 0.42} />
      <RackPost lx={halfW - 0.028} lz={halfD - 0.04} h={RACK_H * 0.42} />

      <mesh position={[0, RACK_H + 0.05, backZ + RACK_D * 0.18]} material={frameMat}>
        <boxGeometry args={[RACK_W, TUBE, RACK_D * 0.36]} />
      </mesh>
      <mesh position={[0, RACK_H + 0.05, halfD - 0.05]} material={frameMat}>
        <boxGeometry args={[RACK_W - 0.04, TUBE, TUBE]} />
      </mesh>

      {braceHeights.map((by) => (
        <mesh key={`brace-${by}`} position={[0, by, backZ]} material={frameMat}>
          <boxGeometry args={[RACK_W - 0.06, 0.01, 0.01]} />
        </mesh>
      ))}

      {shelfYs.map((y, i) => (
        <group key={`shelf-${i}`}>
          <OpenDisplayShelf y={y} />
          <ShelfPedals shelfIndex={i} y={y} rackIndex={rackIndex} />
        </group>
      ))}

      <TopShelfPedals rackIndex={rackIndex} />
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
    </group>
  );
}
