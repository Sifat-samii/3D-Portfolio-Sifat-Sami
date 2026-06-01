"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { Vector3, type Group } from "three";
import { CAMERA_OFFSET } from "@/lib/constants";
import { roomById } from "@/lib/roomConfig";
import { usePortfolioStore } from "@/store/usePortfolioStore";

type CameraControllerProps = {
  playerRef: RefObject<Group | null>;
};

export function CameraController({ playerRef }: CameraControllerProps) {
  const currentRoom = usePortfolioStore((state) => state.currentRoom);
  const isTransitioning = usePortfolioStore((state) => state.isTransitioning);
  const currentOffset = useRef(new Vector3(CAMERA_OFFSET.x, CAMERA_OFFSET.y, CAMERA_OFFSET.z));
  const desiredOffset = useRef(new Vector3(CAMERA_OFFSET.x, CAMERA_OFFSET.y, CAMERA_OFFSET.z));
  const targetPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());
  const desiredLookAt = useRef(new Vector3());

  useFrame(({ camera }, delta) => {
    const player = playerRef.current;
    if (!player) return;

    const config = roomById[currentRoom];
    const offset = config.cameraOffset ?? [CAMERA_OFFSET.x, CAMERA_OFFSET.y, CAMERA_OFFSET.z];
    desiredOffset.current.set(offset[0], offset[1], offset[2]);

    const offsetDamping = 1 - Math.pow(0.012, delta);
    currentOffset.current.lerp(desiredOffset.current, offsetDamping);

    targetPosition.current.set(
      player.position.x + currentOffset.current.x,
      player.position.y + currentOffset.current.y,
      player.position.z + currentOffset.current.z,
    );

    const followDamping = isTransitioning ? 1 - Math.pow(0.035, delta) : 1 - Math.pow(0.07, delta);
    camera.position.lerp(targetPosition.current, followDamping);

    desiredLookAt.current.set(player.position.x, player.position.y + 0.6, player.position.z);
    const lookDamping = isTransitioning ? 1 - Math.pow(0.04, delta) : 1 - Math.pow(0.08, delta);
    currentLookAt.current.lerp(desiredLookAt.current, lookDamping);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
