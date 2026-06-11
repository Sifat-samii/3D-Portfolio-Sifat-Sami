"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { AcademicsOverlay } from "@/components/overlays/AcademicsOverlay";
import { ContactOverlay } from "@/components/overlays/ContactOverlay";
import { CreativeOverlay } from "@/components/overlays/CreativeOverlay";
import { EventsOverlay } from "@/components/overlays/EventsOverlay";
import { MusicOverlay } from "@/components/overlays/MusicOverlay";
import { MusicTvMenuOverlay } from "@/components/overlays/MusicTvMenuOverlay";
import { ProfessionalOverlay } from "@/components/overlays/ProfessionalOverlay";
import { ResumeOverlay } from "@/components/overlays/ResumeOverlay";
import { WebProjectsOverlay } from "@/components/overlays/WebProjectsOverlay";
import { WelcomeOverlay } from "@/components/overlays/WelcomeOverlay";
import { useInputState } from "@/components/systems/useInputState";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const musicOverlays = new Set([
  "musicProfile",
  "bandProjects",
  "audioPreview",
  "guitarJourney",
  "performances",
]);
const webOverlays = new Set(["webProjects", "techStack", "productCaseStudies", "automationSystems"]);
const creativeOverlays = new Set(["beadsBonita", "artworkGallery", "creativeDirection"]);
const eventOverlays = new Set(["eventCaseStudies", "campaignHighlights", "eventPortfolio", "entrepreneurship"]);
const academicOverlays = new Set(["certifications", "researchPublication", "academicBackground"]);
const professionalOverlays = new Set([
  "careerTimeline",
  "professionalImpact",
  "professionalCaseStudies",
  "workflowSystems",
]);

export function OverlayManager() {
  const input = useInputState();
  const lastCloseNonce = useRef(input.closeNonce);
  const activeOverlay = usePortfolioStore((state) => state.activeOverlay);
  const closeOverlay = usePortfolioStore((state) => state.closeOverlay);

  useEffect(() => {
    if (input.closeNonce === lastCloseNonce.current) return;
    lastCloseNonce.current = input.closeNonce;
    closeOverlay();
  }, [closeOverlay, input.closeNonce]);

  return (
    <AnimatePresence mode="wait">
      {activeOverlay === "welcome" ? <WelcomeOverlay key="welcome" onClose={closeOverlay} /> : null}
      {activeOverlay === "contact" ? <ContactOverlay key="contact" onClose={closeOverlay} /> : null}
      {activeOverlay === "resume" ? <ResumeOverlay key="resume" onClose={closeOverlay} /> : null}
      {activeOverlay === "musicTvMenu" ? (
        <MusicTvMenuOverlay key="musicTvMenu" onClose={closeOverlay} />
      ) : null}
      {activeOverlay && musicOverlays.has(activeOverlay) ? (
        <MusicOverlay key={activeOverlay} overlayId={activeOverlay} onClose={closeOverlay} />
      ) : null}
      {activeOverlay && webOverlays.has(activeOverlay) ? (
        <WebProjectsOverlay key={activeOverlay} overlayId={activeOverlay} onClose={closeOverlay} />
      ) : null}
      {activeOverlay && creativeOverlays.has(activeOverlay) ? (
        <CreativeOverlay key={activeOverlay} overlayId={activeOverlay} onClose={closeOverlay} />
      ) : null}
      {activeOverlay && eventOverlays.has(activeOverlay) ? (
        <EventsOverlay key={activeOverlay} overlayId={activeOverlay} onClose={closeOverlay} />
      ) : null}
      {activeOverlay && academicOverlays.has(activeOverlay) ? (
        <AcademicsOverlay key={activeOverlay} overlayId={activeOverlay} onClose={closeOverlay} />
      ) : null}
      {activeOverlay && professionalOverlays.has(activeOverlay) ? (
        <ProfessionalOverlay key={activeOverlay} overlayId={activeOverlay} onClose={closeOverlay} />
      ) : null}
    </AnimatePresence>
  );
}
