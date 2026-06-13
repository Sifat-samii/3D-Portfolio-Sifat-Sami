import { rooms } from "@/lib/roomConfig";
import type { RoomId } from "@/types/portfolio";

const adjacency = new Map<RoomId, Set<RoomId>>();

for (const room of rooms) {
  if (!adjacency.has(room.id)) {
    adjacency.set(room.id, new Set());
  }

  for (const door of room.doors) {
    adjacency.get(room.id)!.add(door.toRoom);

    if (!adjacency.has(door.toRoom)) {
      adjacency.set(door.toRoom, new Set());
    }
    adjacency.get(door.toRoom)!.add(room.id);
  }
}

export function isRoomVisible(currentRoom: RoomId, roomId: RoomId): boolean {
  if (currentRoom === roomId) {
    return true;
  }

  return adjacency.get(currentRoom)?.has(roomId) ?? false;
}

export function getVisibleRooms(currentRoom: RoomId): ReadonlySet<RoomId> {
  const visible = new Set<RoomId>([currentRoom]);
  const neighbors = adjacency.get(currentRoom);

  if (neighbors) {
    for (const neighbor of neighbors) {
      visible.add(neighbor);
    }
  }

  return visible;
}
