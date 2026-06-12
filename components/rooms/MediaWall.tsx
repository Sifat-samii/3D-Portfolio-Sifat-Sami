"use client";

import { scaleWorldZ } from "@/lib/roomLayout";

/**
 * Media wall — big LED TV + HiFi sound system, centre of the north wall.
 *
 * Placement (north wall, wall inner face z ≈ -6.88):
 *   CX = -14.5  → horizontal centre of the wall
 *   TV : 4.40 m × 2.48 m (16:9) screen, centre y = 2.30 — screen OFF (black)
 *   Below: 3.6 m media console + 2.9 m soundbar + 0.75 m subwoofer
 *   Sides: two floor-standing HiFi towers (≈ 2.3 m tall) at CX ± 3.0
 *
 * Clearance notes:
 *   • Stage platform sits at z -6.0..-4.8 — console (z ≈ -6.6) tucks behind it
 *   • Guitar display is at x = -9.2 — right tower edge (-11.2) keeps clear
 */

const CX = -14.5;
const WZ = -6.88;   // wall inner face

const TV_CY = 2.30; // tv centre height
const TV_W = 4.40;  // screen width  (16:9)
const TV_H = 2.48;  // screen height

const CABINET = "#16130f"; // dark walnut-black furniture
const METAL   = "#1a1816";
const GRILLE  = "#0e0e10";

const MEDIA_GROUP_Z = scaleWorldZ(-5.88) - WZ;

export function MediaWall() {
  return (
    <group position={[0, 0, MEDIA_GROUP_Z]}>
      {/* ════════════════════════ LED TV ════════════════════════ */}

      {/* Wall mount plate */}
      <mesh position={[CX, TV_CY, WZ + 0.012]}>
        <boxGeometry args={[1.1, 0.6, 0.024]} />
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Faint warm LED backlight halo behind the panel */}
      <mesh position={[CX, TV_CY, WZ + 0.030]}>
        <boxGeometry args={[TV_W + 0.24, TV_H + 0.24, 0.01]} />
        <meshStandardMaterial
          color="#0c0a08"
          emissive="#c8960c"
          emissiveIntensity={0.30}
          roughness={0.6}
        />
      </mesh>

      {/* TV body / bezel */}
      <mesh position={[CX, TV_CY, WZ + 0.062]}>
        <boxGeometry args={[TV_W + 0.06, TV_H + 0.06, 0.055]} />
        <meshStandardMaterial color="#050505" metalness={0.45} roughness={0.35} />
      </mesh>

      {/* Screen panel — switched off: black glass, faint reflective sheen */}
      <mesh position={[CX, TV_CY, WZ + 0.0925]}>
        <planeGeometry args={[TV_W, TV_H]} />
        <meshStandardMaterial
          color="#020203"
          roughness={0.08}
          metalness={0.55}
        />
      </mesh>

      {/* Brand strip under the screen */}
      <mesh position={[CX, TV_CY - TV_H / 2 - 0.060, WZ + 0.095]}>
        <boxGeometry args={[0.40, 0.032, 0.008]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.75} roughness={0.25} />
      </mesh>

      {/* Standby LED */}
      <mesh position={[CX, TV_CY - TV_H / 2 - 0.060, WZ + 0.100]}>
        <boxGeometry args={[0.02, 0.012, 0.006]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#ff3020"
          emissiveIntensity={2.0}
          roughness={0.3}
        />
      </mesh>

      {/* ════════════════════════ MEDIA CONSOLE ════════════════════════ */}

      {/* Cabinet body */}
      <mesh position={[CX, 0.40, -6.62]}>
        <boxGeometry args={[3.6, 0.56, 0.48]} />
        <meshStandardMaterial color={CABINET} roughness={0.72} metalness={0.06} />
      </mesh>
      {/* Cabinet top slab */}
      <mesh position={[CX, 0.695, -6.62]}>
        <boxGeometry args={[3.74, 0.035, 0.54]} />
        <meshStandardMaterial color="#241a10" roughness={0.55} metalness={0.10} />
      </mesh>
      {/* Two front doors (slightly proud, darker) */}
      {[-0.88, 0.88].map((ox) => (
        <mesh key={`door-${ox}`} position={[CX + ox, 0.40, -6.375]}>
          <boxGeometry args={[1.66, 0.44, 0.018]} />
          <meshStandardMaterial color="#0f0c09" roughness={0.65} metalness={0.08} />
        </mesh>
      ))}
      {/* AV receiver glow slit between the doors */}
      <mesh position={[CX, 0.46, -6.372]}>
        <boxGeometry args={[0.30, 0.025, 0.012]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#ffb030"
          emissiveIntensity={1.8}
          roughness={0.3}
        />
      </mesh>
      {/* Cabinet feet */}
      {[-1.70, 1.70].map((ox) => (
        <mesh key={`foot-${ox}`} position={[CX + ox, 0.16, -6.62]}>
          <boxGeometry args={[0.08, 0.10, 0.40]} />
          <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* ════════════════════════ SOUNDBAR ════════════════════════ */}

      <mesh position={[CX, 0.80, -6.56]}>
        <boxGeometry args={[2.9, 0.16, 0.15]} />
        <meshStandardMaterial color={GRILLE} roughness={0.85} metalness={0.10} />
      </mesh>
      {/* Soundbar end caps */}
      {[-1.42, 1.42].map((ox) => (
        <mesh key={`cap-${ox}`} position={[CX + ox, 0.80, -6.56]}>
          <boxGeometry args={[0.07, 0.165, 0.155]} />
          <meshStandardMaterial color={METAL} metalness={0.65} roughness={0.30} />
        </mesh>
      ))}
      {/* Power LED */}
      <mesh position={[CX + 1.30, 0.80, -6.48]}>
        <boxGeometry args={[0.018, 0.018, 0.008]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#30ff80"
          emissiveIntensity={2.5}
          roughness={0.3}
        />
      </mesh>

      {/* ════════════════════════ SUBWOOFER ════════════════════════ */}

      <mesh position={[CX + 2.30, 0.50, -6.50]}>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
        <meshStandardMaterial color={CABINET} roughness={0.78} metalness={0.05} />
      </mesh>
      {/* Front driver */}
      <mesh position={[CX + 2.30, 0.50, -6.118]}>
        <circleGeometry args={[0.26, 26]} />
        <meshStandardMaterial
          color="#16161a"
          emissive="#c8960c"
          emissiveIntensity={0.18}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[CX + 2.30, 0.50, -6.110]}>
        <circleGeometry args={[0.095, 16]} />
        <meshStandardMaterial color="#26262c" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* ════════════════ HIFI TOWER SPEAKERS (L + R) ════════════════ */}

      {[-3.0, 3.0].map((ox) => (
        <group key={`tower-${ox}`} position={[CX + ox, 0, -6.46]}>
          {/* Plinth base */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.66, 0.08, 0.60]} />
            <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.35} />
          </mesh>
          {/* Tower body */}
          <mesh position={[0, 1.25, 0]}>
            <boxGeometry args={[0.56, 2.10, 0.50]} />
            <meshStandardMaterial color={CABINET} roughness={0.72} metalness={0.06} />
          </mesh>
          {/* Front grille face */}
          <mesh position={[0, 1.25, 0.253]}>
            <boxGeometry args={[0.48, 2.00, 0.012]} />
            <meshStandardMaterial color={GRILLE} roughness={0.90} metalness={0.05} />
          </mesh>
          {/* Tweeter */}
          <mesh position={[0, 2.06, 0.262]}>
            <circleGeometry args={[0.055, 16]} />
            <meshStandardMaterial color="#30303a" metalness={0.55} roughness={0.35} />
          </mesh>
          {/* Mid driver */}
          <mesh position={[0, 1.76, 0.262]}>
            <circleGeometry args={[0.105, 20]} />
            <meshStandardMaterial
              color="#1a1a20"
              emissive="#c8960c"
              emissiveIntensity={0.15}
              roughness={0.75}
            />
          </mesh>
          {/* Two woofers */}
          {[1.32, 0.82].map((y) => (
            <mesh key={`woof-${y}`} position={[0, y, 0.262]}>
              <circleGeometry args={[0.16, 26]} />
              <meshStandardMaterial
                color="#16161a"
                emissive="#c8960c"
                emissiveIntensity={0.18}
                roughness={0.8}
              />
            </mesh>
          ))}
          {/* Woofer dust caps */}
          {[1.32, 0.82].map((y) => (
            <mesh key={`cap-${y}`} position={[0, y, 0.270]}>
              <circleGeometry args={[0.058, 14]} />
              <meshStandardMaterial color="#26262c" roughness={0.5} metalness={0.3} />
            </mesh>
          ))}
          {/* Gold accent ring at the top */}
          <mesh position={[0, 2.31, 0]}>
            <boxGeometry args={[0.56, 0.025, 0.50]} />
            <meshStandardMaterial
              color="#8a6a1c"
              emissive="#c8960c"
              emissiveIntensity={0.5}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
