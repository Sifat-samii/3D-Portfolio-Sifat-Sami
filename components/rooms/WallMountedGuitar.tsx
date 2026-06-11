"use client";

import { useMemo } from "react";
import {
  BRIDGE_Y,
  FRETS,
  NUT_Y,
  SINGLE_DOTS,
  createDeanHeadGeometry,
  createDeanMlBodyGeometry,
  createFretboardGeometry,
  createIbanezHeadGeometry,
  createJacksonHeadGeometry,
  createNeckGeometry,
  createRgBodyGeometry,
  createRhoadsBodyGeometry,
  dotY,
  fbWidth,
} from "@/lib/guitarShapes";

export type GuitarShape = "rg" | "rhoads" | "deanMl";

export type GuitarFinish = {
  body: string;
  bodyAccent?: string;
  neck: string;
  fretboard: string;
  inlay?: string;
};

type WallMountedGuitarProps = {
  shape: GuitarShape;
  finish: GuitarFinish;
  wallX: number;
  faceX: number;
  z: number;
  bodyY?: number;
  scale?: number;
};

const METAL = "#181614";
const STEEL = "#b6ae98";
const STEEL_WOUND = "#7a7260";

function bodyGeometryFor(shape: GuitarShape) {
  switch (shape) {
    case "rhoads":
      return createRhoadsBodyGeometry();
    case "deanMl":
      return createDeanMlBodyGeometry();
    default:
      return createRgBodyGeometry();
  }
}

function headGeometryFor(shape: GuitarShape) {
  switch (shape) {
    case "rhoads":
      return createJacksonHeadGeometry();
    case "deanMl":
      return createDeanHeadGeometry();
    default:
      return createIbanezHeadGeometry();
  }
}

export function WallMountedGuitar({
  shape,
  finish,
  wallX,
  faceX,
  z,
  bodyY = 1.9,
  scale = 2.0,
}: WallMountedGuitarProps) {
  const bodyGeom = useMemo(() => bodyGeometryFor(shape), [shape]);
  const headGeom = useMemo(() => headGeometryFor(shape), [shape]);
  const fboardGeom = useMemo(() => createFretboardGeometry(), []);
  const neckGeom = useMemo(() => createNeckGeometry(), []);

  const nutWorldY = bodyY + NUT_Y * scale;
  const inlay = finish.inlay ?? "#e8e2d4";
  const bodyDepth = shape === "rg" ? -0.049 : -0.045;

  return (
    <group>
      {/* Wall hanger */}
      <mesh position={[wallX - 0.008, nutWorldY - 0.06, z]}>
        <boxGeometry args={[0.016, 0.28, 0.11]} />
        <meshStandardMaterial color={METAL} metalness={0.72} roughness={0.32} />
      </mesh>
      <mesh position={[wallX - 0.058, nutWorldY - 0.04, z]}>
        <boxGeometry args={[0.096, 0.034, 0.04]} />
        <meshStandardMaterial color={METAL} metalness={0.72} roughness={0.32} />
      </mesh>
      {[-0.075, 0.075].map((oz) => (
        <mesh key={oz} position={[wallX - 0.108, nutWorldY - 0.025, z + oz]}>
          <boxGeometry args={[0.030, 0.100, 0.024]} />
          <meshStandardMaterial color="#141414" roughness={0.94} metalness={0.0} />
        </mesh>
      ))}

      {/* Guitar — faces west into the music room */}
      <group position={[faceX, bodyY, z]} rotation={[0, -Math.PI / 2, 0]} scale={[scale, scale, scale]}>
        <mesh geometry={bodyGeom} position={[0, 0, bodyDepth]}>
          <meshStandardMaterial color={finish.body} roughness={0.82} metalness={0.04} />
        </mesh>

        {finish.bodyAccent
          ? [-0.09, -0.02, 0.06].map((ox, i) => (
              <mesh key={`accent-${i}`} position={[ox, -0.04, 0.002]}>
                <boxGeometry args={[0.012, 0.28, 0.002]} />
                <meshStandardMaterial color={finish.bodyAccent} roughness={0.75} metalness={0.08} />
              </mesh>
            ))
          : null}

        {shape === "rg"
          ? [-0.105, -0.055, 0.012, 0.068, 0.118].map((ox, i) => (
              <mesh key={`grain-${i}`} position={[ox, -0.035, 0.0015]}>
                <boxGeometry args={[0.008 + (i % 2) * 0.005, 0.34, 0.0015]} />
                <meshStandardMaterial color={finish.neck} roughness={0.88} metalness={0.01} />
              </mesh>
            ))
          : null}

        {shape === "deanMl" ? (
          <mesh position={[0, -0.12, bodyDepth - 0.008]}>
            <boxGeometry args={[0.018, 0.10, 0.028]} />
            <meshStandardMaterial
              color={finish.bodyAccent ?? "#8a1010"}
              roughness={0.55}
              metalness={0.25}
            />
          </mesh>
        ) : null}

        <mesh geometry={neckGeom} position={[0, 0, -0.022]}>
          <meshStandardMaterial color={finish.neck} roughness={0.80} metalness={0.02} />
        </mesh>
        <mesh geometry={fboardGeom} position={[0, 0, -0.001]}>
          <meshStandardMaterial color={finish.fretboard} roughness={0.85} metalness={0.01} />
        </mesh>

        <mesh position={[0, NUT_Y, 0.011]}>
          <boxGeometry args={[0.045, 0.008, 0.008]} />
          <meshStandardMaterial color="#d8d0c0" roughness={0.50} metalness={0.05} />
        </mesh>

        {FRETS.map((y, i) => (
          <mesh key={`fret-${i}`} position={[0, y, 0.0125]}>
            <boxGeometry args={[fbWidth(y) - 0.003, 0.0035, 0.0035]} />
            <meshStandardMaterial color="#8a8580" metalness={0.65} roughness={0.30} />
          </mesh>
        ))}

        {SINGLE_DOTS.map((y, i) => (
          <mesh key={`dot-${i}`} position={[0, y, 0.0128]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0042, 0.0042, 0.002, 10]} />
            <meshStandardMaterial color={inlay} roughness={0.55} metalness={0.0} />
          </mesh>
        ))}
        {[-0.012, 0.012].map((ox, i) => (
          <mesh key={`dot12-${i}`} position={[ox, dotY(12), 0.0128]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0042, 0.0042, 0.002, 10]} />
            <meshStandardMaterial color={inlay} roughness={0.55} metalness={0.0} />
          </mesh>
        ))}

        <mesh geometry={headGeom} position={[0, NUT_Y, -0.016]}>
          <meshStandardMaterial color={finish.neck} roughness={0.82} metalness={0.03} />
        </mesh>

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={`tpost-${i}`}
            position={[-0.018, NUT_Y + 0.028 + i * 0.0205, 0.006]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.0042, 0.0042, 0.014, 8]} />
            <meshStandardMaterial color={METAL} metalness={0.70} roughness={0.28} />
          </mesh>
        ))}

        <mesh position={[0, 0.052, 0.008]}>
          <boxGeometry args={[0.082, 0.038, 0.014]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.45} metalness={0.10} />
        </mesh>
        <mesh position={[0, -0.058, 0.008]}>
          <boxGeometry args={[0.082, 0.038, 0.014]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.45} metalness={0.10} />
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

      {/* Spotlight */}
      <pointLight
        position={[faceX - 0.35, 3.2, z]}
        color="#fff4c8"
        intensity={4.5}
        distance={3.5}
        decay={2}
      />
      <mesh position={[wallX - 0.10, 3.75, z]} rotation={[-0.48, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.038, 0.055, 0.16, 10]} />
        <meshStandardMaterial color="#111111" metalness={0.68} roughness={0.38} />
      </mesh>
      <mesh position={[wallX - 0.12, 3.62, z]} rotation={[-0.48, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.005, 10]} />
        <meshStandardMaterial
          color="#fff6d0"
          emissive="#fff6d0"
          emissiveIntensity={3.0}
          roughness={0.04}
        />
      </mesh>
    </group>
  );
}
