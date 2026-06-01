"use client";

import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { Group } from "three";
import type { DoorConfig } from "@/types/portfolio";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const TRANSITION_MS = 520;

export function useRoomTransition(playerRef: RefObject<Group | null>) {
  const setCurrentRoom = usePortfolioStore((state) => state.setCurrentRoom);
  const setTransitioning = usePortfolioStore((state) => state.setTransitioning);
  const setNearbyDoor = usePortfolioStore((state) => state.setNearbyDoor);
  const setNearbyObject = usePortfolioStore((state) => state.setNearbyObject);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (door: DoorConfig) => {
      const player = playerRef.current;
      if (!player) return;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setTransitioning(true);
      setNearbyDoor(null);
      setNearbyObject(null);
      player.position.set(...door.targetPosition);
      setCurrentRoom(door.toRoom);

      timeoutRef.current = window.setTimeout(() => {
        setTransitioning(false);
        timeoutRef.current = null;
      }, TRANSITION_MS);
    },
    [playerRef, setCurrentRoom, setNearbyDoor, setNearbyObject, setTransitioning],
  );
}
