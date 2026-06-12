"use client";

import { Door } from "@/components/shared/Door";
import { InteractiveObject } from "@/components/shared/InteractiveObject";
import { RoomAtmosphere } from "@/components/shared/RoomAtmosphere";
import { RoomLights } from "@/components/shared/RoomLights";
import { RoomShell } from "@/components/shared/RoomShell";
import { roomById } from "@/lib/roomConfig";
import { DEPTH_SCALE, scaleDepth, scaleWorldZ } from "@/lib/roomLayout";
import { MusicPosterWall } from "@/components/rooms/MusicPosterWall";
import { GuitarWallDisplay } from "@/components/rooms/GuitarWallDisplay";
import { GuitarWallAmpStacks } from "@/components/rooms/GuitarWallAmpStacks";
import { MediaWall } from "@/components/rooms/MediaWall";
import { NorthWallBandPosters } from "@/components/rooms/NorthWallBandPosters";
import { PedalDisplayRack } from "@/components/rooms/PedalDisplayRack";
import { StudioDesk } from "@/components/rooms/StudioDesk";
import { StudioFloorMat } from "@/components/rooms/StudioFloorMat";
import { DrumKit } from "@/components/rooms/DrumKit";
import { TvWatchCouch } from "@/components/rooms/TvWatchCouch";

/**
 * Room geometry reference (15 m wide, 15.6 m deep after ×1.3 expansion):
 *   Center [-14.5, 0, -1.8], size 15×15.6, wallHeight 4
 *   North wall inner face  z ≈ -9.51
 *   South wall inner face  z ≈  5.91
 *   West wall inner face   x = -21.91 (poster wall)
 *   East wall inner face   x = -7.09  (door gap layout z: -3.2 → -0.8)
 */

const z = scaleWorldZ;
const ROOM_CZ = z(0);

// Horizontal plank seam y-positions (9 seams, 4 m wall height)
const PLANK_SEAMS = [0.42, 0.84, 1.26, 1.68, 2.10, 2.52, 2.94, 3.36, 3.78];

const EAST_SEG1_DEPTH = 2.8 * DEPTH_SCALE;
const EAST_SEG2_DEPTH = 6.8 * DEPTH_SCALE;

export function MusicRoom() {
  const room = roomById.music;

  return (
    <RoomShell
      room={room}
      wallHeight={4}
      openings={[{ side: "east", offset: -2.6, width: 2.4 }]}
    >
      {/* ── NORTH WALL — dark reclaimed wood (15 m wide) ─────── */}

      <mesh position={[-14.5, 2.1, z(-5.90)]}>
        <boxGeometry args={[14.64, 4, 0.02]} />
        <meshStandardMaterial color="#2a1909" roughness={0.90} metalness={0.03} />
      </mesh>
      <mesh position={[-14.5, 2.1, z(-5.88)]}>
        <boxGeometry args={[14.5, 3.8, 0.005]} />
        <meshStandardMaterial color="#3b2410" roughness={0.85} metalness={0.02} />
      </mesh>
      {PLANK_SEAMS.map((y) => (
        <mesh key={`nw-${y}`} position={[-14.5, y, z(-5.87)]}>
          <boxGeometry args={[14.62, 0.022, 0.015]} />
          <meshStandardMaterial color="#170e05" roughness={0.95} metalness={0.01} />
        </mesh>
      ))}

      {/* ── WEST WALL — matte grey (poster wall) ──────────────── */}

      <mesh position={[-21.90, 2.1, ROOM_CZ]}>
        <boxGeometry args={[0.02, 4, 11.64 * DEPTH_SCALE]} />
        <meshStandardMaterial color="#757575" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* ── EAST WALL — dark wood, two segments around door gap ── */}

      <mesh position={[-7.10, 2.1, z(-4.6)]}>
        <boxGeometry args={[0.02, 4, EAST_SEG1_DEPTH]} />
        <meshStandardMaterial color="#2a1909" roughness={0.90} metalness={0.03} />
      </mesh>
      {PLANK_SEAMS.map((y) => (
        <mesh key={`ew1-${y}`} position={[-7.08, y, z(-4.6)]}>
          <boxGeometry args={[0.015, 0.022, EAST_SEG1_DEPTH - 0.02]} />
          <meshStandardMaterial color="#170e05" roughness={0.95} metalness={0.01} />
        </mesh>
      ))}

      <mesh position={[-7.10, 2.1, z(2.6)]}>
        <boxGeometry args={[0.02, 4, EAST_SEG2_DEPTH]} />
        <meshStandardMaterial color="#2a1909" roughness={0.90} metalness={0.03} />
      </mesh>
      {PLANK_SEAMS.map((y) => (
        <mesh key={`ew2-${y}`} position={[-7.08, y, z(2.6)]}>
          <boxGeometry args={[0.015, 0.022, EAST_SEG2_DEPTH - 0.02]} />
          <meshStandardMaterial color="#170e05" roughness={0.95} metalness={0.01} />
        </mesh>
      ))}

      <GuitarWallDisplay />
      <GuitarWallAmpStacks />
      <MediaWall />
      <NorthWallBandPosters />
      <PedalDisplayRack />
      <TvWatchCouch />
      <StudioDesk />
      <MusicPosterWall />

      {/* ── CARPET ──────────────────────────────────────────────── */}

      <mesh position={[-14.5, 0.104, ROOM_CZ]}>
        <boxGeometry args={[14.6, 0.01, scaleDepth(11.6)]} />
        <meshStandardMaterial color="#9c9994" roughness={0.97} metalness={0.0} />
      </mesh>

      <mesh position={[-14.5, 0.112, ROOM_CZ]}>
        <boxGeometry args={[13.8, 0.01, scaleDepth(10.8)]} />
        <meshStandardMaterial
          color="#c4c0bb"
          roughness={0.98}
          metalness={0.0}
          emissive="#a09c98"
          emissiveIntensity={0.025}
        />
      </mesh>

      <mesh position={[-14.5, 0.118, z(-5.0)]}>
        <boxGeometry args={[13.0, 0.006, 0.07]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      <mesh position={[-14.5, 0.118, z(5.0)]}>
        <boxGeometry args={[13.0, 0.006, 0.07]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      <mesh position={[-21.0, 0.118, ROOM_CZ]}>
        <boxGeometry args={[0.07, 0.006, scaleDepth(10.0)]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      <mesh position={[-8.0, 0.118, ROOM_CZ]}>
        <boxGeometry args={[0.07, 0.006, scaleDepth(10.0)]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>

      <mesh position={[-14.5, 0.120, z(-4.85)]}>
        <boxGeometry args={[12.7, 0.006, 0.07]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      <mesh position={[-14.5, 0.120, z(4.85)]}>
        <boxGeometry args={[12.7, 0.006, 0.07]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      <mesh position={[-20.85, 0.120, ROOM_CZ]}>
        <boxGeometry args={[0.07, 0.006, scaleDepth(9.7)]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>
      <mesh position={[-8.15, 0.120, ROOM_CZ]}>
        <boxGeometry args={[0.07, 0.006, scaleDepth(9.7)]} />
        <meshStandardMaterial color="#7a7672" roughness={0.97} metalness={0.0} />
      </mesh>

      <StudioFloorMat />
      <DrumKit />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={28} speed={0.5} size={3} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects
        .filter((object) => !object.proximityOnly)
        .map((object) => (
          <InteractiveObject key={object.id} object={object} />
        ))}
    </RoomShell>
  );
}
