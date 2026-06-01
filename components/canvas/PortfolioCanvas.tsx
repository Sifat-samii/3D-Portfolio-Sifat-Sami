"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Scene } from "@/components/canvas/Scene";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

function SceneReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return null;
}

function WebGLErrorFallback() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950 p-6 text-center text-white">
      <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-lg font-semibold">3D view unavailable</p>
        <p className="mt-3 text-sm text-slate-300">
          WebGL could not start on this device. Use the mobile layout or try a browser with hardware acceleration
          enabled.
        </p>
      </div>
    </div>
  );
}

function detectWebGLUnavailable() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    return !gl;
  } catch {
    return true;
  }
}

export function PortfolioCanvas() {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [webglError] = useState(detectWebGLUnavailable);
  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  if (webglError) {
    return <WebGLErrorFallback />;
  }

  return (
    <div className="fixed inset-0 z-0 bg-slate-950">
      {!isSceneReady ? <LoadingScreen /> : null}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene />
          <SceneReady onReady={handleSceneReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
