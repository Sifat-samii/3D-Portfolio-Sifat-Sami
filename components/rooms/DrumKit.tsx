"use client";

/**
 * Studio drum kit — realistic 5-piece setup (modelled on the Sketchfab
 * reference "Studio Drum Kit – Realistic 5-Piece Setup").
 *
 * Built LIFE-SIZE in local coordinates, then scaled ×1.5 to match the
 * room's oversized furniture scale. High corner stage in the south-east.
 *
 * Local space: origin = floor under kick drum centre.
 *   Player sits south (+Z) on the throne and faces north (−Z).
 *   −Z = audience side (kick reso head with port hole).
 *
 * Correct drum construction:
 *   • Kick lies on its SIDE — cylinder axis along Z (heads face ±Z)
 *   • Rack toms MOUNTED ABOVE the kick on a tom bar, tilted to player
 *   • Snare on its own stand at thigh height, slight tilt
 *   • Floor tom standing on 3 legs, right of player
 *   • Hi-hat left, crash left-front + right-front, ride far right
 *
 * Finish: honey-sunburst lacquer shells, black hoops/lugs, coated heads,
 * lathed bronze cymbals, matte-black double-braced hardware.
 */

import {
  DrumStagePlatform,
  drumKitStagePosition,
} from "@/components/rooms/DrumStagePlatform";

const S = 1.5;
const EAST_WALL_X = -7.09;
const SOUTH_WALL_WORLD_Z = 6.0;
const DRUM_YAW = (40 * Math.PI) / 180;
/** Kit-only inset from east wall — platform stays flush; kit shifts west (−X). */
const KIT_EAST_GAP = 0.35;
const _baseKitPos = drumKitStagePosition(EAST_WALL_X, SOUTH_WALL_WORLD_Z);
const KIT_POS: [number, number, number] = [
  _baseKitPos[0] - KIT_EAST_GAP,
  _baseKitPos[1],
  _baseKitPos[2],
];

// ── Palette ───────────────────────────────────────────────────────────────────
const BURST_EDGE = "#3a1c08";   // dark burst rim
const BURST_MID  = "#a05a20";   // amber mid
const BURST_HI   = "#d8a850";   // honey centre
const HOOP       = "#0b0b0b";   // black powder-coat hoops
const LUG        = "#141414";   // lug casings
const HEAD_TOP   = "#efece4";   // coated batter head
const HEAD_RESO  = "#e4e0d6";   // resonant head
const KICK_RESO  = "#16130f";   // black kick reso head
const HW         = "#141210";   // stand steel
const HW_DARK    = "#0d0c0b";   // pedal frames
const CHROME     = "#9a948a";   // chrome accents
/** Scale overhead cymbal / hi-hat mounting heights. */
const OVERHEAD_H = 0.82;
const BRONZE     = "#b08434";   // cymbal bronze
const BRONZE_HI  = "#d4a850";   // lathing highlight
const FELT       = "#3a3228";   // felt washers

/* ════════════════════════════════════════════════════════════════════
   Reusable parts
   ════════════════════════════════════════════════════════════════════ */

/** Vertical drum shell (snare / toms) with hoops, lugs and both heads.
 *  Rendered in its own local frame so callers can tilt the whole group. */
function ShellDrum({
  radius,
  depth,
  lugs,
}: {
  radius: number;
  depth: number;
  lugs: number;
}) {
  const half = depth / 2;
  return (
    <group>
      {/* Outer burst shell (3 stacked bands give the sunburst gradient) */}
      <mesh>
        <cylinderGeometry args={[radius, radius, depth, 36]} />
        <meshStandardMaterial color={BURST_EDGE} roughness={0.40} metalness={0.08} />
      </mesh>
      <mesh scale={[0.985, 0.92, 0.985]}>
        <cylinderGeometry args={[radius * 1.012, radius * 1.012, depth, 36]} />
        <meshStandardMaterial color={BURST_MID} roughness={0.36} metalness={0.06} />
      </mesh>
      <mesh scale={[0.985, 0.55, 0.985]}>
        <cylinderGeometry args={[radius * 1.018, radius * 1.018, depth, 36]} />
        <meshStandardMaterial color={BURST_HI} roughness={0.34} metalness={0.05} />
      </mesh>

      {/* Batter head (top) */}
      <mesh position={[0, half + 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.985, 36]} />
        <meshStandardMaterial color={HEAD_TOP} roughness={0.86} metalness={0.0} />
      </mesh>
      {/* Reso head (bottom) */}
      <mesh position={[0, -half - 0.0015, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.985, 36]} />
        <meshStandardMaterial color={HEAD_RESO} roughness={0.88} metalness={0.0} />
      </mesh>

      {/* Hoops */}
      {[half, -half].map((hy) => (
        <mesh key={`hp-${hy}`} position={[0, hy, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius + 0.008, 0.011, 10, 36]} />
          <meshStandardMaterial color={HOOP} metalness={0.62} roughness={0.32} />
        </mesh>
      ))}

      {/* Lugs + tension rods */}
      {Array.from({ length: lugs }, (_, i) => {
        const a = (i / lugs) * Math.PI * 2;
        const lx = Math.cos(a) * (radius + 0.014);
        const lz = Math.sin(a) * (radius + 0.014);
        return (
          <group key={`lug-${i}`}>
            <mesh position={[lx, 0, lz]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.018, depth * 0.42, 0.022]} />
              <meshStandardMaterial color={LUG} metalness={0.66} roughness={0.30} />
            </mesh>
            {/* Rods up to both hoops */}
            {[half * 0.78, -half * 0.78].map((ry) => (
              <mesh key={`rod-${ry}`} position={[lx, ry, lz]}>
                <cylinderGeometry args={[0.0035, 0.0035, depth * 0.34, 6]} />
                <meshStandardMaterial color={CHROME} metalness={0.75} roughness={0.25} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Badge */}
      <mesh position={[radius + 0.002, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 0.003, 14]} />
        <meshStandardMaterial color={CHROME} metalness={0.78} roughness={0.22} />
      </mesh>
    </group>
  );
}

/** Double-braced tripod stand base (legs only, no pole). */
function TripodLegs({ spread = 0.30 }: { spread?: number }) {
  return (
    <group>
      {[0.5, 2.6, 4.7].map((a) => (
        <group key={`tl-${a}`} rotation={[0, a, 0]}>
          {/* Braced leg pair */}
          <mesh position={[spread * 0.5, 0.10, 0]} rotation={[0, 0, 1.05]}>
            <cylinderGeometry args={[0.007, 0.008, spread * 1.25, 8]} />
            <meshStandardMaterial color={HW} metalness={0.65} roughness={0.32} />
          </mesh>
          <mesh position={[spread * 0.42, 0.065, 0]} rotation={[0, 0, 1.25]}>
            <cylinderGeometry args={[0.005, 0.005, spread * 0.95, 6]} />
            <meshStandardMaterial color={HW} metalness={0.62} roughness={0.35} />
          </mesh>
          {/* Rubber foot */}
          <mesh position={[spread, 0.014, 0]}>
            <cylinderGeometry args={[0.014, 0.016, 0.028, 10]} />
            <meshStandardMaterial color="#171513" roughness={0.90} metalness={0.02} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const CHIME_TUBE = "#b4aca0";
const CHIME_BAR  = "#1a1714";

/** Bar chime tree — graduated aluminium tubes on a stand (beside hi-hat). */
function WindChimeTree({
  x,
  z,
  barHeight = 0.72,
  tubeCount = 16,
}: {
  x: number;
  z: number;
  barHeight?: number;
  tubeCount?: number;
}) {
  const spacing = 0.026;
  const barLen = tubeCount * spacing + 0.06;
  const halfBar = barLen / 2;

  return (
    <group position={[x, 0, z]} rotation={[0, 0.18, 0]}>
      <TripodLegs spread={0.22} />
      <mesh position={[0, barHeight * 0.48, 0]}>
        <cylinderGeometry args={[0.009, 0.011, barHeight * 0.96, 10]} />
        <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
      </mesh>
      <mesh position={[0, barHeight * 0.92, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.028, 10]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.35} />
      </mesh>
      {/* Horizontal chime bar */}
      <mesh position={[0, barHeight, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[barLen, 0.012, 0.016]} />
        <meshStandardMaterial color={CHIME_BAR} metalness={0.55} roughness={0.38} />
      </mesh>
      {/* Graduated hanging tubes — long to short along the bar */}
      {Array.from({ length: tubeCount }, (_, i) => {
        const t = i / (tubeCount - 1);
        const length = 0.34 - t * 0.20;
        const tx = -halfBar + 0.04 + i * spacing;
        const hangY = barHeight - 0.006;
        return (
          <group key={`chime-${i}`} position={[tx, hangY, 0]}>
            <mesh position={[0, -0.018, 0]}>
              <cylinderGeometry args={[0.0012, 0.0012, 0.032, 4]} />
              <meshStandardMaterial color="#4a443c" roughness={0.85} metalness={0.05} />
            </mesh>
            <mesh position={[0, -0.018 - length / 2, 0]}>
              <cylinderGeometry args={[0.0055, 0.0055, length, 10]} />
              <meshStandardMaterial
                color={CHIME_TUBE}
                metalness={0.84}
                roughness={0.22}
                emissive="#c8c0b4"
                emissiveIntensity={0.03}
              />
            </mesh>
          </group>
        );
      })}
      {/* Felt mallet on hook */}
      <mesh position={[halfBar + 0.04, barHeight - 0.04, 0.02]} rotation={[0.3, 0.4, 1.1]}>
        <cylinderGeometry args={[0.009, 0.011, 0.22, 8]} />
        <meshStandardMaterial color="#3d362c" roughness={0.78} metalness={0.04} />
      </mesh>
      <mesh position={[halfBar + 0.10, barHeight - 0.10, 0.03]}>
        <sphereGeometry args={[0.016, 10, 10]} />
        <meshStandardMaterial color="#e8e0d4" roughness={0.72} metalness={0.02} />
      </mesh>
    </group>
  );
}

const CHINA_BRONZE = "#7a6048";
const CHINA_HI = "#9a8060";

/** Small china/trash cymbal — upturned edge, darker bronze. */
function ChinaCymbalDisc({ radius }: { radius: number }) {
  return (
    <group rotation={[Math.PI, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[radius * 0.88, radius, 0.003, 36]} />
        <meshStandardMaterial
          color={CHINA_BRONZE}
          metalness={0.90}
          roughness={0.34}
          emissive={CHINA_HI}
          emissiveIntensity={0.04}
        />
      </mesh>
      <mesh position={[0, -0.005, 0]}>
        <cylinderGeometry args={[radius * 0.48, radius * 0.82, 0.0035, 32]} />
        <meshStandardMaterial color={CHINA_BRONZE} metalness={0.88} roughness={0.36} />
      </mesh>
      {[0.45, 0.68, 0.86].map((f) => (
        <mesh key={`china-ring-${f}`} position={[0, -0.008, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * f, 0.001, 4, 36]} />
          <meshStandardMaterial color={CHINA_HI} metalness={0.86} roughness={0.38} />
        </mesh>
      ))}
      <mesh position={[0, -0.012, 0]}>
        <cylinderGeometry args={[radius * 0.08, radius * 0.16, 0.018, 16]} />
        <meshStandardMaterial color={CHINA_HI} metalness={0.90} roughness={0.24} />
      </mesh>
      <mesh position={[0, -0.024, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.008, 8]} />
        <meshStandardMaterial color={FELT} roughness={0.92} metalness={0.0} />
      </mesh>
    </group>
  );
}

/** Bronze cymbal with lathing rings, bell, and felt. Lies flat in local XZ. */
function CymbalDisc({ radius }: { radius: number }) {
  return (
    <group>
      {/* Main plate — slight cone via two stacked discs */}
      <mesh>
        <cylinderGeometry args={[radius, radius, 0.0035, 48]} />
        <meshStandardMaterial
          color={BRONZE}
          metalness={0.85}
          roughness={0.26}
          emissive={BRONZE_HI}
          emissiveIntensity={0.06}
        />
      </mesh>
      <mesh position={[0, 0.006, 0]}>
        <cylinderGeometry args={[radius * 0.55, radius * 0.92, 0.004, 48]} />
        <meshStandardMaterial color={BRONZE} metalness={0.84} roughness={0.28} />
      </mesh>
      {/* Lathing rings */}
      {[0.40, 0.58, 0.74, 0.90].map((f) => (
        <mesh key={`ring-${f}`} position={[0, 0.0095, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * f, 0.0012, 4, 48]} />
          <meshStandardMaterial color={BRONZE_HI} metalness={0.82} roughness={0.30} />
        </mesh>
      ))}
      {/* Bell */}
      <mesh position={[0, 0.014, 0]}>
        <cylinderGeometry args={[radius * 0.10, radius * 0.20, 0.026, 20]} />
        <meshStandardMaterial color={BRONZE_HI} metalness={0.88} roughness={0.20} />
      </mesh>
      {/* Felt + wing nut */}
      <mesh position={[0, 0.030, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.010, 10]} />
        <meshStandardMaterial color={FELT} roughness={0.92} metalness={0.0} />
      </mesh>
      <mesh position={[0, 0.040, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.012, 8]} />
        <meshStandardMaterial color={CHROME} metalness={0.75} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Straight/boom cymbal stand topped with a tilted cymbal. */
function CymbalStand({
  x,
  z,
  height,
  radius,
  tilt = 0.22,
  tiltDir = 0,           // yaw direction the cymbal tilts toward
  boom = 0.18,           // horizontal boom offset toward kit centre
  boomDir = 0,           // yaw of the boom arm
  china = false,
}: {
  x: number;
  z: number;
  height: number;
  radius: number;
  tilt?: number;
  tiltDir?: number;
  boom?: number;
  boomDir?: number;
  china?: boolean;
}) {
  const headX = Math.cos(boomDir) * boom;
  const headZ = Math.sin(boomDir) * boom;
  return (
    <group position={[x, 0, z]}>
      <TripodLegs spread={0.30} />
      {/* Lower + upper pole */}
      <mesh position={[0, height * 0.36, 0]}>
        <cylinderGeometry args={[0.011, 0.013, height * 0.72, 10]} />
        <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
      </mesh>
      <mesh position={[0, height * 0.82, 0]}>
        <cylinderGeometry args={[0.008, 0.009, height * 0.42, 10]} />
        <meshStandardMaterial color={HW} metalness={0.68} roughness={0.28} />
      </mesh>
      {/* Clutch collar */}
      <mesh position={[0, height * 0.62, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.030, 10]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.35} />
      </mesh>
      {/* Boom arm */}
      <mesh
        position={[headX / 2, height + 0.015, headZ / 2]}
        rotation={[
          Math.sin(boomDir) * 0.45,
          0,
          -Math.cos(boomDir) * 0.45,
        ]}
      >
        <cylinderGeometry args={[0.007, 0.007, boom * 1.35, 8]} />
        <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
      </mesh>
      {/* Tilter */}
      <mesh position={[headX, height + 0.03, headZ]}>
        <sphereGeometry args={[0.013, 10, 10]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.62} roughness={0.34} />
      </mesh>
      {/* Cymbal */}
      <group
        position={[headX, height + 0.045, headZ]}
        rotation={[Math.sin(tiltDir) * tilt, 0, -Math.cos(tiltDir) * tilt]}
      >
        {china ? <ChinaCymbalDisc radius={radius} /> : <CymbalDisc radius={radius} />}
      </group>
    </group>
  );
}

/* ════════════════════════════════════════════════════════════════════
   The kit
   ════════════════════════════════════════════════════════════════════ */

export function DrumKit() {
  return (
    <group>
      <DrumStagePlatform cornerX={EAST_WALL_X} cornerZ={SOUTH_WALL_WORLD_Z} />
      <group position={KIT_POS} rotation={[0, DRUM_YAW, 0]} scale={[S, S, S]}>

      {/* ─────────────── KICK DRUM — 22"×18", lying on its side ─────────────── */}
      <group position={[0, 0.295, -0.10]}>
        {/* Shell — axis along Z so heads face player/audience */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.28, 0.46, 40]} />
            <meshStandardMaterial color={BURST_EDGE} roughness={0.38} metalness={0.08} />
          </mesh>
          <mesh scale={[0.985, 0.90, 0.985]}>
            <cylinderGeometry args={[0.284, 0.284, 0.46, 40]} />
            <meshStandardMaterial color={BURST_MID} roughness={0.35} metalness={0.06} />
          </mesh>
          <mesh scale={[0.985, 0.52, 0.985]}>
            <cylinderGeometry args={[0.286, 0.286, 0.46, 40]} />
            <meshStandardMaterial color={BURST_HI} roughness={0.33} metalness={0.05} />
          </mesh>
        </group>

        {/* Batter head (player side, +Z) */}
        <mesh position={[0, 0, 0.232]}>
          <circleGeometry args={[0.276, 40]} />
          <meshStandardMaterial color={HEAD_RESO} roughness={0.88} metalness={0.0} />
        </mesh>
        {/* Reso head (audience side, −Z) — black with port */}
        <mesh position={[0, 0, -0.232]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.276, 40]} />
          <meshStandardMaterial color={KICK_RESO} roughness={0.80} metalness={0.04} />
        </mesh>
        {/* Port hole */}
        <mesh position={[0.10, -0.10, -0.234]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.055, 22]} />
          <meshStandardMaterial color="#070605" roughness={0.95} metalness={0.0} />
        </mesh>

        {/* Hoops — wood-tone, facing ±Z */}
        {[0.235, -0.235].map((hz) => (
          <mesh key={`kh-${hz}`} position={[0, 0, hz]}>
            <torusGeometry args={[0.285, 0.015, 10, 40]} />
            <meshStandardMaterial color={HOOP} metalness={0.55} roughness={0.36} />
          </mesh>
        ))}

        {/* Lugs around the rim */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh
              key={`kl-${i}`}
              position={[Math.cos(a) * 0.296, Math.sin(a) * 0.296, 0]}
              rotation={[0, 0, a]}
            >
              <boxGeometry args={[0.020, 0.026, 0.20]} />
              <meshStandardMaterial color={LUG} metalness={0.66} roughness={0.30} />
            </mesh>
          );
        })}

        {/* Kick spurs (front legs, angled out) */}
        {[-1, 1].map((s) => (
          <mesh
            key={`spur-${s}`}
            position={[s * 0.27, -0.16, -0.16]}
            rotation={[0.45, 0, s * -0.5]}
          >
            <cylinderGeometry args={[0.007, 0.005, 0.26, 8]} />
            <meshStandardMaterial color={HW} metalness={0.68} roughness={0.28} />
          </mesh>
        ))}
      </group>

      {/* ─────────────── TOM MOUNT POST on kick ─────────────── */}
      <mesh position={[0, 0.66, -0.10]}>
        <cylinderGeometry args={[0.011, 0.011, 0.18, 10]} />
        <meshStandardMaterial color={CHROME} metalness={0.72} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0.74, -0.10]}>
        <boxGeometry args={[0.34, 0.024, 0.024]} />
        <meshStandardMaterial color={HW_DARK} metalness={0.62} roughness={0.32} />
      </mesh>

      {/* ─────────────── RACK TOM 1 — 10"×7", mounted, tilted ─────────────── */}
      <group position={[-0.185, 0.80, -0.06]} rotation={[0.30, 0.12, 0]}>
        <ShellDrum radius={0.127} depth={0.18} lugs={6} />
        {/* Mount arm down to the bar */}
        <mesh position={[0.04, -0.13, -0.04]} rotation={[-0.3, 0, 0.2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          <meshStandardMaterial color={CHROME} metalness={0.70} roughness={0.26} />
        </mesh>
      </group>

      {/* ─────────────── RACK TOM 2 — 12"×8", mounted, tilted ─────────────── */}
      <group position={[0.195, 0.81, -0.06]} rotation={[0.30, -0.12, 0]}>
        <ShellDrum radius={0.152} depth={0.20} lugs={6} />
        <mesh position={[-0.04, -0.14, -0.04]} rotation={[-0.3, 0, -0.2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          <meshStandardMaterial color={CHROME} metalness={0.70} roughness={0.26} />
        </mesh>
      </group>

      {/* ─────────────── SNARE — 14"×5.5" on stand, slight tilt ─────────────── */}
      <group position={[-0.33, 0, 0.32]}>
        <TripodLegs spread={0.26} />
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.010, 0.012, 0.46, 10]} />
          <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
        </mesh>
        {/* Basket arms */}
        {[0.4, 2.5, 4.6].map((a) => (
          <mesh
            key={`bask-${a}`}
            position={[Math.cos(a) * 0.10, 0.50, Math.sin(a) * 0.10]}
            rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.12, 6]} />
            <meshStandardMaterial color={HW} metalness={0.64} roughness={0.32} />
          </mesh>
        ))}
        <group position={[0, 0.575, 0]} rotation={[0.10, 0, 0.04]}>
          <ShellDrum radius={0.178} depth={0.14} lugs={10} />
          {/* Snare throw-off lever */}
          <mesh position={[-0.185, -0.02, 0.02]}>
            <boxGeometry args={[0.014, 0.06, 0.020]} />
            <meshStandardMaterial color={CHROME} metalness={0.72} roughness={0.26} />
          </mesh>
        </group>
      </group>

      {/* ─────────────── FLOOR TOM — 16"×15", on legs ─────────────── */}
      <group position={[0.50, 0, 0.30]}>
        <group position={[0, 0.46, 0]} rotation={[0.04, 0, -0.03]}>
          <ShellDrum radius={0.203} depth={0.38} lugs={8} />
        </group>
        {/* 3 legs */}
        {[0.7, 2.8, 4.9].map((a) => (
          <mesh
            key={`ftl-${a}`}
            position={[Math.cos(a) * 0.225, 0.18, Math.sin(a) * 0.225]}
            rotation={[Math.sin(a) * 0.22, 0, -Math.cos(a) * 0.22]}
          >
            <cylinderGeometry args={[0.006, 0.007, 0.40, 8]} />
            <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
          </mesh>
        ))}
      </group>

      {/* ─────────────── HI-HAT — 14", player's left ─────────────── */}
      <group position={[-0.62, 0, 0.20]}>
        <TripodLegs spread={0.26} />
        <mesh position={[0, 0.42 * OVERHEAD_H, 0]}>
          <cylinderGeometry args={[0.010, 0.012, 0.80 * OVERHEAD_H, 10]} />
          <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
        </mesh>
        {/* Pull rod */}
        <mesh position={[0, 0.92 * OVERHEAD_H, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.28 * OVERHEAD_H, 6]} />
          <meshStandardMaterial color={CHROME} metalness={0.78} roughness={0.22} />
        </mesh>
        {/* Bottom cymbal (fixed) */}
        <group position={[0, 0.875 * OVERHEAD_H, 0]} rotation={[0.03, 0, 0.02]}>
          <CymbalDisc radius={0.178} />
        </group>
        {/* Top cymbal (on clutch, slightly open) */}
        <group position={[0, 0.925 * OVERHEAD_H, 0]} rotation={[-0.02, 0, -0.02]}>
          <CymbalDisc radius={0.178} />
        </group>
        {/* Pedal board */}
        <mesh position={[0.02, 0.020, 0.21]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.085, 0.012, 0.26]} />
          <meshStandardMaterial color={HW_DARK} metalness={0.58} roughness={0.36} />
        </mesh>
        <mesh position={[0.02, 0.012, 0.10]}>
          <boxGeometry args={[0.11, 0.020, 0.06]} />
          <meshStandardMaterial color={HW} metalness={0.62} roughness={0.32} />
        </mesh>
      </group>

      {/* ─────────────── WIND CHIMES — player's left beside hi-hat ─────────────── */}
      <WindChimeTree x={-0.58} z={-0.14} barHeight={1.14 * OVERHEAD_H} />

      {/* ─────────────── CYMBALS ─────────────── */}
      {/* Crash 1 — 18", left of toms, high */}
      <CymbalStand
        x={-0.55} z={-0.52} height={1.32 * OVERHEAD_H} radius={0.228}
        tilt={0.26} tiltDir={1.0} boom={0.22} boomDir={0.6}
      />
      {/* Crash 2 — 19", right of toms, higher */}
      <CymbalStand
        x={0.52} z={-0.58} height={1.40 * OVERHEAD_H} radius={0.24}
        tilt={0.24} tiltDir={2.2} boom={0.22} boomDir={2.6}
      />
      {/* Ride — 21", far right over floor tom */}
      <CymbalStand
        x={0.82} z={-0.12} height={1.08 * OVERHEAD_H} radius={0.265}
        tilt={0.30} tiltDir={2.8} boom={0.16} boomDir={3.0}
      />

      {/* ─────────────── ADDITIONAL CYMBALS (existing kit unchanged above) ─────────────── */}
      {/* Extra crash — 18", front of right-side arc (bowed outward) */}
      <CymbalStand
        x={1.22} z={0.16} height={1.14 * OVERHEAD_H} radius={0.220}
        tilt={0.28} tiltDir={2.85} boom={0.16} boomDir={3.05}
      />
      {/* Extra ride — 20", rear of right-side arc */}
      <CymbalStand
        x={0.98} z={0.72} height={1.00 * OVERHEAD_H} radius={0.252}
        tilt={0.32} tiltDir={3.10} boom={0.14} boomDir={3.30}
      />
      {/* China — 10", small, low at front toward audience */}
      <CymbalStand
        x={0.14} z={-0.78} height={0.68 * OVERHEAD_H} radius={0.102}
        tilt={0.52} tiltDir={0.12} boom={0.10} boomDir={0.42}
        china
      />

      {/* ─────────────── KICK PEDAL ─────────────── */}
      <group position={[0, 0, 0.18]}>
        {/* Frame */}
        <mesh position={[0, 0.045, -0.02]}>
          <boxGeometry args={[0.10, 0.09, 0.025]} />
          <meshStandardMaterial color={HW_DARK} metalness={0.60} roughness={0.34} />
        </mesh>
        {/* Footboard */}
        <mesh position={[0, 0.022, 0.10]} rotation={[0.22, 0, 0]}>
          <boxGeometry args={[0.082, 0.010, 0.24]} />
          <meshStandardMaterial color={HW} metalness={0.64} roughness={0.30} />
        </mesh>
        {/* Beater shaft + head striking the batter */}
        <mesh position={[0, 0.16, -0.015]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.22, 8]} />
          <meshStandardMaterial color={CHROME} metalness={0.75} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.27, -0.06]}>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshStandardMaterial color="#e6ded0" roughness={0.78} metalness={0.02} />
        </mesh>
      </group>

      {/* ─────────────── DRUM THRONE — player side (south) ─────────────── */}
      <group position={[0, 0, 0.92]}>
        <TripodLegs spread={0.30} />
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.026, 0.030, 0.44, 12]} />
          <meshStandardMaterial color={HW} metalness={0.66} roughness={0.30} />
        </mesh>
        {/* Spindle collar */}
        <mesh position={[0, 0.20, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.045, 12]} />
          <meshStandardMaterial color={HW_DARK} metalness={0.58} roughness={0.36} />
        </mesh>
        {/* Padded round seat */}
        <mesh position={[0, 0.49, 0]}>
          <cylinderGeometry args={[0.175, 0.165, 0.075, 30]} />
          <meshStandardMaterial color="#16130f" roughness={0.68} metalness={0.04} />
        </mesh>
        {/* Seat piping ring */}
        <mesh position={[0, 0.525, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.168, 0.009, 8, 30]} />
          <meshStandardMaterial color="#211d17" roughness={0.62} metalness={0.05} />
        </mesh>
        {/* Top cushion dome */}
        <mesh position={[0, 0.535, 0]}>
          <cylinderGeometry args={[0.158, 0.168, 0.022, 30]} />
          <meshStandardMaterial color="#1c1914" roughness={0.66} metalness={0.04} />
        </mesh>
      </group>

      </group>
    </group>
  );
}
