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
import { scaleWorldZ } from "@/lib/roomLayout";

const DECOR_GX = 9.5;
const DECOR_GZ = -22;
const decor = (lx: number, y: number, lz: number): [number, number, number] => [
  DECOR_GX + lx,
  y,
  scaleWorldZ(DECOR_GZ + lz),
];

export function ProfessionalRoom() {
  const room = roomById.professional;

  return (
    <RoomShell
      room={room}
      wallHeight={3.8}
      openings={[{ side: "west", offset: 0, width: 2.4 }]}
    >
      <FurnitureBox position={decor(5, 0.5, 9.5)} scale={[3.2, 0.75, 1.3]} color="#0b1224" />
      <FurnitureBox position={decor(5, 0.95, 9.5)} scale={[3.2, 0.04, 1.3]} color="#020617" />

      <ScreenPanel position={decor(5, 1.55, 9)} width={1.4} height={0.85} color="#38bdf8" />

      <CoffeeMug position={decor(6.2, 0.95, 9.5)} color="#0f172a" />
      <Notebook position={decor(3.6, 0.95, 9.5)} color="#dbeafe" />
      <CablePile position={decor(6.6, 0.95, 9.7)} color="#020617" />

      <ScreenPanel
        position={decor(5, 1.4, 15.15)}
        rotation={[0, Math.PI, 0]}
        width={2.4}
        height={1.4}
        color="#38bdf8"
      />
      <ScreenPanel
        position={decor(2, 1.4, 12.7)}
        rotation={[0, -Math.PI / 4, 0]}
        width={1.7}
        height={1.1}
        color="#93c5fd"
      />
      <ScreenPanel
        position={decor(8, 1.4, 12.5)}
        rotation={[0, Math.PI / 4, 0]}
        width={1.7}
        height={1.1}
        color="#60a5fa"
      />

      <FurnitureBox position={decor(5, 0.5, 14.4)} scale={[5, 0.04, 0.4]} color="#0f172a" emissive="#38bdf8" />

      <Plant position={decor(1.4, 0.2, 8.6)} color="#166534" />
      <Plant position={decor(8.6, 0.2, 8.6)} color="#166534" />

      <FurnitureBox position={decor(5, 0.16, 11.5)} scale={[5.6, 0.04, 3.2]} color="#020617" emissive="#0c4a6e" />
      <RoomLabel label={room.label} position={decor(5, 0.16, 8.6)} color={room.accentColor} />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={20} speed={0.28} size={2.2} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
