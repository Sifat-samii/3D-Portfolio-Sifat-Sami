"use client";

/**
 * Premium music-production workstation — the centrepiece of the Music Room.
 *
 * Built LIFE-SIZE in local coordinates, then scaled ×1.6 to suit the room's
 * oversized furniture scale (guitar display 2.2×, 4.4 m TV).
 *
 * Local space:
 *   origin  = floor point under the desk centre
 *   +X      = east (toward the door wall) — the desk FACES +X
 *   +Y      = up
 *   +Z      = south
 *
 * World placement:  group position [-21.1, 0.1, -1.5], scale 1.6
 *   → desk back edge x ≈ -21.78 (wall inner face ≈ -21.88, 10 cm cable gap)
 *   → desk spans z ≈ -3.1 … 0.1 — exactly the empty wall zone between the
 *     two poster clusters (cluster edges at z ≈ -3.0 and 0.1)
 *   → desk surface world y ≈ 1.30, chair seat ≈ 0.98
 *
 * All screens / drivers face +X via rotation [0, π/2, 0]
 * (plane local +Z normal → world +X after the yaw).
 */

const S = 1.6;                      // global display scale
const POS: [number, number, number] = [-21.1, 0.1, 0];

// ── Key local heights ─────────────────────────────────────────────────────────
const TOP = 0.75;                   // desk surface
const RISER = TOP + 0.42;           // riser shelf top

// ── Materials ─────────────────────────────────────────────────────────────────
const WALNUT    = "#2c1c0c";        // matte walnut top
const WALNUT_LT = "#3e2814";        // grain stripes
const FRAME     = "#131110";        // black powder-coat steel
const ALU       = "#9a958c";        // brushed aluminium
const GEAR      = "#0d0b0a";        // dark equipment body
const CREAM     = "#e6e0d6";        // monitor cabinet white
const GLASS     = "#020407";        // screen glass
const LEATHER   = "#16130f";        // chair leather
const FABRIC    = "#1d1a17";        // chair fabric / mesh

export function StudioDesk() {
  return (
    <group position={POS} scale={[S, S, S]}>

      {/* ═══════════════════════════════════════════════════════════
          1. DESK — walnut top, black steel frame, dual built-in racks
         ═══════════════════════════════════════════════════════════ */}

      {/* Main walnut tabletop — 2.0 m × 0.85 m */}
      <mesh position={[0, TOP, 0]}>
        <boxGeometry args={[0.85, 0.045, 2.0]} />
        <meshStandardMaterial color={WALNUT} roughness={0.42} metalness={0.05} />
      </mesh>
      {/* Grain stripes */}
      {[-0.78, -0.44, -0.12, 0.18, 0.50, 0.80].map((oz, i) => (
        <mesh key={`gr-${i}`} position={[0, TOP + 0.0235, oz]}>
          <boxGeometry args={[0.83, 0.0012, 0.024 + (i % 3) * 0.010]} />
          <meshStandardMaterial color={WALNUT_LT} roughness={0.46} metalness={0.03} />
        </mesh>
      ))}
      {/* Curved ergonomic front edge (rounded cap) */}
      <mesh position={[0.425, TOP, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0225, 0.0225, 2.0, 12]} />
        <meshStandardMaterial color={WALNUT} roughness={0.42} metalness={0.05} />
      </mesh>

      {/* Steel side-panel legs */}
      {[-0.93, 0.93].map((oz) => (
        <mesh key={`leg-${oz}`} position={[0, TOP / 2 - 0.02, oz]}>
          <boxGeometry args={[0.72, TOP - 0.04, 0.055]} />
          <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
      {/* Rear cross-beam + cable channel */}
      <mesh position={[-0.36, TOP - 0.12, 0]}>
        <boxGeometry args={[0.05, 0.16, 1.84]} />
        <meshStandardMaterial color={FRAME} metalness={0.45} roughness={0.45} />
      </mesh>
      {/* Cable channel slot detail */}
      {[-0.6, 0, 0.6].map((oz) => (
        <mesh key={`slot-${oz}`} position={[-0.332, TOP - 0.12, oz]}>
          <boxGeometry args={[0.006, 0.10, 0.16]} />
          <meshStandardMaterial color="#000000" roughness={0.95} metalness={0.0} />
        </mesh>
      ))}

      {/* ── Dual rack spaces built into both desk sides (4U each) ── */}
      {[-0.80, 0.80].map((oz, side) => (
        <group key={`rack-${side}`} position={[0, 0, oz]}>
          {/* Rack cabinet shell */}
          <mesh position={[0.06, TOP / 2 - 0.04, 0]}>
            <boxGeometry args={[0.62, TOP - 0.14, 0.24]} />
            <meshStandardMaterial color={GEAR} roughness={0.62} metalness={0.16} />
          </mesh>
          {/* 4 rack-unit faces with hardware detail */}
          {Array.from({ length: 4 }, (_, u) => {
            const uy = TOP - 0.16 - u * 0.115;
            return (
              <group key={`u-${u}`}>
                {/* Faceplate */}
                <mesh position={[0.372, uy, 0]}>
                  <boxGeometry args={[0.008, 0.10, 0.225]} />
                  <meshStandardMaterial
                    color={u % 2 === 0 ? "#1b1714" : "#100e0c"}
                    roughness={0.60}
                    metalness={0.20}
                  />
                </mesh>
                {/* Rack ears + screws */}
                {[-0.098, 0.098].map((ez) => (
                  <mesh key={`ear-${ez}`} position={[0.377, uy, ez]}>
                    <boxGeometry args={[0.006, 0.085, 0.016]} />
                    <meshStandardMaterial color={ALU} metalness={0.62} roughness={0.30} />
                  </mesh>
                ))}
                {/* Knobs */}
                {[-0.05, 0.0, 0.05].map((kz) => (
                  <mesh
                    key={`kn-${kz}`}
                    position={[0.379, uy + 0.018, kz]}
                    rotation={[0, 0, Math.PI / 2]}
                  >
                    <cylinderGeometry args={[0.009, 0.009, 0.012, 10]} />
                    <meshStandardMaterial color={ALU} metalness={0.60} roughness={0.30} />
                  </mesh>
                ))}
                {/* Status LED */}
                <mesh position={[0.379, uy - 0.025, -0.07]}>
                  <boxGeometry args={[0.005, 0.008, 0.008]} />
                  <meshStandardMaterial
                    color="#070707"
                    emissive={["#22c55e", "#f59e0b", "#3b82f6", "#ef4444"][u]}
                    emissiveIntensity={2.2}
                    roughness={0.3}
                  />
                </mesh>
                {/* VU meter strip */}
                <mesh position={[0.379, uy - 0.025, 0.04]}>
                  <boxGeometry args={[0.005, 0.014, 0.085]} />
                  <meshStandardMaterial
                    color="#070707"
                    emissive={u < 2 ? "#16a34a" : "#d97706"}
                    emissiveIntensity={1.1}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* ── Monitor riser shelf ── */}
      <mesh position={[-0.27, RISER, 0]}>
        <boxGeometry args={[0.30, 0.035, 1.46]} />
        <meshStandardMaterial color={WALNUT} roughness={0.42} metalness={0.05} />
      </mesh>
      {[-0.62, 0, 0.62].map((oz) => (
        <mesh key={`rsp-${oz}`} position={[-0.27, TOP + 0.21, oz]}>
          <boxGeometry args={[0.26, 0.38, 0.035]} />
          <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════════════════
          2. SCREENS — ultrawide centre + vertical secondary
         ═══════════════════════════════════════════════════════════ */}

      {/* Heavy monitor arm */}
      <mesh position={[-0.26, RISER + 0.10, 0]}>
        <boxGeometry args={[0.06, 0.20, 0.06]} />
        <meshStandardMaterial color={FRAME} metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh position={[-0.20, RISER + 0.26, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.035, 0.22, 0.035]} />
        <meshStandardMaterial color={FRAME} metalness={0.65} roughness={0.28} />
      </mesh>

      {/* Ultrawide bezel — 1.45 m wide (≈ 49") */}
      <mesh position={[-0.10, RISER + 0.42, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.45, 0.62, 0.035]} />
        <meshStandardMaterial color="#050505" metalness={0.50} roughness={0.26} />
      </mesh>
      {/* Screen glass — DAW session view */}
      <mesh position={[-0.080, RISER + 0.42, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.39, 0.56]} />
        <meshStandardMaterial
          color={GLASS}
          emissive="#101e38"
          emissiveIntensity={0.85}
          roughness={0.07}
          metalness={0.30}
        />
      </mesh>
      {/* DAW track lanes (8 colour-coded) */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`lane-${i}`}
          position={[-0.076, RISER + 0.64 - i * 0.058, 0.10]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[1.05, 0.040]} />
          <meshStandardMaterial
            color={GLASS}
            emissive={["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#0891b2", "#ca8a04", "#db2777", "#4f46e5"][i]}
            emissiveIntensity={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}
      {/* Mixer strip column on screen left */}
      <mesh position={[-0.076, RISER + 0.42, -0.575]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.20, 0.52]} />
        <meshStandardMaterial
          color={GLASS}
          emissive="#1e3a5f"
          emissiveIntensity={1.0}
          roughness={0.1}
        />
      </mesh>
      {/* Playhead */}
      <mesh position={[-0.072, RISER + 0.42, 0.18]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.006, 0.54]} />
        <meshStandardMaterial color={GLASS} emissive="#fbbf24" emissiveIntensity={2.2} roughness={0.1} />
      </mesh>

      {/* Vertical secondary monitor (right of ultrawide) */}
      <mesh position={[-0.14, RISER + 0.40, 0.97]} rotation={[0, Math.PI / 2 + 0.18, 0]}>
        <boxGeometry args={[0.44, 0.72, 0.030]} />
        <meshStandardMaterial color="#050505" metalness={0.50} roughness={0.26} />
      </mesh>
      <mesh position={[-0.119, RISER + 0.40, 0.966]} rotation={[0, Math.PI / 2 + 0.18, 0]}>
        <planeGeometry args={[0.40, 0.68]} />
        <meshStandardMaterial
          color={GLASS}
          emissive="#0c1a30"
          emissiveIntensity={0.70}
          roughness={0.08}
          metalness={0.28}
        />
      </mesh>
      {/* Plugin window blocks on vertical screen */}
      {[0.22, 0.0, -0.22].map((oy, i) => (
        <mesh
          key={`plug-${i}`}
          position={[-0.114, RISER + 0.40 + oy, 0.962]}
          rotation={[0, Math.PI / 2 + 0.18, 0]}
        >
          <planeGeometry args={[0.34, 0.16]} />
          <meshStandardMaterial
            color={GLASS}
            emissive={["#155e75", "#3730a3", "#166534"][i]}
            emissiveIntensity={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}
      {/* Vertical monitor stand */}
      <mesh position={[-0.24, RISER + 0.02, 0.97]}>
        <boxGeometry args={[0.04, 0.16, 0.04]} />
        <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Screen glow wash */}
      <pointLight position={[0.35, RISER + 0.45, 0]} color="#b8ccff" intensity={1.1} distance={3.0} decay={2} />

      {/* ═══════════════════════════════════════════════════════════
          3. STUDIO MONITORS — isolation floor stands, toed-in
             (proper listening triangle aimed at the chair)
         ═══════════════════════════════════════════════════════════ */}

      {[-1.28, 1.28].map((oz, side) => {
        // Toe-in: left (north) speaker yaws south-east, right yaws north-east
        const yaw = Math.PI / 2 + (side === 0 ? -0.30 : 0.30);
        return (
          <group key={`spk-${side}`} position={[-0.18, 0, oz]}>
            {/* Stand base plate */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.40, 0.04, 0.40]} />
              <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
            </mesh>
            {/* Stand column */}
            <mesh position={[0, 0.55, 0]}>
              <boxGeometry args={[0.10, 1.06, 0.10]} />
              <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
            </mesh>
            {/* Isolation pad */}
            <mesh position={[0, 1.095, 0]}>
              <boxGeometry args={[0.32, 0.035, 0.30]} />
              <meshStandardMaterial color="#191715" roughness={0.92} metalness={0.0} />
            </mesh>
            {/* Speaker — toed-in group */}
            <group position={[0, 1.36, 0]} rotation={[0, yaw, 0]}>
              {/* Cabinet */}
              <mesh>
                <boxGeometry args={[0.36, 0.50, 0.32]} />
                <meshStandardMaterial color={CREAM} roughness={0.52} metalness={0.04} />
              </mesh>
              {/* Front baffle inset */}
              <mesh position={[0, 0, 0.162]}>
                <boxGeometry args={[0.33, 0.47, 0.008]} />
                <meshStandardMaterial color="#dcd5c8" roughness={0.55} metalness={0.04} />
              </mesh>
              {/* Woofer ring */}
              <mesh position={[0, -0.075, 0.168]}>
                <circleGeometry args={[0.125, 30]} />
                <meshStandardMaterial color="#191717" roughness={0.75} metalness={0.05} />
              </mesh>
              {/* Woofer surround */}
              <mesh position={[0, -0.075, 0.169]}>
                <torusGeometry args={[0.105, 0.013, 8, 30]} />
                <meshStandardMaterial color="#2c2a2a" roughness={0.68} metalness={0.08} />
              </mesh>
              {/* Dust cap */}
              <mesh position={[0, -0.075, 0.171]}>
                <circleGeometry args={[0.038, 18]} />
                <meshStandardMaterial color="#262424" roughness={0.55} metalness={0.22} />
              </mesh>
              {/* Tweeter waveguide */}
              <mesh position={[0, 0.135, 0.169]}>
                <torusGeometry args={[0.048, 0.009, 8, 22]} />
                <meshStandardMaterial color="#d8d2c6" roughness={0.50} metalness={0.06} />
              </mesh>
              {/* Tweeter dome */}
              <mesh position={[0, 0.135, 0.168]}>
                <circleGeometry args={[0.032, 18]} />
                <meshStandardMaterial color="#171515" metalness={0.55} roughness={0.32} />
              </mesh>
              {/* Power LED */}
              <mesh position={[0.13, -0.21, 0.166]}>
                <boxGeometry args={[0.010, 0.010, 0.005]} />
                <meshStandardMaterial color="#070707" emissive="#28e848" emissiveIntensity={3.0} roughness={0.3} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════
          4. DESK GEAR — interface, controller, monitor ctrl, HP amp
         ═══════════════════════════════════════════════════════════ */}

      {/* ── Audio interface (UA Apollo style) on riser left ── */}
      <group position={[-0.26, RISER + 0.052, -0.50]}>
        <mesh>
          <boxGeometry args={[0.24, 0.068, 0.34]} />
          <meshStandardMaterial color="#16130f" roughness={0.45} metalness={0.30} />
        </mesh>
        {/* Big monitor knob */}
        <mesh position={[0.125, 0.0, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.018, 18]} />
          <meshStandardMaterial color={ALU} metalness={0.68} roughness={0.22} />
        </mesh>
        {/* Gain knobs */}
        {[-0.06, -0.12].map((kz, i) => (
          <mesh key={`g-${i}`} position={[0.125, 0.0, kz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.014, 12]} />
            <meshStandardMaterial color={ALU} metalness={0.62} roughness={0.26} />
          </mesh>
        ))}
        {/* Meter display */}
        <mesh position={[0.123, 0.022, 0]}>
          <boxGeometry args={[0.004, 0.016, 0.12]} />
          <meshStandardMaterial color="#070707" emissive="#22c55e" emissiveIntensity={1.8} roughness={0.3} />
        </mesh>
      </group>

      {/* ── Compact control surface / mixer (front centre-right) ── */}
      <group position={[0.16, TOP + 0.038, 0.52]}>
        <mesh>
          <boxGeometry args={[0.34, 0.032, 0.46]} />
          <meshStandardMaterial color={GEAR} roughness={0.55} metalness={0.22} />
        </mesh>
        {/* 8 faders */}
        {Array.from({ length: 8 }, (_, i) => (
          <group key={`fd-${i}`} position={[0.04, 0.018, -0.185 + i * 0.052]}>
            <mesh>
              <boxGeometry args={[0.16, 0.003, 0.005]} />
              <meshStandardMaterial color="#1a1816" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[(i % 4 - 1.5) * 0.030, 0.008, 0]}>
              <boxGeometry args={[0.020, 0.012, 0.016]} />
              <meshStandardMaterial color={ALU} metalness={0.62} roughness={0.26} />
            </mesh>
          </group>
        ))}
        {/* Encoder row */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={`enc-${i}`} position={[-0.12, 0.022, -0.185 + i * 0.052]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.014, 10]} />
            <meshStandardMaterial color="#26221e" metalness={0.50} roughness={0.40} />
          </mesh>
        ))}
        {/* Transport buttons */}
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={`tb-${i}`} position={[0.135, 0.018, -0.10 + i * 0.05]}>
            <boxGeometry args={[0.024, 0.010, 0.024]} />
            <meshStandardMaterial
              color="#070707"
              emissive={["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#a855f7"][i]}
              emissiveIntensity={1.5}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* ── Studio monitor controller (small, right) ── */}
      <group position={[0.27, TOP + 0.034, 0.18]}>
        <mesh>
          <boxGeometry args={[0.13, 0.045, 0.14]} />
          <meshStandardMaterial color={GEAR} roughness={0.52} metalness={0.24} />
        </mesh>
        <mesh position={[0, 0.030, 0]}>
          <cylinderGeometry args={[0.034, 0.036, 0.022, 20]} />
          <meshStandardMaterial color={ALU} metalness={0.70} roughness={0.20} />
        </mesh>
      </group>

      {/* ── Headphone amplifier on riser right ── */}
      <group position={[-0.26, RISER + 0.042, 0.52]}>
        <mesh>
          <boxGeometry args={[0.18, 0.052, 0.22]} />
          <meshStandardMaterial color="#14110e" roughness={0.50} metalness={0.26} />
        </mesh>
        {[-0.05, 0.02].map((kz, i) => (
          <mesh key={`hk-${i}`} position={[0.095, 0, kz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.013, 0.013, 0.012, 12]} />
            <meshStandardMaterial color={ALU} metalness={0.62} roughness={0.26} />
          </mesh>
        ))}
        <mesh position={[0.093, 0.016, 0.075]}>
          <boxGeometry args={[0.004, 0.008, 0.008]} />
          <meshStandardMaterial color="#070707" emissive="#3b82f6" emissiveIntensity={2.4} roughness={0.3} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════
          5. MIDI KEYBOARD — 61 keys, front-left of desk
         ═══════════════════════════════════════════════════════════ */}

      <group position={[0.17, TOP + 0.040, -0.46]}>
        {/* Chassis */}
        <mesh>
          <boxGeometry args={[0.30, 0.055, 0.92]} />
          <meshStandardMaterial color={GEAR} roughness={0.58} metalness={0.16} />
        </mesh>
        {/* White keys — 36 naturals */}
        {Array.from({ length: 36 }, (_, i) => (
          <mesh key={`wk-${i}`} position={[0.085, 0.032, -0.428 + i * 0.0245]}>
            <boxGeometry args={[0.115, 0.014, 0.021]} />
            <meshStandardMaterial color="#f2ede4" roughness={0.38} metalness={0.0} />
          </mesh>
        ))}
        {/* Black keys — 7-note octave pattern (skip E♯/B♯ gaps) */}
        {Array.from({ length: 35 }, (_, i) => {
          if (i % 7 === 2 || i % 7 === 6) return null;
          return (
            <mesh key={`bk-${i}`} position={[0.055, 0.044, -0.415 + i * 0.0245]}>
              <boxGeometry args={[0.068, 0.014, 0.014]} />
              <meshStandardMaterial color="#0a0908" roughness={0.45} metalness={0.10} />
            </mesh>
          );
        })}
        {/* Pitch + mod wheels */}
        {[-0.025, 0.025].map((kz, i) => (
          <mesh key={`wl-${i}`} position={[0.10, 0.030, 0.43 + kz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.020, 0.020, 0.024, 14]} />
            <meshStandardMaterial color="#1e1b18" metalness={0.45} roughness={0.42} />
          </mesh>
        ))}
        {/* Pad grid 2×4 */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={`pad-${i}`}
            position={[-0.075 - Math.floor(i / 4) * 0.055, 0.030, -0.30 + (i % 4) * 0.055]}
          >
            <boxGeometry args={[0.042, 0.008, 0.042]} />
            <meshStandardMaterial
              color="#111010"
              emissive={["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b"][i % 4]}
              emissiveIntensity={0.85}
              roughness={0.4}
            />
          </mesh>
        ))}
        {/* Encoder knobs row */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`mk-${i}`} position={[-0.085, 0.032, 0.05 + i * 0.052]}>
            <cylinderGeometry args={[0.011, 0.011, 0.014, 10]} />
            <meshStandardMaterial color={ALU} metalness={0.58} roughness={0.30} />
          </mesh>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════════════════
          6. COMPUTER PERIPHERALS — mech keyboard, mouse, tablet
         ═══════════════════════════════════════════════════════════ */}

      {/* Mechanical keyboard */}
      <group position={[0.30, TOP + 0.030, 0.05]}>
        <mesh>
          <boxGeometry args={[0.15, 0.030, 0.42]} />
          <meshStandardMaterial color="#100e0c" roughness={0.55} metalness={0.18} />
        </mesh>
        {/* Keycap rows */}
        {Array.from({ length: 5 }, (_, r) => (
          <mesh key={`kr-${r}`} position={[-0.045 + r * 0.024, 0.018, 0]}>
            <boxGeometry args={[0.020, 0.008, 0.40]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.50} metalness={0.10} />
          </mesh>
        ))}
        {/* Subtle white backlight slit */}
        <mesh position={[0, 0.008, 0]}>
          <boxGeometry args={[0.145, 0.002, 0.415]} />
          <meshStandardMaterial color="#0a0a0a" emissive="#fef3c7" emissiveIntensity={0.5} roughness={0.4} />
        </mesh>
      </group>
      {/* Wireless mouse */}
      <mesh position={[0.31, TOP + 0.038, 0.36]}>
        <sphereGeometry args={[0.042, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0e0c0a" roughness={0.45} metalness={0.22} />
      </mesh>

      {/* Tablet on stand (left of keyboard) */}
      <group position={[0.24, TOP + 0.085, -1.00]} rotation={[0, Math.PI / 2, -0.45]}>
        <mesh>
          <boxGeometry args={[0.020, 0.26, 0.19]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.30} metalness={0.45} />
        </mesh>
        <mesh position={[0.011, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.17, 0.24]} />
          <meshStandardMaterial color={GLASS} emissive="#16263e" emissiveIntensity={0.7} roughness={0.08} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════
          7. MICROPHONE — condenser + boom + shock mount + pop filter
         ═══════════════════════════════════════════════════════════ */}

      <group position={[-0.30, 0, 0.93]}>
        {/* Desk clamp */}
        <mesh position={[0, TOP + 0.045, 0]}>
          <boxGeometry args={[0.055, 0.09, 0.055]} />
          <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
        </mesh>
        {/* Lower boom section */}
        <mesh position={[0.10, TOP + 0.27, -0.05]} rotation={[0.18, 0, -0.42]}>
          <cylinderGeometry args={[0.011, 0.011, 0.52, 10]} />
          <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
        </mesh>
        {/* Spring detail */}
        <mesh position={[0.10, TOP + 0.27, -0.05]} rotation={[0.18, 0, -0.42]}>
          <cylinderGeometry args={[0.016, 0.016, 0.18, 8]} />
          <meshStandardMaterial color="#23201d" metalness={0.55} roughness={0.40} />
        </mesh>
        {/* Upper boom reaching toward the chair */}
        <mesh position={[0.33, TOP + 0.46, -0.16]} rotation={[0.25, 0, 1.05]}>
          <cylinderGeometry args={[0.009, 0.009, 0.46, 10]} />
          <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
        </mesh>
        {/* Shock-mount cage */}
        <mesh position={[0.52, TOP + 0.38, -0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.045, 0.006, 8, 22]} />
          <meshStandardMaterial color={ALU} metalness={0.68} roughness={0.24} />
        </mesh>
        {/* Mic body (large diaphragm condenser) */}
        <mesh position={[0.52, TOP + 0.33, -0.26]}>
          <cylinderGeometry args={[0.026, 0.022, 0.16, 16]} />
          <meshStandardMaterial color="#b8b0a2" metalness={0.74} roughness={0.18} />
        </mesh>
        {/* Capsule grille */}
        <mesh position={[0.52, TOP + 0.44, -0.26]}>
          <cylinderGeometry args={[0.024, 0.024, 0.06, 16]} />
          <meshStandardMaterial color="#272421" roughness={0.80} metalness={0.20} />
        </mesh>
        {/* Pop filter gooseneck */}
        <mesh position={[0.60, TOP + 0.40, -0.22]} rotation={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.005, 0.005, 0.16, 8]} />
          <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.40} />
        </mesh>
        {/* Pop filter hoop + mesh */}
        <mesh position={[0.66, TOP + 0.40, -0.26]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.055, 0.006, 8, 24]} />
          <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
        </mesh>
        <mesh position={[0.66, TOP + 0.40, -0.258]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.050, 24]} />
          <meshStandardMaterial color="#161414" roughness={0.92} metalness={0.04} transparent opacity={0.50} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════
          8. HEADPHONES — over-ear, on dedicated desk-edge hook
         ═══════════════════════════════════════════════════════════ */}

      <group position={[0.42, TOP - 0.07, -0.97]}>
        {/* Hook bracket under desk edge */}
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.07, 0.018, 0.05]} />
          <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
        </mesh>
        <mesh position={[0.025, 0.012, 0]}>
          <boxGeometry args={[0.016, 0.10, 0.045]} />
          <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
        </mesh>
        {/* Headband hanging on hook */}
        <mesh position={[0.025, -0.085, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.095, 0.013, 10, 26, Math.PI]} />
          <meshStandardMaterial color="#1c1916" metalness={0.50} roughness={0.38} />
        </mesh>
        {/* Headband cushion */}
        <mesh position={[0.025, 0.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.092, 0.009, 8, 18, Math.PI * 0.5]} />
          <meshStandardMaterial color="#26221e" roughness={0.75} metalness={0.05} />
        </mesh>
        {/* Ear cups */}
        {[-0.098, 0.098].map((cz, i) => (
          <group key={`cup-${i}`} position={[0.025, -0.10, cz]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.052, 0.056, 0.040, 20]} />
              <meshStandardMaterial color="#14110e" roughness={0.55} metalness={0.16} />
            </mesh>
            {/* Cushion ring */}
            <mesh position={[0, 0, cz < 0 ? 0.022 : -0.022]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.038, 0.013, 8, 18]} />
              <meshStandardMaterial color="#1e1a16" roughness={0.82} metalness={0.03} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════════════════
          9. ACCESSORIES — mug, plant, notebook
         ═══════════════════════════════════════════════════════════ */}

      {/* Coffee mug */}
      <group position={[0.34, TOP + 0.07, 0.80]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.040, 0.105, 18]} />
          <meshStandardMaterial color="#1a1714" roughness={0.48} metalness={0.06} />
        </mesh>
        <mesh position={[0, 0.048, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.006, 18]} />
          <meshStandardMaterial color="#3a2010" emissive="#6a3414" emissiveIntensity={0.18} roughness={0.40} />
        </mesh>
        <mesh position={[0, -0.01, 0.052]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.030, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#1a1714" roughness={0.48} metalness={0.06} />
        </mesh>
      </group>

      {/* Small desk plant */}
      <group position={[-0.27, RISER + 0.04, -0.92]}>
        <mesh>
          <cylinderGeometry args={[0.050, 0.042, 0.085, 14]} />
          <meshStandardMaterial color="#3e2a1a" roughness={0.70} metalness={0.03} />
        </mesh>
        {[
          [0.02, 0.085, 0.01, 0.045],
          [-0.025, 0.10, -0.015, 0.038],
          [0.005, 0.115, 0.025, 0.032],
        ].map(([px, py, pz, r], i) => (
          <mesh key={`lf-${i}`} position={[px, py, pz]}>
            <sphereGeometry args={[r, 10, 10]} />
            <meshStandardMaterial color={["#1c5e26", "#237030", "#1a5422"][i]} roughness={0.80} metalness={0.0} />
          </mesh>
        ))}
      </group>

      {/* Notebook + pen */}
      <group position={[0.33, TOP + 0.032, -0.62]} rotation={[0, 0.18, 0]}>
        <mesh>
          <boxGeometry args={[0.20, 0.022, 0.145]} />
          <meshStandardMaterial color="#241c12" roughness={0.68} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.013, -0.068]}>
          <boxGeometry args={[0.19, 0.004, 0.006]} />
          <meshStandardMaterial color="#c8a060" emissive="#c8a060" emissiveIntensity={0.22} metalness={0.55} roughness={0.30} />
        </mesh>
        <mesh position={[0.02, 0.018, 0.02]} rotation={[0, 0.6, Math.PI / 2]}>
          <cylinderGeometry args={[0.004, 0.004, 0.13, 8]} />
          <meshStandardMaterial color="#0e0c0a" metalness={0.50} roughness={0.35} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════
          10. PREMIUM ERGONOMIC CHAIR — reclined, facing the desk
         ═══════════════════════════════════════════════════════════ */}

      <group position={[1.15, 0, 0]}>
        {/* 5-star polished aluminium base */}
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2 + 0.3;
          return (
            <group key={`star-${i}`}>
              <mesh
                position={[Math.cos(a) * 0.185, 0.062, Math.sin(a) * 0.185]}
                rotation={[0, -a, 0.10]}
              >
                <boxGeometry args={[0.36, 0.035, 0.055]} />
                <meshStandardMaterial color={ALU} metalness={0.78} roughness={0.20} />
              </mesh>
              {/* Caster wheel */}
              <mesh
                position={[Math.cos(a) * 0.36, 0.035, Math.sin(a) * 0.36]}
                rotation={[Math.PI / 2, 0, a]}
              >
                <cylinderGeometry args={[0.034, 0.034, 0.030, 14]} />
                <meshStandardMaterial color="#171514" roughness={0.45} metalness={0.35} />
              </mesh>
            </group>
          );
        })}
        {/* Gas lift */}
        <mesh position={[0, 0.30, 0]}>
          <cylinderGeometry args={[0.032, 0.026, 0.46, 16]} />
          <meshStandardMaterial color={ALU} metalness={0.72} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.040, 0.040, 0.14, 16]} />
          <meshStandardMaterial color="#1a1816" metalness={0.55} roughness={0.40} />
        </mesh>
        {/* Tilt mechanism */}
        <mesh position={[0, 0.515, 0]}>
          <boxGeometry args={[0.24, 0.06, 0.20]} />
          <meshStandardMaterial color={FRAME} metalness={0.50} roughness={0.40} />
        </mesh>

        {/* Seat — leather cushion with contour */}
        <mesh position={[0, 0.585, 0]}>
          <boxGeometry args={[0.52, 0.075, 0.50]} />
          <meshStandardMaterial color={LEATHER} roughness={0.55} metalness={0.05} />
        </mesh>
        {/* Seat front waterfall edge */}
        <mesh position={[-0.245, 0.575, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.09, 0.060, 0.48]} />
          <meshStandardMaterial color={LEATHER} roughness={0.58} metalness={0.05} />
        </mesh>
        {/* Seat side bolsters */}
        {[-0.24, 0.24].map((bz) => (
          <mesh key={`bol-${bz}`} position={[0.02, 0.615, bz]}>
            <boxGeometry args={[0.46, 0.045, 0.055]} />
            <meshStandardMaterial color={FABRIC} roughness={0.70} metalness={0.03} />
          </mesh>
        ))}

        {/* Backrest — reclined ~12°, leather + fabric panels */}
        <group position={[0.27, 1.06, 0]} rotation={[0, 0, -0.21]}>
          {/* Frame spine */}
          <mesh position={[0.030, 0, 0]}>
            <boxGeometry args={[0.045, 0.92, 0.14]} />
            <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
          </mesh>
          {/* Main back panel */}
          <mesh>
            <boxGeometry args={[0.060, 0.88, 0.46]} />
            <meshStandardMaterial color={LEATHER} roughness={0.55} metalness={0.05} />
          </mesh>
          {/* Fabric centre insert */}
          <mesh position={[-0.032, 0.02, 0]}>
            <boxGeometry args={[0.012, 0.74, 0.30]} />
            <meshStandardMaterial color={FABRIC} roughness={0.80} metalness={0.02} />
          </mesh>
          {/* Horizontal stitch lines */}
          {[-0.22, -0.05, 0.12, 0.29].map((sy, i) => (
            <mesh key={`st-${i}`} position={[-0.039, sy, 0]}>
              <boxGeometry args={[0.003, 0.006, 0.29]} />
              <meshStandardMaterial color="#0a0908" roughness={0.75} metalness={0.02} />
            </mesh>
          ))}
          {/* Lumbar support bulge */}
          <mesh position={[-0.045, -0.28, 0]}>
            <boxGeometry args={[0.040, 0.16, 0.34]} />
            <meshStandardMaterial color={LEATHER} roughness={0.52} metalness={0.05} />
          </mesh>
          {/* Headrest on stalk */}
          <mesh position={[-0.005, 0.55, 0]}>
            <boxGeometry args={[0.035, 0.14, 0.10]} />
            <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[-0.035, 0.66, 0]}>
            <boxGeometry args={[0.070, 0.16, 0.26]} />
            <meshStandardMaterial color={LEATHER} roughness={0.52} metalness={0.05} />
          </mesh>
        </group>

        {/* Adjustable armrests */}
        {[-0.29, 0.29].map((az) => (
          <group key={`arm-${az}`} position={[0.10, 0, az]}>
            <mesh position={[0, 0.70, 0]}>
              <boxGeometry args={[0.035, 0.26, 0.030]} />
              <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
            </mesh>
            <mesh position={[-0.08, 0.835, 0]}>
              <boxGeometry args={[0.26, 0.030, 0.085]} />
              <meshStandardMaterial color="#1a1714" roughness={0.62} metalness={0.06} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════════════════
          11. GUITAR CORNER — electric + acoustic stands, amp, pedals
         ═══════════════════════════════════════════════════════════ */}

      {/* ── Electric guitar on A-frame stand (north end) ── */}
      <group position={[0.30, 0, -1.62]} rotation={[0, 0.5, 0]}>
        {/* A-frame legs */}
        {[-0.09, 0.09].map((lz) => (
          <mesh key={`afl-${lz}`} position={[0.02, 0.21, lz]} rotation={[lz < 0 ? 0.28 : -0.28, 0, 0.18]}>
            <cylinderGeometry args={[0.008, 0.008, 0.46, 8]} />
            <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
          </mesh>
        ))}
        {/* Back support leg */}
        <mesh position={[-0.10, 0.24, 0]} rotation={[0, 0, -0.42]}>
          <cylinderGeometry args={[0.008, 0.008, 0.52, 8]} />
          <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
        </mesh>
        {/* Body cradle arms */}
        {[-0.085, 0.085].map((cz) => (
          <mesh key={`cr-${cz}`} position={[0.075, 0.10, cz]} rotation={[0, 0, 0.25]}>
            <cylinderGeometry args={[0.007, 0.007, 0.13, 8]} />
            <meshStandardMaterial color="#141210" roughness={0.85} metalness={0.10} />
          </mesh>
        ))}
        {/* Guitar — leaning back slightly on the stand */}
        <group position={[0.05, 0, 0]} rotation={[0, 0, -0.16]}>
          {/* Body (superstrat) */}
          <mesh position={[0.02, 0.26, 0]}>
            <boxGeometry args={[0.075, 0.34, 0.27]} />
            <meshStandardMaterial color="#2c1c0e" roughness={0.78} metalness={0.04} />
          </mesh>
          {/* Horns */}
          <mesh position={[0.02, 0.44, -0.09]} rotation={[0.45, 0, 0]}>
            <boxGeometry args={[0.070, 0.16, 0.08]} />
            <meshStandardMaterial color="#2c1c0e" roughness={0.78} metalness={0.04} />
          </mesh>
          <mesh position={[0.02, 0.42, 0.10]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.070, 0.12, 0.08]} />
            <meshStandardMaterial color="#2c1c0e" roughness={0.78} metalness={0.04} />
          </mesh>
          {/* Pickups */}
          {[0.20, 0.30].map((py, i) => (
            <mesh key={`pu-${i}`} position={[0.060, py, 0]}>
              <boxGeometry args={[0.012, 0.040, 0.085]} />
              <meshStandardMaterial color="#080808" roughness={0.50} metalness={0.12} />
            </mesh>
          ))}
          {/* Neck */}
          <mesh position={[0.02, 0.70, 0]}>
            <boxGeometry args={[0.045, 0.58, 0.058]} />
            <meshStandardMaterial color="#190f06" roughness={0.80} metalness={0.03} />
          </mesh>
          {/* Headstock */}
          <mesh position={[0.02, 1.04, -0.012]} rotation={[0.12, 0, 0]}>
            <boxGeometry args={[0.040, 0.15, 0.075]} />
            <meshStandardMaterial color="#120b04" roughness={0.80} metalness={0.04} />
          </mesh>
          {/* Strings hint */}
          <mesh position={[0.063, 0.58, 0]}>
            <boxGeometry args={[0.0015, 0.78, 0.035]} />
            <meshStandardMaterial color="#a8a090" metalness={0.80} roughness={0.20} />
          </mesh>
        </group>
      </group>

      {/* ── Acoustic guitar on stand (south end) ── */}
      <group position={[0.30, 0, 1.62]} rotation={[0, -0.5, 0]}>
        {/* Stand legs */}
        {[-0.09, 0.09].map((lz) => (
          <mesh key={`asl-${lz}`} position={[0.02, 0.21, lz]} rotation={[lz < 0 ? 0.28 : -0.28, 0, 0.18]}>
            <cylinderGeometry args={[0.008, 0.008, 0.46, 8]} />
            <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
          </mesh>
        ))}
        <mesh position={[-0.10, 0.24, 0]} rotation={[0, 0, -0.42]}>
          <cylinderGeometry args={[0.008, 0.008, 0.52, 8]} />
          <meshStandardMaterial color={FRAME} metalness={0.60} roughness={0.32} />
        </mesh>
        {/* Guitar leaning back */}
        <group position={[0.05, 0, 0]} rotation={[0, 0, -0.14]}>
          {/* Lower bout */}
          <mesh position={[0.02, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.20, 0.20, 0.105, 22]} />
            <meshStandardMaterial color="#8a5a28" roughness={0.55} metalness={0.04} />
          </mesh>
          {/* Upper bout */}
          <mesh position={[0.02, 0.46, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.10, 20]} />
            <meshStandardMaterial color="#8a5a28" roughness={0.55} metalness={0.04} />
          </mesh>
          {/* Sound hole */}
          <mesh position={[0.075, 0.34, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.052, 20]} />
            <meshStandardMaterial color="#120a04" roughness={0.90} metalness={0.0} />
          </mesh>
          {/* Rosette ring */}
          <mesh position={[0.076, 0.34, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.058, 0.004, 6, 22]} />
            <meshStandardMaterial color="#c89858" roughness={0.45} metalness={0.10} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0.075, 0.185, 0]}>
            <boxGeometry args={[0.010, 0.030, 0.11]} />
            <meshStandardMaterial color="#1a0e06" roughness={0.70} metalness={0.04} />
          </mesh>
          {/* Neck */}
          <mesh position={[0.02, 0.74, 0]}>
            <boxGeometry args={[0.045, 0.50, 0.055]} />
            <meshStandardMaterial color="#3a2410" roughness={0.72} metalness={0.03} />
          </mesh>
          {/* Headstock */}
          <mesh position={[0.02, 1.05, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.042, 0.14, 0.068]} />
            <meshStandardMaterial color="#241404" roughness={0.75} metalness={0.04} />
          </mesh>
          {/* Strings hint */}
          <mesh position={[0.064, 0.60, 0]}>
            <boxGeometry args={[0.0015, 0.82, 0.032]} />
            <meshStandardMaterial color="#c0b8a0" metalness={0.78} roughness={0.22} />
          </mesh>
        </group>
      </group>

      {/* ── Guitar amplifier (combo, north of electric stand) ── */}
      <group position={[0.55, 0, -2.30]} rotation={[0, 0.35, 0]}>
        {/* Cab */}
        <mesh position={[0, 0.30, 0]}>
          <boxGeometry args={[0.42, 0.56, 0.60]} />
          <meshStandardMaterial color="#100d0a" roughness={0.72} metalness={0.06} />
        </mesh>
        {/* Front grille cloth */}
        <mesh position={[0.213, 0.24, 0]}>
          <boxGeometry args={[0.010, 0.38, 0.54]} />
          <meshStandardMaterial color="#1e1a14" roughness={0.92} metalness={0.02} />
        </mesh>
        {/* Speaker shadow circle */}
        <mesh position={[0.220, 0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.155, 24]} />
          <meshStandardMaterial color="#0a0806" roughness={0.95} metalness={0.0} />
        </mesh>
        {/* Control panel */}
        <mesh position={[0.205, 0.50, 0]}>
          <boxGeometry args={[0.030, 0.075, 0.52]} />
          <meshStandardMaterial color="#2a2218" metalness={0.30} roughness={0.50} />
        </mesh>
        {/* Knob row */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`ak-${i}`} position={[0.225, 0.50, -0.19 + i * 0.076]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.014, 12]} />
            <meshStandardMaterial color="#d8cdb8" metalness={0.30} roughness={0.45} />
          </mesh>
        ))}
        {/* Power lamp */}
        <mesh position={[0.224, 0.50, 0.235]}>
          <boxGeometry args={[0.008, 0.014, 0.014]} />
          <meshStandardMaterial color="#070707" emissive="#ef3030" emissiveIntensity={2.4} roughness={0.3} />
        </mesh>
        {/* Top handle */}
        <mesh position={[0, 0.60, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.075, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0c0a08" roughness={0.60} metalness={0.10} />
        </mesh>
        {/* Corner protectors */}
        {[[-0.20, 0.56, -0.28], [-0.20, 0.56, 0.28], [0.20, 0.56, -0.28], [0.20, 0.56, 0.28]].map(([cx, cy, cz], i) => (
          <mesh key={`cp-${i}`} position={[cx, cy, cz]}>
            <boxGeometry args={[0.035, 0.035, 0.035]} />
            <meshStandardMaterial color="#1c1916" metalness={0.55} roughness={0.40} />
          </mesh>
        ))}
      </group>

      {/* ── Pedalboard (floor, in front of electric stand) ── */}
      <group position={[0.85, 0, -1.30]} rotation={[0, 0.15, 0]}>
        {/* Board (slight tilt) */}
        <mesh position={[0, 0.045, 0]} rotation={[0, 0, 0.10]}>
          <boxGeometry args={[0.30, 0.035, 0.55]} />
          <meshStandardMaterial color="#0d0b09" roughness={0.75} metalness={0.08} />
        </mesh>
        {/* 4 stompboxes */}
        {[
          { oz: -0.19, col: "#d97706" },
          { oz: -0.065, col: "#2563eb" },
          { oz: 0.065, col: "#dc2626" },
          { oz: 0.19, col: "#16a34a" },
        ].map(({ oz, col }, i) => (
          <group key={`pd-${i}`} position={[0.01 + (i % 2) * 0.02, 0.085, oz]} rotation={[0, 0, 0.10]}>
            <mesh>
              <boxGeometry args={[0.115, 0.050, 0.075]} />
              <meshStandardMaterial color={["#3d2f10", "#10254a", "#3d1010", "#103d1a"][i]} roughness={0.55} metalness={0.20} />
            </mesh>
            {/* Footswitch */}
            <mesh position={[0.035, 0.030, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.014, 12]} />
              <meshStandardMaterial color={ALU} metalness={0.65} roughness={0.28} />
            </mesh>
            {/* Knobs */}
            {[-0.020, 0.020].map((kz) => (
              <mesh key={`pk-${kz}`} position={[-0.035, 0.030, kz]}>
                <cylinderGeometry args={[0.009, 0.009, 0.012, 10]} />
                <meshStandardMaterial color="#0e0c0a" metalness={0.45} roughness={0.45} />
              </mesh>
            ))}
            {/* LED */}
            <mesh position={[0.052, 0.028, 0.026]}>
              <boxGeometry args={[0.008, 0.008, 0.008]} />
              <meshStandardMaterial color="#070707" emissive={col} emissiveIntensity={2.2} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════════════════
          12. LIGHTING — subtle LED underglow + riser backlight
         ═══════════════════════════════════════════════════════════ */}

      {/* Under-desk strip (subtle warm white — no RGB overload) */}
      <mesh position={[0.428, TOP - 0.045, 0]}>
        <boxGeometry args={[0.008, 0.008, 1.96]} />
        <meshStandardMaterial color="#0c0b08" emissive="#d8b048" emissiveIntensity={0.85} roughness={0.4} />
      </mesh>
      <pointLight position={[0.55, TOP - 0.15, 0]} color="#caa040" intensity={0.7} distance={2.0} decay={2} />

      {/* Behind-riser wall-wash strip */}
      <mesh position={[-0.44, TOP + 0.30, 0]}>
        <boxGeometry args={[0.006, 0.006, 1.42]} />
        <meshStandardMaterial color="#0c0b08" emissive="#e8c060" emissiveIntensity={1.1} roughness={0.4} />
      </mesh>
      <pointLight position={[-0.50, TOP + 0.45, 0]} color="#d4a840" intensity={0.85} distance={2.2} decay={2} />

    </group>
  );
}
