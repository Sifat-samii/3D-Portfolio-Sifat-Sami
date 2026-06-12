import * as THREE from "three";

export const SCALE_LEN = 0.648;
export const NUT_Y = 0.64;
export const BRIDGE_Y = -0.125;

export const fretY = (n: number) => NUT_Y - (SCALE_LEN - SCALE_LEN / Math.pow(2, n / 12));
export const FRETS = Array.from({ length: 24 }, (_, i) => fretY(i + 1));
export const dotY = (n: number) => (fretY(n - 1) + fretY(n)) / 2;
export const SINGLE_DOTS = [3, 5, 7, 9, 15, 17, 19, 21].map(dotY);
export const fbWidth = (y: number) => 0.06 - (0.06 - 0.044) * ((y - 0.15) / (NUT_Y + 0.01 - 0.15));

const EXTRUDE = {
  bevelEnabled: true,
  bevelThickness: 0.007,
  bevelSize: 0.006,
  bevelSegments: 3,
  curveSegments: 32,
};

/** RG body thickness — slim Iron Label slab. */
export const RG_BODY_DEPTH = 0.032;

/**
 * Ibanez RG double-cutaway — right-handed front (+Z).
 * Deep scooped cutaways, sharp horn tips; longer bass horn on −X.
 */
export const RG_BODY_OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [0, -0.236],
  // Treble lower bout (+X)
  [0.098, -0.220],
  [0.148, -0.182],
  [0.176, -0.122],
  [0.182, -0.058],
  [0.176, 0.002],
  [0.162, 0.052],
  [0.148, 0.082],
  // Treble cutaway scoop (pulls inward before horn)
  [0.132, 0.102],
  [0.114, 0.112],
  [0.096, 0.116],
  // Treble horn — sharp tip
  [0.078, 0.142],
  [0.058, 0.168],
  [0.038, 0.188],
  [0.024, 0.194],
  // Neck pocket
  [0.014, 0.184],
  [0.008, 0.162],
  [0.004, 0.142],
  [0, 0.132],
  [-0.004, 0.142],
  [-0.008, 0.162],
  [-0.014, 0.184],
  // Bass horn — longer, sharper
  [-0.032, 0.206],
  [-0.066, 0.236],
  [-0.108, 0.262],
  [-0.152, 0.278],
  [-0.166, 0.262],
  [-0.154, 0.232],
  // Bass cutaway scoop
  [-0.176, 0.178],
  [-0.186, 0.122],
  [-0.188, 0.062],
  [-0.184, 0.002],
  [-0.174, -0.068],
  [-0.156, -0.134],
  [-0.124, -0.188],
  [-0.074, -0.224],
  [0, -0.236],
] as const;

function traceOutline(points: ReadonlyArray<readonly [number, number]>, target: THREE.Shape | THREE.Path) {
  const [fx, fy] = points[0]!;
  target.moveTo(fx, fy);
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i]!;
    target.lineTo(x, y);
  }
}

export function buildRgBodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  traceOutline(RG_BODY_OUTLINE, s);
  return s;
}

/** Perimeter binding segments — edge-only, avoids solid-fill hole artifacts. */
export function getRgBindingSegments(): Array<{
  pos: [number, number, number];
  size: [number, number, number];
  rotZ: number;
}> {
  const z = 0.0012;
  const segs: Array<{ pos: [number, number, number]; size: [number, number, number]; rotZ: number }> = [];
  for (let i = 0; i < RG_BODY_OUTLINE.length - 1; i++) {
    const [x0, y0] = RG_BODY_OUTLINE[i]!;
    const [x1, y1] = RG_BODY_OUTLINE[i + 1]!;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    if (len < 0.004) continue;
    segs.push({
      pos: [(x0 + x1) / 2, (y0 + y1) / 2, z],
      size: [len + 0.001, 0.0032, 0.0016],
      rotZ: Math.atan2(dy, dx),
    });
  }
  return segs;
}

/**
 * Ibanez RG (RGIR20BFE) — flat-top Superstrat, no bevel (stays angular).
 * Front face at local Z = 0 when positioned with z = −RG_BODY_DEPTH.
 */
export function createRgBodyGeometry() {
  return new THREE.ExtrudeGeometry(buildRgBodyShape(), {
    bevelEnabled: false,
    curveSegments: 1,
    depth: RG_BODY_DEPTH,
  });
}

/** Jackson Randy Rhoads — offset asymmetrical flying V */
export function createRhoadsBodyGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0.06);
  s.lineTo(-0.026, 0.06);
  s.lineTo(-0.11, 0.20);
  s.lineTo(-0.17, 0.16);
  s.lineTo(-0.09, 0.09);
  s.lineTo(-0.11, 0.0);
  s.lineTo(-0.24, -0.30);
  s.lineTo(-0.19, -0.34);
  s.lineTo(-0.07, -0.12);
  s.lineTo(0, -0.14);
  s.lineTo(0.15, -0.24);
  s.lineTo(0.19, -0.19);
  s.lineTo(0.09, -0.05);
  s.lineTo(0.07, 0.09);
  s.lineTo(0.026, 0.06);
  s.lineTo(0, 0.06);
  return new THREE.ExtrudeGeometry(s, { ...EXTRUDE, depth: 0.038 });
}

/** Dean ML Razorback — sharp offset wings + center tail spike */
export function createDeanMlBodyGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0.08);
  s.lineTo(-0.028, 0.08);
  s.lineTo(-0.15, 0.28);
  s.lineTo(-0.22, 0.22);
  s.lineTo(-0.11, 0.07);
  s.lineTo(-0.13, -0.02);
  s.lineTo(-0.28, -0.24);
  s.lineTo(-0.32, -0.19);
  s.lineTo(-0.15, -0.03);
  s.lineTo(-0.05, -0.10);
  s.lineTo(0, -0.16);
  s.lineTo(0.05, -0.10);
  s.lineTo(0.17, -0.20);
  s.lineTo(0.21, -0.15);
  s.lineTo(0.11, 0.01);
  s.lineTo(0.13, 0.15);
  s.lineTo(0.19, 0.24);
  s.lineTo(0.08, 0.07);
  s.lineTo(0.028, 0.08);
  s.lineTo(0, 0.08);
  return new THREE.ExtrudeGeometry(s, { ...EXTRUDE, depth: 0.040 });
}

export function createIbanezHeadGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.022, 0);
  s.lineTo(-0.028, 0.042);
  s.lineTo(-0.030, 0.092);
  s.lineTo(-0.022, 0.138);
  s.lineTo(-0.012, 0.162);
  s.lineTo(0.032, 0.176);
  s.lineTo(0.028, 0.118);
  s.lineTo(0.024, 0.058);
  s.lineTo(0.022, 0);
  s.lineTo(-0.022, 0);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 16,
  });
}

/** Jackson sharp arrow headstock */
export function createJacksonHeadGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.020, 0);
  s.lineTo(-0.024, 0.06);
  s.lineTo(-0.018, 0.12);
  s.lineTo(0.032, 0.178);
  s.lineTo(0.038, 0.150);
  s.lineTo(0.022, 0.055);
  s.lineTo(0.020, 0);
  s.lineTo(-0.020, 0);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 12,
  });
}

/** Dean pointed headstock */
export function createDeanHeadGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.022, 0);
  s.lineTo(-0.028, 0.05);
  s.lineTo(-0.020, 0.11);
  s.lineTo(0.0, 0.168);
  s.lineTo(0.020, 0.11);
  s.lineTo(0.028, 0.05);
  s.lineTo(0.022, 0);
  s.lineTo(-0.022, 0);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 12,
  });
}

export function createFretboardGeometry() {
  const s = new THREE.Shape();
  const yBot = 0.148;
  const yTop = NUT_Y + 0.008;
  s.moveTo(-fbWidth(yBot) / 2, yBot);
  s.lineTo(-fbWidth(yTop) / 2, yTop);
  s.lineTo(fbWidth(yTop) / 2, yTop);
  s.lineTo(fbWidth(yBot) / 2, yBot);
  s.lineTo(-fbWidth(yBot) / 2, yBot);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.012,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.0015,
    bevelSegments: 2,
  });
}

export function createNeckGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.029, 0.146);
  s.lineTo(-0.021, NUT_Y);
  s.lineTo(0.021, NUT_Y);
  s.lineTo(0.029, 0.146);
  s.lineTo(-0.029, 0.146);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
  });
}

/** AANJ heel scoop — bolt-on all-access neck joint (RG Iron Label). */
export function createRgHeelScoopGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.034, 0);
  s.lineTo(-0.034, 0.028);
  s.lineTo(-0.018, 0.038);
  s.lineTo(0.018, 0.038);
  s.lineTo(0.034, 0.028);
  s.lineTo(0.034, 0);
  s.lineTo(-0.034, 0);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.0015,
    bevelSegments: 2,
  });
}
