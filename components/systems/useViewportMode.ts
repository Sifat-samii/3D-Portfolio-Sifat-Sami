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

function subscribeToMount(onStoreChange: () => void) {
  onStoreChange();
  return () => {};
}

function getHasMounted() {
  return true;
}

function getServerHasMounted() {
  return false;
}

export function useViewportMode() {
  const hasMounted = useSyncExternalStore(subscribeToMount, getHasMounted, getServerHasMounted);
  const isMobile = useSyncExternalStore(subscribeToViewport, getIsMobileViewport, () => false);
  const webglAvailable = useSyncExternalStore(subscribeToViewport, isWebGLAvailable, () => false);

  if (!hasMounted) {
    return {
      isMobile: false,
      webglAvailable: false,
      show3D: false,
      showMobileLayout: false,
      isWebGLFallback: false,
      isReady: false,
    };
  }

  const show3D = !isMobile && webglAvailable;
  const showMobileLayout = isMobile || !webglAvailable;

  return {
    isMobile,
    webglAvailable,
    show3D,
    showMobileLayout,
    isWebGLFallback: !isMobile && !webglAvailable,
    isReady: true,
  };
}
