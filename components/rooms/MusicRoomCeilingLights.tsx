"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MathUtils, Object3D, type PointLight, type SpotLight } from "three";
import { scaleDepth, scaleWorldZ } from "@/lib/roomLayout";
import { usePortfolioStore } from "@/store/usePortfolioStore";

/**
 * Music room ceiling map — four corner pools + one centre downlight.
 * Invisible fixtures only; golden wash.
 */

const GOLDEN = "#e0b858";
const LIGHT_Y = 3.72;
const FLOOR_Y = 0.18;
const CORNER_INSET = 0.85;

const CORNER_SPOT = 9.6;
const CORNER_FILL = 4.8;
const CENTER_SPOT = 10.6;
const CENTER_FILL = 5.2;

const SPOT_ANGLE = 0.94;
const SPOT_PENUMBRA = 0.46;
const SPOT_DISTANCE = 28;
const SPOT_DECAY = 1.15;
const FILL_DISTANCE = 19;
const FILL_DECAY = 1.3;

const ROOM_CX = -14.5;
const ROOM_CZ = scaleWorldZ(0);
const HALF_W = 7.5;
const HALF_D = scaleDepth(12) / 2;

type LightSpec = {
  id: string;
  ceiling: [number, number, number];
  floor: [number, number, number];
  spot: number;
  fill: number;
};

const LIGHTS: LightSpec[] = [
  {
    id: "nw",
    ceiling: [ROOM_CX - HALF_W + CORNER_INSET, LIGHT_Y, ROOM_CZ - HALF_D + CORNER_INSET],
    floor: [ROOM_CX - HALF_W + CORNER_INSET, FLOOR_Y, ROOM_CZ - HALF_D + CORNER_INSET],
    spot: CORNER_SPOT,
    fill: CORNER_FILL,
  },
  {
    id: "ne",
    ceiling: [ROOM_CX + HALF_W - CORNER_INSET, LIGHT_Y, ROOM_CZ - HALF_D + CORNER_INSET],
    floor: [ROOM_CX + HALF_W - CORNER_INSET, FLOOR_Y, ROOM_CZ - HALF_D + CORNER_INSET],
    spot: CORNER_SPOT,
    fill: CORNER_FILL,
  },
  {
    id: "sw",
    ceiling: [ROOM_CX - HALF_W + CORNER_INSET, LIGHT_Y, ROOM_CZ + HALF_D - CORNER_INSET],
    floor: [ROOM_CX - HALF_W + CORNER_INSET, FLOOR_Y, ROOM_CZ + HALF_D - CORNER_INSET],
    spot: CORNER_SPOT,
    fill: CORNER_FILL,
  },
  {
    id: "se",
    ceiling: [ROOM_CX + HALF_W - CORNER_INSET, LIGHT_Y, ROOM_CZ + HALF_D - CORNER_INSET],
    floor: [ROOM_CX + HALF_W - CORNER_INSET, FLOOR_Y, ROOM_CZ + HALF_D - CORNER_INSET],
    spot: CORNER_SPOT,
    fill: CORNER_FILL,
  },
  {
    id: "center",
    ceiling: [ROOM_CX, LIGHT_Y, ROOM_CZ],
    floor: [ROOM_CX, FLOOR_Y, ROOM_CZ],
    spot: CENTER_SPOT,
    fill: CENTER_FILL,
  },
];

function CeilingDownlight({ spec }: { spec: LightSpec }) {
  const target = useMemo(() => {
    const obj = new Object3D();
    obj.position.set(...spec.floor);
    return obj;
  }, [spec.floor]);

  const spotRef = useRef<SpotLight>(null);
  const fillRef = useRef<PointLight>(null);
  const isActive = usePortfolioStore((state) => state.currentRoom === "music");
  const targetSpot = isActive ? spec.spot : 0;
  const targetFill = isActive ? spec.fill : 0;

  useFrame((_, delta) => {
    const damping = 1 - Math.pow(0.0025, delta);
    if (spotRef.current) {
      spotRef.current.intensity = MathUtils.lerp(spotRef.current.intensity, targetSpot, damping);
    }
    if (fillRef.current) {
      fillRef.current.intensity = MathUtils.lerp(fillRef.current.intensity, targetFill, damping);
    }
  });

  return (
    <group>
      <primitive object={target} />
      <spotLight
        ref={spotRef}
        position={spec.ceiling}
        target={target}
        color={GOLDEN}
        intensity={targetSpot}
        angle={SPOT_ANGLE}
        penumbra={SPOT_PENUMBRA}
        distance={SPOT_DISTANCE}
        decay={SPOT_DECAY}
        castShadow={false}
      />
      <pointLight
        ref={fillRef}
        position={spec.ceiling}
        color={GOLDEN}
        intensity={targetFill}
        distance={FILL_DISTANCE}
        decay={FILL_DECAY}
      />
    </group>
  );
}

export function MusicRoomCeilingLights() {
  const isActive = usePortfolioStore((state) => state.currentRoom === "music");
  if (!isActive) {
    return null;
  }

  return (
    <group>
      {LIGHTS.map((spec) => (
        <CeilingDownlight key={spec.id} spec={spec} />
      ))}
    </group>
  );
}
