"use client";

import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Scene } from "@/components/canvas/Scene";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

const LOADING_TIMEOUT_MS = 12_000;

function SceneReady({ onReady }: { onReady: () => void }) {
  const { active, progress } = useProgress();
  const hasReadyRef = useRef(false);

  useEffect(() => {
    if (hasReadyRef.current) {
      return;
    }

    if (!active && progress >= 100) {
      hasReadyRef.current = true;
      onReady();
    }
  }, [active, onReady, progress]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (hasReadyRef.current) {
        return;
      }

      hasReadyRef.current = true;
      onReady();
    }, LOADING_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [onReady]);

  return null;
}

function useCanvasSettings() {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return {
        dpr: [1, 1.25] as [number, number],
        antialias: true,
      };
    }

    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
    const lowPower =
      navigator.hardwareConcurrency <= 4 ||
      (navigatorWithMemory.deviceMemory !== undefined && navigatorWithMemory.deviceMemory <= 4);

    return {
      dpr: lowPower ? ([1, 1] as [number, number]) : ([1, 1.25] as [number, number]),
      antialias: !lowPower,
    };
  }, []);
}

export function PortfolioCanvas() {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const canvasSettings = useCanvasSettings();
  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-slate-950">
      {!isSceneReady ? <LoadingScreen /> : null}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 50 }}
        dpr={canvasSettings.dpr}
        gl={{ antialias: canvasSettings.antialias, powerPreference: "default" }}
      >
        <Suspense fallback={null}>
          <Scene />
          <SceneReady onReady={handleSceneReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
