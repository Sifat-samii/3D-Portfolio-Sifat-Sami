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
import { scaleWorldZ } from "@/lib/roomLayout";

const DECOR_GZ = -10;
const decor = (x: number, y: number, lz: number): [number, number, number] => [
  x,
  y,
  scaleWorldZ(DECOR_GZ + lz),
];

export function EventsBusinessRoom() {
  const room = roomById.events;

  return (
    <RoomShell
      room={room}
      wallHeight={4}
      openings={[{ side: "south", offset: -1, width: 2.4 }]}
    >
      <FurnitureBox position={decor(5, 0.25, -14.4)} scale={[5.8, 0.5, 1.2]} color="#3b0a3a" emissive="#ff4fd8" />
      <FurnitureBox position={decor(5, 0.6, -14.4)} scale={[5.8, 0.15, 1.2]} color="#1a081a" />

      <FramedArt position={decor(2.2, 2.0, -15.88)} width={1.4} height={1.6} color="#facc15" />
      <FramedArt position={decor(5, 2.0, -15.88)} width={1.6} height={1.6} color="#ff4fd8" />
      <FramedArt position={decor(7.8, 2.0, -15.88)} width={1.4} height={1.6} color="#f59e0b" />

      <FurnitureBox position={decor(7.8, 0.55, -11.7)} scale={[2.2, 0.75, 1.2]} color="#78350f" />
      <FurnitureBox position={decor(7.8, 0.95, -11.7)} scale={[2.2, 0.04, 1.2]} color="#1c1917" />
      <Trophy position={decor(7.4, 0.95, -11.7)} color="#facc15" />
      <Trophy position={decor(8.2, 0.95, -11.4)} color="#f59e0b" />

      <FurnitureBox position={decor(3, 0.55, -9)} scale={[1.9, 0.75, 1.2]} color="#422006" />
      <FurnitureBox position={decor(3, 0.95, -9)} scale={[1.9, 0.04, 1.2]} color="#1c1917" />
      <CoffeeMug position={decor(3.5, 0.95, -9)} color="#facc15" />
      <Notebook position={decor(2.6, 0.95, -9)} color="#fef3c7" />

      <StickyNote position={decor(1.8, 1.6, -15.88)} rotation={[0, 0, 0.1]} color="#facc15" />
      <StickyNote position={decor(1.6, 1.9, -15.88)} rotation={[0, 0, -0.1]} color="#fb7185" />
      <StickyNote position={decor(8.4, 1.7, -15.88)} rotation={[0, 0, 0.15]} color="#34d399" />

      <FurnitureBox position={decor(5, 0.16, -11)} scale={[5.2, 0.04, 2.8]} color="#1a081a" emissive="#7e2266" />
      <RoomLabel label={room.label} position={decor(5, 0.16, -9)} color={room.accentColor} />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={28} speed={0.45} size={2.6} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
