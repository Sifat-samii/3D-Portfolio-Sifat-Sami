import type { Vector3Tuple } from "@/types/portfolio";

export function distance3(a: Vector3Tuple, b: Vector3Tuple) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Horizontal (XZ) distance — ignores Y drift from animated interactables. */
export function distanceXZ(a: Vector3Tuple, b: Vector3Tuple) {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];

  return Math.sqrt(dx * dx + dz * dz);
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
