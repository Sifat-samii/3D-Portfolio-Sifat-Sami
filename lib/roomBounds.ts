import { roomById } from "@/lib/roomConfig";
import type { RoomId, Vector3Tuple } from "@/types/portfolio";

const ROOM_MARGIN = 0.85;

export function clampToRoomBounds(
  roomId: RoomId,
  position: { x: number; y: number; z: number },
): Vector3Tuple {
  const room = roomById[roomId];
  const halfWidth = room.size[0] / 2 - ROOM_MARGIN;
  const halfDepth = room.size[2] / 2 - ROOM_MARGIN;
  const centerX = room.position[0];
  const centerZ = room.position[2];

  return [
    Math.max(centerX - halfWidth, Math.min(centerX + halfWidth, position.x)),
    position.y,
    Math.max(centerZ - halfDepth, Math.min(centerZ + halfDepth, position.z)),
  ];
}
