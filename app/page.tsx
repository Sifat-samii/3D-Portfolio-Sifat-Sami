"use client";

import { ControlGuide } from "@/components/canvas/ControlGuide";
import { InteractionPrompt } from "@/components/canvas/InteractionPrompt";
import { PortfolioCanvas } from "@/components/canvas/PortfolioCanvas";
import { MobilePortfolio } from "@/components/fallback/MobilePortfolio";
import { OverlayManager } from "@/components/overlays/OverlayManager";
import { MiniMap } from "@/components/shared/MiniMap";
import { RoomEntryToast } from "@/components/shared/RoomEntryToast";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { InputProvider } from "@/components/systems/InputProvider";
import { useViewportMode } from "@/components/systems/useViewportMode";

function PortfolioExperience() {
  const { show3D, showMobileLayout, isWebGLFallback, isReady } = useViewportMode();

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <a
        href="#portfolio-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:border focus:border-white/20 focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      {show3D ? <PortfolioCanvas /> : null}
      {showMobileLayout ? <MobilePortfolio isWebGLFallback={isWebGLFallback} /> : null}
      {show3D ? (
        <>
          <ControlGuide />
          <MiniMap />
          <RoomEntryToast />
          <InteractionPrompt />
        </>
      ) : null}
      {show3D ? <OverlayManager /> : null}
      <main id="portfolio-content" tabIndex={-1} className="sr-only">
        <h1>Sifat Mahmud interactive 3D portfolio</h1>
        <p>
          Explore rooms for music, software projects, creative work, events, academics, professional experience, and
          contact information.
        </p>
      </main>
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
