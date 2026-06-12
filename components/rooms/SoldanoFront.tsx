"use client";

import { type AmpFrontLayout, FrontSlab, FrontText, GrilleCloth, slabX } from "@/components/rooms/ampFrontShared";

/**
 * Soldano half-stack front — diamond mesh head, white control strip, cloth cab.
 */

const DIAMOND_MESH = "#1a1a1e";
const DIAMOND = "#4a4a52";
const PANEL = "#e6e6ec";
const KNOB = "#b0b0b8";
const JEWEL = "#3080e8";

function BlackFrame({ frontX, y, w, h }: { frontX: number; y: number; w: number; h: number }) {
  const lip = 0.014;
  const depth = 0.012;
  const x = slabX(frontX, depth);
  const halfW = w / 2;
  const halfH = h / 2;

  return (
    <group>
      {[
        [0, halfH, w + lip, lip],
        [0, -halfH, w + lip, lip],
        [-halfW, 0, lip, h + lip],
        [halfW, 0, lip, h + lip],
      ].map(([oz, oy, bw, bh], i) => (
        <mesh key={i} position={[x, y + oy, oz]}>
          <boxGeometry args={[depth, bh, bw]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.85} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function DiamondMeshGrille({
  frontX,
  y,
  w,
  h,
  scale,
  facing = "north",
}: {
  frontX: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  facing?: AmpFrontLayout["facing"];
}) {
  const depth = 0.016;
  const rows = 6;
  const cols = 8;
  const cellW = (w * 0.9) / cols;
  const cellH = (h * 0.88) / rows;

  return (
    <group position={[0, y, 0]}>
      <FrontSlab frontX={frontX} y={0} w={w} h={h} depth={depth} color={DIAMOND_MESH} />
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const oz = -w / 2 + (col + 0.5) * (w / cols);
          const oy = -h / 2 + (row + 0.5) * (h / rows);
          return (
            <mesh
              key={`d-${row}-${col}`}
              position={[slabX(frontX, depth) - 0.002, oy, oz]}
              rotation={[0, 0, Math.PI / 4]}
            >
              <boxGeometry args={[cellW * 0.55, cellH * 0.55, 0.005]} />
              <meshStandardMaterial color={DIAMOND} metalness={0.55} roughness={0.35} />
            </mesh>
          );
        }),
      )}
      {/* Tube glow hint behind mesh */}
      <mesh position={[slabX(frontX, depth) + 0.004, 0, 0]}>
        <boxGeometry args={[0.006, h * 0.35, w * 0.35]} />
        <meshStandardMaterial color="#ff9040" emissive="#ff6020" emissiveIntensity={0.35} roughness={0.6} />
      </mesh>
      <FrontText frontX={frontX} y={0} z={0} size={0.06 * scale} color="#f2f2f6" facing={facing}>
        soldano
      </FrontText>
    </group>
  );
}

function CabinetFront({ cabFrontX, cabY, cabW, cabH, scale, facing = "north" }: AmpFrontLayout) {
  const frameW = cabW * 0.9;
  const frameH = cabH * 0.9;
  const clothW = frameW * 0.94;

  return (
    <group>
      <BlackFrame frontX={cabFrontX} y={cabY} w={frameW} h={frameH} />
      <GrilleCloth frontX={cabFrontX} y={cabY} w={clothW} h={frameH * 0.94} color="#1e1e22" weave="#101012" />
      <FrontText frontX={cabFrontX} y={cabY} z={0} size={0.11 * scale} color="#f2f2f6" facing={facing}>
        soldano
      </FrontText>
    </group>
  );
}

function HeadFront({ headFrontX, headY, headW, headH, scale, facing = "north" }: AmpFrontLayout) {
  const panelH = headH * 0.36;
  const grilleH = headH * 0.58;
  const grilleY = headY + headH * 0.17;
  const panelY = headY - headH * 0.21;
  const frameW = headW * 0.94;
  const panelDepth = 0.016;

  const knob = (z: number, r = 0.01) => (
    <mesh key={z} position={[headFrontX - 0.026, panelY, z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r * scale, r * scale, 0.013 * scale, 12]} />
      <meshStandardMaterial color={KNOB} metalness={0.55} roughness={0.32} />
    </mesh>
  );

  const knobSpan = frameW * 0.62;
  const knobZ = (i: number, n: number) => -knobSpan / 2 + (i + 0.5) * (knobSpan / n);

  return (
    <group>
      <BlackFrame frontX={headFrontX} y={grilleY} w={frameW} h={grilleH} />
      <DiamondMeshGrille frontX={headFrontX} y={grilleY} w={frameW * 0.96} h={grilleH * 0.92} scale={scale} facing={facing} />

      <mesh position={[slabX(headFrontX, panelDepth), panelY, 0]}>
        <boxGeometry args={[panelDepth, panelH, frameW]} />
        <meshStandardMaterial color={PANEL} emissive="#888890" emissiveIntensity={0.12} roughness={0.42} metalness={0.18} />
      </mesh>

      {/* Input jack */}
      <mesh position={[headFrontX - 0.024, panelY, -frameW * 0.44]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006 * scale, 0.006 * scale, 0.012, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.65} roughness={0.28} />
      </mesh>

      {/* Toggle switches — left */}
      {[-0.34, -0.27].map((zOff, i) => (
        <mesh key={`tog-l-${i}`} position={[headFrontX - 0.024, panelY + panelH * 0.08, frameW * zOff]}>
          <boxGeometry args={[0.007, 0.022 * scale, 0.012 * scale]} />
          <meshStandardMaterial color="#c8c8d0" metalness={0.6} roughness={0.28} />
        </mesh>
      ))}

      {/* Nine control knobs */}
      {Array.from({ length: 9 }, (_, i) => knob(knobZ(i, 9), 0.0095))}

      {/* Standby / power toggles — right */}
      {[0.3, 0.38].map((zOff, i) => (
        <mesh key={`tog-r-${i}`} position={[headFrontX - 0.024, panelY + panelH * 0.08, frameW * zOff]}>
          <boxGeometry args={[0.008, 0.028 * scale, 0.014 * scale]} />
          <meshStandardMaterial color="#c8c8d0" metalness={0.6} roughness={0.28} />
        </mesh>
      ))}

      {/* Blue jewel power light */}
      <mesh position={[headFrontX - 0.022, panelY + panelH * 0.06, frameW * 0.44]}>
        <sphereGeometry args={[0.009 * scale, 10, 10]} />
        <meshStandardMaterial color={JEWEL} emissive={JEWEL} emissiveIntensity={1.6} roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function SoldanoFront(props: AmpFrontLayout) {
  return (
    <group>
      <pointLight position={[props.cabFrontX - 0.4, props.cabY + props.cabH * 0.5, 0]} color="#e8ecff" intensity={0.75} distance={2.5} decay={2} />
      <CabinetFront {...props} />
      <HeadFront {...props} />
    </group>
  );
}
