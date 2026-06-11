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
      openings={[{ side: "east", offset: 0, width: 2.4 }]}
    >
      {/* Decor translated to the room's new center (-14.5, -11): Δ = (-9.5, -22) */}
      <group position={[-9.5, 0, -22]}>
        <FurnitureBox position={[-2, 1.1, 12.7]} scale={[1.2, 2.2, 0.8]} color="#14532d" />
        <FurnitureBox position={[-2, 0.4, 12.7]} scale={[1.2, 0.06, 0.8]} color="#86efac" emissive="#86efac" />
        <FurnitureBox position={[-2, 0.95, 12.7]} scale={[1.2, 0.06, 0.8]} color="#86efac" emissive="#86efac" />
        <FurnitureBox position={[-2, 1.5, 12.7]} scale={[1.2, 0.06, 0.8]} color="#86efac" emissive="#86efac" />
        <FurnitureBox position={[-2, 2.05, 12.7]} scale={[1.2, 0.06, 0.8]} color="#86efac" emissive="#86efac" />

        <BookStack position={[-2, 0.55, 12.7]} color="#14532d" />
        <BookStack position={[-2.3, 1.1, 12.7]} rotation={[0, Math.PI / 6, 0]} color="#1e3a8a" />
        <BookStack position={[-1.7, 1.65, 12.7]} rotation={[0, -Math.PI / 8, 0]} color="#7c2d12" />

        <FurnitureBox position={[-5.5, 0.55, 9.5]} scale={[2.6, 0.7, 1.2]} color="#3f2f1f" />
        <FurnitureBox position={[-5.5, 0.95, 9.5]} scale={[2.6, 0.04, 1.2]} color="#1c1917" />

        <Notebook position={[-5.5, 0.95, 9.5]} color="#fff7ed" />
        <Notebook position={[-5.8, 0.96, 9.7]} rotation={[0, 0.3, 0]} color="#bbf7d0" />
        <CoffeeMug position={[-4.5, 0.95, 9.4]} color="#166534" />
        <BookStack position={[-6.6, 0.95, 9.5]} color="#1e3a8a" />

        <FurnitureBox position={[-5.5, 1.95, 9.5]} scale={[0.1, 0.6, 0.1]} color="#1c1917" />
        <FurnitureBox position={[-5.5, 2.35, 9.5]} scale={[0.5, 0.18, 0.5]} color="#1c1917" />
        <pointLight position={[-5.5, 2.25, 9.5]} intensity={0.7} distance={3.2} color="#bbf7d0" decay={1.6} />

        <FloorLamp position={[-8.8, 0.2, 8]} color="#bbf7d0" />
        <Plant position={[-0.4, 0.2, 8.6]} color="#166534" />
        <Plant position={[-8.6, 0.2, 14]} color="#15803d" />

        <FurnitureBox position={[-5, 0.16, 12]} scale={[5.2, 0.04, 2.8]} color="#06140c" emissive="#14532d" />
        <RoomLabel label={room.label} position={[-5, 0.16, 8.5]} color={room.accentColor} />
      </group>

      {/* Framed art re-anchored to the new north wall (z = -16) */}
      <FramedArt position={[-12, 2.0, -15.85]} width={1.6} height={1.1} color="#86efac" />
      <FramedArt position={[-17, 2.0, -15.85]} width={1.6} height={1.1} color="#bbf7d0" />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={20} speed={0.22} size={2.2} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
