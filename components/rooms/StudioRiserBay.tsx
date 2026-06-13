"use client";

/**
 * Recording gear packed into the hollow bay under the monitor riser shelf.
 * Sits on the main desk surface between the two riser supports.
 */

const FRAME = "#131110";
const ALU = "#9a958c";
const GEAR = "#0d0b0a";
const GEAR_LT = "#1a1714";

/** Gear body depth (+X) and height (+Y) — thicker, taller rack units. */
const IFACE_D = 0.26;
const IFACE_H = 0.098;
const CARD_D = 0.24;
const CARD_H = 0.084;
const CONSOLE_D = 0.28;
const CONSOLE_H = 0.092;
const PATCH_D = 0.22;
const PATCH_H = 0.072;

type StudioRiserBayProps = {
  topY?: number;
  /** Riser shelf underside — gear must fit below this */
  riserY?: number;
  centerX?: number;
};

/** Dual-input audio interface (Apollo / Scarlett style). */
function AudioInterface({ z }: { z: number }) {
  const faceX = IFACE_D / 2 - 0.002;

  return (
    <group position={[0, 0, z]}>
      <mesh>
        <boxGeometry args={[IFACE_D, IFACE_H, 0.30]} />
        <meshStandardMaterial color="#16130f" roughness={0.44} metalness={0.32} />
      </mesh>
      {/* Side cheek plates */}
      <mesh position={[0, 0.004, 0]}>
        <boxGeometry args={[IFACE_D - 0.02, IFACE_H - 0.012, 0.296]} />
        <meshStandardMaterial color="#1e1a16" roughness={0.48} metalness={0.28} />
      </mesh>
      <mesh position={[faceX, 0.022, 0]}>
        <boxGeometry args={[0.005, 0.054, 0.26]} />
        <meshStandardMaterial color="#070707" emissive="#22c55e" emissiveIntensity={1.6} roughness={0.3} />
      </mesh>
      <mesh position={[faceX, 0.052, 0.085]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.030, 0.030, 0.020, 18]} />
        <meshStandardMaterial color={ALU} metalness={0.72} roughness={0.2} />
      </mesh>
      {[-0.075, -0.012, 0.052].map((kz, i) => (
        <mesh key={`kn-${i}`} position={[faceX, 0.022, kz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.013, 0.013, 0.016, 12]} />
          <meshStandardMaterial color={ALU} metalness={0.65} roughness={0.24} />
        </mesh>
      ))}
      <mesh position={[faceX, 0.022, -0.105]}>
        <boxGeometry args={[0.006, 0.010, 0.010]} />
        <meshStandardMaterial color="#070707" emissive="#3b82f6" emissiveIntensity={2.2} roughness={0.3} />
      </mesh>
      {[-0.085, 0.085].map((kz) => (
        <mesh key={`xlr-${kz}`} position={[-(IFACE_D / 2 - 0.004), 0.014, kz]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.010, 10]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

/** External DSP / PCIe soundcard breakout. */
function SoundcardUnit({ z }: { z: number }) {
  const faceX = CARD_D / 2 - 0.002;

  return (
    <group position={[0, 0, z]}>
      <mesh>
        <boxGeometry args={[CARD_D, CARD_H, 0.20]} />
        <meshStandardMaterial color={GEAR_LT} roughness={0.48} metalness={0.28} />
      </mesh>
      <mesh position={[faceX, 0.032, 0]}>
        <boxGeometry args={[0.005, 0.038, 0.15]} />
        <meshStandardMaterial color="#070707" emissive="#f59e0b" emissiveIntensity={1.4} roughness={0.3} />
      </mesh>
      {[-0.042, 0, 0.042].map((kz) => (
        <mesh key={`vent-${kz}`} position={[faceX, 0.010, kz]}>
          <boxGeometry args={[0.004, 0.006, 0.032]} />
          <meshStandardMaterial color="#050505" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
      <mesh position={[-(CARD_D / 2 - 0.004), 0.010, -0.052]}>
        <boxGeometry args={[0.010, 0.016, 0.065]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-(CARD_D / 2 - 0.004), 0.010, 0.052]}>
        <boxGeometry args={[0.010, 0.016, 0.044]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Compact recording console — faders + master section. */
function RecordingConsole({ z }: { z: number }) {
  const faceX = CONSOLE_D / 2 - 0.002;

  return (
    <group position={[0, 0, z]}>
      <mesh>
        <boxGeometry args={[CONSOLE_D, CONSOLE_H, 0.40]} />
        <meshStandardMaterial color={GEAR} roughness={0.54} metalness={0.2} />
      </mesh>
      {/* Angled control surface lip */}
      <mesh position={[0.04, CONSOLE_H / 2 + 0.004, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[CONSOLE_D - 0.06, 0.008, 0.38]} />
        <meshStandardMaterial color="#141210" roughness={0.58} metalness={0.16} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <group key={`fd-${i}`} position={[0.05, 0.048, -0.15 + i * 0.054]}>
          <mesh>
            <boxGeometry args={[0.13, 0.005, 0.007]} />
            <meshStandardMaterial color="#141210" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <boxGeometry args={[0.022, 0.018, 0.016]} />
            <meshStandardMaterial color={ALU} metalness={0.64} roughness={0.26} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={`eq-${i}`} position={[-0.095, 0.056, -0.15 + i * 0.054]}>
          <cylinderGeometry args={[0.010, 0.010, 0.016, 12]} />
          <meshStandardMaterial color="#26221e" metalness={0.5} roughness={0.38} />
        </mesh>
      ))}
      {[-0.032, 0.032].map((kz, i) => (
        <mesh key={`mst-${i}`} position={[faceX, 0.056, kz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.018, 12]} />
          <meshStandardMaterial color={ALU} metalness={0.68} roughness={0.22} />
        </mesh>
      ))}
      <mesh position={[faceX, 0.064, 0]}>
        <boxGeometry args={[0.005, 0.028, 0.24]} />
        <meshStandardMaterial color="#070707" emissive="#16a34a" emissiveIntensity={1.2} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** 1U patch bay + headphone amp strip. */
function PatchBayStrip({ z }: { z: number }) {
  const faceX = PATCH_D / 2 - 0.002;

  return (
    <group position={[0, 0, z]}>
      <mesh>
        <boxGeometry args={[PATCH_D, PATCH_H, 0.54]} />
        <meshStandardMaterial color="#100e0c" roughness={0.55} metalness={0.22} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={`patch-${i}`}
          position={[faceX, 0.012, -0.21 + i * 0.038]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.005, 0.005, 0.008, 8]} />
          <meshStandardMaterial color={ALU} metalness={0.78} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[-0.065, 0.046, 0.17]}>
        <boxGeometry args={[0.09, 0.038, 0.11]} />
        <meshStandardMaterial color="#14110e" roughness={0.5} metalness={0.26} />
      </mesh>
      {[-0.022, 0.032].map((kz, i) => (
        <mesh key={`hp-${i}`} position={[0.02, 0.048, 0.17 + kz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.013, 0.013, 0.014, 10]} />
          <meshStandardMaterial color={ALU} metalness={0.62} roughness={0.26} />
        </mesh>
      ))}
      <mesh position={[0.024, 0.056, 0.21]}>
        <boxGeometry args={[0.005, 0.008, 0.008]} />
        <meshStandardMaterial color="#070707" emissive="#3b82f6" emissiveIntensity={2.0} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function StudioRiserBay({
  topY = 0.75,
  riserY = 1.17,
  centerX = -0.20,
}: StudioRiserBayProps) {
  const gearY = topY + 0.028;
  const maxH = riserY - topY - 0.05;

  return (
    <group position={[centerX, gearY, 0]}>
      {/* Bay liner shelf — thicker platform */}
      <mesh position={[0, -0.010, 0]}>
        <boxGeometry args={[0.30, 0.012, 1.52]} />
        <meshStandardMaterial color="#0a0908" roughness={0.88} metalness={0.06} />
      </mesh>
      {/* Front retaining lip */}
      <mesh position={[0.14, 0.006, 0]}>
        <boxGeometry args={[0.008, 0.018, 1.48]} />
        <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.34} />
      </mesh>
      {/* Side cable guides */}
      {[-0.76, 0.76].map((z) => (
        <mesh key={`guide-${z}`} position={[0.13, maxH * 0.42, z]}>
          <boxGeometry args={[0.012, maxH * 0.72, 0.028]} />
          <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.38} />
        </mesh>
      ))}

      <AudioInterface z={-0.54} />
      <AudioInterface z={-0.30} />
      <SoundcardUnit z={-0.04} />
      <PatchBayStrip z={0.30} />
      <RecordingConsole z={0.60} />

      <pointLight position={[0.15, maxH * 0.55, 0]} color="#fff0d0" intensity={0.38} distance={1.2} decay={2} />
    </group>
  );
}
