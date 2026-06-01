import type { DoorConfig, InteractiveObjectConfig, RoomId } from "@/types/portfolio";
import { allDoors, allInteractiveObjects } from "@/lib/roomConfig";

export const doorsByRoom: Record<RoomId, DoorConfig[]> = {
  living: [],
  music: [],
  web: [],
  creative: [],
  events: [],
  academics: [],
  professional: [],
};

export const objectsByRoom: Record<RoomId, InteractiveObjectConfig[]> = {
  living: [],
  music: [],
  web: [],
  creative: [],
  events: [],
  academics: [],
  professional: [],
};

for (const door of allDoors) {
  doorsByRoom[door.fromRoom].push(door);
}

for (const object of allInteractiveObjects) {
  objectsByRoom[object.roomId].push(object);
}
