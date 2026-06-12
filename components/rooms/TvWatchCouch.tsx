"use client";

/**
 * Unified curved sectional — single low arc sofa facing the north-wall TV (−Z).
 */

import { RoundedBox } from "@react-three/drei";
import { createWoolTexture } from "@/lib/sofaTextures";
import { scaleWorldZ } from "@/lib/roomLayout";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const CX = -14.5;
const CZ = scaleWorldZ(-2.88);
const FLOOR_Y = 0.10;
const SOFA_SCALE = 1.08;

/** Oatmeal tan wool — uniform upholstery. */
const WOOL = "#d4c8b4";
/** Analogous warm tones that complement the sofa. */
const RUG = "#e0d4c2";
const STONE = "#b0a090";
const STONE_VEIN = "#8a7868";
const BRASS_TRIM = "#b8a080";

const trimMat = new THREE.MeshStandardMaterial({
  color: BRASS_TRIM,
  metalness: 0.78,
  roughness: 0.28,
});

const stoneMat = new THREE.MeshStandardMaterial({
  color: STONE,
  roughness: 0.22,
  metalness: 0.05,
});

function useWoolMaterial() {
  const map = useMemo(() => createWoolTexture(WOOL), []);

  useEffect(() => () => map.dispose(), [map]);

  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map,
        color: "#ffffff",
        roughness: 0.93,
        metalness: 0,
      }),
    [map],
  );
}

type WoolBoxProps = {
  args: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  material: THREE.MeshStandardMaterial;
};

function WoolBox({ args, position = [0, 0, 0], rotation = [0, 0, 0], radius = 0.06, material }: WoolBoxProps) {
  return (
    <RoundedBox
      args={args}
      radius={radius}
      smoothness={8}
      position={position}
      rotation={rotation}
      material={material}
      castShadow
      receiveShadow
    />
  );
}

/** Segment overlap so adjacent pieces read as one continuous sofa. */
const SEG_W = 1.04;
const SEG_D = 1.1;
const SEAT_W = 0.94;
const SEAT_D = 0.96;

type ArcPose = { x: number; z: number; ry: number };

/** Four-seat arc — reversed bow (convex toward the TV). */
const ARC_MODULES: ArcPose[] = [
  { x: -1.42, z: -0.14, ry: -0.34 },
  { x: -0.48, z: 0.02, ry: -0.11 },
  { x: 0.48, z: 0.02, ry: 0.11 },
  { x: 1.42, z: -0.14, ry: 0.34 },
];

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

/** Continuous brass trim rail following the full arc. */
function ArcTrimRail({ poses }: { poses: ArcRailPose[] }) {
  return (
    <>
      {poses.map((pose, i) => (
        <mesh key={`trim-${i}`} position={[pose.x, 0.026, pose.z]} rotation={[0, pose.ry, 0]} material={trimMat}>
          <boxGeometry
            args={[pose.kind === "segment" ? SEG_W + 0.04 : 0.72, 0.007, SEG_D + 0.02]}
          />
        </mesh>
      ))}
    </>
  );
}

/** Continuous chrome plinth skim along the arc base. */
function ArcPlinthSkim({ poses }: { poses: ArcRailPose[] }) {
  return (
    <>
      {poses.map((pose, i) => (
        <mesh key={`skim-${i}`} position={[pose.x, 0.06, pose.z]} rotation={[0, pose.ry, 0]} material={trimMat}>
          <boxGeometry args={[pose.kind === "segment" ? SEG_W + 0.06 : 0.76, 0.006, 0.24]} />
        </mesh>
      ))}
    </>
  );
}

/** One arc segment — widened so neighbouring segments overlap seamlessly. */
function ArcSofaSegment({ wool }: { wool: THREE.MeshStandardMaterial }) {
  return (
    <group>
      <WoolBox args={[SEG_W, 0.11, SEG_D]} position={[0, 0.08, 0]} radius={0.045} material={wool} />
      <WoolBox args={[SEAT_W, 0.13, SEAT_D]} position={[0, 0.30, -0.03]} radius={0.065} material={wool} />
      <WoolBox args={[SEAT_W, 0.38, 0.20]} position={[0, 0.54, 0.34]} radius={0.07} material={wool} />
      <WoolBox args={[0.34, 0.34, 0.12]} position={[0, 0.48, 0.08]} radius={0.05} material={wool} />
    </group>
  );
}

/** Wool fillers at segment joints — blends seat and back into one piece. */
function ArcJointFillers({ wool }: { wool: THREE.MeshStandardMaterial }) {
  return (
    <>
      {ARC_MIDPOINTS.map((pose, i) => (
        <group key={`joint-${i}`} position={[pose.x, 0, pose.z]} rotation={[0, pose.ry, 0]}>
          <WoolBox args={[0.24, 0.11, SEG_D]} position={[0, 0.08, 0]} radius={0.04} material={wool} />
          <WoolBox args={[0.22, 0.13, SEAT_D]} position={[0, 0.30, -0.03]} radius={0.05} material={wool} />
          <WoolBox args={[0.22, 0.38, 0.20]} position={[0, 0.54, 0.34]} radius={0.06} material={wool} />
        </group>
      ))}
    </>
  );
}

const TABLE_TOP_R = 0.55;
const TABLE_TOP_THICK = 0.065;
const TABLE_TOP_Y = 0.47;
const PROP_SCALE = 1.25;

function WineBottle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={PROP_SCALE}>
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.036, 0.038, 0.22, 16]} />
        <meshStandardMaterial color="#1e3428" roughness={0.12} metalness={0.15} transparent={true} opacity={0.92} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.014, 0.016, 0.05, 12]} />
        <meshStandardMaterial color="#1e3428" roughness={0.12} metalness={0.15} transparent={true} opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.275, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.03, 10]} />
        <meshStandardMaterial color="#4a3020" roughness={0.75} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.018, 16]} />
        <meshStandardMaterial color="#141414" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

function BeerCan({ position, label = "#c41e1e" }: { position: [number, number, number]; label?: string }) {
  return (
    <group position={position} scale={PROP_SCALE}>
      <mesh position={[0, 0.059, 0]} castShadow>
        <cylinderGeometry args={[0.031, 0.031, 0.118, 20]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.35} metalness={0.82} />
      </mesh>
      <mesh position={[0, 0.069, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.055, 20]} />
        <meshStandardMaterial color={label} roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.031, 0.031, 0.004, 20]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Ashtray({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={PROP_SCALE}>
      <mesh position={[0, 0.011, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.062, 0.022, 24]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.45} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.044, 0.048, 0.014, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.018, 0.023, 0.012]} rotation={[0.1, 0.4, 1.2]}>
        <cylinderGeometry args={[0.002, 0.002, 0.042, 6]} />
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

/** Pedestal round table — thick stone top, apron, column base. */
function RoundCoffeeTable({ position }: { position: [number, number, number] }) {
  const apronY = TABLE_TOP_Y - TABLE_TOP_THICK - 0.03;

  return (
    <group position={position}>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[TABLE_TOP_R + 0.24, 48]} />
        <meshStandardMaterial color={RUG} roughness={0.96} metalness={0} />
      </mesh>

      {/* Pedestal foot */}
      <mesh position={[0, 0.035, 0]} material={trimMat} castShadow>
        <cylinderGeometry args={[0.36, 0.42, 0.07, 32]} />
      </mesh>
      {/* Column */}
      <mesh position={[0, 0.22, 0]} material={trimMat} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 0.28, 20]} />
      </mesh>
      {/* Stone apron ring */}
      <mesh position={[0, apronY, 0]} material={stoneMat} castShadow>
        <cylinderGeometry args={[TABLE_TOP_R - 0.03, TABLE_TOP_R - 0.03, 0.055, 48]} />
      </mesh>
      {/* Thick top slab */}
      <mesh position={[0, TABLE_TOP_Y, 0]} material={stoneMat} castShadow receiveShadow>
        <cylinderGeometry args={[TABLE_TOP_R, TABLE_TOP_R, TABLE_TOP_THICK, 48]} />
      </mesh>
      {/* Bevel lip */}
      <mesh position={[0, TABLE_TOP_Y - TABLE_TOP_THICK / 2 - 0.008, 0]} material={stoneMat}>
        <torusGeometry args={[TABLE_TOP_R - 0.01, 0.014, 10, 48]} />
      </mesh>
      <mesh position={[0.14, TABLE_TOP_Y + 0.001, 0.08]} rotation={[0, 0.45, 0]}>
        <boxGeometry args={[0.36, 0.003, 0.009]} />
        <meshStandardMaterial color={STONE_VEIN} roughness={0.24} metalness={0.03} />
      </mesh>

      <TabletopProps topY={TABLE_TOP_Y} />
    </group>
  );
}

/** Single unified arc sectional — same curve, one continuous body. */
function UnifiedArcSofa({ wool }: { wool: THREE.MeshStandardMaterial }) {
  const railPoses = arcRailPoses();

  return (
    <group>
      {ARC_MODULES.map((mod, i) => (
        <group key={`seg-${i}`} position={[mod.x, 0, mod.z]} rotation={[0, mod.ry, 0]}>
          <ArcSofaSegment wool={wool} />
        </group>
      ))}

      <ArcJointFillers wool={wool} />
      <ArcTrimRail poses={railPoses} />
      <ArcPlinthSkim poses={railPoses} />

      <RoundCoffeeTable position={[0, 0, -1.165]} />
    </group>
  );
}

export function TvWatchCouch() {
  const wool = useWoolMaterial();

  return (
    <group position={[CX, FLOOR_Y, CZ]}>
      <group scale={[SOFA_SCALE, SOFA_SCALE, SOFA_SCALE]}>
        <UnifiedArcSofa wool={wool} />
      </group>
      <pointLight position={[0, 1.4, -0.4]} color="#fff6ec" intensity={0.40} distance={5} decay={2} />
    </group>
  );
}
