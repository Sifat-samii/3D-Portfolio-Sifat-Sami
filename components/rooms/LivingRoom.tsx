"use client";

import { Door } from "@/components/shared/Door";
import { FurnitureBox, FurnitureCylinder } from "@/components/shared/PlaceholderFurniture";
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

export function LivingRoom() {
  const room = roomById.living;

  return (
    <RoomShell
      room={room}
      wallHeight={3.8}
      openings={[
        { side: "west", offset: -2, width: 2.4 },
        { side: "east", offset: -2, width: 2.4 },
        { side: "north", offset: -4, width: 2.4 },
        { side: "north", offset: 4, width: 2.4 },
      ]}
    >
      <FurnitureBox position={[0, 0.45, 2.4]} scale={[3.4, 0.7, 1.1]} color="#3a2d28" />
      <FurnitureBox position={[0, 0.85, 2.95]} scale={[3.4, 0.18, 0.35]} color="#4a3a32" />
      <FurnitureBox position={[1.4, 0.85, 2.4]} scale={[0.4, 0.2, 1.05]} color="#4a3a32" />
      <FurnitureBox position={[-1.4, 0.85, 2.4]} scale={[0.4, 0.2, 1.05]} color="#4a3a32" />

      <FurnitureBox position={[0, 0.08, 0.4]} scale={[4.2, 0.06, 2.4]} color="#9a5224" />
      <FurnitureBox position={[0, 0.3, 0.4]} scale={[1.8, 0.05, 1.1]} color="#7c2d12" emissive="#fb923c" />

      <FurnitureBox position={[0, 0.45, -1.4]} scale={[1.8, 0.4, 1]} color="#4b372c" />
      <FurnitureBox position={[0, 0.85, -1.4]} scale={[1.4, 0.05, 0.6]} color="#1c1917" emissive="#f59e0b" />
      <BookStack position={[-0.5, 0.85, -1.4]} color="#7c2d12" />
      <CoffeeMug position={[0.5, 0.85, -1.4]} color="#fde68a" />
      <Notebook position={[0.1, 0.85, -1.4]} color="#e2e8f0" />

      <FloorLamp position={[-5.8, 0.2, -4.2]} color="#ffb84d" />
      <Plant position={[-4.8, 0.2, -0.5]} color="#166534" />
      <Plant position={[5.6, 0.2, -0.8]} color="#15803d" />

      <FurnitureBox position={[5, 0.45, 3.5]} scale={[2.2, 0.7, 1.1]} color="#433021" />
      <FurnitureBox position={[5, 0.85, 3.5]} scale={[2.2, 0.04, 1.1]} color="#1c1917" />

      <FramedArt
        position={[0, 2.2, -5.85]}
        width={2.4}
        height={1.4}
        color="#fbbf24"
      />
      <FramedArt
        position={[-5.6, 2.2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.6}
        height={1}
        color="#fb923c"
      />
      <FramedArt
        position={[5.6, 2.2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        width={1.6}
        height={1}
        color="#facc15"
      />

      <FurnitureCylinder position={[-3.4, 0.2, 4.2]} scale={[0.5, 0.4, 0.5]} color="#7c2d12" />
      <FurnitureCylinder position={[3.4, 0.2, 4.6]} scale={[0.45, 0.4, 0.45]} color="#92400e" />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={26} speed={0.32} size={2.6} />
      <RoomLabel label={room.label} position={[0, 0.16, 4.2]} color={room.accentColor} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
