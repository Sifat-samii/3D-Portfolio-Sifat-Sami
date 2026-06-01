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
  isMobileFallback: boolean;
  setCurrentRoom: (roomId: RoomId) => void;
  setPreviousRoom: (roomId: RoomId | null) => void;
  setNearbyDoor: (doorId: DoorId | null) => void;
  setNearbyObject: (objectId: ObjectId | null) => void;
  openOverlay: (overlayId: OverlayId) => void;
  closeOverlay: () => void;
  setTransitioning: (isTransitioning: boolean) => void;
  setMobileFallback: (isMobileFallback: boolean) => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  currentRoom: "living",
  previousRoom: null,
  nearbyDoor: null,
  nearbyObject: null,
  activeOverlay: null,
  isOverlayOpen: false,
  isTransitioning: false,
  isMobileFallback: false,
  setCurrentRoom: (roomId) =>
    set((state) => ({ previousRoom: state.currentRoom, currentRoom: roomId })),
  setPreviousRoom: (roomId) => set({ previousRoom: roomId }),
  setNearbyDoor: (doorId) => set({ nearbyDoor: doorId }),
  setNearbyObject: (objectId) => set({ nearbyObject: objectId }),
  openOverlay: (overlayId) => set({ activeOverlay: overlayId, isOverlayOpen: true }),
  closeOverlay: () => set({ activeOverlay: null, isOverlayOpen: false }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  setMobileFallback: (isMobileFallback) => set({ isMobileFallback }),
}));
