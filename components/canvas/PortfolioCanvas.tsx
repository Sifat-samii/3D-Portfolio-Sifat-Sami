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

export function PortfolioCanvas() {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

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
