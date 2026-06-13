"use client";

import type { AmpFrontLayout } from "@/components/rooms/ampFrontShared";
import { FrontSlab, FrontText, GrilleCloth, slabX } from "@/components/rooms/ampFrontShared";

/**
 * Mesa/Boogie Dual Rectifier Solo half-stack front.
 */

const DIAMOND_BASE = "#1a1a1e";
const DIAMOND = "#6a6a72";
const CHROME = "#c8c8d0";
const PANEL = "#b8bcc4";
const KNOB = "#141414";
const RED_JEWEL = "#c62828";
const ORANGE_PIPE = "#c87820";

function DiamondPlate({
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
  const depth = 0.017;
  const rows = 7;
  const cols = 9;
  const stepZ = w / cols;
  const stepY = h / rows;

  return (
    <group position={[0, y, 0]}>
      <FrontSlab frontX={frontX} y={0} w={w} h={h} depth={depth} color={DIAMOND_BASE} />
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const oz = -w / 2 + (col + 0.5) * stepZ + (row % 2 === 0 ? 0 : stepZ * 0.5);
          const oy = -h / 2 + (row + 0.5) * stepY;
          if (Math.abs(oz) > w * 0.47) return null;
          return (
            <mesh
              key={`${row}-${col}`}
              position={[slabX(frontX, depth) - 0.002, oy, oz]}
              rotation={[0, 0, Math.PI / 4]}
            >
              <boxGeometry args={[stepZ * 0.42, stepZ * 0.42, 0.005]} />
              <meshStandardMaterial color={DIAMOND} metalness={0.62} roughness={0.32} />
            </mesh>
          );
        }),
      )}
      {/* MESA ENGINEERING oval badge */}
      <mesh position={[slabX(frontX, depth) - 0.004, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.11, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[slabX(frontX, depth) - 0.005, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.115, 0.045]} />
        <meshStandardMaterial color={CHROME} wireframe />
      </mesh>
      <FrontText frontX={frontX} y={0} z={0} size={0.022 * scale} color="#d8d8dc" facing={facing}>
        MESA
      </FrontText>
      {/* Vent slats — right side */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[slabX(frontX, depth) - 0.003, -h * 0.05 + i * 0.018, w * 0.32]}>
          <boxGeometry args={[0.004, h * 0.14, 0.006]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function CabinetFront({ cabFrontX, cabY, cabW, cabH, scale, facing = "east" }: AmpFrontLayout) {
  const frameW = cabW * 0.9;
  const frameH = cabH * 0.9;
  const clothW = frameW * 0.94;

  return (
    <group>
      {/* Orange piping accent — Mesa cab trademark */}
      {[
        [0, frameH / 2, frameW, 0.01],
        [0, -frameH / 2, frameW, 0.01],
        [-frameW / 2, 0, 0.01, frameH],
        [frameW / 2, 0, 0.01, frameH],
      ].map(([oz, oy, bw, bh], i) => (
        <mesh key={i} position={[slabX(cabFrontX, 0.012), cabY + oy, oz]}>
          <boxGeometry args={[0.012, bh, bw]} />
          <meshStandardMaterial color={ORANGE_PIPE} emissive="#6a4010" emissiveIntensity={0.25} roughness={0.45} metalness={0.35} />
        </mesh>
      ))}

      <GrilleCloth frontX={cabFrontX} y={cabY} w={clothW} h={frameH * 0.94} color="#1a1a18" weave="#0e0e0c" />

      {/* Center badge — MESA / ENGINEERING */}
      <mesh position={[slabX(cabFrontX, 0.014), cabY + frameH * 0.06, 0]}>
        <boxGeometry args={[0.012, 0.12 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[slabX(cabFrontX, 0.016), cabY + frameH * 0.06, 0]}>
        <boxGeometry args={[0.008, 0.125 * scale, 0.205 * scale]} />
        <meshStandardMaterial color={CHROME} roughness={0.35} metalness={0.55} />
      </mesh>
      <FrontText frontX={cabFrontX} y={cabY + frameH * 0.1} z={0} size={0.085 * scale} color="#ececec" facing={facing}>
        MESA
      </FrontText>
      <FrontText frontX={cabFrontX} y={cabY + frameH * 0.01} z={0} size={0.024 * scale} color="#c8c8cc" facing={facing}>
        ENGINEERING
      </FrontText>

      {/* Side handle */}
      <mesh position={[slabX(cabFrontX, 0.012), cabY, cabW * 0.46]}>
        <boxGeometry args={[0.014, 0.2 * scale, 0.05 * scale]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.88} />
      </mesh>
    </group>
  );
}

function HeadFront({ headFrontX, headY, headW, headH, scale, facing = "east" }: AmpFrontLayout) {
  const diamondH = headH * 0.54;
  const panelH = headH * 0.38;
  const diamondY = headY + headH * 0.17;
  const panelY = headY - headH * 0.21;
  const frameW = headW * 0.94;
  const panelDepth = 0.016;

  const knob = (z: number, yOff: number) => (
    <mesh key={`${z}-${yOff}`} position={[headFrontX - 0.026, panelY + yOff, z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.0095 * scale, 0.0095 * scale, 0.013 * scale, 12]} />
      <meshStandardMaterial color={KNOB} metalness={0.35} roughness={0.48} />
    </mesh>
  );

  const rowSpan = frameW * 0.58;
  const rowZ = (i: number, n: number) => -rowSpan / 2 + (i + 0.5) * (rowSpan / n);
  const knobs: [number, number][] = [];
  for (let i = 0; i < 6; i++) knobs.push([rowZ(i, 6), panelH * 0.14]);
  for (let i = 0; i < 6; i++) knobs.push([rowZ(i, 6), -panelH * 0.1]);

  return (
    <group>
      <DiamondPlate frontX={headFrontX} y={diamondY} w={frameW * 0.96} h={diamondH * 0.92} scale={scale} facing={facing} />

      <mesh position={[slabX(headFrontX, panelDepth), panelY, 0]}>
        <boxGeometry args={[panelDepth, panelH, frameW]} />
        <meshStandardMaterial color={PANEL} emissive="#888890" emissiveIntensity={0.15} roughness={0.38} metalness={0.48} />
      </mesh>

      {/* Power / standby + red jewel */}
      <mesh position={[headFrontX - 0.024, panelY + panelH * 0.12, -frameW * 0.42]}>
        <boxGeometry args={[0.007, 0.022 * scale, 0.014 * scale]} />
        <meshStandardMaterial color="#c8c8cc" metalness={0.6} roughness={0.28} />
      </mesh>
      <mesh position={[headFrontX - 0.024, panelY + panelH * 0.12, -frameW * 0.35]}>
        <boxGeometry args={[0.007, 0.02 * scale, 0.012 * scale]} />
        <meshStandardMaterial color="#c8c8cc" metalness={0.6} roughness={0.28} />
      </mesh>
      <mesh position={[headFrontX - 0.022, panelY + panelH * 0.12, -frameW * 0.28]}>
        <sphereGeometry args={[0.009 * scale, 10, 10]} />
        <meshStandardMaterial color={RED_JEWEL} emissive={RED_JEWEL} emissiveIntensity={1.5} roughness={0.2} />
      </mesh>

      <FrontText frontX={headFrontX} y={panelY + panelH * 0.2} z={-frameW * 0.32} size={0.028 * scale} color="#1a1a1a" facing={facing}>
        DUAL
      </FrontText>
      <FrontText frontX={headFrontX} y={panelY + panelH * 0.08} z={-frameW * 0.32} size={0.034 * scale} color="#1a1a1a" facing={facing}>
        Rectifier
      </FrontText>
      <FrontText frontX={headFrontX} y={panelY - panelH * 0.02} z={-frameW * 0.32} size={0.016 * scale} color="#2a2a2a" facing={facing}>
        SOLO HEAD
      </FrontText>

      {knobs.map(([z, yOff]) => knob(z, yOff))}

      {/* Input jacks */}
      {[-0.05, 0.05].map((zOff) => (
        <mesh key={zOff} position={[headFrontX - 0.024, panelY, frameW * (0.4 + zOff)]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.006 * scale, 0.006 * scale, 0.012, 8]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.65} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

export function MesaBoogieFront(props: AmpFrontLayout) {
  return (
    <group>
      {props.showAccentLight !== false ? (
        <pointLight position={[props.cabFrontX - 0.4, props.cabY + props.cabH * 0.5, 0]} color="#ffe8d0" intensity={0.8} distance={2.5} decay={2} />
      ) : null}
      <CabinetFront {...props} />
      <HeadFront {...props} />
    </group>
  );
}
