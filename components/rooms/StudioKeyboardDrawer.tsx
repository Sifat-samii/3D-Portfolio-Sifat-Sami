"use client";

/**
 * Under-desk sliding keyboard tray with an 88-key production MIDI controller.
 * Tray slides toward +X (toward the chair) — matches StudioDesk facing.
 */

const FRAME = "#131110";
const ALU = "#9a958c";
const GEAR = "#0d0b0a";
const FELT = "#1a1816";

const DRAWER_PULL = 0.36;
const TRAY_D = 0.30;
const TRAY_H = 0.028;
const DEFAULT_TRAY_W = 1.64;
const KEY_WHITE_COUNT = 52; // 88-key bed

type StudioKeyboardDrawerProps = {
  topY?: number;
  /** Tray centre Z — default desk centre */
  centerZ?: number;
  /** Tray width along Z — matches expanded desk keyboard bed */
  trayWidth?: number;
};

function PianoKeys({ whiteCount = KEY_WHITE_COUNT }: { whiteCount?: number }) {
  const keyStep = 0.0248;
  const startZ = -((whiteCount - 1) * keyStep) / 2;

  return (
    <group>
      {Array.from({ length: whiteCount }, (_, i) => (
        <mesh key={`wk-${i}`} position={[0.092, 0.034, startZ + i * keyStep]}>
          <boxGeometry args={[0.118, 0.016, 0.022]} />
          <meshStandardMaterial color="#f4efe6" roughness={0.34} metalness={0.02} />
        </mesh>
      ))}
      {Array.from({ length: whiteCount - 1 }, (_, i) => {
        const octave = i % 7;
        if (octave === 2 || octave === 6) return null;
        return (
          <mesh key={`bk-${i}`} position={[0.062, 0.046, startZ + (i + 1) * keyStep - keyStep / 2]}>
            <boxGeometry args={[0.072, 0.016, 0.014]} />
            <meshStandardMaterial color="#0a0908" roughness={0.42} metalness={0.12} />
          </mesh>
        );
      })}
    </group>
  );
}

function ProductionMidiKeyboard({ trayW }: { trayW: number }) {
  const bodyW = trayW - 0.04;

  return (
    <group position={[0, TRAY_H / 2 + 0.002, 0]}>
      {/* Main chassis */}
      <mesh>
        <boxGeometry args={[0.32, 0.058, bodyW]} />
        <meshStandardMaterial color={GEAR} roughness={0.52} metalness={0.22} />
      </mesh>
      {/* Brushed aluminium end cheeks */}
      {[-bodyW / 2, bodyW / 2].map((z) => (
        <mesh key={`cheek-${z}`} position={[0.002, 0.004, z]}>
          <boxGeometry args={[0.318, 0.054, 0.014]} />
          <meshStandardMaterial color={ALU} metalness={0.74} roughness={0.22} />
        </mesh>
      ))}
      {/* Rubberized control deck (left) */}
      <mesh position={[-0.098, 0.032, -0.28]}>
        <boxGeometry args={[0.118, 0.006, 0.34]} />
        <meshStandardMaterial color="#141210" roughness={0.88} metalness={0.04} />
      </mesh>

      {/* OLED display */}
      <mesh position={[-0.118, 0.038, -0.12]}>
        <boxGeometry args={[0.006, 0.028, 0.11]} />
        <meshStandardMaterial color="#050505" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[-0.121, 0.038, -0.12]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.10, 0.024]} />
        <meshStandardMaterial color="#020408" emissive="#1e4a7a" emissiveIntensity={1.1} roughness={0.1} />
      </mesh>

      {/* Pitch + mod wheels */}
      {[-0.04, 0.04].map((z, i) => (
        <mesh
          key={`wheel-${i}`}
          position={[-0.108, 0.036, -0.34 + z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.022, 0.022, 0.026, 16]} />
          <meshStandardMaterial color={i === 0 ? "#1c1916" : "#242018"} metalness={0.48} roughness={0.38} />
        </mesh>
      ))}

      {/* 8 endless encoders */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={`enc-${i}`} position={[-0.108, 0.038, 0.02 + i * 0.048]}>
          <cylinderGeometry args={[0.012, 0.012, 0.016, 14]} />
          <meshStandardMaterial color={ALU} metalness={0.68} roughness={0.24} />
        </mesh>
      ))}

      {/* 4×2 RGB pad grid */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`pad-${i}`}
          position={[
            -0.108,
            0.036,
            0.30 + (i % 4) * 0.048 + Math.floor(i / 4) * 0.052,
          ]}
        >
          <boxGeometry args={[0.044, 0.008, 0.044]} />
          <meshStandardMaterial
            color="#0e0c0a"
            emissive={["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b"][i % 4]}
            emissiveIntensity={0.75}
            roughness={0.38}
          />
        </mesh>
      ))}

      {/* Transport buttons */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`tr-${i}`} position={[-0.108, 0.036, -0.28 + i * 0.038]}>
          <boxGeometry args={[0.026, 0.010, 0.026]} />
          <meshStandardMaterial
            color="#070707"
            emissive={["#ef4444", "#22c55e", "#f59e0b", "#3b82f6", "#a855f7"][i]}
            emissiveIntensity={1.4}
            roughness={0.32}
          />
        </mesh>
      ))}

      {/* 88-key bed — expanded both ends */}
      <group position={[0.04, 0, 0.12]}>
        <PianoKeys whiteCount={KEY_WHITE_COUNT} />
      </group>

      {/* Power LED */}
      <mesh position={[-0.118, 0.034, bodyW / 2 - 0.04]}>
        <boxGeometry args={[0.005, 0.006, 0.006]} />
        <meshStandardMaterial color="#070707" emissive="#22c55e" emissiveIntensity={2.0} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function StudioKeyboardDrawer({
  topY = 0.75,
  centerZ = 0,
  trayWidth = DEFAULT_TRAY_W,
}: StudioKeyboardDrawerProps) {
  const railY = topY - 0.055;
  const trayY = topY - 0.11;
  const trayX = 0.10 + DRAWER_PULL;
  const railSpan = Math.min(trayWidth - 0.12, 0.88);
  const railZ = Math.min(trayWidth * 0.31, 0.52);

  return (
    <group position={[0, 0, centerZ]}>
      {/* Under-desk rail mounts */}
      {[-railZ, railZ].map((z) => (
        <group key={`rail-${z}`}>
          <mesh position={[0.04, railY, z]}>
            <boxGeometry args={[railSpan + 0.08, 0.018, 0.028]} />
            <meshStandardMaterial color={FRAME} metalness={0.62} roughness={0.28} />
          </mesh>
          {/* Ball-bearing rollers */}
          {[-0.22, -0.08, 0.08, 0.22].map((rx) => (
            <mesh
              key={`roller-${z}-${rx}`}
              position={[trayX + rx, railY - 0.012, z]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.007, 0.007, 0.022, 10]} />
              <meshStandardMaterial color={ALU} metalness={0.78} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Recessed cavity shadow under desk */}
      <mesh position={[0.06, topY - 0.028, 0]}>
        <boxGeometry args={[0.48, 0.012, trayWidth + 0.06]} />
        <meshStandardMaterial color="#080706" roughness={0.92} metalness={0.02} />
      </mesh>

      {/* Sliding tray — partially pulled out toward +X */}
      <group position={[trayX, trayY, 0]}>
        <mesh>
          <boxGeometry args={[TRAY_D, TRAY_H, trayWidth]} />
          <meshStandardMaterial color={FRAME} metalness={0.58} roughness={0.32} />
        </mesh>
        {/* Felt liner */}
        <mesh position={[0, TRAY_H / 2 + 0.001, 0]}>
          <boxGeometry args={[TRAY_D - 0.02, 0.003, trayWidth - 0.02]} />
          <meshStandardMaterial color={FELT} roughness={0.95} metalness={0} />
        </mesh>
        {/* Front pull lip */}
        <mesh position={[TRAY_D / 2 + 0.006, -0.004, 0]}>
          <boxGeometry args={[0.010, 0.018, trayWidth - 0.12]} />
          <meshStandardMaterial color={ALU} metalness={0.72} roughness={0.24} />
        </mesh>

        <ProductionMidiKeyboard trayW={trayWidth} />
      </group>
    </group>
  );
}
