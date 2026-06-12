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
  FloorLamp,
  FramedArt,
  Notebook,
  Plant,
} from "@/components/shared/StorytellingProps";
import { roomById } from "@/lib/roomConfig";
import { scaleWorldZ } from "@/lib/roomLayout";

const DECOR_GZ = -10;
const decor = (x: number, y: number, lz: number): [number, number, number] => [
  x,
  y,
  scaleWorldZ(DECOR_GZ + lz),
];

export function CreativeRoom() {
  const room = roomById.creative;

  return (
    <RoomShell
      room={room}
      wallHeight={3.8}
      openings={[{ side: "south", offset: 1, width: 2.4 }]}
    >
      <FurnitureBox position={decor(-8, 0.45, -12)} scale={[2.4, 0.7, 1.2]} color="#78350f" />
      <FurnitureBox position={decor(-8, 0.85, -12)} scale={[2.4, 0.04, 1.2]} color="#1c1917" />

      <FurnitureBox position={decor(-2.4, 0.45, -11.8)} scale={[1.7, 0.7, 1.3]} color="#92400e" />
      <FurnitureBox position={decor(-2.4, 0.85, -11.8)} scale={[1.7, 0.04, 1.3]} color="#451a03" />

      <FramedArt position={decor(-5, 2.2, -15.85)} width={1.4} height={1.2} color="#fb923c" />
      <FramedArt position={decor(-6.6, 2.2, -15.85)} width={1.0} height={1.4} color="#fbbf24" />
      <FramedArt position={decor(-3.4, 2.2, -15.85)} width={1.0} height={1.4} color="#f97316" />
      <FramedArt position={decor(-8, 1.0, -15.85)} width={1.2} height={0.85} color="#fde68a" />
      <FramedArt position={decor(-2, 1.0, -15.85)} width={1.2} height={0.85} color="#facc15" />

      <FloorLamp position={decor(-9.4, 0.2, -14)} color="#fb923c" />
      <Plant position={decor(-0.6, 0.2, -14)} color="#65a30d" />

      <Notebook position={decor(-2.4, 0.85, -11.8)} rotation={[0, 0.3, 0]} color="#fff7ed" />
      <Notebook position={decor(-2.7, 0.86, -11.5)} rotation={[0, -0.4, 0]} color="#fef3c7" />
      <CoffeeMug position={decor(-1.6, 0.85, -11.6)} color="#fb923c" />

      <FurnitureBox position={decor(-5, 0.16, -11)} scale={[5.6, 0.04, 3.2]} color="#1f0d04" emissive="#9a3412" />
      <RoomLabel label={room.label} position={decor(-5, 0.16, -9)} color={room.accentColor} />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={24} speed={0.32} size={2.6} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
