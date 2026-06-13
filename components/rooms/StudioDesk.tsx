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
 *   → desk spans z ≈ -3.5 … 0.3 — expanded between poster clusters
 *   → desk surface world y ≈ 1.30, chair seat ≈ 0.98
 *
 * All screens / drivers face +X via rotation [0, π/2, 0]
 * (plane local +Z normal → world +X after the yaw).
 */

import { IbanezRgir20Bfe, WALNUT_FLAT_FINISH } from "@/components/rooms/IbanezRgir20Bfe";
import { MarshallMg15Front } from "@/components/rooms/MarshallMg15Front";
import { DeskIpad } from "@/components/rooms/DeskIpad";
import { RiserShelfCactus, StudioDeskScreens } from "@/components/rooms/StudioDeskScreens";
import { StudioMonitorStand } from "@/components/rooms/StudioMonitorSpeaker";
import { StudioKeyboardDrawer } from "@/components/rooms/StudioKeyboardDrawer";
import { StudioRiserBay } from "@/components/rooms/StudioRiserBay";
import { scaleWorldZ } from "@/lib/roomLayout";

const S = 1.6;                      // global display scale
const POS: [number, number, number] = [-21.1, 0.1, scaleWorldZ(0)];

// ── Desk footprint (local Z = depth along wall) ───────────────────────────────
const DESK_DEPTH = 2.7;             // was 2.0 — +0.35 m per end
const DESK_HALF = DESK_DEPTH / 2;
const DESK_WIDTH = 0.85;
const MONITOR_STAND_Z = DESK_HALF + 0.48;
const RISER_DEPTH = DESK_DEPTH - 0.54;
const LEG_Z = DESK_HALF - 0.07;
const RACK_Z = DESK_HALF - 0.20;
const RISER_SUPPORT_Z = DESK_HALF * 0.62;

// ── Key local heights ─────────────────────────────────────────────────────────
const TOP = 0.75;                   // desk surface
const RISER = TOP + 0.42;           // riser shelf top

// ── Materials ─────────────────────────────────────────────────────────────────
const WALNUT    = "#2c1c0c";        // matte walnut top
const WALNUT_LT = "#3e2814";        // grain stripes
const FRAME     = "#131110";        // black powder-coat steel
const ALU       = "#9a958c";        // brushed aluminium
const GEAR      = "#0d0b0a";        // dark equipment body
const LEATHER   = "#16130f";        // chair leather
const FABRIC    = "#1d1a17";        // chair fabric / mesh

/** Guitar-corner floor gear — extra offset from the desk (+X east, −Z north). */
const GUITAR_CORNER_AWAY_X = 0.12;
const GUITAR_CORNER_AWAY_Z = -0.32;
const GUITAR_CORNER_YAW = Math.PI + (50 * Math.PI) / 180 + Math.PI / 2;
/** Electric guitar yaw only — 5° clockwise (viewed from above). */
const ELECTRIC_GUITAR_YAW = -(5 * Math.PI) / 180;
/** Lean forward on the stand — +5° (opposite of back-lean). */
const ELECTRIC_GUITAR_LEAN = (5 * Math.PI) / 180;
/** Extra space between the electric guitar stand and the amp (+Z / south). */
const GUITAR_AMP_GAP_Z = 0.24;
/** Acoustic stand — extra clearance from desk (+X front, +Z south). */
const ACOUSTIC_STAND_AWAY_X = 0.14;
const ACOUSTIC_STAND_AWAY_Z = 0.24;
/** Acoustic body seated on stand — same cradle offset as the electric. */
const ACOUSTIC_GUITAR_OFFSET: [number, number, number] = [0.05, 0.20, 0];
/** Acoustic stand yaw — 10° (viewed from above; was 30°, rotated back 20°). */
const ACOUSTIC_GUITAR_YAW = (10 * Math.PI) / 180;

export function StudioDesk() {
  return (
    <group position={POS} scale={[S, S, S]}>

      {/* ═══════════════════════════════════════════════════════════
          1. DESK — walnut top, black steel frame, dual built-in racks
         ═══════════════════════════════════════════════════════════ */}

      {/* Main walnut tabletop */}
      <mesh position={[0, TOP, 0]}>
        <boxGeometry args={[DESK_WIDTH, 0.045, DESK_DEPTH]} />
        <meshStandardMaterial color={WALNUT} roughness={0.42} metalness={0.05} />
      </mesh>
      {/* Grain stripes */}
      {[-1.08, -0.62, -0.18, 0.26, 0.68, 1.10].map((oz, i) => (
        <mesh key={`gr-${i}`} position={[0, TOP + 0.0235, oz]}>
          <boxGeometry args={[DESK_WIDTH - 0.02, 0.0012, 0.024 + (i % 3) * 0.010]} />
          <meshStandardMaterial color={WALNUT_LT} roughness={0.46} metalness={0.03} />
        </mesh>
      ))}
      {/* Curved ergonomic front edge (rounded cap) */}
      <mesh position={[DESK_WIDTH / 2, TOP, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0225, 0.0225, DESK_DEPTH, 12]} />
        <meshStandardMaterial color={WALNUT} roughness={0.42} metalness={0.05} />
      </mesh>

      {/* Steel side-panel legs */}
      {[-LEG_Z, LEG_Z].map((oz) => (
        <mesh key={`leg-${oz}`} position={[0, TOP / 2 - 0.02, oz]}>
          <boxGeometry args={[0.72, TOP - 0.04, 0.055]} />
          <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
      {/* Rear cross-beam + cable channel */}
      <mesh position={[-0.36, TOP - 0.12, 0]}>
        <boxGeometry args={[0.05, 0.16, DESK_DEPTH - 0.16]} />
        <meshStandardMaterial color={FRAME} metalness={0.45} roughness={0.45} />
      </mesh>
      {/* Cable channel slot detail */}
      {[-DESK_HALF * 0.6, 0, DESK_HALF * 0.6].map((oz) => (
        <mesh key={`slot-${oz}`} position={[-0.332, TOP - 0.12, oz]}>
          <boxGeometry args={[0.006, 0.10, 0.16]} />
          <meshStandardMaterial color="#000000" roughness={0.95} metalness={0.0} />
        </mesh>
      ))}

      {/* ── Dual rack spaces built into both desk sides (4U each) ── */}
      {[-RACK_Z, RACK_Z].map((oz, side) => (
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

      {/* ── Sliding keyboard drawer (under-desk tray) ── */}
      <StudioKeyboardDrawer topY={TOP} centerZ={0.02} trayWidth={1.64} />

      {/* ── Monitor riser shelf ── */}
      <mesh position={[-0.27, RISER, 0]}>
        <boxGeometry args={[0.30, 0.035, RISER_DEPTH]} />
        <meshStandardMaterial color={WALNUT} roughness={0.42} metalness={0.05} />
      </mesh>
      {[-RISER_SUPPORT_Z, 0, RISER_SUPPORT_Z].map((oz) => (
        <mesh key={`rsp-${oz}`} position={[-0.27, TOP + 0.21, oz]}>
          <boxGeometry args={[0.26, 0.38, 0.035]} />
          <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}

      {/* ── Recording bay — interfaces, soundcard, console in riser hollow ── */}
      <StudioRiserBay topY={TOP} riserY={RISER} centerX={-0.20} />

      {/* ═══════════════════════════════════════════════════════════
          2. SCREENS — ultrawide centre + vertical secondary
         ═══════════════════════════════════════════════════════════ */}

      <StudioDeskScreens riserY={RISER} />

      {/* ═══════════════════════════════════════════════════════════
          3. STUDIO MONITORS — isolation floor stands, toed-in
             (proper listening triangle aimed at the chair)
         ═══════════════════════════════════════════════════════════ */}

      {[-MONITOR_STAND_Z, MONITOR_STAND_Z].map((oz, side) => {
        const yaw = Math.PI / 2 + (side === 0 ? -0.30 : 0.30);
        return (
          <StudioMonitorStand
            key={`spk-${side}`}
            position={[-0.18, 0, oz]}
            yaw={yaw}
          />
        );
      })}

      {/* ═══════════════════════════════════════════════════════════
          4. DESK GEAR — controller, monitor ctrl (recording bay under riser)
         ═══════════════════════════════════════════════════════════ */}

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

      {/* ═══════════════════════════════════════════════════════════
          6. COMPUTER PERIPHERALS — mech keyboard, mouse, iPad
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

      {/* iPad — flat on desk between keyboard and notebook */}
      <DeskIpad position={[0.28, TOP + 0.003, -0.38]} rotation={[0, -0.1, 0]} />

      {/* ═══════════════════════════════════════════════════════════
          7. MICROPHONE — condenser + boom + shock mount + pop filter
         ═══════════════════════════════════════════════════════════ */}

      <group position={[-0.30, 0, DESK_HALF - 0.07]}>
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
          8. ACCESSORIES — mug, plant, notebook
         ═══════════════════════════════════════════════════════════ */}

      {/* Coffee mug */}
      <group position={[0.34, TOP + 0.07, DESK_HALF - 0.20]}>
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

      <RiserShelfCactus riserY={RISER} />

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

      {/* ── Electric guitar on A-frame stand (north end) — 5° clockwise ── */}
      <group
        position={[0.30 + GUITAR_CORNER_AWAY_X, 0, -1.62 + GUITAR_CORNER_AWAY_Z + GUITAR_AMP_GAP_Z]}
        rotation={[0, ELECTRIC_GUITAR_YAW, 0]}
      >
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
        {/* Ibanez RGIR20BFE — mesh front is +Z; rotate +90° Y so EMG face points +X into room */}
        <group position={[0.05, 0.33, 0]} rotation={[0, 0, ELECTRIC_GUITAR_LEAN]}>
          <group rotation={[0, Math.PI / 2, 0]} scale={[1.05, 1.05, 1.05]}>
            <IbanezRgir20Bfe finish={WALNUT_FLAT_FINISH} />
          </group>
        </group>
      </group>

      {/* ── Acoustic guitar on stand (south end) ── */}
      <group
        position={[
          0.30 + GUITAR_CORNER_AWAY_X + ACOUSTIC_STAND_AWAY_X,
          0,
          1.62 + ACOUSTIC_STAND_AWAY_Z,
        ]}
        rotation={[0, ACOUSTIC_GUITAR_YAW, 0]}
      >
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
        {/* Body cradle arms */}
        {[-0.085, 0.085].map((cz) => (
          <mesh key={`acr-${cz}`} position={[0.075, 0.10, cz]} rotation={[0, 0, 0.25]}>
            <cylinderGeometry args={[0.007, 0.007, 0.13, 8]} />
            <meshStandardMaterial color="#141210" roughness={0.85} metalness={0.10} />
          </mesh>
        ))}
        {/* Guitar — same forward lean as the electric on its A-frame */}
        <group position={ACOUSTIC_GUITAR_OFFSET} rotation={[0, 0, ELECTRIC_GUITAR_LEAN]}>
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

      {/* ── Guitar amplifier (combo, north of electric stand) — 320° yaw ── */}
      <group
        position={[0.55 + GUITAR_CORNER_AWAY_X, 0, -2.30 + GUITAR_CORNER_AWAY_Z]}
        rotation={[0, GUITAR_CORNER_YAW, 0]}
      >
        {/* Cab shell — Marshall MG15FX front on +X face */}
        <mesh position={[0, 0.30, 0]}>
          <boxGeometry args={[0.42, 0.56, 0.60]} />
          <meshStandardMaterial color="#100d0a" roughness={0.78} metalness={0.05} />
        </mesh>
        <MarshallMg15Front frontX={0.21} cabY={0.30} faceH={0.56} faceW={0.54} />
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

      {/* ── Pedalboard (floor, in front of electric stand) — 320° yaw ── */}
      <group
        position={[0.85 + GUITAR_CORNER_AWAY_X, 0, -1.30 + GUITAR_CORNER_AWAY_Z]}
        rotation={[0, GUITAR_CORNER_YAW, 0]}
      >
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

    </group>
  );
}
