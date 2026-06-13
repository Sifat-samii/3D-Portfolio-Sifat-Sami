"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInputState } from "@/components/systems/useInputState";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const WelcomeOverlay = dynamic(
  () => import("@/components/overlays/WelcomeOverlay").then((module) => ({ default: module.WelcomeOverlay })),
  { loading: () => null },
);
const ContactOverlay = dynamic(
  () => import("@/components/overlays/ContactOverlay").then((module) => ({ default: module.ContactOverlay })),
  { loading: () => null },
);
const ResumeOverlay = dynamic(
  () => import("@/components/overlays/ResumeOverlay").then((module) => ({ default: module.ResumeOverlay })),
  { loading: () => null },
);
const MusicTvMenuOverlay = dynamic(
  () => import("@/components/overlays/MusicTvMenuOverlay").then((module) => ({ default: module.MusicTvMenuOverlay })),
  { loading: () => null },
);
const MusicOverlay = dynamic(
  () => import("@/components/overlays/MusicOverlay").then((module) => ({ default: module.MusicOverlay })),
  { loading: () => null },
);
const WebProjectsOverlay = dynamic(
  () => import("@/components/overlays/WebProjectsOverlay").then((module) => ({ default: module.WebProjectsOverlay })),
  { loading: () => null },
);
const CreativeOverlay = dynamic(
  () => import("@/components/overlays/CreativeOverlay").then((module) => ({ default: module.CreativeOverlay })),
  { loading: () => null },
);
const EventsOverlay = dynamic(
  () => import("@/components/overlays/EventsOverlay").then((module) => ({ default: module.EventsOverlay })),
  { loading: () => null },
);
const AcademicsOverlay = dynamic(
  () => import("@/components/overlays/AcademicsOverlay").then((module) => ({ default: module.AcademicsOverlay })),
  { loading: () => null },
);
const ProfessionalOverlay = dynamic(
  () => import("@/components/overlays/ProfessionalOverlay").then((module) => ({ default: module.ProfessionalOverlay })),
  { loading: () => null },
);

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
