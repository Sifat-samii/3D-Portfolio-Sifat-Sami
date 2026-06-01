"use client";

import { useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Group } from "three";
import { allDoors, allInteractiveObjects } from "@/lib/interactionConfig";
import { doorsByRoom, objectsByRoom } from "@/lib/interactionIndex";
import { INTERACTION_RADIUS } from "@/lib/constants";
import { distanceXZ } from "@/lib/utils";
import { useInputState } from "@/components/systems/useInputState";
import { useRoomTransition } from "@/components/systems/useRoomTransition";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import type { DoorId, ObjectId, Vector3Tuple } from "@/types/portfolio";

function findNearestInRadius<T extends { id: string; position: Vector3Tuple }>(
  items: T[],
  playerPosition: Vector3Tuple,
): T | null {
  let nearest: T | null = null;
  let nearestDistance = INTERACTION_RADIUS;

  for (const item of items) {
    const distance = distanceXZ(playerPosition, item.position);
    if (distance <= nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function useInteractionDetection(playerRef: RefObject<Group | null>) {
  const input = useInputState();
  const lastInteractNonce = useRef(input.interactNonce);
  const lastDoorId = useRef<DoorId | null>(null);
  const lastObjectId = useRef<ObjectId | null>(null);
  const transitionToRoom = useRoomTransition(playerRef);
  const setNearbyDoor = usePortfolioStore((state) => state.setNearbyDoor);
  const setNearbyObject = usePortfolioStore((state) => state.setNearbyObject);

  const updateNearby = useCallback(
    (doorId: DoorId | null, objectId: ObjectId | null) => {
      if (lastDoorId.current !== doorId) {
        lastDoorId.current = doorId;
        setNearbyDoor(doorId);
      }
      if (lastObjectId.current !== objectId) {
        lastObjectId.current = objectId;
        setNearbyObject(objectId);
      }
    },
    [setNearbyDoor, setNearbyObject],
  );

  useFrame(() => {
    const { currentRoom, isOverlayOpen, isTransitioning } = usePortfolioStore.getState();
    const player = playerRef.current;

    if (!player || isOverlayOpen || isTransitioning) {
      updateNearby(null, null);
      return;
    }

    const playerPosition: Vector3Tuple = [player.position.x, player.position.y, player.position.z];
    const roomDoors = doorsByRoom[currentRoom];
    const roomObjects = objectsByRoom[currentRoom];
    const nearestDoor = findNearestInRadius(roomDoors, playerPosition);

    if (nearestDoor) {
      updateNearby(nearestDoor.id, null);
      return;
    }

    const nearestObject = findNearestInRadius(roomObjects, playerPosition);
    updateNearby(null, nearestObject?.id ?? null);
  });

  useEffect(() => {
    if (input.interactNonce === lastInteractNonce.current) return;
    lastInteractNonce.current = input.interactNonce;

    const { nearbyDoor: nearbyDoorId, nearbyObject: nearbyObjectId, isOverlayOpen, isTransitioning } =
      usePortfolioStore.getState();

    if (isOverlayOpen || isTransitioning) return;

    if (nearbyDoorId) {
      const door = allDoors.find((item) => item.id === nearbyDoorId);
      if (door) transitionToRoom(door);
      return;
    }

    if (nearbyObjectId) {
      const object = allInteractiveObjects.find((item) => item.id === nearbyObjectId);
      if (object) usePortfolioStore.getState().openOverlay(object.overlayId);
    }
  }, [input.interactNonce, transitionToRoom]);
}
