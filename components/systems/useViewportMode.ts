"use client";

import { useSyncExternalStore } from "react";
import { MOBILE_BREAKPOINT } from "@/lib/constants";
import { isWebGLAvailable } from "@/lib/webgl";

function subscribeToViewport(onStoreChange: () => void) {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

function getIsMobileViewport() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useViewportMode() {
  const isMobile = useSyncExternalStore(subscribeToViewport, getIsMobileViewport, () => false);
  const webglAvailable = useSyncExternalStore(subscribeToViewport, isWebGLAvailable, () => true);

  const show3D = !isMobile && webglAvailable;
  const showMobileLayout = isMobile || !webglAvailable;

  return {
    isMobile,
    webglAvailable,
    show3D,
    showMobileLayout,
    isWebGLFallback: !isMobile && !webglAvailable,
  };
}
