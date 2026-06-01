"use client";

import { useRef } from "react";
import type { Group } from "three";
import { Avatar } from "@/components/canvas/Avatar";
import { CameraController } from "@/components/canvas/CameraController";
import { InteractionSystem } from "@/components/canvas/InteractionSystem";
import { LightingManager } from "@/components/canvas/LightingManager";
import { LivingRoom } from "@/components/rooms/LivingRoom";
import { MusicRoom } from "@/components/rooms/MusicRoom";
import { WebServicesRoom } from "@/components/rooms/WebServicesRoom";
import { CreativeRoom } from "@/components/rooms/CreativeRoom";
import { EventsBusinessRoom } from "@/components/rooms/EventsBusinessRoom";
import { AcademicsRoom } from "@/components/rooms/AcademicsRoom";
import { ProfessionalRoom } from "@/components/rooms/ProfessionalRoom";

export function Scene() {
  const playerRef = useRef<Group>(null);

  return (
    <>
      <color attach="background" args={["#05070d"]} />
      <LightingManager />
      <LivingRoom />
      <MusicRoom />
      <WebServicesRoom />
      <CreativeRoom />
      <EventsBusinessRoom />
      <AcademicsRoom />
      <ProfessionalRoom />
      <Avatar ref={playerRef} />
      <CameraController playerRef={playerRef} />
      <InteractionSystem playerRef={playerRef} />
    </>
  );
}
