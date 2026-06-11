"use client";

import { Sparkles } from "@react-three/drei";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import type { RoomConfig } from "@/types/portfolio";

type RoomAtmosphereProps = {
  room: RoomConfig;
  count?: number;
  speed?: number;
  size?: number;
};

export function RoomAtmosphere({ room, count = 22, speed = 0.32, size = 2.4 }: RoomAtmosphereProps) {
  const currentRoom = usePortfolioStore((state) => state.currentRoom);
  if (currentRoom !== room.id) return null;

  const [cx, , cz] = room.position;
  const [width, , depth] = room.size;

  return (
    <group>
      <Sparkles
        position={[cx, 1.6, cz]}
        count={count}
        scale={[width * 0.92, 2.4, depth * 0.92]}
        size={size}
        speed={speed}
        color={room.accentColor}
        opacity={0.65}
        noise={0.6}
      />
      <mesh position={[cx, 0.04, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[Math.min(width, depth) * 0.46, 48]} />
        <meshBasicMaterial color={room.accentColor} transparent opacity={0.04} />
      </mesh>
    </group>
  );
}
