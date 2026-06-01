"use client";

import { Text } from "@react-three/drei";
import type { Vector3Tuple } from "@/types/portfolio";

type RoomLabelProps = {
  label: string;
  position: Vector3Tuple;
  color?: string;
};

export function RoomLabel({ label, position, color = "#f8fafc" }: RoomLabelProps) {
  return (
    <Text position={position} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.55} color={color} anchorX="center">
      {label}
    </Text>
  );
}
