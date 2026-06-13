"use client";

/**
 * Premium curved sectional — low floating profile, bouclé upholstery,
 * channel back, brushed bronze base. Faces the north-wall TV (−Z).
 */

import { RoundedBox } from "@react-three/drei";
import { createBoucleTexture, createMarbleTexture } from "@/lib/sofaTextures";
import { scaleWorldZ } from "@/lib/roomLayout";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const CX = -14.5;
const CZ = scaleWorldZ(-2.48);
const FLOOR_Y = 0.10;
const SOFA_SCALE = 1.20;
const SOFA_HEIGHT_SCALE = 1.08;
const CENTER_FORWARD = 0.04;

const BOUCLE = "#a8a094";
const PIPING = "#6e6860";
const STITCH = "#8a8278";
const BASE_WOOD = "#2a2420";
const BRONZE = "#9a8468";
const RUG = "#ddd0bc";
const ACCENT_PILLOW = "#5c4030";

const bronzeMat = new THREE.MeshStandardMaterial({
  color: BRONZE,
  metalness: 0.86,
  roughness: 0.28,
});

const baseMat = new THREE.MeshStandardMaterial({
  color: BASE_WOOD,
  metalness: 0.12,
  roughness: 0.72,
});

const stitchMat = new THREE.MeshStandardMaterial({
  color: STITCH,
  roughness: 0.82,
  metalness: 0,
});

function useSofaMaterials() {
  const map = useMemo(() => createBoucleTexture(BOUCLE), []);

  useEffect(() => () => map.dispose(), [map]);

  const fabric = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map,
        color: "#ddd6ca",
        roughness: 0.9,
        metalness: 0,
        sheen: 0.92,
        sheenRoughness: 0.38,
        sheenColor: new THREE.Color("#f0ebe2"),
      }),
    [map],
  );

  const piping = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PIPING,
        roughness: 0.48,
        metalness: 0.04,
      }),
    [],
  );

  const accent = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: ACCENT_PILLOW,
        roughness: 0.92,
        metalness: 0,
        sheen: 0.55,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color("#7a5848"),
      }),
    [],
  );

  return { fabric, piping, accent };
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

type FabricBoxProps = {
  args: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
};

function FabricBox({
  args,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  radius = 0.08,
  material,
}: FabricBoxProps) {
  const maxR = Math.min(args[0], args[1], args[2]) * 0.38;
  return (
    <RoundedBox
      args={args}
      radius={Math.min(radius, maxR)}
      smoothness={SMOOTH}
      position={position}
      rotation={rotation}
      material={material}
      castShadow
      receiveShadow
    />
  );
}

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
      args={[width, 0.008, 0.008]}
      radius={0.004}
      smoothness={16}
      position={position}
      rotation={rotation}
      material={material}
      castShadow
    />
  );
}

/** Soft vertical channel lines — rounded, low profile. */
function SoftChannels({
  width,
  height,
  depth,
  count,
  position,
  rotation = [0, 0, 0],
}: {
  width: number;
  height: number;
  depth: number;
  count: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const spacing = width / (count + 1);
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: count }, (_, i) => {
        const x = -width / 2 + spacing * (i + 1);
        return (
          <RoundedBox
            key={i}
            args={[0.003, height * 0.88, 0.002]}
            radius={0.0012}
            smoothness={10}
            position={[x, 0, depth / 2 + 0.001]}
            material={stitchMat}
          />
        );
      })}
    </group>
  );
}

const SMOOTH = 28;
const SEG_W = 1.06;
const SEG_D = 1.08;
const SEAT_W = 0.96;
const SEAT_D = 0.98;
const SEG_OVERLAP = 0.06;

type ArcPose = { x: number; z: number; ry: number };

const END_FORWARD = 0.14;
const INNER_FORWARD = END_FORWARD * 0.5;

const ARC_MODULES_BASE: ArcPose[] = [
  { x: -1.56, z: -0.15, ry: -0.36 },
  { x: -0.78, z: 0.01, ry: -0.18 },
  { x: 0, z: 0.05, ry: 0 },
  { x: 0.78, z: 0.01, ry: 0.18 },
  { x: 1.56, z: -0.15, ry: 0.36 },
];

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

const BACK_TILT = -0.09;
const BASE_H = 0.048;
const FLOAT_GAP = 0.016;

/** Seat-to-back transition wedge for a continuous silhouette. */
function BackWedge({
  width,
  depth,
  position,
  rotation = [0, 0, 0],
  material,
}: {
  width: number;
  depth: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  material: THREE.MeshPhysicalMaterial;
}) {
  return (
    <FabricBox
      args={[width, 0.1, depth]}
      position={position}
      rotation={rotation}
      radius={0.06}
      material={material}
    />
  );
}

/** Low floating pedestal + unified cushion + flowing back. */
function PremiumArcSegment({
  fabric,
  piping,
  isEnd = false,
  armSide = 1,
  showPillow = false,
  accent,
}: {
  fabric: THREE.MeshPhysicalMaterial;
  piping: THREE.MeshStandardMaterial;
  isEnd?: boolean;
  armSide?: 1 | -1;
  showPillow?: boolean;
  accent?: THREE.MeshPhysicalMaterial;
}) {
  const seatY = BASE_H + FLOAT_GAP + 0.09;
  const cushionH = 0.11;
  const deckW = SEG_W + SEG_OVERLAP;

  return (
    <group>
      <FabricBox args={[deckW, BASE_H, SEG_D]} position={[0, BASE_H / 2, 0]} radius={0.038} material={baseMat} />
      <RoundedBox
        args={[deckW - 0.05, 0.006, SEG_D - 0.05]}
        radius={0.003}
        smoothness={20}
        position={[0, BASE_H + 0.001, 0]}
        material={bronzeMat}
        castShadow
      />

      {/* Unified seat cushion with subtle crown */}
      <FabricBox
        args={[SEAT_W, cushionH, SEAT_D - 0.04]}
        position={[0, seatY + cushionH / 2, -0.015]}
        radius={0.075}
        material={fabric}
      />
      <FabricBox
        args={[SEAT_W * 0.72, 0.028, SEAT_D * 0.62]}
        position={[0, seatY + cushionH + 0.008, -0.02]}
        radius={0.05}
        material={fabric}
      />
      <PipingCord
        width={SEAT_W * 0.94}
        position={[0, seatY + cushionH + 0.003, SEAT_D / 2 - 0.09]}
        material={piping}
      />

      <BackWedge
        width={SEAT_W * 0.92}
        depth={0.12}
        position={[0, seatY + cushionH + 0.04, 0.2]}
        rotation={[BACK_TILT * 0.55, 0, 0]}
        material={fabric}
      />

      <group position={[0, seatY + cushionH + 0.14, 0.28]} rotation={[BACK_TILT, 0, 0]}>
        <FabricBox args={[SEAT_W, 0.42, 0.13]} position={[0, 0.13, 0]} radius={0.085} material={fabric} />
        <FabricBox args={[SEAT_W * 0.96, 0.05, 0.09]} position={[0, 0.34, -0.015]} radius={0.045} material={fabric} />
        <SoftChannels width={SEAT_W * 0.88} height={0.38} depth={0.13} count={4} position={[0, 0.13, 0]} />
        <PipingCord width={SEAT_W * 0.94} position={[0, 0.03, 0.068]} material={piping} />
        <PipingCord width={SEAT_W * 0.94} position={[0, 0.33, -0.01]} material={piping} />
      </group>

      {isEnd && (
        <FabricBox
          args={[0.064, 0.34, SEG_D * 0.8]}
          position={[armSide * 0.48, seatY + 0.18, 0.015]}
          radius={0.058}
          material={fabric}
        />
      )}

      {showPillow && accent ? (
        <FabricBox
          args={[0.26, 0.09, 0.26]}
          position={[0.1, seatY + cushionH + 0.06, -0.06]}
          rotation={[0, 0.22, 0]}
          radius={0.055}
          material={accent}
        />
      ) : null}
    </group>
  );
}

function PremiumJointFillers({
  fabric,
  piping,
}: {
  fabric: THREE.MeshPhysicalMaterial;
  piping: THREE.MeshStandardMaterial;
}) {
  const seatY = BASE_H + FLOAT_GAP + 0.09;
  const cushionH = 0.11;

  return (
    <>
      {ARC_MIDPOINTS.map((pose, i) => (
        <group key={`joint-${i}`} position={[pose.x, 0, pose.z]} rotation={[0, pose.ry, 0]}>
          <FabricBox args={[0.5, BASE_H, SEG_D]} position={[0, BASE_H / 2, 0]} radius={0.034} material={baseMat} />
          <FabricBox
            args={[0.46, cushionH, SEAT_D - 0.04]}
            position={[0, seatY + cushionH / 2, -0.015]}
            radius={0.07}
            material={fabric}
          />
          <BackWedge
            width={0.42}
            depth={0.12}
            position={[0, seatY + cushionH + 0.04, 0.2]}
            rotation={[BACK_TILT * 0.55, 0, 0]}
            material={fabric}
          />
          <group position={[0, seatY + cushionH + 0.14, 0.28]} rotation={[BACK_TILT, 0, 0]}>
            <FabricBox args={[0.44, 0.42, 0.13]} position={[0, 0.13, 0]} radius={0.08} material={fabric} />
            <PipingCord width={0.38} position={[0, 0.03, 0.068]} material={piping} />
          </group>
        </group>
      ))}
    </>
  );
}

/** Continuous low bronze rail hugging each module edge. */
function PremiumBaseSkirt() {
  return (
    <>
      {ARC_MODULES.map((mod, i) => (
        <group key={`skirt-${i}`} position={[mod.x, 0.005, mod.z]} rotation={[0, mod.ry, 0]}>
          <RoundedBox
            args={[SEG_W + SEG_OVERLAP + 0.01, 0.008, SEG_D + 0.008]}
            radius={0.003}
            smoothness={20}
            material={bronzeMat}
            castShadow
          />
        </group>
      ))}
      {ARC_MIDPOINTS.map((pose, i) => (
        <group key={`skirt-mid-${i}`} position={[pose.x, 0.005, pose.z]} rotation={[0, pose.ry, 0]}>
          <RoundedBox args={[0.48, 0.008, SEG_D + 0.008]} radius={0.003} smoothness={20} material={bronzeMat} />
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

function PremiumArcSofa({
  fabric,
  piping,
  accent,
}: {
  fabric: THREE.MeshPhysicalMaterial;
  piping: THREE.MeshStandardMaterial;
  accent: THREE.MeshPhysicalMaterial;
}) {
  return (
    <group>
      {ARC_MODULES.map((mod, i) => (
        <group key={`seg-${i}`} position={[mod.x, 0, mod.z]} rotation={[0, mod.ry, 0]}>
          <PremiumArcSegment
            fabric={fabric}
            piping={piping}
            accent={accent}
            isEnd={i === 0 || i === ARC_MODULES.length - 1}
            armSide={i === 0 ? -1 : 1}
            showPillow={i === 2}
          />
        </group>
      ))}

      <PremiumJointFillers fabric={fabric} piping={piping} />
      <PremiumBaseSkirt />
      <RoundCoffeeTable position={[0, 0, TABLE_Z]} />
    </group>
  );
}

export function TvWatchCouch() {
  const { fabric, piping, accent } = useSofaMaterials();

  return (
    <group position={[CX, FLOOR_Y, CZ]}>
      <group scale={[SOFA_SCALE, SOFA_SCALE * SOFA_HEIGHT_SCALE, SOFA_SCALE]}>
        <PremiumArcSofa fabric={fabric} piping={piping} accent={accent} />
      </group>
    </group>
  );
}
