"use client";

import { Door } from "@/components/shared/Door";
import { FurnitureBox } from "@/components/shared/PlaceholderFurniture";
import { InteractiveObject } from "@/components/shared/InteractiveObject";
import { RoomAtmosphere } from "@/components/shared/RoomAtmosphere";
import { RoomLabel } from "@/components/shared/RoomLabel";
import { RoomLights } from "@/components/shared/RoomLights";
import { RoomShell } from "@/components/shared/RoomShell";
import {
  CablePile,
  CoffeeMug,
  Notebook,
  ScreenPanel,
  StickyNote,
} from "@/components/shared/StorytellingProps";
import { roomById } from "@/lib/roomConfig";

export function WebServicesRoom() {
  const room = roomById.web;

  return (
    <RoomShell
      room={room}
      wallHeight={3.8}
      openings={[{ side: "west", offset: -2, width: 2.4 }]}
    >
      {/* Decor shifted +2.5 in x to recenter on the widened room (center x = 14.5) */}
      <group position={[2.5, 0, 0]}>
        <FurnitureBox position={[12, 0.45, -4.6]} scale={[4.6, 0.7, 1.2]} color="#0b1224" />
        <FurnitureBox position={[12, 0.85, -4.6]} scale={[4.6, 0.04, 1.2]} color="#020617" emissive="#1e3a8a" />

        <ScreenPanel position={[11.1, 1.55, -5.15]} width={1.6} height={0.95} color="#22d3ee" />
        <ScreenPanel position={[12.9, 1.55, -5.15]} width={1.4} height={0.85} color="#3b82f6" />

        <CoffeeMug position={[13.6, 0.85, -4.4]} color="#1e293b" />
        <Notebook position={[10.6, 0.85, -4.4]} color="#0f172a" />
        <CablePile position={[10.2, 0.85, -4.2]} color="#020617" />

        <StickyNote position={[9.6, 1.6, -5.12]} rotation={[0, 0, 0.1]} color="#facc15" />
        <StickyNote position={[9.6, 1.85, -5.12]} rotation={[0, 0, -0.15]} color="#34d399" />
        <StickyNote position={[14.3, 1.78, -5.12]} rotation={[0, 0, 0.08]} color="#fb7185" />

        <FurnitureBox position={[15.2, 1.05, 1.7]} scale={[1, 2.1, 0.8]} color="#0f172a" />
        <FurnitureBox position={[15.2, 0.6, 2.0]} scale={[0.85, 0.04, 0.06]} color="#22d3ee" emissive="#22d3ee" />
        <FurnitureBox position={[15.2, 0.9, 2.0]} scale={[0.85, 0.04, 0.06]} color="#3b82f6" emissive="#3b82f6" />
        <FurnitureBox position={[15.2, 1.2, 2.0]} scale={[0.85, 0.04, 0.06]} color="#22d3ee" emissive="#22d3ee" />
        <FurnitureBox position={[15.2, 1.5, 2.0]} scale={[0.85, 0.04, 0.06]} color="#3b82f6" emissive="#3b82f6" />
        <FurnitureBox position={[15.2, 1.8, 2.0]} scale={[0.85, 0.04, 0.06]} color="#22d3ee" emissive="#22d3ee" />

        <ScreenPanel position={[10.4, 1.3, 1.5]} rotation={[0, -Math.PI / 12, 0]} width={1.8} height={1.1} color="#3b82f6" />

        <FurnitureBox position={[12, 0.16, 2.6]} scale={[4.8, 0.04, 2.4]} color="#020617" emissive="#0c4a6e" />
        <RoomLabel label={room.label} position={[12, 0.16, 2.8]} color={room.accentColor} />
      </group>

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={24} speed={0.45} size={2.2} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
