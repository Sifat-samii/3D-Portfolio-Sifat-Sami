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

export function CreativeRoom() {
  const room = roomById.creative;

  return (
    <RoomShell
      room={room}
      wallHeight={3.8}
      openings={[{ side: "south", offset: 0, width: 2.4 }]}
    >
      <FurnitureBox position={[-15, 0.45, -17]} scale={[2.4, 0.7, 1.2]} color="#78350f" />
      <FurnitureBox position={[-15, 0.85, -17]} scale={[2.4, 0.04, 1.2]} color="#1c1917" />

      <FurnitureBox position={[-9.4, 0.45, -16.8]} scale={[1.7, 0.7, 1.3]} color="#92400e" />
      <FurnitureBox position={[-9.4, 0.85, -16.8]} scale={[1.7, 0.04, 1.3]} color="#451a03" />

      <FramedArt position={[-12, 2.2, -20.85]} width={1.4} height={1.2} color="#fb923c" />
      <FramedArt position={[-13.6, 2.2, -20.85]} width={1.0} height={1.4} color="#fbbf24" />
      <FramedArt position={[-10.4, 2.2, -20.85]} width={1.0} height={1.4} color="#f97316" />
      <FramedArt position={[-15, 1.0, -20.85]} width={1.2} height={0.85} color="#fde68a" />
      <FramedArt position={[-9, 1.0, -20.85]} width={1.2} height={0.85} color="#facc15" />

      <FloorLamp position={[-16.4, 0.2, -19]} color="#fb923c" />
      <Plant position={[-7.6, 0.2, -19]} color="#65a30d" />

      <Notebook position={[-9.4, 0.85, -16.8]} rotation={[0, 0.3, 0]} color="#fff7ed" />
      <Notebook position={[-9.7, 0.86, -16.5]} rotation={[0, -0.4, 0]} color="#fef3c7" />
      <CoffeeMug position={[-8.6, 0.85, -16.6]} color="#fb923c" />

      <FurnitureBox position={[-12, 0.16, -16]} scale={[5.6, 0.04, 3.2]} color="#1f0d04" emissive="#9a3412" />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={24} speed={0.32} size={2.6} />
      <RoomLabel label={room.label} position={[-12, 0.16, -14]} color={room.accentColor} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
