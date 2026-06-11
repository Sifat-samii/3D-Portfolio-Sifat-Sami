"use client";

import { Door } from "@/components/shared/Door";
import { InteractiveObject } from "@/components/shared/InteractiveObject";
import { RoomAtmosphere } from "@/components/shared/RoomAtmosphere";
import { RoomLights } from "@/components/shared/RoomLights";
import { RoomShell } from "@/components/shared/RoomShell";
import { roomById } from "@/lib/roomConfig";
import { MusicPosterWall } from "@/components/rooms/MusicPosterWall";
import { GuitarWallDisplay } from "@/components/rooms/GuitarWallDisplay";
import { MediaWall } from "@/components/rooms/MediaWall";
import { StudioDesk } from "@/components/rooms/StudioDesk";
import { StudioFloorMat } from "@/components/rooms/StudioFloorMat";
import { DrumKit } from "@/components/rooms/DrumKit";

/**
 * Room geometry reference (15 m wide, 12 m deep):
 *   Center [-14.5, 0, 0], size 15×12, wallHeight 4
 *   North wall inner face  z = -5.91  (wood wall — flush with Creative's south edge z=-6)
 *   South wall inner face  z =  5.91  (flush with Academics' north edge z=6)
 *   West wall inner face   x = -21.91 (poster wall)
 *   East wall inner face   x = -7.09  (right side wall, door gap z: -3.2 → -0.8)
 *   Floor top              y =  0.10
 *
 * Footprint x[-22,-7] z[-6,6] is the south room of the left column: its north
 * wall (z=-6) borders the Academics room; its east wall (x=-7) borders the
 * Living hall (door at z=-2). Geometry is unchanged by the home restructure.
 */

// Horizontal plank seam y-positions (9 seams, 4 m wall height)
const PLANK_SEAMS = [0.42, 0.84, 1.26, 1.68, 2.10, 2.52, 2.94, 3.36, 3.78];

export function MusicRoom() {
  const room = roomById.music;

  return (
    <RoomShell
      room={room}
      wallHeight={4}
      // Door stays at world z = -2 → offset -2 from the new centre (0)
      openings={[{ side: "east", offset: -2, width: 2.4 }]}
    >
      {/* ── NORTH WALL — dark reclaimed wood (15 m wide) ─────── */}

      {/* Base dark-wood panel */}
      <mesh position={[-14.5, 2.1, -5.90]}>
        <boxGeometry args={[14.64, 4, 0.02]} />
        <meshStandardMaterial color="#2a1909" roughness={0.90} metalness={0.03} />
      </mesh>
      {/* Mid-tone wood grain sheen */}
      <mesh position={[-14.5, 2.1, -5.88]}>
        <boxGeometry args={[14.5, 3.8, 0.005]} />
        <meshStandardMaterial color="#3b2410" roughness={0.85} metalness={0.02} />
      </mesh>
      {/* Horizontal plank seam lines */}
      {PLANK_SEAMS.map((y) => (
        <mesh key={`nw-${y}`} position={[-14.5, y, -5.87]}>
          <boxGeometry args={[14.62, 0.022, 0.015]} />
          <meshStandardMaterial color="#170e05" roughness={0.95} metalness={0.01} />
        </mesh>
      ))}

      {/* ── WEST WALL — matte grey (poster wall) ──────────────── */}

      <mesh position={[-21.90, 2.1, 0]}>
        <boxGeometry args={[0.02, 4, 11.64]} />
        <meshStandardMaterial color="#757575" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* ── EAST WALL — dark wood, two segments around door gap ── */}

      {/* Segment 1: z = -6 to -3.2, world-center z = -4.6 */}
      <mesh position={[-7.10, 2.1, -4.6]}>
        <boxGeometry args={[0.02, 4, 2.8]} />
        <meshStandardMaterial color="#2a1909" roughness={0.90} metalness={0.03} />
      </mesh>
      {PLANK_SEAMS.map((y) => (
        <mesh key={`ew1-${y}`} position={[-7.08, y, -4.6]}>
          <boxGeometry args={[0.015, 0.022, 2.78]} />
          <meshStandardMaterial color="#170e05" roughness={0.95} metalness={0.01} />
        </mesh>
      ))}

      {/* Segment 2: z = -0.8 to 6, world-center z = 2.6 */}
      <mesh position={[-7.10, 2.1, 2.6]}>
        <boxGeometry args={[0.02, 4, 6.8]} />
        <meshStandardMaterial color="#2a1909" roughness={0.90} metalness={0.03} />
      </mesh>
      {PLANK_SEAMS.map((y) => (
        <mesh key={`ew2-${y}`} position={[-7.08, y, 2.6]}>
          <boxGeometry args={[0.015, 0.022, 6.78]} />
          <meshStandardMaterial color="#170e05" roughness={0.95} metalness={0.01} />
        </mesh>
      ))}

      {/* ── GUITAR GALLERY — 7 wall-mounted guitars on east (door) wall ── */}

      <GuitarWallDisplay />

      {/* ── MEDIA WALL — LED TV + HiFi system, north wall centre ── */}

      <MediaWall />

      {/* ── STUDIO DESK — professional workstation, poster wall ── */}

      <StudioDesk />

      {/* ── POSTER WALL — 12 album covers on west wall ───────── */}

      <MusicPosterWall />

      {/* ── CARPET ──────────────────────────────────────────────── */}
      {/*
       * Backing / border field  — 14.6 × 9.6 m, warm taupe #c0b49a
       *   exposes a 0.4 m border frame around the ivory field.
       * Main ivory field        — 13.8 × 8.8 m, off-white #f0ebe0
       * Decorative woven lines  — two parallel inset bands, 0.07 m wide
       *   outer band  at 0.40 m inside field edge
       *   inner band  at 0.55 m inside field edge
       *   → mimics the fine border stitching of a high-end area rug
       */}

      {/* Backing */}
      <mesh position={[-14.5, 0.104, 0]}>
        <boxGeometry args={[14.6, 0.01, 11.6]} />
        <meshStandardMaterial color="#9c9994" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* Main ash field */}
      <mesh position={[-14.5, 0.112, 0]}>
        <boxGeometry args={[13.8, 0.01, 10.8]} />
        <meshStandardMaterial
          color="#c4c0bb"
          roughness={0.98}
          metalness={0.0}
          emissive="#a09c98"
          emissiveIntensity={0.025}
        />
      </mesh>

      {/* Outer woven border band — 4 sides, y = 0.118 */}
      {/* North */}
      <mesh position={[-14.5, 0.118, -5.0]}>
        <boxGeometry args={[13.0, 0.006, 0.07]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      {/* South */}
      <mesh position={[-14.5, 0.118, 5.0]}>
        <boxGeometry args={[13.0, 0.006, 0.07]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      {/* West */}
      <mesh position={[-21.0, 0.118, 0]}>
        <boxGeometry args={[0.07, 0.006, 10.0]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      {/* East */}
      <mesh position={[-8.0, 0.118, 0]}>
        <boxGeometry args={[0.07, 0.006, 10.0]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* Inner woven border band — 4 sides, y = 0.120 */}
      {/* North */}
      <mesh position={[-14.5, 0.120, -4.85]}>
        <boxGeometry args={[12.7, 0.006, 0.07]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      {/* South */}
      <mesh position={[-14.5, 0.120, 4.85]}>
        <boxGeometry args={[12.7, 0.006, 0.07]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      {/* West */}
      <mesh position={[-20.85, 0.120, 0]}>
        <boxGeometry args={[0.07, 0.006, 9.7]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      {/* East */}
      <mesh position={[-8.15, 0.120, 0]}>
        <boxGeometry args={[0.07, 0.006, 9.7]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* ── DARK FLOOR MAT (studio area) ──────────────────────── */}

      <StudioFloorMat />
      <DrumKit />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={28} speed={0.5} size={3} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
