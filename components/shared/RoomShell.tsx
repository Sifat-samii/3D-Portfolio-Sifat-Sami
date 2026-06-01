"use client";

import type { ReactNode } from "react";
import type { RoomConfig, Vector3Tuple } from "@/types/portfolio";

type WallSide = "north" | "south" | "east" | "west";

type WallSegment = { start: number; end: number };

type RoomShellProps = {
  room: RoomConfig;
  wallHeight?: number;
  showFrontWall?: boolean;
  openings?: Array<{ side: WallSide; offset?: number; width?: number }>;
  children?: ReactNode;
};

const WALL_THICKNESS = 0.18;
const TRIM_THICKNESS = 0.08;

function buildSegments(
  side: WallSide,
  width: number,
  depth: number,
  openings: Array<{ side: WallSide; offset?: number; width?: number }>,
): WallSegment[] {
  const isVertical = side === "east" || side === "west";
  const span = isVertical ? depth : width;
  const start = -span / 2;
  const end = span / 2;
  const sideOpenings = openings
    .filter((opening) => opening.side === side)
    .map((opening) => {
      const offset = opening.offset ?? 0;
      const w = opening.width ?? 2.4;
      return { gapStart: offset - w / 2, gapEnd: offset + w / 2 };
    })
    .sort((a, b) => a.gapStart - b.gapStart);

  if (sideOpenings.length === 0) return [{ start, end }];

  const segments: WallSegment[] = [];
  let cursor = start;
  for (const { gapStart, gapEnd } of sideOpenings) {
    if (gapStart > cursor) {
      segments.push({ start: cursor, end: Math.min(end, gapStart) });
    }
    cursor = Math.max(cursor, gapEnd);
  }
  if (cursor < end) segments.push({ start: cursor, end });
  return segments;
}

type WallStripProps = {
  side: WallSide;
  segments: WallSegment[];
  wallColor: string;
  trimColor: string;
  wallHeight: number;
  cx: number;
  cz: number;
  halfW: number;
  halfD: number;
};

function WallStrip({
  side,
  segments,
  wallColor,
  trimColor,
  wallHeight,
  cx,
  cz,
  halfW,
  halfD,
}: WallStripProps) {
  const isVertical = side === "east" || side === "west";
  const wallY = wallHeight / 2 + 0.1;

  return (
    <>
      {segments.map((segment, index) => {
        const length = segment.end - segment.start;
        if (length <= 0.08) return null;
        const mid = (segment.start + segment.end) / 2;
        const position: Vector3Tuple = isVertical
          ? [cx + (side === "east" ? halfW : -halfW), wallY, cz + mid]
          : [cx + mid, wallY, cz + (side === "north" ? -halfD : halfD)];
        const scale: Vector3Tuple = isVertical
          ? [WALL_THICKNESS, wallHeight, length]
          : [length, wallHeight, WALL_THICKNESS];
        const trimScale: Vector3Tuple = isVertical
          ? [WALL_THICKNESS + 0.05, TRIM_THICKNESS, length + 0.05]
          : [length + 0.05, TRIM_THICKNESS, WALL_THICKNESS + 0.05];
        return (
          <group key={`${side}-${index}`}>
            <mesh position={position} scale={scale}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={wallColor} roughness={0.92} metalness={0.04} />
            </mesh>
            <mesh position={[position[0], wallHeight + 0.05, position[2]]} scale={trimScale}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color={trimColor}
                emissive={trimColor}
                emissiveIntensity={0.35}
                roughness={0.5}
              />
            </mesh>
            <mesh position={[position[0], 0.32, position[2]]} scale={trimScale}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color={trimColor}
                emissive={trimColor}
                emissiveIntensity={0.18}
                roughness={0.7}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

export function RoomShell({
  room,
  wallHeight = 3.6,
  showFrontWall = false,
  openings = [],
  children,
}: RoomShellProps) {
  const [cx, , cz] = room.position;
  const [width, , depth] = room.size;
  const halfW = width / 2;
  const halfD = depth / 2;

  const wallProps = {
    wallColor: room.wallColor,
    trimColor: room.trimColor,
    wallHeight,
    cx,
    cz,
    halfW,
    halfD,
  };

  return (
    <group>
      <mesh position={room.position}>
        <boxGeometry args={room.size} />
        <meshStandardMaterial color={room.themeColor} roughness={0.88} metalness={0.02} />
      </mesh>

      <mesh
        position={[cx, room.position[1] + room.size[1] / 2 + 0.002, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[Math.min(halfW, halfD) * 0.32, Math.min(halfW, halfD) * 0.36, 64]} />
        <meshStandardMaterial
          color={room.accentColor}
          emissive={room.accentColor}
          emissiveIntensity={0.45}
          transparent
          opacity={0.55}
          roughness={0.7}
        />
      </mesh>

      <WallStrip
        side="north"
        segments={buildSegments("north", width, depth, openings)}
        {...wallProps}
      />
      {showFrontWall ? (
        <WallStrip
          side="south"
          segments={buildSegments("south", width, depth, openings)}
          {...wallProps}
        />
      ) : null}
      <WallStrip
        side="east"
        segments={buildSegments("east", width, depth, openings)}
        {...wallProps}
      />
      <WallStrip
        side="west"
        segments={buildSegments("west", width, depth, openings)}
        {...wallProps}
      />

      <mesh position={[cx, wallHeight + 0.32, cz - halfD + 0.4]} scale={[width - 1.4, 0.14, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={room.trimColor} roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[cx, wallHeight + 0.32, cz + halfD - 0.4]} scale={[width - 1.4, 0.14, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={room.trimColor} roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[cx - halfW + 0.4, wallHeight + 0.32, cz]} scale={[0.14, 0.14, depth - 1.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={room.trimColor} roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[cx + halfW - 0.4, wallHeight + 0.32, cz]} scale={[0.14, 0.14, depth - 1.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={room.trimColor} roughness={0.55} metalness={0.15} />
      </mesh>

      {children}
    </group>
  );
}
