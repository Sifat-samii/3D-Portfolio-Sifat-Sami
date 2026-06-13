import { create } from "zustand";
import type { DoorId, ObjectId, OverlayId, RoomId } from "@/types/portfolio";

type PortfolioState = {
  currentRoom: RoomId;
  previousRoom: RoomId | null;
  nearbyDoor: DoorId | null;
  nearbyObject: ObjectId | null;
  activeOverlay: OverlayId | null;
  isOverlayOpen: boolean;
  isTransitioning: boolean;
  openingDoorIds: DoorId[];
  doorPassImmunityUntil: number;
  setCurrentRoom: (roomId: RoomId) => void;
  setPreviousRoom: (roomId: RoomId | null) => void;
  setNearbyDoor: (doorId: DoorId | null) => void;
  setNearbyObject: (objectId: ObjectId | null) => void;
  openOverlay: (overlayId: OverlayId) => void;
  closeOverlay: () => void;
  setTransitioning: (isTransitioning: boolean) => void;
  openDoor: (doorId: DoorId) => void;
  closeDoor: (doorId: DoorId) => void;
  setDoorPassImmunityUntil: (timestamp: number) => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  currentRoom: "living",
  previousRoom: null,
  nearbyDoor: null,
  nearbyObject: null,
  activeOverlay: null,
  isOverlayOpen: false,
  isTransitioning: false,
  openingDoorIds: [],
  doorPassImmunityUntil: 0,
  setCurrentRoom: (roomId) =>
    set((state) => ({ previousRoom: state.currentRoom, currentRoom: roomId })),
  setPreviousRoom: (roomId) => set({ previousRoom: roomId }),
  setNearbyDoor: (doorId) => set({ nearbyDoor: doorId }),
  setNearbyObject: (objectId) => set({ nearbyObject: objectId }),
  openOverlay: (overlayId) =>
    set((state) => {
      if (state.isOverlayOpen && state.activeOverlay === overlayId) {
        return state;
      }

      return { activeOverlay: overlayId, isOverlayOpen: true };
    }),
  closeOverlay: () => set({ activeOverlay: null, isOverlayOpen: false }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  openDoor: (doorId) =>
    set((state) => ({
      openingDoorIds: state.openingDoorIds.includes(doorId)
        ? state.openingDoorIds
        : [...state.openingDoorIds, doorId],
    })),
  closeDoor: (doorId) =>
    set((state) => ({
      openingDoorIds: state.openingDoorIds.filter((id) => id !== doorId),
    })),
  setDoorPassImmunityUntil: (doorPassImmunityUntil) => set({ doorPassImmunityUntil }),
}));
