"use client";

import type { AmpFrontLayout } from "@/components/rooms/ampFrontShared";
import { EnglFront } from "@/components/rooms/EnglFront";
import { MarshallJvmFront } from "@/components/rooms/MarshallJvmFront";
import { MesaBoogieFront } from "@/components/rooms/MesaBoogieFront";
import { SoldanoFront } from "@/components/rooms/SoldanoFront";
import { RIGHT_POSTER_X } from "@/components/rooms/NorthWallBandPosters";
import { DEPTH_SCALE, scaleWorldZ } from "@/lib/roomLayout";

/**
 * Four amp stacks in two zones:
 *   • Mesa/Boogie + ENGL — east wall north segment (above the door)
 *   • Marshall JVM + Soldano — north wood wall, under the right band poster
 */

const EAST_WALL_X = -7.08;
/** Nudge east-wall stacks closer to the wall (+X), away from the guitar gallery. */
const EAST_STACK_WALL_INSET = 0.12;
const FLOOR_Y = 0.10;
const SCALE = 1.42;

const LENGTH_BOOST = 1.14;
const CAB_Z = 0.74 * LENGTH_BOOST;
const CAB_X = 0.38;
const CAB_Y = 0.82;
const HEAD_Z = 0.68;
const HEAD_X = 0.30;
const HEAD_Y = 0.28;

const STACK_SPACING = 0.62 * SCALE * DEPTH_SCALE;

type WallFacing = "east" | "north";

type AmpBrand = "marshall" | "engl" | "soldano" | "mesa";

type AmpBrandStyle = {
  cab: string;
  cabDark: string;
  grille: string;
  piping: string;
  head: string;
  panel: string;
  knob: string;
  logo: string;
  accent: string;
  casters: string;
};

const BRANDS: Record<AmpBrand, AmpBrandStyle> = {
  marshall: {
    cab: "#141210",
    cabDark: "#0a0908",
    grille: "#c8a830",
    piping: "#c8a830",
    head: "#141210",
    panel: "#e8e4dc",
    knob: "#d8cdb8",
    logo: "#f0ece4",
    accent: "#ef3030",
    casters: "#1c1916",
  },
  engl: {
    cab: "#101010",
    cabDark: "#080808",
    grille: "#2a2a2a",
    piping: "#1a1a1a",
    head: "#101010",
    panel: "#1a1a1a",
    knob: "#c8c0b0",
    logo: "#d42020",
    accent: "#d42020",
    casters: "#141414",
  },
  soldano: {
    cab: "#2a2438",
    cabDark: "#1e1a28",
    grille: "#d8d0c0",
    piping: "#4a4058",
    head: "#2a2438",
    panel: "#1e1a28",
    knob: "#c8c0b0",
    logo: "#e8e0d0",
    accent: "#c8a040",
    casters: "#1a1618",
  },
  mesa: {
    cab: "#0e0c0a",
    cabDark: "#080706",
    grille: "#3a3834",
    piping: "#c87820",
    head: "#0e0c0a",
    panel: "#1a1814",
    knob: "#b8b0a0",
    logo: "#d0c8b8",
    accent: "#c87820",
    casters: "#141210",
  },
};

function eastStackCenterX(): number {
  return EAST_WALL_X - (CAB_X * SCALE) / 2 - 0.005 + EAST_STACK_WALL_INSET;
}

function northStackCenterZ(): number {
  return scaleWorldZ(-5.9) + (CAB_X * SCALE) / 2 + 0.01;
}

type AmpStackProps = {
  brand: AmpBrand;
  position: [number, number, number];
  facing: WallFacing;
  marshallJvm?: boolean;
  soldanoFront?: boolean;
  englFront?: boolean;
  mesaFront?: boolean;
};

function AmpStack({
  brand,
  position,
  facing,
  marshallJvm = false,
  soldanoFront = false,
  englFront = false,
  mesaFront = false,
}: AmpStackProps) {
  const s = BRANDS[brand];
  /** North stacks: front (−X local) must face into the room (+Z world). */
  const rotY = facing === "north" ? Math.PI / 2 : 0;
  const cabY = (CAB_Y * SCALE) / 2;
  const headY = CAB_Y * SCALE + (HEAD_Y * SCALE) / 2;
  const cabHalfX = (CAB_X * SCALE) / 2;
  const cabHalfZ = (CAB_Z * SCALE) / 2;
  const headHalfX = (HEAD_X * SCALE) / 2;
  const headHalfZ = (HEAD_Z * SCALE) / 2;
  const frontX = -cabHalfX;
  const headFrontX = -headHalfX;
  const jvmFront = marshallJvm && brand === "marshall";
  const soldanoDetail = soldanoFront && brand === "soldano";
  const englDetail = englFront && brand === "engl";
  const mesaDetail = mesaFront && brand === "mesa";
  const customFront = jvmFront || soldanoDetail || englDetail || mesaDetail;
  const shellColor = mesaDetail ? "#0e0c0a" : englDetail ? "#101010" : soldanoDetail ? "#121214" : s.cab;
  const headColor = mesaDetail ? "#0e0c0a" : englDetail ? "#101010" : soldanoDetail ? "#121214" : s.head;

  const frontLayout: AmpFrontLayout = {
    cabFrontX: frontX,
    headFrontX,
    cabY,
    headY,
    cabW: CAB_Z * SCALE,
    cabH: CAB_Y * SCALE,
    headW: HEAD_Z * SCALE,
    headH: HEAD_Y * SCALE,
    scale: SCALE,
    facing,
    showAccentLight: false,
  };

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, cabY, 0]}>
        <boxGeometry args={[CAB_X * SCALE, CAB_Y * SCALE, CAB_Z * SCALE]} />
        <meshStandardMaterial color={shellColor} roughness={0.78} metalness={0.06} />
      </mesh>

      {!customFront &&
        [-cabHalfZ + 0.02, cabHalfZ - 0.02].map((pz) => (
          <mesh key={`pipe-z-${pz}`} position={[0, cabY + (CAB_Y * SCALE) / 2 - 0.018, pz]}>
            <boxGeometry args={[(CAB_X * SCALE) * 0.98, 0.012, 0.018]} />
            <meshStandardMaterial color={s.piping} roughness={0.45} metalness={0.35} />
          </mesh>
        ))}

      {jvmFront ? (
        <MarshallJvmFront {...frontLayout} />
      ) : soldanoDetail ? (
        <SoldanoFront {...frontLayout} />
      ) : englDetail ? (
        <EnglFront {...frontLayout} />
      ) : mesaDetail ? (
        <MesaBoogieFront {...frontLayout} />
      ) : (
        <mesh position={[frontX + 0.012, cabY, 0]}>
          <boxGeometry args={[0.018, CAB_Y * SCALE * 0.88, CAB_Z * SCALE * 0.9]} />
          <meshStandardMaterial color={s.grille} roughness={0.94} metalness={0.04} />
        </mesh>
      )}

      {!customFront && brand === "mesa"
        ? Array.from({ length: 15 }, (_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            return (
              <mesh
                key={`mesa-${row}-${col}`}
                position={[
                  frontX + 0.022,
                  cabY - 0.22 * SCALE + row * 0.11 * SCALE,
                  -0.22 * SCALE + col * 0.22 * SCALE,
                ]}
                rotation={[0, 0, Math.PI / 4]}
              >
                <boxGeometry args={[0.055 * SCALE, 0.055 * SCALE, 0.006]} />
                <meshStandardMaterial color="#5a5854" metalness={0.72} roughness={0.28} />
              </mesh>
            );
          })
        : null}

      {!customFront &&
      ([-0.18, 0.18] as const).flatMap((sz) =>
        ([-0.18, 0.18] as const).map((sy) => (
          <group key={`spk-${sz}-${sy}`} position={[frontX + 0.02, cabY + sy * SCALE, sz * SCALE]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.13 * SCALE, 24]} />
              <meshStandardMaterial color={s.cabDark} roughness={0.95} metalness={0.02} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0.004, 0, 0]}>
              <circleGeometry args={[0.042 * SCALE, 16]} />
              <meshStandardMaterial color="#0a0806" roughness={0.88} metalness={0.08} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0.006, 0, 0]}>
              <circleGeometry args={[0.018 * SCALE, 12]} />
              <meshStandardMaterial color="#1a1410" roughness={0.7} metalness={0.12} />
            </mesh>
          </group>
        )),
      )}

      {(
        [
          [-cabHalfX + 0.03, cabHalfZ - 0.03],
          [-cabHalfX + 0.03, -cabHalfZ + 0.03],
          [cabHalfX - 0.03, cabHalfZ - 0.03],
          [cabHalfX - 0.03, -cabHalfZ + 0.03],
        ] as const
      ).map(([px, pz], i) => (
        <mesh key={`corner-${i}`} position={[px, CAB_Y * SCALE - 0.02, pz]}>
          <boxGeometry args={[0.04 * SCALE, 0.04 * SCALE, 0.04 * SCALE]} />
          <meshStandardMaterial color={s.casters} metalness={0.55} roughness={0.4} />
        </mesh>
      ))}

      {([-cabHalfZ + 0.06, cabHalfZ - 0.06] as const).flatMap((pz) =>
        ([-cabHalfX + 0.08, cabHalfX - 0.08] as const).map((px, i) => (
          <mesh key={`caster-${pz}-${i}`} position={[px, 0.03, pz]}>
            <cylinderGeometry args={[0.028 * SCALE, 0.028 * SCALE, 0.04, 10]} />
            <meshStandardMaterial color={s.casters} metalness={0.6} roughness={0.35} />
          </mesh>
        )),
      )}

      <mesh position={[0, headY, 0]}>
        <boxGeometry args={[HEAD_X * SCALE, HEAD_Y * SCALE, HEAD_Z * SCALE]} />
        <meshStandardMaterial color={headColor} roughness={0.76} metalness={0.08} />
      </mesh>

      {!customFront ? (
        <>
          <mesh position={[headFrontX + 0.012, headY, 0]}>
            <boxGeometry args={[0.016, HEAD_Y * SCALE * 0.72, HEAD_Z * SCALE * 0.82]} />
            <meshStandardMaterial
              color={s.panel}
              roughness={brand === "marshall" ? 0.55 : 0.65}
              metalness={brand === "marshall" ? 0.05 : 0.12}
            />
          </mesh>

          <mesh position={[headFrontX + 0.024, headY + 0.04 * SCALE, 0]}>
            <boxGeometry args={[0.008, 0.045 * SCALE, HEAD_Z * SCALE * 0.55]} />
            <meshStandardMaterial
              color={s.logo}
              emissive={brand === "engl" || brand === "mesa" ? s.accent : "#000000"}
              emissiveIntensity={brand === "engl" || brand === "mesa" ? 0.35 : 0}
              roughness={0.5}
              metalness={0.1}
            />
          </mesh>

          {Array.from({ length: brand === "mesa" ? 8 : 6 }, (_, i) => {
            const count = brand === "mesa" ? 8 : 6;
            const span = HEAD_Z * SCALE * 0.72;
            const kz = -span / 2 + (i + 0.5) * (span / count);
            return (
              <mesh
                key={`knob-${i}`}
                position={[headFrontX + 0.028, headY + HEAD_Y * SCALE * 0.22, kz]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.012 * SCALE, 0.012 * SCALE, 0.014 * SCALE, 10]} />
                <meshStandardMaterial color={s.knob} metalness={0.35} roughness={0.42} />
              </mesh>
            );
          })}

          <mesh position={[headFrontX + 0.026, headY + HEAD_Y * SCALE * 0.22, headHalfZ * 0.78]}>
            <boxGeometry args={[0.008, 0.012 * SCALE, 0.012 * SCALE]} />
            <meshStandardMaterial
              color="#070707"
              emissive={s.accent}
              emissiveIntensity={brand === "soldano" ? 1.8 : 2.4}
              roughness={0.3}
            />
          </mesh>
        </>
      ) : null}

      <mesh position={[0, headY + HEAD_Y * SCALE * 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09 * SCALE, 0.014 * SCALE, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#0c0a08" roughness={0.6} metalness={0.12} />
      </mesh>

      {!customFront && brand === "engl"
        ? [-0.12, 0, 0.12].map((vz) => (
            <mesh key={`vent-${vz}`} position={[0, headY - HEAD_Y * SCALE * 0.15, vz * SCALE]}>
              <boxGeometry args={[HEAD_X * SCALE * 0.85, 0.008, 0.04 * SCALE]} />
              <meshStandardMaterial color="#080808" roughness={0.9} metalness={0.1} />
            </mesh>
          ))
        : null}

      {!customFront && brand === "soldano" ? (
        <mesh position={[0, headY + HEAD_Y * SCALE * 0.46, 0]}>
          <boxGeometry args={[HEAD_X * SCALE * 0.95, 0.01, HEAD_Z * SCALE * 0.95]} />
          <meshStandardMaterial color="#8a8090" roughness={0.5} metalness={0.2} />
        </mesh>
      ) : null}
    </group>
  );
}

/** North half of the east wall — centred in the upper segment above the door. */
const EAST_STACK_Z = scaleWorldZ(-4.5);
const EAST_STACKS: AmpBrand[] = ["mesa", "engl"];
const NORTH_STACKS: AmpBrand[] = ["marshall", "soldano"];

export function GuitarWallAmpStacks() {
  const eastX = eastStackCenterX();
  const northZ = northStackCenterZ();

  return (
    <group>
      {/* East wall — north segment (above door) */}
      {EAST_STACKS.map((brand, index) => {
        const offset = (index - (EAST_STACKS.length - 1) / 2) * STACK_SPACING;
        return (
          <AmpStack
            key={`east-${brand}`}
            brand={brand}
            facing="east"
            position={[eastX, FLOOR_Y, EAST_STACK_Z + offset]}
            mesaFront={brand === "mesa"}
            englFront={brand === "engl"}
          />
        );
      })}

      {/* North wood wall — under the right band poster */}
      {NORTH_STACKS.map((brand, index) => {
        const offset = (index - (NORTH_STACKS.length - 1) / 2) * STACK_SPACING;
        const position: [number, number, number] = [RIGHT_POSTER_X + offset, FLOOR_Y, northZ];
        return (
          <AmpStack
            key={`north-${brand}`}
            brand={brand}
            facing="north"
            position={position}
            marshallJvm={index === 0}
            soldanoFront={index === 1}
          />
        );
      })}
    </group>
  );
}
