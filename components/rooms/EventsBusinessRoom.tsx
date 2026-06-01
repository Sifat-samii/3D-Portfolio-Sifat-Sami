"use client";

import { Door } from "@/components/shared/Door";
import { FurnitureBox } from "@/components/shared/PlaceholderFurniture";
import { InteractiveObject } from "@/components/shared/InteractiveObject";
import { RoomAtmosphere } from "@/components/shared/RoomAtmosphere";
import { RoomLabel } from "@/components/shared/RoomLabel";
import { RoomLights } from "@/components/shared/RoomLights";
import { RoomShell } from "@/components/shared/RoomShell";
import {
  CoffeeMug,
  FramedArt,
  Notebook,
  StickyNote,
  Trophy,
} from "@/components/shared/StorytellingProps";
import { roomById } from "@/lib/roomConfig";

export function EventsBusinessRoom() {
  const room = roomById.events;

  return (
    <RoomShell
      room={room}
      wallHeight={4}
      openings={[{ side: "south", offset: 0, width: 2.4 }]}
    >
      <FurnitureBox position={[12, 0.25, -19.4]} scale={[5.8, 0.5, 1.2]} color="#3b0a3a" emissive="#ff4fd8" />
      <FurnitureBox position={[12, 0.6, -19.4]} scale={[5.8, 0.15, 1.2]} color="#1a081a" />

      <FramedArt position={[9.2, 2.0, -20.88]} width={1.4} height={1.6} color="#facc15" />
      <FramedArt position={[12, 2.0, -20.88]} width={1.6} height={1.6} color="#ff4fd8" />
      <FramedArt position={[14.8, 2.0, -20.88]} width={1.4} height={1.6} color="#f59e0b" />

      <FurnitureBox position={[14.8, 0.55, -16.7]} scale={[2.2, 0.75, 1.2]} color="#78350f" />
      <FurnitureBox position={[14.8, 0.95, -16.7]} scale={[2.2, 0.04, 1.2]} color="#1c1917" />
      <Trophy position={[14.4, 0.95, -16.7]} color="#facc15" />
      <Trophy position={[15.2, 0.95, -16.4]} color="#f59e0b" />

      <FurnitureBox position={[10, 0.55, -14]} scale={[1.9, 0.75, 1.2]} color="#422006" />
      <FurnitureBox position={[10, 0.95, -14]} scale={[1.9, 0.04, 1.2]} color="#1c1917" />
      <CoffeeMug position={[10.5, 0.95, -14]} color="#facc15" />
      <Notebook position={[9.6, 0.95, -14]} color="#fef3c7" />

      <StickyNote position={[8.8, 1.6, -20.88]} rotation={[0, 0, 0.1]} color="#facc15" />
      <StickyNote position={[8.6, 1.9, -20.88]} rotation={[0, 0, -0.1]} color="#fb7185" />
      <StickyNote position={[15.4, 1.7, -20.88]} rotation={[0, 0, 0.15]} color="#34d399" />

      <FurnitureBox position={[12, 0.16, -16]} scale={[5.2, 0.04, 2.8]} color="#1a081a" emissive="#7e2266" />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={28} speed={0.45} size={2.6} />
      <RoomLabel label={room.label} position={[12, 0.16, -14]} color={room.accentColor} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
