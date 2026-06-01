"use client";

import { useSyncExternalStore } from "react";
import { ControlGuide } from "@/components/canvas/ControlGuide";
import { InteractionPrompt } from "@/components/canvas/InteractionPrompt";
import { PortfolioCanvas } from "@/components/canvas/PortfolioCanvas";
import { MobilePortfolio } from "@/components/fallback/MobilePortfolio";
import { OverlayManager } from "@/components/overlays/OverlayManager";
import { MiniMap } from "@/components/shared/MiniMap";
import { RoomEntryToast } from "@/components/shared/RoomEntryToast";
import { InputProvider } from "@/components/systems/InputProvider";
import { MOBILE_BREAKPOINT } from "@/lib/constants";

function subscribeToViewport(onStoreChange: () => void) {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

function getIsMobileFallback() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function PortfolioExperience() {
  const isMobileFallback = useSyncExternalStore(
    subscribeToViewport,
    getIsMobileFallback,
    () => false,
  );

  return (
    <>
      {!isMobileFallback ? <PortfolioCanvas /> : null}
      <MobilePortfolio />
      {!isMobileFallback ? (
        <>
          <ControlGuide />
          <MiniMap />
          <RoomEntryToast />
          <InteractionPrompt />
        </>
      ) : null}
      <OverlayManager />
      <div className="sr-only md:block">
        <h1>Sifat Mahmud interactive 3D portfolio</h1>
        <p>
          Explore rooms for music, software projects, creative work, events, academics, professional experience, and
          contact information.
        </p>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <InputProvider>
      <PortfolioExperience />
    </InputProvider>
  );
}
