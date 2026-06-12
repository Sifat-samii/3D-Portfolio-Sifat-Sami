"use client";

import { useMemo } from "react";
import {
  BRIDGE_Y,
  FRETS,
  NUT_Y,
  SINGLE_DOTS,
  createFretboardGeometry,
  createIbanezHeadGeometry,
  createNeckGeometry,
  createRgBodyGeometry,
  dotY,
  fbWidth,
} from "@/lib/guitarShapes";
import { scaleWorldZ } from "@/lib/roomLayout";

/**
 * Ibanez RG on an A-frame stand — south-east corner of the east (guitar) wall.
 */

const FLOOR_Y = 0.10;
const STAND_FRAME = "#131110";
const METAL = "#181614";
const STEEL = "#b6ae98";
const STEEL_WOUND = "#7a7260";

/** South-east corner, slightly into the room from the wood wall. */
const STAND_X = -7.82;
const STAND_Z = scaleWorldZ(5.35);
const GUITAR_SCALE = 1.05;

const IBANEZ_FINISH = {
  body: "#6b1a1a",
  neck: "#241407",
  fretboard: "#1c1009",
  inlay: "#ffd060",
};

export function FloorGuitarStand() {
  const bodyGeom = useMemo(() => createRgBodyGeometry(), []);
  const headGeom = useMemo(() => createIbanezHeadGeometry(), []);
  const fboardGeom = useMemo(() => createFretboardGeometry(), []);
  const neckGeom = useMemo(() => createNeckGeometry(), []);

  const inlay = IBANEZ_FINISH.inlay;
  const bodyDepth = -0.049;

  return (
    <group position={[STAND_X, FLOOR_Y, STAND_Z]} rotation={[0, -0.35, 0]}>
      {/* A-frame stand */}
      {[-0.11, 0.11].map((lz) => (
        <mesh
          key={`leg-${lz}`}
          position={[0.04, 0.24, lz]}
          rotation={[lz < 0 ? 0.3 : -0.3, 0, 0.16]}
        >
          <cylinderGeometry args={[0.009, 0.009, 0.52, 8]} />
          <meshStandardMaterial color={STAND_FRAME} metalness={0.6} roughness={0.32} />
        </mesh>
      ))}
      <mesh position={[-0.12, 0.28, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.009, 0.009, 0.58, 8]} />
        <meshStandardMaterial color={STAND_FRAME} metalness={0.6} roughness={0.32} />
      </mesh>
      {[-0.1, 0.1].map((cz) => (
        <mesh key={`cradle-${cz}`} position={[0.1, 0.12, cz]} rotation={[0, 0, 0.22]}>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          <meshStandardMaterial color="#141210" roughness={0.85} metalness={0.1} />
        </mesh>
      ))}

      {/* Ibanez RG — leans back on the stand, neck up */}
      <group
        position={[0.08, 0, 0]}
        rotation={[0, -Math.PI / 2, -0.14]}
        scale={[GUITAR_SCALE, GUITAR_SCALE, GUITAR_SCALE]}
      >
        <mesh geometry={bodyGeom} position={[0, 0, bodyDepth]}>
          <meshStandardMaterial color={IBANEZ_FINISH.body} roughness={0.82} metalness={0.04} />
        </mesh>
        {[-0.105, -0.055, 0.012, 0.068, 0.118].map((ox, i) => (
          <mesh key={`grain-${i}`} position={[ox, -0.035, 0.0015]}>
            <boxGeometry args={[0.008 + (i % 2) * 0.005, 0.34, 0.0015]} />
            <meshStandardMaterial color={IBANEZ_FINISH.neck} roughness={0.88} metalness={0.01} />
          </mesh>
        ))}
        <mesh geometry={neckGeom} position={[0, 0, -0.022]}>
          <meshStandardMaterial color={IBANEZ_FINISH.neck} roughness={0.8} metalness={0.02} />
        </mesh>
        <mesh geometry={fboardGeom} position={[0, 0, -0.001]}>
          <meshStandardMaterial color={IBANEZ_FINISH.fretboard} roughness={0.85} metalness={0.01} />
        </mesh>
        <mesh position={[0, NUT_Y, 0.011]}>
          <boxGeometry args={[0.045, 0.008, 0.008]} />
          <meshStandardMaterial color="#d8d0c0" roughness={0.5} metalness={0.05} />
        </mesh>
        {FRETS.map((y, i) => (
          <mesh key={`fret-${i}`} position={[0, y, 0.0125]}>
            <boxGeometry args={[fbWidth(y) - 0.003, 0.0035, 0.0035]} />
            <meshStandardMaterial color="#8a8580" metalness={0.65} roughness={0.3} />
          </mesh>
        ))}
        {SINGLE_DOTS.map((y, i) => (
          <mesh key={`dot-${i}`} position={[0, y, 0.0128]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0042, 0.0042, 0.002, 10]} />
            <meshStandardMaterial color={inlay} roughness={0.55} metalness={0} />
          </mesh>
        ))}
        {[-0.012, 0.012].map((ox, i) => (
          <mesh key={`dot12-${i}`} position={[ox, dotY(12), 0.0128]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0042, 0.0042, 0.002, 10]} />
            <meshStandardMaterial color={inlay} roughness={0.55} metalness={0} />
          </mesh>
        ))}
        <mesh geometry={headGeom} position={[0, NUT_Y, -0.016]}>
          <meshStandardMaterial color={IBANEZ_FINISH.neck} roughness={0.82} metalness={0.03} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={`tpost-${i}`}
            position={[-0.018, NUT_Y + 0.028 + i * 0.0205, 0.006]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.0042, 0.0042, 0.014, 8]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.28} />
          </mesh>
        ))}
        <mesh position={[0, 0.052, 0.008]}>
          <boxGeometry args={[0.082, 0.038, 0.014]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.45} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.058, 0.008]}>
          <boxGeometry args={[0.082, 0.038, 0.014]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.45} metalness={0.1} />
        </mesh>
        <mesh position={[0, BRIDGE_Y, 0.007]}>
          <boxGeometry args={[0.078, 0.030, 0.012]} />
          <meshStandardMaterial color={METAL} metalness={0.68} roughness={0.35} />
        </mesh>
        {[-0.0205, -0.0123, -0.0041, 0.0041, 0.0123, 0.0205].map((ox, i) => (
          <mesh key={`str-${i}`} position={[ox, (NUT_Y + BRIDGE_Y) / 2, 0.0165]}>
            <boxGeometry args={[i < 3 ? 0.0022 : 0.0014, NUT_Y - BRIDGE_Y, 0.0012]} />
            <meshStandardMaterial
              color={i < 3 ? STEEL_WOUND : STEEL}
              metalness={0.85}
              roughness={0.18}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
