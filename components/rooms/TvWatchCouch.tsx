"use client";

/**
 * Unified curved sectional — single low arc sofa facing the north-wall TV (−Z).
 */

import { RoundedBox } from "@react-three/drei";
import { createMarbleTexture, createWoolTexture } from "@/lib/sofaTextures";
import { scaleWorldZ } from "@/lib/roomLayout";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const CX = -14.5;
const CZ = scaleWorldZ(-2.48);
const FLOOR_Y = 0.10;
const SOFA_SCALE = 1.20;
const SOFA_HEIGHT_SCALE = 1.08;
const CENTER_FORWARD = 0.04;

/** Modern oatmeal linen — cool neutral upholstery. */
const WOOL = "#c8c0b0";
const PIPING = "#8a8278";
const LEG_METAL = "#a8a4a0";
/** Analogous warm tones that complement the sofa. */
const RUG = "#e0d4c2";

const trimMat = new THREE.MeshStandardMaterial({
  color: "#9a9088",
  metalness: 0.82,
  roughness: 0.22,
});

const legMat = new THREE.MeshStandardMaterial({
  color: LEG_METAL,
  metalness: 0.88,
  roughness: 0.18,
});

function useSofaMaterials() {
  const map = useMemo(() => createWoolTexture(WOOL), []);

  useEffect(() => () => map.dispose(), [map]);

  const wool = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map,
        color: "#f6f2ea",
        roughness: 0.9,
        metalness: 0,
        sheen: 0.85,
        sheenRoughness: 0.35,
        sheenColor: new THREE.Color("#ebe4d8"),
      }),
    [map],
  );

  const piping = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PIPING,
        roughness: 0.55,
        metalness: 0.01,
      }),
    [],
  );

  return { wool, piping };
}

function useTableMaterials() {
  const marbleMap = useMemo(() => createMarbleTexture(), []);

  useEffect(() => () => marbleMap.dispose(), [marbleMap]);

  const top = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: marbleMap,
        color: "#f5f0e8",
        roughness: 0.16,
        metalness: 0.02,
        clearcoat: 0.42,
        clearcoatRoughness: 0.12,
      }),
    [marbleMap],
  );

  const apron = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: marbleMap,
        color: "#ddd4c8",
        roughness: 0.28,
        metalness: 0.03,
        clearcoat: 0.18,
        clearcoatRoughness: 0.22,
      }),
    [marbleMap],
  );

  const brass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4a870",
        metalness: 0.92,
        roughness: 0.26,
      }),
    [],
  );

  const base = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4a4438",
        metalness: 0.78,
        roughness: 0.34,
      }),
    [],
  );

  return { top, apron, brass, base };
}

type WoolBoxProps = {
  args: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
};

function WoolBox({ args, position = [0, 0, 0], rotation = [0, 0, 0], radius = 0.08, material }: WoolBoxProps) {
  return (
    <RoundedBox
      args={args}
      radius={radius}
      smoothness={18}
      position={position}
      rotation={rotation}
      material={material}
      castShadow
      receiveShadow
    />
  );
}

/** Soft cord trim — rounded profile instead of flat strips. */
function PipingCord({
  width,
  position,
  rotation = [0, 0, 0],
  material,
}: {
  width: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  material: THREE.MeshStandardMaterial;
}) {
  return (
    <RoundedBox
      args={[width, 0.012, 0.012]}
      radius={0.006}
      smoothness={12}
      position={position}
      rotation={rotation}
      material={material}
      castShadow
    />
  );
}

/** Segment overlap so adjacent pieces read as one continuous sofa. */
const SEG_W = 1.04;
const SEG_D = 1.1;
const SEAT_W = 0.94;
const SEAT_D = 0.96;

type ArcPose = { x: number; z: number; ry: number };

/** Toward the north-wall TV (−Z in sofa-local space). */
const END_FORWARD = 0.14;
const INNER_FORWARD = END_FORWARD * 0.5;

const ARC_MODULES_BASE: ArcPose[] = [
  { x: -1.56, z: -0.15, ry: -0.36 },
  { x: -0.78, z: 0.01, ry: -0.18 },
  { x: 0, z: 0.05, ry: 0 },
  { x: 0.78, z: 0.01, ry: 0.18 },
  { x: 1.56, z: -0.15, ry: 0.36 },
];

/** Ends step forward fully; inner pair at 50%; centre nudged slightly toward TV. */
const ARC_FORWARD_OFFSETS = [END_FORWARD, INNER_FORWARD, CENTER_FORWARD, INNER_FORWARD, END_FORWARD];

const ARC_MODULES: ArcPose[] = ARC_MODULES_BASE.map((pose, i) => ({
  ...pose,
  z: pose.z - ARC_FORWARD_OFFSETS[i],
}));

function arcMidpoints(modules: ArcPose[]): ArcPose[] {
  const mids: ArcPose[] = [];
  for (let i = 0; i < modules.length - 1; i++) {
    const a = modules[i];
    const b = modules[i + 1];
    mids.push({
      x: (a.x + b.x) / 2,
      z: (a.z + b.z) / 2,
      ry: (a.ry + b.ry) / 2,
    });
  }
  return mids;
}

const ARC_MIDPOINTS = arcMidpoints(ARC_MODULES);

type ArcRailPose = ArcPose & { kind: "segment" | "joint" };

function arcRailPoses(): ArcRailPose[] {
  return [
    ...ARC_MODULES.map((pose) => ({ ...pose, kind: "segment" as const })),
    ...ARC_MIDPOINTS.map((pose) => ({ ...pose, kind: "joint" as const })),
  ];
}

/** Subtle base skim — low profile, rounded edge. */
function ArcTrimRail({ poses }: { poses: ArcRailPose[] }) {
  return (
    <>
      {poses.map((pose, i) => (
        <RoundedBox
          key={`trim-${i}`}
          args={[pose.kind === "segment" ? SEG_W + 0.01 : 0.66, 0.004, SEG_D + 0.008]}
          radius={0.002}
          smoothness={8}
          position={[pose.x, 0.112, pose.z]}
          rotation={[0, pose.ry, 0]}
          material={trimMat}
        />
      ))}
    </>
  );
}

const LEG_POSITIONS: [number, number][] = [
  [-0.36, 0.34],
  [0.36, 0.34],
  [-0.36, -0.32],
  [0.36, -0.32],
];

const BACK_TILT = -0.09;

/** One arc segment — floating platform, plush cushions, integrated back. */
function ArcSofaSegment({
  wool,
  piping,
  isEnd = false,
  armSide = 1,
}: {
  wool: THREE.MeshPhysicalMaterial;
  piping: THREE.MeshStandardMaterial;
  isEnd?: boolean;
  armSide?: 1 | -1;
}) {
  return (
    <group>
      {LEG_POSITIONS.map(([lx, lz]) => (
        <mesh key={`${lx}-${lz}`} position={[lx, 0.052, lz]} material={legMat} castShadow>
          <cylinderGeometry args={[0.013, 0.017, 0.104, 24]} />
        </mesh>
      ))}

      <WoolBox args={[SEG_W, 0.034, SEG_D]} position={[0, 0.125, 0]} radius={0.034} material={wool} />
      <WoolBox args={[SEAT_W, 0.138, SEAT_D]} position={[0, 0.285, -0.01]} radius={0.1} material={wool} />
      <WoolBox args={[SEAT_W * 0.82, 0.028, 0.048]} position={[0, 0.31, -0.46]} radius={0.024} material={wool} />

      <PipingCord width={SEAT_W * 0.9} position={[0, 0.355, -0.44]} material={piping} />

      <group position={[0, 0.5, 0.28]} rotation={[BACK_TILT, 0, 0]}>
        <WoolBox args={[SEAT_W, 0.38, 0.16]} position={[0, 0.12, 0]} radius={0.1} material={wool} />
        <WoolBox args={[SEAT_W * 0.88, 0.07, 0.1]} position={[0, 0.33, -0.02]} radius={0.05} material={wool} />
        <PipingCord width={SEAT_W * 0.9} position={[0, 0.06, 0.09]} material={piping} />
      </group>

      {isEnd && (
        <WoolBox
          args={[0.1, 0.28, SEG_D * 0.84]}
          position={[armSide * 0.46, 0.35, 0.01]}
          radius={0.065}
          material={wool}
        />
      )}
    </group>
  );
}

/** Wool fillers at segment joints — blends seat and back into one piece. */
function ArcJointFillers({
  wool,
  piping,
}: {
  wool: THREE.MeshPhysicalMaterial;
  piping: THREE.MeshStandardMaterial;
}) {
  return (
    <>
      {ARC_MIDPOINTS.map((pose, i) => (
        <group key={`joint-${i}`} position={[pose.x, 0, pose.z]} rotation={[0, pose.ry, 0]}>
          <WoolBox args={[0.3, 0.034, SEG_D]} position={[0, 0.125, 0]} radius={0.03} material={wool} />
          <WoolBox args={[0.28, 0.138, SEAT_D]} position={[0, 0.285, -0.01]} radius={0.09} material={wool} />
          <group position={[0, 0.5, 0.28]} rotation={[BACK_TILT, 0, 0]}>
            <WoolBox args={[0.28, 0.38, 0.16]} position={[0, 0.12, 0]} radius={0.095} material={wool} />
            <PipingCord width={0.24} position={[0, 0.06, 0.09]} material={piping} />
          </group>
        </group>
      ))}
    </>
  );
}

const TABLE_TOP_R = 0.55;
const TABLE_TOP_THICK = 0.072;
const TABLE_HEIGHT_LIFT = 0.05;
const TABLE_TOP_Y = 0.47 + TABLE_HEIGHT_LIFT;
const TABLE_Z = -1.38;
const TABLE_SEGMENTS = 64;
const PROP_SCALE = 1.25;

const glassMat = new THREE.MeshPhysicalMaterial({
  color: "#1a3028",
  roughness: 0.06,
  metalness: 0.1,
  transmission: 0.72,
  thickness: 0.35,
  transparent: true,
  opacity: 0.95,
});

const corkMat = new THREE.MeshStandardMaterial({ color: "#6a4a30", roughness: 0.92, metalness: 0 });
const foilMat = new THREE.MeshStandardMaterial({ color: "#8a8070", metalness: 0.85, roughness: 0.28 });

function WineBottle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={PROP_SCALE}>
      <mesh position={[0, 0.11, 0]} castShadow material={glassMat}>
        <cylinderGeometry args={[0.036, 0.04, 0.22, 24]} />
      </mesh>
      <mesh position={[0, 0.24, 0]} material={glassMat}>
        <cylinderGeometry args={[0.013, 0.016, 0.05, 16]} />
      </mesh>
      <mesh position={[0, 0.275, 0]} material={corkMat}>
        <cylinderGeometry args={[0.011, 0.011, 0.028, 12]} />
      </mesh>
      <mesh position={[0, 0.255, 0]} material={foilMat}>
        <cylinderGeometry args={[0.015, 0.015, 0.018, 16]} />
      </mesh>
      <mesh position={[0, 0.06, 0]} material={foilMat}>
        <cylinderGeometry args={[0.039, 0.039, 0.016, 24]} />
      </mesh>
    </group>
  );
}

function BeerCan({ position, label = "#c41e1e" }: { position: [number, number, number]; label?: string }) {
  return (
    <group position={position} scale={PROP_SCALE}>
      <mesh position={[0, 0.059, 0]} castShadow>
        <cylinderGeometry args={[0.031, 0.031, 0.118, 28]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.32} metalness={0.88} />
      </mesh>
      <mesh position={[0, 0.069, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.055, 28]} />
        <meshStandardMaterial color={label} roughness={0.5} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.031, 0.031, 0.005, 28]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.123, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.003, 12]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Ashtray({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={PROP_SCALE}>
      <mesh position={[0, 0.011, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.062, 0.022, 32]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.38} metalness={0.62} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.044, 0.048, 0.014, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.55} metalness={0.45} />
      </mesh>
      <mesh position={[0.018, 0.023, 0.012]} rotation={[0.1, 0.4, 1.2]}>
        <cylinderGeometry args={[0.002, 0.002, 0.042, 8]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
}

function TabletopProps({ topY }: { topY: number }) {
  const y = topY + TABLE_TOP_THICK / 2;
  return (
    <group>
      <WineBottle position={[-0.14, y, 0.06]} />
      <BeerCan position={[0.12, y, -0.08]} label="#c41e1e" />
      <BeerCan position={[0.22, y, 0.1]} label="#1e4a8a" />
      <BeerCan position={[0.05, y, 0.16]} label="#c41e1e" />
      <Ashtray position={[-0.22, y, -0.12]} />
    </group>
  );
}

/** Pedestal round table — polished stone top, brass edge, bronze base. */
function RoundCoffeeTable({ position }: { position: [number, number, number] }) {
  const { top, apron, brass, base } = useTableMaterials();
  const apronY = TABLE_TOP_Y - TABLE_TOP_THICK - 0.028;
  const edgeY = TABLE_TOP_Y + TABLE_TOP_THICK / 2 - 0.006;

  return (
    <group position={position}>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[TABLE_TOP_R + 0.24, TABLE_SEGMENTS]} />
        <meshStandardMaterial color={RUG} roughness={0.96} metalness={0} />
      </mesh>

      <mesh position={[0, 0.036, 0]} material={base} castShadow>
        <cylinderGeometry args={[0.34, 0.4, 0.072, TABLE_SEGMENTS]} />
      </mesh>
      <mesh position={[0, 0.22 + TABLE_HEIGHT_LIFT * 0.45, 0]} material={base} castShadow>
        <cylinderGeometry args={[0.065, 0.1, 0.28 + TABLE_HEIGHT_LIFT, 32]} />
      </mesh>

      <mesh position={[0, apronY, 0]} material={apron} castShadow>
        <cylinderGeometry args={[TABLE_TOP_R - 0.02, TABLE_TOP_R - 0.02, 0.048, TABLE_SEGMENTS]} />
      </mesh>

      <mesh position={[0, TABLE_TOP_Y, 0]} material={top} castShadow receiveShadow>
        <cylinderGeometry args={[TABLE_TOP_R, TABLE_TOP_R, TABLE_TOP_THICK, TABLE_SEGMENTS]} />
      </mesh>

      <mesh position={[0, edgeY, 0]} rotation={[Math.PI / 2, 0, 0]} material={brass} castShadow>
        <torusGeometry args={[TABLE_TOP_R - 0.018, 0.022, 20, TABLE_SEGMENTS]} />
      </mesh>

      <mesh position={[0, TABLE_TOP_Y - TABLE_TOP_THICK / 2 + 0.004, 0]} material={brass}>
        <cylinderGeometry args={[TABLE_TOP_R - 0.04, TABLE_TOP_R - 0.04, 0.006, TABLE_SEGMENTS]} />
      </mesh>

      <TabletopProps topY={TABLE_TOP_Y} />
    </group>
  );
}

/** Single unified arc sectional — same curve, one continuous body. */
function UnifiedArcSofa({
  wool,
  piping,
}: {
  wool: THREE.MeshPhysicalMaterial;
  piping: THREE.MeshStandardMaterial;
}) {
  const railPoses = arcRailPoses();

  return (
    <group>
      {ARC_MODULES.map((mod, i) => (
        <group key={`seg-${i}`} position={[mod.x, 0, mod.z]} rotation={[0, mod.ry, 0]}>
          <ArcSofaSegment
            wool={wool}
            piping={piping}
            isEnd={i === 0 || i === ARC_MODULES.length - 1}
            armSide={i === 0 ? -1 : 1}
          />
        </group>
      ))}

      <ArcJointFillers wool={wool} piping={piping} />
      <ArcTrimRail poses={railPoses} />

      <RoundCoffeeTable position={[0, 0, TABLE_Z]} />
    </group>
  );
}

export function TvWatchCouch() {
  const { wool, piping } = useSofaMaterials();

  return (
    <group position={[CX, FLOOR_Y, CZ]}>
      <group scale={[SOFA_SCALE, SOFA_SCALE * SOFA_HEIGHT_SCALE, SOFA_SCALE]}>
        <UnifiedArcSofa wool={wool} piping={piping} />
      </group>
    </group>
  );
}
