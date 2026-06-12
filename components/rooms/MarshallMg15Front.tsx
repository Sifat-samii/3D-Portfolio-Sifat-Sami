"use client";

import {
  FrontSlab,
  FrontText,
  GrilleCloth,
  PipingRect,
  frontSlabPosition,
  type AmpFacing,
} from "@/components/rooms/ampFrontShared";

/**
 * Marshall MG15FX combo front — gold control strip, cloth grille, gold piping.
 * Same procedural approach as MarshallJvmFront; studio desk faces +X.
 */

const GRILLE = "#1a1814";
const GRILLE_WEAVE = "#0c0b0a";
const GOLD_PANEL = "#c9a84a";
const GOLD_KNOB = "#c9ab4a";
const GOLD_PIPE = "#d4af37";
const BLUE_BTN = "#2a4a8a";

const KNOB_LABELS = ["GAIN", "BASS", "MIDDLE", "TREBLE", "REVERB", "VOLUME", "FX", "MASTER"] as const;

export type Mg15FrontLayout = {
  frontX: number;
  cabY: number;
  faceW: number;
  faceH: number;
  facing?: AmpFacing;
};

function Mg15Knob({
  frontX,
  y,
  z,
  facing = "studio",
  r = 0.011,
}: {
  frontX: number;
  y: number;
  z: number;
  facing?: AmpFacing;
  r?: number;
}) {
  const shaftX = frontSlabPosition(frontX, 0.016, facing);
  const capX = frontSlabPosition(frontX, 0.022, facing);

  return (
    <group>
      <mesh position={[shaftX, y, z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[r * 0.55, r * 0.55, 0.01, 10]} />
        <meshStandardMaterial color="#141210" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[capX, y, z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[r, r * 1.04, 0.013, 14]} />
        <meshStandardMaterial
          color={GOLD_KNOB}
          emissive="#5a4a18"
          emissiveIntensity={0.28}
          metalness={0.5}
          roughness={0.34}
        />
      </mesh>
      <mesh position={[capX + 0.006, y, z + r * 0.55]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.002, 0.006, 0.0012]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function ControlPanel({
  frontX,
  panelY,
  panelH,
  faceW,
  facing = "studio",
}: {
  frontX: number;
  panelY: number;
  panelH: number;
  faceW: number;
  facing?: AmpFacing;
}) {
  const frameW = faceW * 0.94;
  const knobSpan = frameW * 0.76;
  const knobY = panelY - panelH * 0.02;
  const knobZ = (index: number, count: number) =>
    -knobSpan / 2 + (index + 0.5) * (knobSpan / count);

  return (
    <group>
      {/* Black recess bezel */}
      <FrontSlab
        frontX={frontX}
        y={panelY}
        w={frameW + 0.02}
        h={panelH + 0.018}
        depth={0.008}
        color="#080706"
        facing={facing}
        roughness={0.9}
        metalness={0.04}
      />

      {/* Brushed gold panel */}
      <FrontSlab
        frontX={frontX}
        y={panelY}
        w={frameW}
        h={panelH * 0.88}
        depth={0.018}
        color={GOLD_PANEL}
        emissive="#6a5418"
        emissiveIntensity={0.35}
        facing={facing}
        roughness={0.34}
        metalness={0.52}
      />

      {/* INPUT jack */}
      <mesh
        position={[frontSlabPosition(frontX, 0.016, facing), panelY, -frameW * 0.44]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.0055, 0.0055, 0.012, 12]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.72} roughness={0.32} />
      </mesh>
      <FrontText
        frontX={frontX}
        y={panelY - panelH * 0.38}
        z={-frameW * 0.44}
        size={0.0055}
        color="#1a1408"
        facing={facing}
      >
        INPUT
      </FrontText>

      {/* Knobs + scale ticks */}
      {KNOB_LABELS.map((label, i) => (
        <group key={label}>
          <Mg15Knob frontX={frontX} y={knobY} z={knobZ(i, KNOB_LABELS.length)} facing={facing} />
          {[-0.008, 0, 0.008].map((tz) => (
            <mesh
              key={`tick-${label}-${tz}`}
              position={[frontSlabPosition(frontX, 0.02, facing), panelY - panelH * 0.28, knobZ(i, KNOB_LABELS.length) + tz]}
            >
              <boxGeometry args={[0.0015, 0.003, 0.001]} />
              <meshStandardMaterial color="#2a2010" roughness={0.85} />
            </mesh>
          ))}
          <FrontText
            frontX={frontX}
            y={panelY - panelH * 0.36}
            z={knobZ(i, KNOB_LABELS.length)}
            size={0.0058}
            color="#1a1408"
            facing={facing}
          >
            {label}
          </FrontText>
        </group>
      ))}

      {/* Blue function buttons */}
      {[0, 1, 5, 6].map((i) => (
        <mesh
          key={`btn-${i}`}
          position={[frontSlabPosition(frontX, 0.012, facing), panelY + panelH * 0.22, knobZ(i, KNOB_LABELS.length)]}
        >
          <cylinderGeometry args={[0.0065, 0.0065, 0.005, 10]} />
          <meshStandardMaterial
            color={BLUE_BTN}
            emissive="#2848a0"
            emissiveIntensity={0.45}
            roughness={0.48}
            metalness={0.2}
          />
        </mesh>
      ))}

      <FrontText
        frontX={frontX}
        y={panelY + panelH * 0.16}
        z={frameW * 0.3}
        size={0.011}
        color="#0a0806"
        facing={facing}
      >
        MG15FX
      </FrontText>

      {/* Power button */}
      <mesh position={[frontSlabPosition(frontX, 0.01, facing), panelY, frameW * 0.4]}>
        <cylinderGeometry args={[0.011, 0.011, 0.007, 16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.35} roughness={0.55} />
      </mesh>
      <FrontText
        frontX={frontX}
        y={panelY - panelH * 0.34}
        z={frameW * 0.4}
        size={0.005}
        color="#1a1408"
        facing={facing}
      >
        POWER
      </FrontText>
    </group>
  );
}

function GrilleSection({
  frontX,
  grilleY,
  grilleH,
  frameW,
  facing = "studio",
}: {
  frontX: number;
  grilleY: number;
  grilleH: number;
  frameW: number;
  facing?: AmpFacing;
}) {
  const clothW = frameW * 0.9;
  const clothH = grilleH * 0.9;

  return (
    <group>
      <PipingRect
        frontX={frontX}
        y={grilleY}
        w={frameW}
        h={grilleH}
        color={GOLD_PIPE}
        emissive="#6a5520"
        emissiveIntensity={0.28}
        facing={facing}
      />

      <GrilleCloth
        frontX={frontX}
        y={grilleY}
        w={clothW}
        h={clothH}
        color={GRILLE}
        weave={GRILLE_WEAVE}
        facing={facing}
      />

      {/* Speaker cone */}
      <mesh
        position={[frontSlabPosition(frontX, 0.016, facing), grilleY - grilleH * 0.08, 0]}
        rotation={[0, facing === "studio" ? -Math.PI / 2 : Math.PI / 2, 0]}
      >
        <circleGeometry args={[clothW * 0.22, 28]} />
        <meshStandardMaterial color="#060504" roughness={0.98} metalness={0} />
      </mesh>
      <mesh
        position={[frontSlabPosition(frontX, 0.018, facing), grilleY - grilleH * 0.08, 0]}
        rotation={[0, facing === "studio" ? -Math.PI / 2 : Math.PI / 2, 0]}
      >
        <ringGeometry args={[clothW * 0.1, clothW * 0.22, 28]} />
        <meshStandardMaterial color="#0a0908" roughness={0.95} metalness={0} />
      </mesh>

      <FrontText
        frontX={frontX}
        y={grilleY + grilleH * 0.16}
        z={0}
        size={0.056}
        color="#f8f4ec"
        facing={facing}
      >
        Marshall
      </FrontText>

      {/* Corner protectors with screw heads */}
      {[
        [grilleY + grilleH / 2, -frameW / 2],
        [grilleY + grilleH / 2, frameW / 2],
        [grilleY - grilleH / 2, -frameW / 2],
        [grilleY - grilleH / 2, frameW / 2],
      ].map(([cy, cz], idx) => (
        <group key={`cap-${idx}`}>
          <mesh position={[frontSlabPosition(frontX, 0.01, facing), cy, cz]}>
            <boxGeometry args={[0.014, 0.032, 0.032]} />
            <meshStandardMaterial color="#141210" metalness={0.5} roughness={0.45} />
          </mesh>
          <mesh position={[frontSlabPosition(frontX, 0.016, facing), cy, cz]}>
            <cylinderGeometry args={[0.004, 0.004, 0.003, 8]} />
            <meshStandardMaterial color="#2a2824" metalness={0.65} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function MarshallMg15Front({
  frontX = 0.21,
  cabY = 0.30,
  faceH = 0.56,
  faceW = 0.54,
  facing = "studio",
}: Mg15FrontLayout) {
  const halfH = faceH / 2;
  const frameW = faceW * 0.92;

  const panelH = faceH * 0.27;
  const panelY = cabY + halfH - panelH / 2 - 0.01;

  const grilleH = faceH * 0.67;
  const grilleY = cabY - halfH + grilleH / 2 + 0.018;

  const lightX = facing === "studio" ? frontX + 0.38 : frontX - 0.38;

  return (
    <group>
      <pointLight
        position={[lightX, cabY + faceH * 0.35, 0]}
        color="#ffe8c8"
        intensity={0.75}
        distance={2.2}
        decay={2}
      />

      <ControlPanel
        frontX={frontX}
        panelY={panelY}
        panelH={panelH}
        faceW={frameW}
        facing={facing}
      />

      <GrilleSection
        frontX={frontX}
        grilleY={grilleY}
        grilleH={grilleH}
        frameW={frameW}
        facing={facing}
      />
    </group>
  );
}
