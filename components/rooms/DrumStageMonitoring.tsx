"use client";

/**
 * Drum-riser monitoring — wedge fills on the platform perimeter edges.
 * All placements sit on the quarter-disc surface in world space.
 */

import { RoundedBox } from "@react-three/drei";
import {
  DRUM_STAGE_RADIUS,
  DRUM_STAGE_SURFACE_Y,
  drumKitStagePosition,
} from "@/components/rooms/DrumStagePlatform";

/** Matches DrumKit KIT_SOUTH_BIAS — kit aim point for speaker orientation. */
const KIT_SOUTH_BIAS = 0.48;

/** Inset from the south / east walls so wedges sit on the carpet. */
const WALL_INSET = 0.42;
/** Arc monitors — fraction of platform radius along the curved edge. */
const ARC_RADIUS_FRAC = 0.91;

const CABINET = "#141416";
const CABINET_LT = "#1e1e22";
const GRILLE = "#0a0a0c";
const BAFFLE = "#18181c";
const SURROUND = "#101012";
const CONE = "#1a191c";
const CAP = "#3a3a42";
const RUBBER = "#171513";
const HANDLE = "#2a2824";

type DrumStageMonitoringProps = {
  cornerX: number;
  cornerZ: number;
};

function kitAim(cornerX: number, cornerZ: number): [number, number] {
  const base = drumKitStagePosition(cornerX, cornerZ);
  return [base[0], base[2] + KIT_SOUTH_BIAS];
}

/** Point on the platform arc (angle π → π/2 from the SE corner). */
function arcPosition(
  cornerX: number,
  cornerZ: number,
  radiusFrac: number,
  angle: number,
): [number, number, number] {
  const r = DRUM_STAGE_RADIUS * radiusFrac;
  return [
    cornerX + r * Math.cos(angle),
    DRUM_STAGE_SURFACE_Y,
    cornerZ - r * Math.sin(angle),
  ];
}

function yawToward(fromX: number, fromZ: number, toX: number, toZ: number) {
  return Math.atan2(toX - fromX, toZ - fromZ);
}

function WedgeDriver({
  y,
  radius,
  tweeter = false,
}: {
  y: number;
  radius: number;
  tweeter?: boolean;
}) {
  return (
    <group position={[0, y, 0.018]}>
      <mesh>
        <torusGeometry args={[radius, tweeter ? 0.006 : 0.010, 8, 28]} />
        <meshStandardMaterial color={SURROUND} roughness={0.86} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[radius * 0.88, 28]} />
        <meshStandardMaterial
          color={tweeter ? "#2a2a32" : CONE}
          roughness={tweeter ? 0.35 : 0.84}
          metalness={tweeter ? 0.65 : 0.02}
        />
      </mesh>
      {!tweeter && (
        <mesh position={[0, 0, 0.004]}>
          <circleGeometry args={[radius * 0.32, 16]} />
          <meshStandardMaterial color={CAP} roughness={0.40} metalness={0.35} />
        </mesh>
      )}
    </group>
  );
}

/** Floor wedge monitor — angled toward the drummer. */
function DrumWedgeMonitor({
  position,
  yaw,
  pitch = 0.42,
  wide = false,
}: {
  position: [number, number, number];
  yaw: number;
  pitch?: number;
  wide?: boolean;
}) {
  const w = wide ? 0.52 : 0.44;
  const h = wide ? 0.38 : 0.32;
  const d = wide ? 0.48 : 0.40;

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <group rotation={[pitch, 0, 0]} position={[0, h * 0.42, 0]}>
        <RoundedBox args={[w, h, d]} radius={0.012} smoothness={5} castShadow>
          <meshStandardMaterial color={CABINET} roughness={0.72} metalness={0.06} />
        </RoundedBox>
        <mesh position={[0, -0.04, -d * 0.22]}>
          <boxGeometry args={[w * 0.96, 0.08, d * 0.55]} />
          <meshStandardMaterial color={CABINET_LT} roughness={0.74} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.02, d / 2 + 0.002]}>
          <boxGeometry args={[w * 0.88, h * 0.82, 0.006]} />
          <meshStandardMaterial color={GRILLE} roughness={0.94} metalness={0.02} />
        </mesh>
        <mesh position={[0, 0.02, d / 2 + 0.006]}>
          <boxGeometry args={[w * 0.82, h * 0.76, 0.004]} />
          <meshStandardMaterial color={BAFFLE} roughness={0.68} metalness={0.04} />
        </mesh>
        <WedgeDriver y={h * 0.22} radius={wide ? 0.11 : 0.095} tweeter />
        <WedgeDriver y={-h * 0.14} radius={wide ? 0.14 : 0.12} />
        <mesh position={[0, h / 2 + 0.006, -0.02]}>
          <boxGeometry args={[0.18, 0.012, 0.04]} />
          <meshStandardMaterial color={HANDLE} roughness={0.62} metalness={0.12} />
        </mesh>
      </group>
      {[
        [-w * 0.38, 0.012, d * 0.32],
        [w * 0.38, 0.012, d * 0.32],
        [0, 0.012, -d * 0.28],
      ].map(([fx, fy, fz], i) => (
        <mesh key={`wf-${i}`} position={[fx, fy, fz]}>
          <cylinderGeometry args={[0.016, 0.018, 0.024, 10]} />
          <meshStandardMaterial color={RUBBER} roughness={0.92} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Wedge layout on platform edges:
 *   • South wall (west span)
 *   • East wall (south span)
 *   • East wall (north span)
 *   • Curved arc (front / audience side)
 */
export function DrumStageMonitoring({ cornerX, cornerZ }: DrumStageMonitoringProps) {
  const [kitX, kitZ] = kitAim(cornerX, cornerZ);
  const y = DRUM_STAGE_SURFACE_Y;

  const wedges: Array<{
    id: string;
    pos: [number, number, number];
    wide?: boolean;
  }> = [
    {
      id: "south-edge",
      pos: [cornerX - DRUM_STAGE_RADIUS * 0.82, y, cornerZ - WALL_INSET],
    },
    {
      id: "east-south",
      pos: [cornerX - WALL_INSET, y, cornerZ - DRUM_STAGE_RADIUS * 0.38],
    },
    {
      id: "east-north",
      pos: [cornerX - WALL_INSET, y, cornerZ - DRUM_STAGE_RADIUS * 0.82],
      wide: true,
    },
    {
      id: "arc-front",
      pos: arcPosition(cornerX, cornerZ, ARC_RADIUS_FRAC, Math.PI * 0.74),
      wide: true,
    },
  ];

  return (
    <group>
      {wedges.map(({ id, pos, wide }) => (
        <DrumWedgeMonitor
          key={id}
          position={pos}
          yaw={yawToward(pos[0], pos[2], kitX, kitZ)}
          wide={wide}
        />
      ))}
    </group>
  );
}
