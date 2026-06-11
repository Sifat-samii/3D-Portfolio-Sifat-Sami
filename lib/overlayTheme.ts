import { allInteractiveObjects, roomById } from "@/lib/roomConfig";
import type { OverlayId, RoomId } from "@/types/portfolio";

const overlayRoomMap = new Map<OverlayId, RoomId>();

for (const object of allInteractiveObjects) {
  overlayRoomMap.set(object.overlayId, object.roomId);
}

overlayRoomMap.set("welcome", "living");
overlayRoomMap.set("contact", "living");
overlayRoomMap.set("resume", "living");
overlayRoomMap.set("musicTvMenu", "music");
overlayRoomMap.set("guitarJourney", "music");
overlayRoomMap.set("performances", "music");

export function getOverlayAccent(overlayId: OverlayId): string {
  const roomId = overlayRoomMap.get(overlayId) ?? "living";
  return roomById[roomId].accentColor;
}

export function getOverlayRoomId(overlayId: OverlayId): RoomId {
  return overlayRoomMap.get(overlayId) ?? "living";
}
