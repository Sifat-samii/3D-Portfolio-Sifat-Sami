"use client";

import { Door } from "@/components/shared/Door";
import { FurnitureBox } from "@/components/shared/PlaceholderFurniture";
import { InteractiveObject } from "@/components/shared/InteractiveObject";
import { RoomAtmosphere } from "@/components/shared/RoomAtmosphere";
import { RoomLabel } from "@/components/shared/RoomLabel";
import { RoomLights } from "@/components/shared/RoomLights";
import { RoomShell } from "@/components/shared/RoomShell";
import {
  BookStack,
  CoffeeMug,
  FloorLamp,
  FramedArt,
  Notebook,
  Plant,
} from "@/components/shared/StorytellingProps";
import { roomById } from "@/lib/roomConfig";

export function AcademicsRoom() {
  const room = roomById.academics;

  return (
    <RoomShell
      room={room}
      wallHeight={3.8}
      openings={[{ side: "north", offset: 0, width: 2.4 }]}
    >
      <FurnitureBox position={[-9, 1.1, 15.7]} scale={[1.2, 2.2, 0.8]} color="#14532d" />
      <FurnitureBox position={[-9, 0.4, 15.7]} scale={[1.2, 0.06, 0.8]} color="#86efac" emissive="#86efac" />
      <FurnitureBox position={[-9, 0.95, 15.7]} scale={[1.2, 0.06, 0.8]} color="#86efac" emissive="#86efac" />
      <FurnitureBox position={[-9, 1.5, 15.7]} scale={[1.2, 0.06, 0.8]} color="#86efac" emissive="#86efac" />
      <FurnitureBox position={[-9, 2.05, 15.7]} scale={[1.2, 0.06, 0.8]} color="#86efac" emissive="#86efac" />

      <BookStack position={[-9, 0.55, 15.7]} color="#14532d" />
      <BookStack position={[-9.3, 1.1, 15.7]} rotation={[0, Math.PI / 6, 0]} color="#1e3a8a" />
      <BookStack position={[-8.7, 1.65, 15.7]} rotation={[0, -Math.PI / 8, 0]} color="#7c2d12" />

      <FurnitureBox position={[-12.5, 0.55, 12.5]} scale={[2.6, 0.7, 1.2]} color="#3f2f1f" />
      <FurnitureBox position={[-12.5, 0.95, 12.5]} scale={[2.6, 0.04, 1.2]} color="#1c1917" />

      <Notebook position={[-12.5, 0.95, 12.5]} color="#fff7ed" />
      <Notebook position={[-12.8, 0.96, 12.7]} rotation={[0, 0.3, 0]} color="#bbf7d0" />
      <CoffeeMug position={[-11.5, 0.95, 12.4]} color="#166534" />
      <BookStack position={[-13.6, 0.95, 12.5]} color="#1e3a8a" />

      <FurnitureBox position={[-12.5, 1.95, 12.5]} scale={[0.1, 0.6, 0.1]} color="#1c1917" />
      <FurnitureBox position={[-12.5, 2.35, 12.5]} scale={[0.5, 0.18, 0.5]} color="#1c1917" />
      <pointLight position={[-12.5, 2.25, 12.5]} intensity={0.7} distance={3.2} color="#bbf7d0" decay={1.6} />

      <FramedArt position={[-15.85, 1.6, 15.8]} rotation={[0, Math.PI / 2, 0]} width={1.6} height={1.1} color="#86efac" />
      <FramedArt position={[-15.85, 1.6, 18.2]} rotation={[0, Math.PI / 2, 0]} width={1.6} height={1.1} color="#bbf7d0" />

      <FloorLamp position={[-15.8, 0.2, 11]} color="#bbf7d0" />
      <Plant position={[-7.4, 0.2, 11.6]} color="#166534" />
      <Plant position={[-15.6, 0.2, 17]} color="#15803d" />

      <FurnitureBox position={[-12, 0.16, 15]} scale={[5.2, 0.04, 2.8]} color="#06140c" emissive="#14532d" />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={20} speed={0.22} size={2.2} />
      <RoomLabel label={room.label} position={[-12, 0.16, 11.5]} color={room.accentColor} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
