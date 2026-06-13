"use client";

/**
 * High corner drum riser — flush with the east and south walls, arced front
 * edge bulging outward toward the kit (convex front).
 *
 * Group origin = south-east corner on the room floor.
 *   Local −X → west (into room)
 *   Local −Z → north (into room)
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";

export const DRUM_STAGE_WEST = 5.05;
export const DRUM_STAGE_NORTH = 4.75;
export const PLATFORM_H = 0.30;
const CARPET_THICK = 0.012;
/** Outward bow — control point pushed past the diagonal (convex toward the kit). */
const ARC_BOW_OUT = 0.30;

const RISER = "#4a3d30";
const SKIRT = "#1a1610";
/** Platform floor — lightened carpet-border family (#7a7672 → lighter ash). */
const STAGE_FLOOR = "#a8a4a0";

export const DRUM_FLOOR_Y = 0.10;
export const DRUM_STAGE_SURFACE_Y = DRUM_FLOOR_Y + PLATFORM_H + CARPET_THICK;

type DrumStagePlatformProps = {
  cornerX: number;
  cornerZ: number;
};

/**
 * 2D footprint in the XZ plane (y = 0). SE corner at origin.
 * Points run: corner → west along south wall → outward arc → north along east wall → corner.
 */
function buildFootprint(west: number, north: number, bowOut: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(-west, 0);
  // Control beyond the diagonal — bulges outward into the room (convex front)
  shape.quadraticCurveTo(-west * (1 + bowOut), north * (1 + bowOut), 0, north);
  shape.lineTo(0, 0);
  return shape;
}

function extrudeFootprint(
  west: number,
  north: number,
  bowOut: number,
  height: number,
  bevel = false,
) {
  const shape = buildFootprint(west, north, bowOut);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: bevel,
    bevelThickness: bevel ? 0.010 : 0,
    bevelSize: bevel ? 0.008 : 0,
    bevelSegments: 2,
    curveSegments: 40,
  });
  // Shape lies in XY; extrude +Z → rotate so +Z becomes +Y (up)
  geom.rotateX(-Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

export function DrumStagePlatform({ cornerX, cornerZ }: DrumStagePlatformProps) {

  const platformGeom = useMemo(
    () => extrudeFootprint(DRUM_STAGE_WEST, DRUM_STAGE_NORTH, ARC_BOW_OUT, PLATFORM_H, true),
    [],
  );

  const carpetGeom = useMemo(() => {
    const inset = 0.12;
    return extrudeFootprint(
      DRUM_STAGE_WEST - inset,
      DRUM_STAGE_NORTH - inset,
      ARC_BOW_OUT,
      CARPET_THICK,
      false,
    );
  }, []);

  const skirtGeom = useMemo(
    () =>
      extrudeFootprint(DRUM_STAGE_WEST + 0.03, DRUM_STAGE_NORTH + 0.03, ARC_BOW_OUT, 0.012, false),
    [],
  );

  useEffect(
    () => () => {
      platformGeom.dispose();
      carpetGeom.dispose();
      skirtGeom.dispose();
    },
    [platformGeom, carpetGeom, skirtGeom],
  );

  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: STAGE_FLOOR,
        roughness: 0.97,
        metalness: 0,
      }),
    [],
  );

  return (
    <group position={[cornerX, DRUM_FLOOR_Y, cornerZ]}>
      <mesh geometry={skirtGeom} receiveShadow>
        <meshStandardMaterial color={SKIRT} roughness={0.88} metalness={0.04} />
      </mesh>

      <mesh geometry={platformGeom} castShadow receiveShadow>
        <meshStandardMaterial color={RISER} roughness={0.62} metalness={0.08} />
      </mesh>

      <mesh geometry={carpetGeom} position={[0, PLATFORM_H, 0]} material={floorMat} receiveShadow />
    </group>
  );
}

/** Kit centre on the stage — shifted toward the corner so the full kit sits on the carpet. */
export function drumKitStagePosition(cornerX: number, cornerZ: number): [number, number, number] {
  return [
    cornerX - DRUM_STAGE_WEST * 0.46,
    DRUM_STAGE_SURFACE_Y,
    cornerZ - DRUM_STAGE_NORTH * 0.42,
  ];
}
