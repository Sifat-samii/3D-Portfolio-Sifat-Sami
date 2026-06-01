"use client";

import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Group } from "three";
import { MathUtils, Vector3 } from "three";
import { PLAYER_SPEED, PLAYER_SPRINT_MULTIPLIER } from "@/lib/constants";
import { clampToRoomBounds } from "@/lib/roomBounds";
import { useInputState } from "@/components/systems/useInputState";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const direction = new Vector3();

export function usePlayerMovement(playerRef: RefObject<Group | null>) {
  const input = useInputState();

  useFrame((_, delta) => {
    const { isOverlayOpen, isTransitioning, currentRoom } = usePortfolioStore.getState();
    const player = playerRef.current;
    if (!player) return;
    if (isOverlayOpen || isTransitioning) return;

    direction.set(0, 0, 0);
    if (input.forward) direction.z -= 1;
    if (input.backward) direction.z += 1;
    if (input.left) direction.x -= 1;
    if (input.right) direction.x += 1;

    if (direction.lengthSq() > 0) {
      direction.normalize();
      const speed = PLAYER_SPEED * (input.sprint ? PLAYER_SPRINT_MULTIPLIER : 1);
      player.position.addScaledVector(direction, speed * delta);
      player.rotation.y = MathUtils.lerp(
        player.rotation.y,
        Math.atan2(direction.x, direction.z),
        0.18,
      );
    }

    const [x, y, z] = clampToRoomBounds(currentRoom, player.position);
    player.position.set(x, y, z);
  });
}
