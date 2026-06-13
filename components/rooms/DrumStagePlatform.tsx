"use client";

/**
 * High corner drum riser — quarter-circle platform flush with the east and south walls.
 *
 * Group origin = south-east corner on the room floor (circle centre).
 *   Local −X → west along the south wall (x axis)
 *   Local +Y (shape) → north along the east wall (−Z in world)
 *
 * Footprint = ¼ disc: radius R from the corner, bounded by the two walls and one arc.
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";

/** Radius along both walls — equal span on south (x) and east (z) axes. */
export const DRUM_STAGE_RADIUS = 6.305;
export const PLATFORM_H = 0.30;
const CARPET_THICK = 0.012;
const ARC_SEGMENTS = 48;

const RISER = "#4a3d30";
const SKIRT = "#1a1610";
/** Platform floor — lightened carpet-border family (#7a7672 → lighter ash). */
const STAGE_FLOOR = "#a8a4a0";

export const DRUM_FLOOR_Y = 0.10;
export const DRUM_STAGE_SURFACE_Y = DRUM_FLOOR_Y + PLATFORM_H + CARPET_THICK;

/** @deprecated Use DRUM_STAGE_RADIUS — kept for callers expecting west extent. */
export const DRUM_STAGE_WEST = DRUM_STAGE_RADIUS;
/** @deprecated Use DRUM_STAGE_RADIUS — kept for callers expecting north extent. */
export const DRUM_STAGE_NORTH = DRUM_STAGE_RADIUS;

type DrumStagePlatformProps = {
  cornerX: number;
  cornerZ: number;
};

/**
 * Quarter-circle footprint in the shape XY plane (maps to world X / −Z).
 * SE corner at origin; arc runs from (−R, 0) on the south wall to (0, R) on the east wall.
 */
function buildQuarterCircleFootprint(radius: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(-radius, 0);
  shape.absarc(0, 0, radius, Math.PI, Math.PI / 2, true);
  shape.lineTo(0, 0);
  return shape;
}

function extrudeFootprint(radius: number, height: number, bevel = false) {
  const shape = buildQuarterCircleFootprint(radius);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: bevel,
    bevelThickness: bevel ? 0.010 : 0,
    bevelSize: bevel ? 0.008 : 0,
    bevelSegments: 2,
    curveSegments: ARC_SEGMENTS,
  });
  geom.rotateX(-Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

export function DrumStagePlatform({ cornerX, cornerZ }: DrumStagePlatformProps) {
  const platformGeom = useMemo(
    () => extrudeFootprint(DRUM_STAGE_RADIUS, PLATFORM_H, true),
    [],
  );

  const carpetGeom = useMemo(() => {
    const inset = 0.12;
    return extrudeFootprint(DRUM_STAGE_RADIUS - inset, CARPET_THICK, false);
  }, []);

  const skirtGeom = useMemo(
    () => extrudeFootprint(DRUM_STAGE_RADIUS + 0.03, 0.012, false),
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

/** Centroid of a quarter-disc — offset from the SE corner along west and north. */
export const DRUM_STAGE_CENTROID = (4 * DRUM_STAGE_RADIUS) / (3 * Math.PI);

/** Kit centre at the geometric centre of the quarter-disc platform. */
export function drumKitStagePosition(cornerX: number, cornerZ: number): [number, number, number] {
  return [
    cornerX - DRUM_STAGE_CENTROID,
    DRUM_STAGE_SURFACE_Y,
    cornerZ - DRUM_STAGE_CENTROID,
  ];
}
