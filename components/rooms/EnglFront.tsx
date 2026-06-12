"use client";

import type { AmpFrontLayout } from "@/components/rooms/ampFrontShared";
import { FrontSlab, FrontText, slabX } from "@/components/rooms/ampFrontShared";

/**
 * ENGL Ironball half-stack — slat head grille, hex cab mesh, chrome corners.
 */

const BLACK = "#101010";
const MESH = "#1a1a1c";
const SLAT = "#2a2a30";
const CHROME = "#b8bcc4";
const KNOB = "#141414";
const RED = "#d42020";

function ChromeCorners({
  frontX,
  y,
  w,
  h,
  scale,
}: {
  frontX: number;
  y: number;
  w: number;
  h: number;
  scale: number;
}) {
  const cap = 0.038 * scale;
  const x = slabX(frontX, 0.014);
  const halfW = w / 2;
  const halfH = h / 2;

  return (
    <group>
      {[
        [-halfW, halfH],
        [halfW, halfH],
        [-halfW, -halfH],
        [halfW, -halfH],
      ].map(([oz, oy], i) => (
        <mesh key={i} position={[x, y + oy, oz]}>
          <boxGeometry args={[0.014, cap, cap]} />
          <meshStandardMaterial color={CHROME} metalness={0.82} roughness={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function SlatGrille({
  frontX,
  y,
  w,
  h,
  scale,
  facing = "east",
}: {
  frontX: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  facing?: AmpFrontLayout["facing"];
}) {
  const depth = 0.016;
  const slats = Math.max(8, Math.round(h / 0.022));

  return (
    <group position={[0, y, 0]}>
      <FrontSlab frontX={frontX} y={0} w={w} h={h} depth={depth} color={MESH} />
      {Array.from({ length: slats }, (_, i) => {
        const oy = -h / 2 + (i + 0.5) * (h / slats);
        return (
          <mesh key={i} position={[slabX(frontX, depth) - 0.001, oy, 0]}>
            <boxGeometry args={[0.004, 0.006, w * 0.94]} />
            <meshStandardMaterial color={SLAT} metalness={0.5} roughness={0.38} />
          </mesh>
        );
      })}
      <mesh position={[slabX(frontX, depth) + 0.005, 0, 0]}>
        <boxGeometry args={[0.006, h * 0.3, w * 0.3]} />
        <meshStandardMaterial color="#ff8030" emissive="#ff5010" emissiveIntensity={0.3} roughness={0.55} />
      </mesh>
      <FrontText frontX={frontX} y={0} z={0} size={0.075 * scale} color="#f4f4f6" facing={facing}>
        ENGL
      </FrontText>
    </group>
  );
}

function HexMeshGrille({
  frontX,
  y,
  w,
  h,
  scale,
  facing = "east",
}: {
  frontX: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  facing?: AmpFrontLayout["facing"];
}) {
  const depth = 0.018;
  const rows = 11;
  const cols = 9;
  const stepZ = w / cols;
  const stepY = h / rows;

  return (
    <group position={[0, y, 0]}>
      <FrontSlab frontX={frontX} y={0} w={w} h={h} depth={depth} color={MESH} />
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const oz = -w / 2 + (col + 0.5) * stepZ + (row % 2 === 0 ? 0 : stepZ * 0.5);
          const oy = -h / 2 + (row + 0.5) * stepY;
          if (Math.abs(oz) > w * 0.48) return null;
          return (
            <mesh key={`${row}-${col}`} position={[slabX(frontX, depth) - 0.002, oy, oz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.007, 0.007, 0.005, 6]} />
              <meshStandardMaterial color="#0c0c0e" metalness={0.45} roughness={0.45} />
            </mesh>
          );
        }),
      )}
      {/* Single speaker behind mesh */}
      <group position={[slabX(frontX, depth) + 0.006, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[h * 0.34, 28]} />
          <meshStandardMaterial color="#0a0908" roughness={0.94} metalness={0.02} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0.004, 0, 0]}>
          <circleGeometry args={[h * 0.1, 20]} />
          <meshStandardMaterial color="#1a1410" roughness={0.85} />
        </mesh>
      </group>
      <FrontText frontX={frontX} y={0} z={0} size={0.1 * scale} color="#f4f4f6" facing={facing}>
        ENGL
      </FrontText>
    </group>
  );
}

function CabinetFront(props: AmpFrontLayout) {
  const { cabFrontX, cabY, cabW, cabH, scale, facing = "east" } = props;
  const frameW = cabW * 0.9;
  const frameH = cabH * 0.9;

  return (
    <group>
      <ChromeCorners frontX={cabFrontX} y={cabY} w={frameW} h={frameH} scale={scale} />
      <HexMeshGrille
        frontX={cabFrontX}
        y={cabY}
        w={frameW * 0.96}
        h={frameH * 0.94}
        scale={scale}
        facing={facing}
      />
    </group>
  );
}

function HeadFront(props: AmpFrontLayout) {
  const { headFrontX, headY, headW, headH, scale, facing = "east" } = props;
  const grilleH = headH * 0.56;
  const panelH = headH * 0.36;
  const grilleY = headY + headH * 0.17;
  const panelY = headY - headH * 0.21;
  const frameW = headW * 0.94;
  const panelDepth = 0.016;

  const knob = (z: number) => (
    <mesh key={z} position={[headFrontX - 0.026, panelY, z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.01 * scale, 0.01 * scale, 0.013 * scale, 12]} />
      <meshStandardMaterial color={KNOB} metalness={0.35} roughness={0.5} />
    </mesh>
  );

  const knobSpan = frameW * 0.55;
  const knobZ = (i: number, n: number) => -knobSpan / 2 + (i + 0.5) * (knobSpan / n);

  return (
    <group>
      <ChromeCorners frontX={headFrontX} y={grilleY} w={frameW} h={grilleH} scale={scale} />
      <SlatGrille
        frontX={headFrontX}
        y={grilleY}
        w={frameW * 0.96}
        h={grilleH * 0.92}
        scale={scale}
        facing={facing}
      />

      <mesh position={[slabX(headFrontX, panelDepth), panelY, 0]}>
        <boxGeometry args={[panelDepth, panelH, frameW]} />
        <meshStandardMaterial color={BLACK} roughness={0.78} metalness={0.08} />
      </mesh>

      {Array.from({ length: 7 }, (_, i) => knob(knobZ(i, 7)))}

      <mesh position={[headFrontX - 0.024, panelY + panelH * 0.1, frameW * 0.4]}>
        <boxGeometry args={[0.008, 0.034 * scale, 0.022 * scale]} />
        <meshStandardMaterial color={RED} emissive="#881010" emissiveIntensity={0.55} />
      </mesh>

      {[-0.28, -0.2].map((zOff) => (
        <mesh key={zOff} position={[headFrontX - 0.024, panelY + panelH * 0.08, frameW * zOff]}>
          <boxGeometry args={[0.007, 0.02 * scale, 0.012 * scale]} />
          <meshStandardMaterial color="#c8c8cc" metalness={0.6} roughness={0.28} />
        </mesh>
      ))}

      <mesh position={[headFrontX - 0.024, panelY - panelH * 0.02, frameW * 0.42]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006 * scale, 0.006 * scale, 0.012, 8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.65} roughness={0.28} />
      </mesh>

      <FrontText
        frontX={headFrontX}
        y={panelY + panelH * 0.22}
        z={frameW * 0.22}
        size={0.032 * scale}
        color="#f0f0f4"
        facing={facing}
      >
        Ironball
      </FrontText>
    </group>
  );
}

export function EnglFront(props: AmpFrontLayout) {
  return (
    <group>
      <pointLight position={[props.cabFrontX - 0.4, props.cabY + props.cabH * 0.5, 0]} color="#ffe8e0" intensity={0.8} distance={2.5} decay={2} />
      <CabinetFront {...props} />
      <HeadFront {...props} />
    </group>
  );
}
