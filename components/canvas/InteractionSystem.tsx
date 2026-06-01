"use client";

import type { RefObject } from "react";
import type { Group } from "three";
import { useInteractionDetection } from "@/components/systems/useInteractionDetection";

type InteractionSystemProps = {
  playerRef: RefObject<Group | null>;
};

export function InteractionSystem({ playerRef }: InteractionSystemProps) {
  useInteractionDetection(playerRef);
  return null;
}
