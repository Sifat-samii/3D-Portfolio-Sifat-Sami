"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { MathUtils, type RectAreaLight } from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { scaleDepth, scaleWorldZ } from "@/lib/roomLayout";
import { usePortfolioStore } from "@/store/usePortfolioStore";

/**
 * Invisible linear ceiling strips — centre cross (white) + border perimeter (golden).
 * Works with MeshStandard / MeshPhysical materials (RectAreaLightUniformsLib).
 */

const WHITE = "#ffffff";
const GOLDEN = "#e0b858";
const STRIP_Y = 3.86;
const CENTER_INTENSITY = 14;
const BORDER_INTENSITY = 9;
const CENTER_THICK = 0.2;
const BORDER_THICK = 0.52;
const BORDER_INSET = 0.32;

const ROOM_CX = -14.5;
const ROOM_CZ = scaleWorldZ(0);
const HALF_W = 7.5;
const HALF_D = scaleDepth(12) / 2;
const STRIP_LEN_X = HALF_W * 2 - 1.4;
const STRIP_LEN_Z = HALF_D * 2 - 1.4;
/** Border strips span nearly the full wall run for a wider wash. */
const BORDER_LEN_X = HALF_W * 2 - 0.35;
const BORDER_LEN_Z = HALF_D * 2 - 0.35;

const DOWN_EW: [number, number, number] = [-Math.PI / 2, 0, 0];
const DOWN_NS: [number, number, number] = [-Math.PI / 2, 0, Math.PI / 2];

type StripSpec = {
  id: string;
  color: string;
  intensity: number;
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
};

const STRIPS: StripSpec[] = [
  {
    id: "center-ew",
    color: WHITE,
    intensity: CENTER_INTENSITY,
    width: STRIP_LEN_X,
    height: CENTER_THICK,
    position: [ROOM_CX, STRIP_Y, ROOM_CZ],
    rotation: DOWN_EW,
  },
  {
    id: "center-ns",
    color: WHITE,
    intensity: CENTER_INTENSITY,
    width: STRIP_LEN_Z,
    height: CENTER_THICK,
    position: [ROOM_CX, STRIP_Y, ROOM_CZ],
    rotation: DOWN_NS,
  },
  {
    id: "border-north",
    color: GOLDEN,
    intensity: BORDER_INTENSITY,
    width: BORDER_LEN_X,
    height: BORDER_THICK,
    position: [ROOM_CX, STRIP_Y, ROOM_CZ - HALF_D + BORDER_INSET],
    rotation: DOWN_EW,
  },
  {
    id: "border-south",
    color: GOLDEN,
    intensity: BORDER_INTENSITY,
    width: BORDER_LEN_X,
    height: BORDER_THICK,
    position: [ROOM_CX, STRIP_Y, ROOM_CZ + HALF_D - BORDER_INSET],
    rotation: DOWN_EW,
  },
  {
    id: "border-west",
    color: GOLDEN,
    intensity: BORDER_INTENSITY,
    width: BORDER_LEN_Z,
    height: BORDER_THICK,
    position: [ROOM_CX - HALF_W + BORDER_INSET, STRIP_Y, ROOM_CZ],
    rotation: DOWN_NS,
  },
  {
    id: "border-east",
    color: GOLDEN,
    intensity: BORDER_INTENSITY,
    width: BORDER_LEN_Z,
    height: BORDER_THICK,
    position: [ROOM_CX + HALF_W - BORDER_INSET, STRIP_Y, ROOM_CZ],
    rotation: DOWN_NS,
  },
];

function LinearStrip({
  spec,
  lightRef,
}: {
  spec: StripSpec;
  lightRef: (el: RectAreaLight | null) => void;
}) {
  return (
    <rectAreaLight
      ref={lightRef}
      color={spec.color}
      intensity={spec.intensity}
      width={spec.width}
      height={spec.height}
      position={spec.position}
      rotation={spec.rotation}
    />
  );
}

export function MusicRoomLinearLights() {
  const lightRefs = useRef<(RectAreaLight | null)[]>([]);
  const isActive = usePortfolioStore((state) => state.currentRoom === "music");

  useLayoutEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  useFrame((_, delta) => {
    const damping = 1 - Math.pow(0.0025, delta);
    for (let i = 0; i < STRIPS.length; i++) {
      const light = lightRefs.current[i];
      if (!light) continue;
      const target = isActive ? STRIPS[i]!.intensity : 0;
      light.intensity = MathUtils.lerp(light.intensity, target, damping);
    }
  });

  return (
    <group>
      {STRIPS.map((spec, index) => (
        <LinearStrip
          key={spec.id}
          spec={spec}
          lightRef={(el) => {
            lightRefs.current[index] = el;
          }}
        />
      ))}
    </group>
  );
}
