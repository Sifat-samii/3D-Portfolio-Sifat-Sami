"use client";

import { Door } from "@/components/shared/Door";
import { FurnitureBox, FurnitureCylinder } from "@/components/shared/PlaceholderFurniture";
import { InteractiveObject } from "@/components/shared/InteractiveObject";
import { RoomAtmosphere } from "@/components/shared/RoomAtmosphere";
import { RoomLabel } from "@/components/shared/RoomLabel";
import { RoomLights } from "@/components/shared/RoomLights";
import { RoomShell } from "@/components/shared/RoomShell";
import { CablePile, FramedArt, SpeakerStack } from "@/components/shared/StorytellingProps";
import { roomById } from "@/lib/roomConfig";

export function MusicRoom() {
  const room = roomById.music;

  return (
    <RoomShell
      room={room}
      wallHeight={4}
      openings={[{ side: "east", offset: 0, width: 2.4 }]}
    >
      <FurnitureBox position={[-18, 0.18, -5.4]} scale={[6.8, 0.35, 1.2]} color="#1a0526" emissive="#b557ff" />
      <FurnitureBox position={[-18, 0.5, -5.4]} scale={[6.8, 0.2, 1.2]} color="#3b0764" />

      <FurnitureCylinder position={[-21.5, 1.4, -5.4]} scale={[0.18, 2.6, 0.18]} color="#1c0a26" emissive="#ff3d6e" />
      <FurnitureCylinder position={[-14.5, 1.4, -5.4]} scale={[0.18, 2.6, 0.18]} color="#1c0a26" emissive="#b557ff" />
      <FurnitureBox position={[-21.5, 2.6, -5.4]} scale={[0.4, 0.2, 0.5]} color="#1c1917" emissive="#ff3d6e" />
      <FurnitureBox position={[-14.5, 2.6, -5.4]} scale={[0.4, 0.2, 0.5]} color="#1c1917" emissive="#b557ff" />
      <FurnitureBox position={[-18, 2.8, -5.6]} scale={[6.4, 0.06, 0.2]} color="#0c0418" />

      <FurnitureBox position={[-19.8, 0.65, -4.5]} scale={[0.18, 1.3, 0.12]} color="#7f1d1d" />
      <FurnitureBox position={[-19.8, 1.35, -4.5]} scale={[0.6, 0.25, 0.18]} color="#9a0c2a" emissive="#ff3d6e" />

      <SpeakerStack position={[-20.8, 0, 0.8]} color="#0f172a" />
      <SpeakerStack position={[-15.2, 0, 0.8]} color="#0f172a" />

      <CablePile position={[-17.6, 0.2, -3.6]} color="#1c1917" />
      <CablePile position={[-18.4, 0.2, -3.4]} color="#0f172a" />

      <FramedArt
        position={[-22.6, 1.9, -3]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.4}
        height={1.8}
        color="#b557ff"
      />
      <FramedArt
        position={[-22.6, 1.9, 0]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.4}
        height={1.8}
        color="#ff3d6e"
      />

      <FurnitureBox position={[-18, 0.16, 2.4]} scale={[5, 0.04, 2.8]} color="#0a0410" emissive="#7c1d6f" />

      <RoomLights roomId={room.id} position={room.position} />
      <RoomAtmosphere room={room} count={28} speed={0.5} size={3} />
      <RoomLabel label={room.label} position={[-18, 0.16, 2.6]} color={room.accentColor} />
      {room.doors.map((door) => (
        <Door key={door.id} door={door} />
      ))}
      {room.objects.map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </RoomShell>
  );
}
