"use client";

import { Suspense, lazy, useRef, type ReactNode } from "react";
import type { Group } from "three";
import { Avatar } from "@/components/canvas/Avatar";
import { CameraController } from "@/components/canvas/CameraController";
import { InteractionSystem } from "@/components/canvas/InteractionSystem";
import { LightingManager } from "@/components/canvas/LightingManager";
import { LivingRoom } from "@/components/rooms/LivingRoom";
import { WebServicesRoom } from "@/components/rooms/WebServicesRoom";
import { CreativeRoom } from "@/components/rooms/CreativeRoom";
import { EventsBusinessRoom } from "@/components/rooms/EventsBusinessRoom";
import { AcademicsRoom } from "@/components/rooms/AcademicsRoom";
import { ProfessionalRoom } from "@/components/rooms/ProfessionalRoom";
import { isRoomVisible } from "@/lib/roomVisibility";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import type { RoomId } from "@/types/portfolio";

const MusicRoom = lazy(() =>
  import("@/components/rooms/MusicRoom").then((module) => ({ default: module.MusicRoom })),
);

type RoomSlotProps = {
  roomId: RoomId;
  children: ReactNode;
};

function RoomSlot({ roomId, children }: RoomSlotProps) {
  const currentRoom = usePortfolioStore((state) => state.currentRoom);
  if (!isRoomVisible(currentRoom, roomId)) {
    return null;
  }

  return <>{children}</>;
}

export function Scene() {
  const playerRef = useRef<Group>(null);

  return (
    <>
      <color attach="background" args={["#05070d"]} />
      <LightingManager />
      <RoomSlot roomId="living">
        <LivingRoom />
      </RoomSlot>
      <RoomSlot roomId="music">
        <Suspense fallback={null}>
          <MusicRoom />
        </Suspense>
      </RoomSlot>
      <RoomSlot roomId="web">
        <WebServicesRoom />
      </RoomSlot>
      <RoomSlot roomId="creative">
        <CreativeRoom />
      </RoomSlot>
      <RoomSlot roomId="events">
        <EventsBusinessRoom />
      </RoomSlot>
      <RoomSlot roomId="academics">
        <AcademicsRoom />
      </RoomSlot>
      <RoomSlot roomId="professional">
        <ProfessionalRoom />
      </RoomSlot>
      <Avatar ref={playerRef} />
      <CameraController playerRef={playerRef} />
      <InteractionSystem playerRef={playerRef} />
    </>
  );
}
