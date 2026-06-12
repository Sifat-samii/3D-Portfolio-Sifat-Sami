/**
 * House depth layout — all room depths scaled ×1.3 from the south entrance pivot.
 * South entrance stays at z = 6; rooms expand northward without wall overlap.
 */
export const DEPTH_SCALE = 1.3;
export const Z_PIVOT_SOUTH = 6;

/** Scale a world-space Z coordinate after the 30 % depth expansion. */
export function scaleWorldZ(z: number): number {
  return Z_PIVOT_SOUTH + (z - Z_PIVOT_SOUTH) * DEPTH_SCALE;
}

/** Scale a room depth (size[2]). */
export function scaleDepth(depth: number): number {
  return depth * DEPTH_SCALE;
}

/** Scale the Z component of a world position tuple. */
export function scalePositionZ<T extends [number, number, number]>(pos: T): T {
  return [pos[0], pos[1], scaleWorldZ(pos[2])] as T;
}

/** Door/wall offset along Z relative to a room centre. */
export function doorOffsetZ(roomCenterZ: number, worldDoorZ: number): number {
  return worldDoorZ - roomCenterZ;
}

/** World position with Z scaled from the pre-expansion layout coordinate. */
export function worldPos(x: number, y: number, layoutZ: number): [number, number, number] {
  return [x, y, scaleWorldZ(layoutZ)];
}
