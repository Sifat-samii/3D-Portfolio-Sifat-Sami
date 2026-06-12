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
 * +X = treble (player's right); −X = bass. Sides are nearly mirrored;
 * bass horn extends only slightly further than treble (authentic but balanced).
 */
export const RG_BODY_OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [0, -0.238],
  // Treble lower bout (+X)
  [0.062, -0.228],
  [0.118, -0.202],
  [0.158, -0.162],
  [0.182, -0.108],
  [0.192, -0.048],
  [0.190, 0.010],
  [0.178, 0.060],
  [0.160, 0.096],
  [0.142, 0.112],
  // Treble cutaway scoop
  [0.122, 0.122],
  [0.100, 0.126],
  [0.088, 0.120],
  // Treble upper horn
  [0.092, 0.148],
  [0.110, 0.178],
  [0.118, 0.202],
  [0.112, 0.214],
  [0.094, 0.210],
  [0.068, 0.192],
  [0.040, 0.172],
  [0.016, 0.154],
  [0, 0.142],
  // Bass side (−X) — pulled in to match treble proportions
  [-0.016, 0.154],
  [-0.040, 0.172],
  [-0.068, 0.192],
  [-0.094, 0.210],
  [-0.112, 0.214],
  [-0.118, 0.202],
  [-0.110, 0.178],
  [-0.092, 0.148],
  // Bass cutaway scoop
  [-0.088, 0.120],
  [-0.100, 0.126],
  [-0.122, 0.122],
  [-0.142, 0.112],
  [-0.160, 0.096],
  [-0.178, 0.060],
  [-0.190, 0.010],
  [-0.192, -0.048],
  [-0.182, -0.108],
  [-0.158, -0.162],
  [-0.118, -0.202],
  [-0.062, -0.228],
  [0, -0.238],
] as const;

export function buildRgBodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  const p = RG_BODY_OUTLINE;

  s.moveTo(p[0]![0], p[0]![1]);

  // Treble lower bout: smooth quadratic arcs instead of a jagged polyline
  s.quadraticCurveTo(0.128, -0.218, p[3]![0], p[3]![1]);
  s.quadraticCurveTo(0.198, -0.078, p[6]![0], p[6]![1]);
  s.quadraticCurveTo(0.198, 0.038, p[9]![0], p[9]![1]);

  // Cutaway scoop + horn on +X
  s.quadraticCurveTo(0.108, 0.118, p[12]![0], p[12]![1]);
  s.quadraticCurveTo(0.122, 0.192, p[15]![0], p[15]![1]);
  s.quadraticCurveTo(0.078, 0.218, p[18]![0], p[18]![1]);
  s.quadraticCurveTo(0.024, 0.158, p[21]![0], p[21]![1]);

  // Bass (−X) from neck centre — mirrored treble proportions
  s.quadraticCurveTo(-0.024, 0.158, p[24]![0], p[24]![1]);
  s.quadraticCurveTo(-0.122, 0.192, p[27]![0], p[27]![1]);
  s.quadraticCurveTo(-0.078, 0.218, p[30]![0], p[30]![1]);
  s.quadraticCurveTo(-0.198, 0.038, p[33]![0], p[33]![1]);
  s.quadraticCurveTo(-0.198, -0.078, p[36]![0], p[36]![1]);
  s.quadraticCurveTo(-0.128, -0.218, p[39]![0], p[39]![1]);
  s.quadraticCurveTo(-0.048, -0.238, p[42]![0], p[42]![1]);

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
    curveSegments: 20,
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
