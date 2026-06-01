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
  Plant,
  ScreenPanel,
} from "@/components/shared/StorytellingProps";
import { roomById } from "@/lib/roomConfig";

export function ProfessionalRoom() {
  const room = roomById.professional;

  return (
    <RoomShell
      room={room}
      wallHeight={3.8}
      openings={[{ side: "north", offset: 0, width: 2.4 }]}
    >
      <FurnitureBox position={[12, 0.5, 12.5]} scale={[3.2, 0.75, 1.3]} color="#0b1224" />
      <FurnitureBox position={[12, 0.95, 12.5]} scale={[3.2, 0.04, 1.3]} color="#020617" />

      <ScreenPanel position={[12, 1.55, 12]} width={1.4} height={0.85} color="#38bdf8" />

      <CoffeeMug position={[13.2, 0.95, 12.5]} color="#0f172a" />
      <Notebook position={[10.6, 0.95, 12.5]} color="#dbeafe" />
      <CablePile position={[13.6, 0.95, 12.7]} color="#020617" />

      <ScreenPanel
        position={[12, 1.4, 18.15]}
        rotation={[0, Math.PI, 0]}
        width={2.4}
        height={1.4}
        color="#38bdf8"
      />
      <ScreenPanel
        position={[9, 1.4, 15.7]}
        rotation={[0, -Math.PI / 4, 0]}
        width={1.7}
        height={1.1}
        color="#93c5fd"
      />
      <ScreenPanel
        position={[15, 1.4, 15.5]}
        rotation={[0, Math.PI / 4, 0]}
        width={1.7}
        height={1.1}
        color="#60a5fa"
      />

      <FurnitureBox position={[12, 0.5, 17.4]} scale={[5, 0.04, 0.4]} color="#0f172a" emissive="#38bdf8" />

      <Plant position={[8.4, 0.2, 11.6]} color="#166534" />
      <Plant position={[15.6, 0.2, 11.6]} color="#166534" />

      <FurnitureBox position={[12, 0.16, 14.5]} scale={[5.6, 0.04, 3.2]} color="#020617" emissive="#0c4a6e" />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={20} speed={0.28} size={2.2} />
      <RoomLabel label={room.label} position={[12, 0.16, 11.6]} color={room.accentColor} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
