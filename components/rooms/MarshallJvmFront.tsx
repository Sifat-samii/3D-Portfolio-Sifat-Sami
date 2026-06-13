"use client";

import { type AmpFrontLayout, FrontSlab, FrontText, GrilleCloth, slabX } from "@/components/rooms/ampFrontShared";

/**
 * Marshall JVM head + 1960 Lead cab — local amp space, front face at negative X.
 * Text + piping tuned for north-wall stacks (parent rotY = π/2, front faces +Z world).
 */

const GRILLE = "#2e2c28";
const GRILLE_WEAVE = "#141312";
const WHITE_PIPE = "#f0ece4";
const GOLD = "#b89428";
const GOLD_KNOB = "#c9ab4a";
const RED = "#c62828";

/** Single aligned white piping rectangle (Marshall cabinet / head border). */
function PipingRect({ frontX, y, w, h }: { frontX: number; y: number; w: number; h: number }) {
  const lip = 0.011;
  const depth = 0.013;
  const x = slabX(frontX, depth);
  const halfW = w / 2;
  const halfH = h / 2;

  return (
    <group>
      <mesh position={[x, y + halfH, 0]}>
        <boxGeometry args={[depth, lip, w + lip]} />
        <meshStandardMaterial color={WHITE_PIPE} emissive="#4a443c" emissiveIntensity={0.3} roughness={0.48} metalness={0.1} />
      </mesh>
      <mesh position={[x, y - halfH, 0]}>
        <boxGeometry args={[depth, lip, w + lip]} />
        <meshStandardMaterial color={WHITE_PIPE} emissive="#4a443c" emissiveIntensity={0.3} roughness={0.48} metalness={0.1} />
      </mesh>
      <mesh position={[x, y, -halfW]}>
        <boxGeometry args={[depth, h + lip, lip]} />
        <meshStandardMaterial color={WHITE_PIPE} emissive="#4a443c" emissiveIntensity={0.3} roughness={0.48} metalness={0.1} />
      </mesh>
      <mesh position={[x, y, halfW]}>
        <boxGeometry args={[depth, h + lip, lip]} />
        <meshStandardMaterial color={WHITE_PIPE} emissive="#4a443c" emissiveIntensity={0.3} roughness={0.48} metalness={0.1} />
      </mesh>
    </group>
  );
}

function CabinetFront({ cabFrontX, cabY, cabW, cabH, scale, facing = "north" }: AmpFrontLayout) {
  const frameW = cabW * 0.9;
  const frameH = cabH * 0.9;
  const clothW = frameW * 0.94;
  const lowerH = frameH * 0.64;
  const upperH = frameH * 0.3;
  const frameBottom = cabY - frameH / 2;
  const lowerY = frameBottom + lowerH / 2;
  const hingeY = frameBottom + lowerH;

  return (
    <group>
      {/* One aligned piping frame for the whole cab face */}
      <PipingRect frontX={cabFrontX} y={cabY} w={frameW} h={frameH} />

      {/* Lower vertical grille */}
      <GrilleCloth frontX={cabFrontX} y={lowerY} w={clothW} h={lowerH * 0.94} color={GRILLE} weave={GRILLE_WEAVE} />

      {/* Upper slant grille — cloth only, frame stays square */}
      <group position={[0, hingeY, 0]} rotation={[-0.09, 0, 0]}>
        <GrilleCloth frontX={cabFrontX} y={upperH / 2} w={clothW} h={upperH * 0.92} color={GRILLE} weave={GRILLE_WEAVE} />
      </group>

      <FrontText frontX={cabFrontX} y={cabY + frameH * 0.02} z={0} size={0.1 * scale} color="#f8f4ec" facing={facing}>
        Marshall
      </FrontText>

      {/* 1960 LEAD plaque */}
      <FrontSlab
        frontX={cabFrontX}
        y={frameBottom + frameH * 0.1}
        z={-frameW * 0.36}
        w={0.14 * scale}
        h={0.046 * scale}
        depth={0.01}
        color={GOLD}
        emissive={GOLD}
        emissiveIntensity={0.4}
      />
      <FrontText
        frontX={cabFrontX}
        y={frameBottom + frameH * 0.1}
        z={-frameW * 0.36}
        size={0.019 * scale}
        color="#1a1408"
        facing={facing}
      >
        1960 LEAD
      </FrontText>

      {/* Side handle */}
      <mesh position={[slabX(cabFrontX, 0.014), cabY, -cabW * 0.47]}>
        <boxGeometry args={[0.014, 0.22 * scale, 0.05 * scale]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.88} />
      </mesh>
    </group>
  );
}

function HeadFront({ headFrontX, headY, headW, headH, scale, facing = "north" }: AmpFrontLayout) {
  const panelH = headH * 0.38;
  const grilleH = headH * 0.56;
  const grilleY = headY + headH * 0.18;
  const panelY = headY - headH * 0.22;
  const frameW = headW * 0.92;
  const clothW = frameW * 0.94;
  const panelDepth = 0.016;

  const knob = (y: number, z: number, r = 0.011) => (
    <mesh key={`${y}-${z}`} position={[headFrontX - 0.026, y, z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r * scale, r * scale, 0.014 * scale, 12]} />
      <meshStandardMaterial color={GOLD_KNOB} emissive="#5a4a18" emissiveIntensity={0.28} metalness={0.5} roughness={0.34} />
    </mesh>
  );

  const rowSpan = frameW * 0.58;
  const rowZ = (i: number, n: number) => -rowSpan / 2 + (i + 0.5) * (rowSpan / n);
  const knobs: [number, number][] = [];
  for (let i = 0; i < 5; i++) knobs.push([panelY + panelH * 0.15, rowZ(i, 5)]);
  for (let i = 0; i < 5; i++) knobs.push([panelY - panelH * 0.08, rowZ(i, 5)]);

  return (
    <group>
      <PipingRect frontX={headFrontX} y={grilleY} w={frameW} h={grilleH} />
      <GrilleCloth frontX={headFrontX} y={grilleY} w={clothW} h={grilleH * 0.92} color={GRILLE} weave={GRILLE_WEAVE} />
      <FrontText frontX={headFrontX} y={grilleY} z={0} size={0.07 * scale} color="#f8f4ec" facing={facing}>
        Marshall
      </FrontText>

      <mesh position={[slabX(headFrontX, panelDepth), panelY, 0]}>
        <boxGeometry args={[panelDepth, panelH, frameW]} />
        <meshStandardMaterial color={GOLD} emissive="#6a5418" emissiveIntensity={0.38} roughness={0.35} metalness={0.5} />
      </mesh>

      <mesh position={[headFrontX - 0.024, panelY + panelH * 0.14, -frameW * 0.4]}>
        <boxGeometry args={[0.008, 0.032 * scale, 0.02 * scale]} />
        <meshStandardMaterial color={RED} emissive="#661010" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[headFrontX - 0.024, panelY + panelH * 0.14, -frameW * 0.31]}>
        <boxGeometry args={[0.008, 0.028 * scale, 0.018 * scale]} />
        <meshStandardMaterial color="#141414" roughness={0.7} />
      </mesh>

      <FrontText frontX={headFrontX} y={panelY + panelH * 0.14} z={-frameW * 0.18} size={0.03 * scale} color="#1a1408" facing={facing}>
        JVM
      </FrontText>

      {knobs.map(([y, z]) => knob(y, z))}
      {[0.12, -0.02, -0.16].map((dy) => knob(panelY + panelH * dy, frameW * 0.36, 0.01))}

      <mesh position={[headFrontX - 0.024, panelY - panelH * 0.02, frameW * 0.42]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.007 * scale, 0.007 * scale, 0.012, 8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.62} roughness={0.28} />
      </mesh>
    </group>
  );
}

export function MarshallJvmFront(props: AmpFrontLayout) {
  return (
    <group>
      {props.showAccentLight !== false ? (
        <pointLight position={[props.cabFrontX - 0.4, props.cabY + props.cabH * 0.5, 0]} color="#ffe8c8" intensity={0.85} distance={2.5} decay={2} />
      ) : null}
      <CabinetFront {...props} />
      <HeadFront {...props} />
    </group>
  );
}
