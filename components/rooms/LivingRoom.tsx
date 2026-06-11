"use client";

import { Text } from "@react-three/drei";
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
      showFrontWall
      openings={[
        { side: "west", offset: -6, width: 2.4 }, // → Academics (upper)
        { side: "west", offset: 3, width: 2.4 }, // → Music (lower)
        { side: "east", offset: -6, width: 2.4 }, // → Professional (upper)
        { side: "east", offset: 3, width: 2.4 }, // → Web (lower)
        { side: "north", offset: -4, width: 2.4 }, // → Creative
        { side: "north", offset: 4, width: 2.4 }, // → Events
        { side: "south", offset: 0, width: 3.2 }, // main entrance / exit
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
        position={[0, 2.2, -15.85]}
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

      {/* ── GRAND MAIN ENTRANCE — south wall (z = 6), centered ──────── */}
      <group position={[0, 0, 6]}>
        {/* Stone surround / portal */}
        <mesh position={[-1.95, 1.85, 0.02]}>
          <boxGeometry args={[0.55, 3.7, 0.4]} />
          <meshStandardMaterial color="#3a2c20" roughness={0.85} metalness={0.08} />
        </mesh>
        <mesh position={[1.95, 1.85, 0.02]}>
          <boxGeometry args={[0.55, 3.7, 0.4]} />
          <meshStandardMaterial color="#3a2c20" roughness={0.85} metalness={0.08} />
        </mesh>
        <mesh position={[0, 3.55, 0.02]}>
          <boxGeometry args={[4.45, 0.5, 0.4]} />
          <meshStandardMaterial color="#3a2c20" roughness={0.85} metalness={0.08} />
        </mesh>

        {/* Inner frame trim (gold) */}
        <mesh position={[-1.62, 1.6, -0.08]}>
          <boxGeometry args={[0.1, 3.25, 0.16]} />
          <meshStandardMaterial color="#c9962f" emissive="#ffb84d" emissiveIntensity={0.4} roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[1.62, 1.6, -0.08]}>
          <boxGeometry args={[0.1, 3.25, 0.16]} />
          <meshStandardMaterial color="#c9962f" emissive="#ffb84d" emissiveIntensity={0.4} roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 3.2, -0.08]}>
          <boxGeometry args={[3.35, 0.1, 0.16]} />
          <meshStandardMaterial color="#c9962f" emissive="#ffb84d" emissiveIntensity={0.4} roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Two door leaves (dark walnut) — interior side faces -z */}
        {[-0.78, 0.78].map((lx) => (
          <group key={`leaf-${lx}`} position={[lx, 1.55, -0.1]}>
            <mesh>
              <boxGeometry args={[1.48, 3.0, 0.09]} />
              <meshStandardMaterial color="#241606" roughness={0.7} metalness={0.12} />
            </mesh>
            {/* Recessed gold panels */}
            <mesh position={[0, 0.72, -0.05]}>
              <boxGeometry args={[1.05, 1.15, 0.02]} />
              <meshStandardMaterial color="#7c5a1e" emissive="#ffb84d" emissiveIntensity={0.18} roughness={0.5} metalness={0.6} />
            </mesh>
            <mesh position={[0, -0.72, -0.05]}>
              <boxGeometry args={[1.05, 1.15, 0.02]} />
              <meshStandardMaterial color="#7c5a1e" emissive="#ffb84d" emissiveIntensity={0.18} roughness={0.5} metalness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Handles near the central seam */}
        <mesh position={[-0.16, 1.5, -0.18]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial color="#ffd060" emissive="#ffb84d" emissiveIntensity={0.5} roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[0.16, 1.5, -0.18]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial color="#ffd060" emissive="#ffb84d" emissiveIntensity={0.5} roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Threshold mat just inside */}
        <mesh position={[0, 0.055, -0.95]}>
          <boxGeometry args={[3.5, 0.04, 1.4]} />
          <meshStandardMaterial color="#1c140d" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.06, -0.95]}>
          <boxGeometry args={[3.0, 0.02, 1.0]} />
          <meshStandardMaterial color="#3a2c20" roughness={0.9} emissive="#8a5a2b" emissiveIntensity={0.15} />
        </mesh>

        {/* Engraved sign above the portal */}
        <Text
          position={[0, 3.55, -0.22]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.3}
          letterSpacing={0.18}
          color="#ffd79a"
          anchorX="center"
          anchorY="middle"
        >
          ENTRANCE · EXIT
        </Text>

        {/* Warm wash highlighting the entrance */}
        <pointLight position={[0, 2.6, -1.4]} intensity={0.9} distance={7} decay={1.8} color="#ffcf8a" />
      </group>

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
