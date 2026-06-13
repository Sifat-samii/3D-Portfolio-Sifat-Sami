"use client";

/**
 * Studio drum kit — realistic 5-piece setup with refined shells, cymbals,
 * hardware, hi-hat clutch, wind chimes, and corner-stage placement.
 *
 * Local space: origin = kick drum centre on the platform.
 *   Player sits south (+Z); kit faces north (−Z).
 */

import {
  DrumStagePlatform,
  drumKitStagePosition,
} from "@/components/rooms/DrumStagePlatform";
import { DrumStageMonitoring } from "@/components/rooms/DrumStageMonitoring";
import * as THREE from "three";

const S = 1.5;
const EAST_WALL_X = -7.09;
const SOUTH_WALL_WORLD_Z = 6.0;
const DRUM_YAW = (40 * Math.PI) / 180;
/** Nudge kit toward the south wall (+Z). */
const KIT_SOUTH_BIAS = 0.48;
const _baseKitPos = drumKitStagePosition(EAST_WALL_X, SOUTH_WALL_WORLD_Z);
const KIT_POS: [number, number, number] = [
  _baseKitPos[0],
  _baseKitPos[1],
  _baseKitPos[2] + KIT_SOUTH_BIAS,
];

// ── Palette & shared PBR materials ───────────────────────────────────────────
/** Neutral slate-grey lacquer — visible under warm room lights. */
const GREY_EDGE = "#4a4f55";
const GREY_MID = "#6d7379";
const GREY_HI = "#92989f";
const GREY_CLEAR = "#a8aeb4";

const HOOP = "#1c1c20";
const LUG = "#242428";
const HEAD_TOP = "#e8e4dc";
const HEAD_RESO = "#ddd8ce";
const HEAD_RING = "#c8c2b8";
const KICK_RESO = "#1a1816";
const HW = "#2a2826";
const HW_DARK = "#161412";
const CHROME = "#c4c0b8";
const CHROME_HI = "#e0dcd4";
const OVERHEAD_H = 0.82;
/** Warm polished gold — tuned for spotlight-only music room (no env map). */
const GOLD = "#d4a830";
const GOLD_BRIGHT = "#d8b848";
const GOLD_EMISSIVE = "#886818";
const GOLD_BELL = "#e0c050";
const FELT = "#3a3228";
const CHIME_TUBE = "#b4aca0";
const CHIME_BAR = "#1a1714";
const CHINA_GOLD = "#c8a030";
const CHINA_BRIGHT = "#d4b040";
const RUBBER = "#171513";
const VINYL = "#222018";

const greyShellEdgeMat = new THREE.MeshPhysicalMaterial({
  color: GREY_EDGE,
  roughness: 0.22,
  metalness: 0.14,
  clearcoat: 0.92,
  clearcoatRoughness: 0.08,
});
const greyShellMidMat = new THREE.MeshPhysicalMaterial({
  color: GREY_MID,
  roughness: 0.18,
  metalness: 0.12,
  clearcoat: 0.94,
  clearcoatRoughness: 0.06,
});
const greyShellHiMat = new THREE.MeshPhysicalMaterial({
  color: GREY_HI,
  roughness: 0.16,
  metalness: 0.10,
  clearcoat: 0.96,
  clearcoatRoughness: 0.05,
});
const hoopMat = new THREE.MeshPhysicalMaterial({
  color: HOOP,
  roughness: 0.18,
  metalness: 0.88,
  clearcoat: 0.4,
  clearcoatRoughness: 0.15,
});
const chromeMat = new THREE.MeshPhysicalMaterial({
  color: CHROME,
  roughness: 0.12,
  metalness: 0.92,
  clearcoat: 0.3,
  clearcoatRoughness: 0.1,
});
const headBatterMat = new THREE.MeshPhysicalMaterial({
  color: HEAD_TOP,
  roughness: 0.92,
  metalness: 0.0,
  sheen: 0.35,
  sheenRoughness: 0.8,
  sheenColor: new THREE.Color("#f0ece4"),
});
const headResoMat = new THREE.MeshPhysicalMaterial({
  color: HEAD_RESO,
  roughness: 0.94,
  metalness: 0.0,
});
/** Brushed-bronze gold — reads correctly under low ambient / spotlight lighting. */
const cymbalGoldMat = new THREE.MeshStandardMaterial({
  color: GOLD,
  roughness: 0.10,
  metalness: 0.58,
  emissive: GOLD_EMISSIVE,
  emissiveIntensity: 0.20,
});
const cymbalGoldBrightMat = new THREE.MeshStandardMaterial({
  color: GOLD_BRIGHT,
  roughness: 0.06,
  metalness: 0.65,
  emissive: "#a88820",
  emissiveIntensity: 0.26,
});
const cymbalBellMat = new THREE.MeshStandardMaterial({
  color: GOLD_BELL,
  roughness: 0.04,
  metalness: 0.70,
  emissive: "#b89828",
  emissiveIntensity: 0.30,
});
const hwMat = new THREE.MeshPhysicalMaterial({
  color: HW,
  roughness: 0.28,
  metalness: 0.78,
});

/* ════════════════════════════════════════════════════════════════════
   Reusable parts
   ════════════════════════════════════════════════════════════════════ */

function ShellDrum({
  radius,
  depth,
  lugs,
  snare = false,
  vent = true,
}: {
  radius: number;
  depth: number;
  lugs: number;
  snare?: boolean;
  vent?: boolean;
}) {
  const half = depth / 2;
  const hoopR = radius + 0.008;
  const hoopTube = 0.012;
  const segs = 48;

  return (
    <group>
      {/* Ply shell — lacquered grey with clearcoat */}
      <mesh>
        <cylinderGeometry args={[radius, radius, depth, segs]} />
        <primitive object={greyShellEdgeMat} attach="material" />
      </mesh>
      <mesh scale={[0.988, 0.90, 0.988]}>
        <cylinderGeometry args={[radius * 1.01, radius * 1.01, depth, segs]} />
        <primitive object={greyShellMidMat} attach="material" />
      </mesh>
      <mesh scale={[0.988, 0.54, 0.988]}>
        <cylinderGeometry args={[radius * 1.015, radius * 1.015, depth, segs]} />
        <primitive object={greyShellHiMat} attach="material" />
      </mesh>
      {/* Ply seam lines */}
      {[0, Math.PI / 2].map((a) => (
        <mesh key={`ply-${a}`} position={[0, 0, 0]} rotation={[0, a, 0]}>
          <boxGeometry args={[0.002, depth * 0.96, radius * 2.02]} />
          <meshStandardMaterial color={GREY_EDGE} roughness={0.35} metalness={0.08} />
        </mesh>
      ))}
      {/* Highlight stripe */}
      <mesh scale={[0.992, 0.08, 0.992]} position={[0, depth * 0.08, 0]}>
        <cylinderGeometry args={[radius * 1.02, radius * 1.02, depth, segs]} />
        <meshStandardMaterial color={GREY_CLEAR} roughness={0.12} metalness={0.18} transparent opacity={0.35} />
      </mesh>

      {/* Bearing edge */}
      {[half - 0.004, -half + 0.004].map((hy) => (
        <mesh key={`be-${hy}`} position={[0, hy, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 0.97, 0.0035, 8, segs]} />
          <meshStandardMaterial color={HEAD_RING} roughness={0.48} metalness={0.18} />
        </mesh>
      ))}

      {/* Heads */}
      <group position={[0, half + 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <circleGeometry args={[radius * 0.982, segs]} />
          <primitive object={headBatterMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <ringGeometry args={[radius * 0.72, radius * 0.96, segs]} />
          <meshStandardMaterial color={HEAD_RING} roughness={0.88} metalness={0.0} transparent opacity={0.25} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.012, 12]} />
          <meshStandardMaterial color="#d8d4cc" roughness={0.85} metalness={0.0} />
        </mesh>
      </group>
      <mesh position={[0, -half - 0.0015, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.982, segs]} />
        <primitive object={headResoMat} attach="material" />
      </mesh>

      {/* Snare wire bed */}
      {snare && (
        <group position={[0, -half - 0.003, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {Array.from({ length: 20 }, (_, i) => {
            const t = (i - 9.5) * 0.008;
            return (
              <mesh key={`sw-${i}`} position={[0, t, -0.004]}>
                <boxGeometry args={[radius * 1.5, 0.0012, 0.008]} />
                <meshStandardMaterial color={CHROME} metalness={0.90} roughness={0.14} />
              </mesh>
            );
          })}
          <mesh position={[radius * 0.72, 0, 0]}>
            <boxGeometry args={[0.028, 0.045, 0.018]} />
            <meshStandardMaterial color={CHROME} metalness={0.74} roughness={0.26} />
          </mesh>
        </group>
      )}

      {/* Die-cast hoops */}
      {[half, -half].map((hy) => (
        <group key={`hp-${hy}`} position={[0, hy, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[hoopR, hoopTube, 14, segs]} />
            <primitive object={hoopMat} attach="material" />
          </mesh>
          <mesh>
            <torusGeometry args={[hoopR - 0.016, 0.005, 10, segs]} />
            <meshStandardMaterial color="#2e2e34" metalness={0.82} roughness={0.16} />
          </mesh>
        </group>
      ))}

      {/* Lugs, washers, tension rods */}
      {Array.from({ length: lugs }, (_, i) => {
        const a = (i / lugs) * Math.PI * 2;
        const lx = Math.cos(a) * (radius + 0.016);
        const lz = Math.sin(a) * (radius + 0.016);
        return (
          <group key={`lug-${i}`}>
            <mesh position={[lx, 0, lz]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.024, depth * 0.46, 0.028]} />
              <meshStandardMaterial color={LUG} metalness={0.82} roughness={0.18} />
            </mesh>
            {[half * 0.78, -half * 0.78].map((ry) => (
              <group key={`rod-${ry}`} position={[lx, ry, lz]}>
                <mesh>
                  <cylinderGeometry args={[0.0035, 0.0035, depth * 0.34, 8]} />
                  <primitive object={chromeMat} attach="material" />
                </mesh>
                <mesh position={[0, (depth * 0.34) / 2, 0]}>
                  <cylinderGeometry args={[0.007, 0.007, 0.005, 8]} />
                  <meshStandardMaterial color={CHROME_HI} metalness={0.94} roughness={0.10} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* Air vent */}
      {vent && (
        <group position={[0, 0, radius + 0.001]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.018, 0.006, 16]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.55} roughness={0.40} />
          </mesh>
          <mesh position={[0, 0, 0.004]}>
            <torusGeometry args={[0.018, 0.003, 6, 16]} />
            <meshStandardMaterial color={CHROME} metalness={0.76} roughness={0.24} />
          </mesh>
        </group>
      )}

      {/* Badge */}
      <mesh position={[radius + 0.002, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.026, 0.005, 18]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
    </group>
  );
}

function TripodLegs({ spread = 0.30 }: { spread?: number }) {
  return (
    <group>
      <mesh position={[0, 0.10, 0]}>
        <cylinderGeometry args={[0.022, 0.026, 0.05, 12]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.72} roughness={0.26} />
      </mesh>
      {[0.5, 2.6, 4.7].map((a) => (
        <group key={`tl-${a}`} rotation={[0, a, 0]}>
          <mesh position={[spread * 0.48, 0.11, 0]} rotation={[0, 0, 1.08]}>
            <cylinderGeometry args={[0.010, 0.011, spread * 1.28, 10]} />
            <primitive object={hwMat} attach="material" />
          </mesh>
          <mesh position={[spread * 0.40, 0.072, 0]} rotation={[0, 0, 1.22]}>
            <cylinderGeometry args={[0.006, 0.007, spread * 0.98, 8]} />
            <primitive object={hwMat} attach="material" />
          </mesh>
          <mesh position={[spread * 0.52, 0.048, 0]}>
            <cylinderGeometry args={[0.010, 0.010, 0.020, 8]} />
            <primitive object={chromeMat} attach="material" />
          </mesh>
          <mesh position={[spread, 0.016, 0]}>
            <cylinderGeometry args={[0.016, 0.020, 0.034, 10]} />
            <meshStandardMaterial color={RUBBER} roughness={0.92} metalness={0.02} />
          </mesh>
        </group>
      ))}
      {/* Spreader chain */}
      {[0.5, 2.6, 4.7].map((a) => (
        <mesh
          key={`sp-${a}`}
          position={[Math.cos(a) * spread * 0.22, 0.055, Math.sin(a) * spread * 0.22]}
          rotation={[0, a + Math.PI / 2, 0]}
        >
          <boxGeometry args={[spread * 0.44, 0.004, 0.008]} />
          <meshStandardMaterial color={HW_DARK} metalness={0.58} roughness={0.36} />
        </mesh>
      ))}
    </group>
  );
}

function CymbalDisc({ radius }: { radius: number }) {
  const segs = 80;

  return (
    <group>
      {/* Smooth gold plate — no lathe rings or hammer texture */}
      <mesh>
        <cylinderGeometry args={[radius, radius * 0.992, 0.0028, segs]} />
        <primitive object={cymbalGoldMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.0032, 0]}>
        <cylinderGeometry args={[radius * 0.52, radius * 0.90, 0.0034, segs]} />
        <primitive object={cymbalGoldBrightMat} attach="material" />
      </mesh>

      {/* Bell dome */}
      <mesh position={[0, 0.011, 0]}>
        <cylinderGeometry args={[radius * 0.07, radius * 0.19, 0.026, 36]} />
        <primitive object={cymbalBellMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.024, 0]}>
        <sphereGeometry args={[radius * 0.075, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={cymbalBellMat} attach="material" />
      </mesh>

      <mesh position={[0, 0.032, 0]}>
        <cylinderGeometry args={[0.020, 0.020, 0.009, 12]} />
        <meshStandardMaterial color={FELT} roughness={0.92} metalness={0.0} />
      </mesh>
      <mesh position={[0, 0.040, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.016, 8]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
    </group>
  );
}

function ChinaCymbalDisc({ radius }: { radius: number }) {
  const chinaMat = new THREE.MeshStandardMaterial({
    color: CHINA_GOLD,
    roughness: 0.10,
    metalness: 0.55,
    emissive: GOLD_EMISSIVE,
    emissiveIntensity: 0.18,
  });
  const chinaBrightMat = new THREE.MeshStandardMaterial({
    color: CHINA_BRIGHT,
    roughness: 0.07,
    metalness: 0.62,
    emissive: "#a88820",
    emissiveIntensity: 0.24,
  });
  const segs = 64;

  return (
    <group rotation={[Math.PI, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[radius * 0.86, radius, 0.0032, segs]} />
        <primitive object={chinaMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.006, 0]}>
        <cylinderGeometry args={[radius * 0.44, radius * 0.80, 0.004, segs]} />
        <primitive object={chinaBrightMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.014, 0]}>
        <cylinderGeometry args={[radius * 0.08, radius * 0.17, 0.020, 24]} />
        <primitive object={cymbalBellMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.026, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.010, 10]} />
        <meshStandardMaterial color={FELT} roughness={0.92} metalness={0.0} />
      </mesh>
    </group>
  );
}

function CymbalStand({
  x,
  z,
  height,
  radius,
  tilt = 0.22,
  tiltDir = 0,
  boom = 0.18,
  boomDir = 0,
  china = false,
}: {
  x: number;
  z: number;
  height: number;
  radius: number;
  tilt?: number;
  tiltDir?: number;
  boom?: number;
  boomDir?: number;
  china?: boolean;
}) {
  const headX = Math.cos(boomDir) * boom;
  const headZ = Math.sin(boomDir) * boom;

  return (
    <group position={[x, 0, z]}>
      <TripodLegs spread={0.30} />
      <mesh position={[0, height * 0.34, 0]}>
        <cylinderGeometry args={[0.012, 0.014, height * 0.68, 10]} />
        <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
      </mesh>
      <mesh position={[0, height * 0.62, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.034, 10]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.34} />
      </mesh>
      <mesh position={[0, height * 0.80, 0]}>
        <cylinderGeometry args={[0.009, 0.010, height * 0.40, 10]} />
        <meshStandardMaterial color={HW} metalness={0.68} roughness={0.28} />
      </mesh>
      <mesh position={[0, height * 0.98, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.022, 10]} />
        <meshStandardMaterial color={CHROME} metalness={0.74} roughness={0.24} />
      </mesh>
      <mesh
        position={[headX / 2, height + 0.018, headZ / 2]}
        rotation={[Math.sin(boomDir) * 0.45, 0, -Math.cos(boomDir) * 0.45]}
      >
        <cylinderGeometry args={[0.008, 0.008, boom * 1.38, 8]} />
        <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
      </mesh>
      <mesh position={[headX, height + 0.032, headZ]}>
        <sphereGeometry args={[0.014, 10, 10]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.62} roughness={0.34} />
      </mesh>
      <mesh position={[headX, height + 0.038, headZ]}>
        <cylinderGeometry args={[0.016, 0.016, 0.006, 10]} />
        <meshStandardMaterial color={FELT} roughness={0.92} metalness={0.0} />
      </mesh>
      <group
        position={[headX, height + 0.048, headZ]}
        rotation={[Math.sin(tiltDir) * tilt, 0, -Math.cos(tiltDir) * tilt]}
      >
        {china ? <ChinaCymbalDisc radius={radius} /> : <CymbalDisc radius={radius} />}
      </group>
    </group>
  );
}

function HiHatStand({ x, z }: { x: number; z: number }) {
  const h = 0.42 * OVERHEAD_H;
  const top = 0.925 * OVERHEAD_H;
  const bottom = 0.875 * OVERHEAD_H;

  return (
    <group position={[x, 0, z]}>
      <TripodLegs spread={0.26} />
      <mesh position={[0, h, 0]}>
        <cylinderGeometry args={[0.011, 0.013, 0.80 * OVERHEAD_H, 10]} />
        <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
      </mesh>
      <mesh position={[0, 0.62 * OVERHEAD_H, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.032, 10]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.34} />
      </mesh>
      {/* Pull rod + spring sleeve */}
      <mesh position={[0, top + 0.04, 0]}>
        <cylinderGeometry args={[0.0045, 0.0045, 0.30 * OVERHEAD_H, 6]} />
        <meshStandardMaterial color={CHROME} metalness={0.80} roughness={0.20} />
      </mesh>
      <mesh position={[0, top + 0.12, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.14 * OVERHEAD_H, 10]} />
        <meshStandardMaterial color={HW} metalness={0.64} roughness={0.32} />
      </mesh>
      {/* Clutch */}
      <mesh position={[0, top + 0.02, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.028, 10]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.62} roughness={0.32} />
      </mesh>
      <group position={[0, bottom, 0]} rotation={[0.03, 0, 0.02]}>
        <CymbalDisc radius={0.178} />
      </group>
      <group position={[0, top, 0]} rotation={[-0.02, 0, -0.02]}>
        <CymbalDisc radius={0.178} />
      </group>
      {/* Pedal */}
      <group position={[0.02, 0, 0.21]} rotation={[0.12, 0, 0]}>
        <mesh position={[0, 0.008, -0.02]}>
          <boxGeometry args={[0.10, 0.012, 0.28]} />
          <meshStandardMaterial color={HW_DARK} metalness={0.58} roughness={0.36} />
        </mesh>
        <mesh position={[0, 0.004, 0.08]}>
          <boxGeometry args={[0.12, 0.022, 0.07]} />
          <meshStandardMaterial color={HW} metalness={0.62} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.018, 0.02]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />
          <meshStandardMaterial color={CHROME} metalness={0.76} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.10, -0.06]}>
          <cylinderGeometry args={[0.012, 0.012, 0.04, 10]} />
          <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.34} />
        </mesh>
      </group>
    </group>
  );
}

function WindChimeTree({
  x,
  z,
  barHeight = 0.72,
  tubeCount = 16,
}: {
  x: number;
  z: number;
  barHeight?: number;
  tubeCount?: number;
}) {
  const spacing = 0.026;
  const barLen = tubeCount * spacing + 0.06;
  const halfBar = barLen / 2;

  return (
    <group position={[x, 0, z]} rotation={[0, 0.18, 0]}>
      <TripodLegs spread={0.22} />
      <mesh position={[0, barHeight * 0.46, 0]}>
        <cylinderGeometry args={[0.010, 0.012, barHeight * 0.92, 10]} />
        <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
      </mesh>
      <mesh position={[0, barHeight * 0.90, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.032, 10]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.34} />
      </mesh>
      <mesh position={[0, barHeight, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[barLen, 0.014, 0.018]} />
        <meshStandardMaterial color={CHIME_BAR} metalness={0.55} roughness={0.36} />
      </mesh>
      {Array.from({ length: tubeCount }, (_, i) => {
        const t = i / (tubeCount - 1);
        const length = 0.36 - t * 0.22;
        const tx = -halfBar + 0.04 + i * spacing;
        const hangY = barHeight - 0.008;
        return (
          <group key={`chime-${i}`} position={[tx, hangY, 0]}>
            <mesh position={[0, -0.012, 0]}>
              <cylinderGeometry args={[0.0015, 0.0015, 0.028, 4]} />
              <meshStandardMaterial color="#5a544c" roughness={0.82} metalness={0.08} />
            </mesh>
            <mesh position={[0, -0.028 - length / 2, 0]}>
              <cylinderGeometry args={[0.006, 0.0055, length, 12]} />
              <meshStandardMaterial
                color={CHIME_TUBE}
                metalness={0.86}
                roughness={0.20}
                emissive="#c8c0b4"
                emissiveIntensity={0.03}
              />
            </mesh>
            <mesh position={[0, -0.028 - length, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.006, 10]} />
              <meshStandardMaterial color={CHROME} metalness={0.78} roughness={0.22} />
            </mesh>
          </group>
        );
      })}
      {/* Felt mallet */}
      <group position={[halfBar + 0.05, barHeight - 0.06, 0.02]} rotation={[0.3, 0.4, 1.15]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.008, 0.010, 0.20, 8]} />
          <meshStandardMaterial color="#4a4034" roughness={0.76} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color="#ece4d8" roughness={0.70} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
}

function KickPedal() {
  return (
    <group position={[0, 0, 0.18]}>
      <mesh position={[0, 0.048, -0.02]}>
        <boxGeometry args={[0.11, 0.10, 0.028]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.024, 0.10]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[0.086, 0.012, 0.26]} />
        <meshStandardMaterial color={HW} metalness={0.64} roughness={0.30} />
      </mesh>
      <mesh position={[0, 0.038, 0.04]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[0.07, 0.006, 0.18]} />
        <meshStandardMaterial color="#2a2620" roughness={0.78} metalness={0.04} />
      </mesh>
      <mesh position={[0.04, 0.10, -0.02]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
        <meshStandardMaterial color={HW} metalness={0.62} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.17, -0.015]} rotation={[0.38, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.24, 8]} />
        <meshStandardMaterial color={CHROME} metalness={0.78} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.29, -0.065]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color="#e8e0d4" roughness={0.76} metalness={0.02} />
      </mesh>
    </group>
  );
}

function DrumThrone() {
  return (
    <group position={[0, 0, 0.92]}>
      <TripodLegs spread={0.30} />
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.028, 0.032, 0.44, 12]} />
        <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
      </mesh>
      <mesh position={[0, 0.20, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.048, 12]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.58} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.010, 0.010, 0.06, 8]} />
        <meshStandardMaterial color={CHROME} metalness={0.74} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.50, 0]}>
        <cylinderGeometry args={[0.178, 0.168, 0.078, 32]} />
        <meshPhysicalMaterial color={VINYL} roughness={0.52} metalness={0.06} clearcoat={0.35} clearcoatRoughness={0.4} />
      </mesh>
      <mesh position={[0, 0.536, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.170, 0.010, 8, 32]} />
        <meshStandardMaterial color="#211d17" roughness={0.60} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.548, 0]}>
        <cylinderGeometry args={[0.160, 0.170, 0.024, 32]} />
        <meshStandardMaterial color="#1c1914" roughness={0.64} metalness={0.04} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════════════════════
   The kit
   ════════════════════════════════════════════════════════════════════ */

export function DrumKit() {
  return (
    <group>
      <DrumStagePlatform cornerX={EAST_WALL_X} cornerZ={SOUTH_WALL_WORLD_Z} />
      <DrumStageMonitoring cornerX={EAST_WALL_X} cornerZ={SOUTH_WALL_WORLD_Z} />
      <group position={KIT_POS} rotation={[0, DRUM_YAW, 0]} scale={[S, S, S]}>

        {/* KICK — 22"×18", on its side */}
        <group position={[0, 0.295, -0.10]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.28, 0.28, 0.46, 48]} />
              <primitive object={greyShellEdgeMat} attach="material" />
            </mesh>
            <mesh scale={[0.985, 0.88, 0.985]}>
              <cylinderGeometry args={[0.284, 0.284, 0.46, 48]} />
              <primitive object={greyShellMidMat} attach="material" />
            </mesh>
            <mesh scale={[0.985, 0.50, 0.985]}>
              <cylinderGeometry args={[0.286, 0.286, 0.46, 48]} />
              <primitive object={greyShellHiMat} attach="material" />
            </mesh>
          </group>

          <mesh position={[0, 0, 0.232]}>
            <circleGeometry args={[0.276, 48]} />
            <primitive object={headBatterMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.232]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.276, 48]} />
            <meshPhysicalMaterial color={KICK_RESO} roughness={0.72} metalness={0.06} clearcoat={0.2} />
          </mesh>
          <mesh position={[0.10, -0.10, -0.235]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.055, 24]} />
            <meshStandardMaterial color="#070605" roughness={0.95} metalness={0.0} />
          </mesh>
          <mesh position={[0.10, -0.10, -0.236]} rotation={[0, Math.PI, 0]}>
            <torusGeometry args={[0.055, 0.004, 6, 24]} />
            <meshStandardMaterial color={CHROME} metalness={0.76} roughness={0.24} />
          </mesh>

          {[0.235, -0.235].map((hz) => (
            <group key={`kh-${hz}`} position={[0, 0, hz]}>
              <mesh>
                <torusGeometry args={[0.285, 0.017, 14, 48]} />
                <primitive object={hoopMat} attach="material" />
              </mesh>
              <mesh>
                <torusGeometry args={[0.268, 0.006, 10, 48]} />
                <meshStandardMaterial color="#2e2e34" metalness={0.84} roughness={0.14} />
              </mesh>
            </group>
          ))}

          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const cx = Math.cos(a) * 0.296;
            const cy = Math.sin(a) * 0.296;
            return (
              <group key={`kl-${i}`} position={[cx, cy, 0]} rotation={[0, 0, a]}>
                <mesh>
                  <boxGeometry args={[0.022, 0.028, 0.21]} />
                  <meshStandardMaterial color={LUG} metalness={0.68} roughness={0.28} />
                </mesh>
                <mesh position={[0, 0, 0.09]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.18, 6]} />
                  <meshStandardMaterial color={CHROME} metalness={0.78} roughness={0.22} />
                </mesh>
              </group>
            );
          })}

          {[-1, 1].map((s) => (
            <group key={`spur-${s}`} position={[s * 0.27, -0.16, -0.16]} rotation={[0.45, 0, s * -0.5]}>
              <mesh>
                <cylinderGeometry args={[0.008, 0.006, 0.26, 8]} />
                <meshStandardMaterial color={HW} metalness={0.68} roughness={0.28} />
              </mesh>
              <mesh position={[0, -0.13, 0]}>
                <cylinderGeometry args={[0.016, 0.020, 0.024, 10]} />
                <meshStandardMaterial color={RUBBER} roughness={0.90} metalness={0.02} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Tom mount */}
        <mesh position={[0, 0.66, -0.10]}>
          <cylinderGeometry args={[0.013, 0.013, 0.18, 10]} />
          <primitive object={chromeMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.74, -0.10]}>
          <boxGeometry args={[0.36, 0.026, 0.026]} />
          <meshStandardMaterial color={HW_DARK} metalness={0.62} roughness={0.32} />
        </mesh>

        <group position={[-0.185, 0.80, -0.06]} rotation={[0.30, 0.12, 0]}>
          <ShellDrum radius={0.127} depth={0.18} lugs={6} />
          <mesh position={[0.04, -0.13, -0.04]} rotation={[-0.3, 0, 0.2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.14, 8]} />
            <meshStandardMaterial color={CHROME} metalness={0.72} roughness={0.24} />
          </mesh>
        </group>

        <group position={[0.195, 0.81, -0.06]} rotation={[0.30, -0.12, 0]}>
          <ShellDrum radius={0.152} depth={0.20} lugs={6} />
          <mesh position={[-0.04, -0.14, -0.04]} rotation={[-0.3, 0, -0.2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.14, 8]} />
            <meshStandardMaterial color={CHROME} metalness={0.72} roughness={0.24} />
          </mesh>
        </group>

        {/* Snare */}
        <group position={[-0.33, 0, 0.32]}>
          <TripodLegs spread={0.26} />
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.011, 0.013, 0.46, 10]} />
            <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.030, 10]} />
            <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.34} />
          </mesh>
          {[0.4, 2.5, 4.6].map((a) => (
            <mesh
              key={`bask-${a}`}
              position={[Math.cos(a) * 0.10, 0.50, Math.sin(a) * 0.10]}
              rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]}
            >
              <cylinderGeometry args={[0.006, 0.006, 0.13, 6]} />
              <meshStandardMaterial color={HW} metalness={0.64} roughness={0.32} />
            </mesh>
          ))}
          <group position={[0, 0.575, 0]} rotation={[0.10, 0, 0.04]}>
            <ShellDrum radius={0.178} depth={0.14} lugs={10} snare vent={false} />
            <mesh position={[-0.188, -0.02, 0.02]}>
              <boxGeometry args={[0.016, 0.065, 0.022]} />
              <meshStandardMaterial color={CHROME} metalness={0.74} roughness={0.24} />
            </mesh>
          </group>
        </group>

        {/* Floor tom */}
        <group position={[0.50, 0, 0.30]}>
          <group position={[0, 0.46, 0]} rotation={[0.04, 0, -0.03]}>
            <ShellDrum radius={0.203} depth={0.38} lugs={8} />
          </group>
          {[0.7, 2.8, 4.9].map((a) => (
            <group
              key={`ftl-${a}`}
              position={[Math.cos(a) * 0.225, 0.18, Math.sin(a) * 0.225]}
              rotation={[Math.sin(a) * 0.22, 0, -Math.cos(a) * 0.22]}
            >
              <mesh>
                <cylinderGeometry args={[0.007, 0.008, 0.40, 8]} />
                <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
              </mesh>
              <mesh position={[0, -0.20, 0]}>
                <cylinderGeometry args={[0.014, 0.018, 0.028, 10]} />
                <meshStandardMaterial color={RUBBER} roughness={0.90} metalness={0.02} />
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <boxGeometry args={[0.028, 0.018, 0.032]} />
                <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.34} />
              </mesh>
            </group>
          ))}
        </group>

        <HiHatStand x={-0.62} z={0.20} />
        <WindChimeTree x={-0.58} z={-0.14} barHeight={1.14 * OVERHEAD_H} />

        <CymbalStand
          x={-0.55} z={-0.52} height={1.32 * OVERHEAD_H} radius={0.228}
          tilt={0.26} tiltDir={1.0} boom={0.22} boomDir={0.6}
        />
        <CymbalStand
          x={0.52} z={-0.58} height={1.40 * OVERHEAD_H} radius={0.24}
          tilt={0.24} tiltDir={2.2} boom={0.22} boomDir={2.6}
        />
        <CymbalStand
          x={0.82} z={-0.12} height={1.08 * OVERHEAD_H} radius={0.265}
          tilt={0.30} tiltDir={2.8} boom={0.16} boomDir={3.0}
        />
        <CymbalStand
          x={1.22} z={0.16} height={1.14 * OVERHEAD_H} radius={0.220}
          tilt={0.28} tiltDir={2.85} boom={0.16} boomDir={3.05}
        />
        <CymbalStand
          x={0.98} z={0.72} height={1.00 * OVERHEAD_H} radius={0.252}
          tilt={0.32} tiltDir={3.10} boom={0.14} boomDir={3.30}
        />
        <CymbalStand
          x={0.14} z={-0.78} height={0.68 * OVERHEAD_H} radius={0.102}
          tilt={0.52} tiltDir={0.12} boom={0.10} boomDir={0.42}
          china
        />

        <KickPedal />
        <DrumThrone />

      </group>
    </group>
  );
}
