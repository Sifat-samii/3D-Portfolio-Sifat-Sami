import { allDoors } from "@/lib/roomConfig";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import type { DoorConfig, DoorId } from "@/types/portfolio";

export const DOOR_AUTO_CLOSE_MS = 2000;
export const DOOR_PASS_IMMUNITY_MS = 2600;

const closeTimers = new Map<DoorId, number>();

export function findPairedDoor(door: DoorConfig): DoorConfig | undefined {
  return allDoors.find(
    (candidate) => candidate.fromRoom === door.toRoom && candidate.toRoom === door.fromRoom,
  );
}

export function triggerDoorOpen(doorId: DoorId, closeAfterMs = DOOR_AUTO_CLOSE_MS) {
  const { openDoor, closeDoor } = usePortfolioStore.getState();
  openDoor(doorId);

  const existing = closeTimers.get(doorId);
  if (existing) window.clearTimeout(existing);

  closeTimers.set(
    doorId,
    window.setTimeout(() => {
      closeDoor(doorId);
      closeTimers.delete(doorId);
    }, closeAfterMs),
  );
}

export function triggerDoorPairOpen(door: DoorConfig) {
  triggerDoorOpen(door.id);
  const paired = findPairedDoor(door);
  if (paired) triggerDoorOpen(paired.id);
}

export function beginDoorPassImmunity() {
  usePortfolioStore
    .getState()
    .setDoorPassImmunityUntil(Date.now() + DOOR_PASS_IMMUNITY_MS);
}
