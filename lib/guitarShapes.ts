import * as THREE from "three";

export const SCALE_LEN = 0.648;
export const NUT_Y = 0.64;
export const BRIDGE_Y = -0.125;

export const fretY = (n: number) => NUT_Y - (SCALE_LEN - SCALE_LEN / Math.pow(2, n / 12));
export const FRETS = Array.from({ length: 24 }, (_, i) => fretY(i + 1));
export const dotY = (n: number) => (fretY(n - 1) + fretY(n)) / 2;
export const SINGLE_DOTS = [3, 5, 7, 9, 15, 17, 19, 21].map(dotY);
export const fbWidth = (y: number) => 0.06 - (0.06 - 0.044) * ((y - 0.15) / (NUT_Y + 0.01 - 0.15));

/** V-body extrude — lighter edge bevel keeps wings sharp but smooths the outline. */
const V_EXTRUDE = {
  bevelEnabled: true,
  bevelThickness: 0.005,
  bevelSize: 0.004,
  bevelSegments: 2,
  curveSegments: 28,
};

/** RG body thickness — slim Iron Label slab. */
export const RG_BODY_DEPTH = 0.032;

/**
 * Ibanez RGIR20BFE body anchors — traced from product reference (front +Z).
 * +X treble, −X bass. Long sharp horns, deep cutaway scoops, full lower bout.
 */
export const RG_BODY_OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [0, -0.244],
  [0.102, -0.234],
  [0.174, -0.192],
  [0.206, -0.128],
  [0.212, -0.052],
  [0.202, 0.022],
  [0.178, 0.072],
  [0.148, 0.108],
  [0.112, 0.124],
  [0.086, 0.114],
  [0.078, 0.096],
  [0.094, 0.138],
  [0.108, 0.184],
  [0.110, 0.212],
  [0.092, 0.214],
  [0.048, 0.198],
  [0, 0.148],
  [-0.048, 0.202],
  [-0.100, 0.218],
  [-0.114, 0.214],
  [-0.104, 0.184],
  [-0.088, 0.138],
  [-0.076, 0.096],
  [-0.086, 0.114],
  [-0.112, 0.124],
  [-0.148, 0.108],
  [-0.178, 0.072],
  [-0.202, 0.022],
  [-0.212, -0.052],
  [-0.206, -0.128],
  [-0.174, -0.192],
  [-0.102, -0.234],
  [0, -0.244],
] as const;

const RG_SHAPE_CENTROID: readonly [number, number] = [0, -0.048];

export function buildRgBodyShape(): THREE.Shape {
  const s = new THREE.Shape();

  s.moveTo(0, -0.244);

  // Treble lower bout — full belly, slightly offset waist
  s.bezierCurveTo(0.112, -0.238, 0.202, -0.196, 0.208, -0.112);
  s.bezierCurveTo(0.214, -0.038, 0.202, 0.038, 0.176, 0.086);

  // Treble cutaway — deep AANJ scoop
  s.bezierCurveTo(0.148, 0.114, 0.114, 0.126, 0.090, 0.114);
  s.bezierCurveTo(0.076, 0.098, 0.090, 0.142, 0.106, 0.188);

  // Treble horn — long Iron Label tip
  s.bezierCurveTo(0.114, 0.212, 0.102, 0.216, 0.086, 0.212);
  s.quadraticCurveTo(0.042, 0.198, 0, 0.148);

  // Bass horn — longer asymmetric tip
  s.quadraticCurveTo(-0.046, 0.206, -0.102, 0.218);
  s.bezierCurveTo(-0.116, 0.216, -0.108, 0.190, -0.094, 0.168);
  s.bezierCurveTo(-0.080, 0.132, -0.070, 0.094, -0.082, 0.112);
  s.bezierCurveTo(-0.104, 0.126, -0.140, 0.116, -0.172, 0.090);
  s.bezierCurveTo(-0.202, 0.042, -0.214, -0.034, -0.208, -0.108);
  s.bezierCurveTo(-0.202, -0.196, -0.112, -0.238, 0, -0.244);

  return s;
}

function buildRgBodyShapeInset(inset: number): THREE.Shape {
  const [cx, cy] = RG_SHAPE_CENTROID;
  const source = buildRgBodyShape().getPoints(72);
  const s = new THREE.Shape();

  source.forEach((pt, i) => {
    const x = cx + (pt.x - cx) * inset;
    const y = cy + (pt.y - cy) * inset;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  });

  return s;
}

/** Cream binding ring — continuous extruded strip (no spike artifacts). */
export function createRgBindingGeometry() {
  const outer = buildRgBodyShape();
  outer.holes.push(buildRgBodyShapeInset(0.988));
  return new THREE.ExtrudeGeometry(outer, {
    depth: 0.0022,
    bevelEnabled: false,
    curveSegments: 28,
  });
}

/** @deprecated Use createRgBindingGeometry — kept for outline sampling only. */
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
    curveSegments: 28,
    depth: RG_BODY_DEPTH,
  });
}

/**
 * Jackson Randy Rhoads — offset asymmetrical V.
 * Signature upward bass horn, long bass wing, shorter treble wing.
 */
function buildRhoadsBodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0.058);

  // Bass shoulder → upward horn bulge
  s.bezierCurveTo(-0.014, 0.058, -0.032, 0.060, -0.052, 0.056);
  s.bezierCurveTo(-0.082, 0.072, -0.108, 0.142, -0.132, 0.192);
  s.bezierCurveTo(-0.152, 0.218, -0.168, 0.198, -0.156, 0.168);
  s.bezierCurveTo(-0.122, 0.122, -0.092, 0.094, -0.072, 0.078);
  s.bezierCurveTo(-0.082, 0.042, -0.092, 0.008, -0.086, -0.022);

  // Bass lower wing — dramatic down-left sweep
  s.bezierCurveTo(-0.132, -0.118, -0.194, -0.228, -0.238, -0.312);
  s.bezierCurveTo(-0.248, -0.338, -0.222, -0.332, -0.202, -0.302);
  s.bezierCurveTo(-0.148, -0.228, -0.092, -0.158, -0.054, -0.112);
  s.bezierCurveTo(-0.028, -0.082, -0.010, -0.062, 0, -0.066);

  // Treble lower wing — shorter, down-right
  s.bezierCurveTo(0.062, -0.132, 0.122, -0.212, 0.166, -0.262);
  s.bezierCurveTo(0.186, -0.282, 0.176, -0.258, 0.156, -0.228);
  s.bezierCurveTo(0.114, -0.158, 0.078, -0.092, 0.056, -0.042);
  s.bezierCurveTo(0.046, 0.008, 0.050, 0.062, 0.036, 0.080);
  s.bezierCurveTo(0.020, 0.070, 0.010, 0.062, 0, 0.058);

  return s;
}

/** Gibson-style symmetric Flying V — equal swept wings. */
function buildFlyingVBodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0.100);

  // Bass wing
  s.bezierCurveTo(-0.022, 0.100, -0.042, 0.096, -0.056, 0.084);
  s.bezierCurveTo(-0.102, 0.042, -0.152, -0.038, -0.212, -0.162);
  s.bezierCurveTo(-0.236, -0.252, -0.246, -0.312, -0.242, -0.336);
  s.bezierCurveTo(-0.232, -0.346, -0.202, -0.324, -0.176, -0.284);
  s.bezierCurveTo(-0.132, -0.224, -0.086, -0.172, -0.050, -0.142);
  s.bezierCurveTo(-0.024, -0.116, -0.008, -0.102, 0, -0.096);

  // Treble wing — mirror
  s.bezierCurveTo(0.008, -0.102, 0.024, -0.116, 0.050, -0.142);
  s.bezierCurveTo(0.086, -0.172, 0.132, -0.224, 0.176, -0.284);
  s.bezierCurveTo(0.202, -0.324, 0.232, -0.346, 0.242, -0.336);
  s.bezierCurveTo(0.246, -0.312, 0.236, -0.252, 0.212, -0.162);
  s.bezierCurveTo(0.152, -0.038, 0.102, 0.042, 0.056, 0.084);
  s.bezierCurveTo(0.042, 0.096, 0.022, 0.100, 0, 0.100);

  return s;
}

/** Dean ML Razorback — tall bass horn, center tail spike, offset treble wing. */
function buildDeanMlBodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0.080);

  // Bass shoulder → tall left horn
  s.bezierCurveTo(-0.016, 0.080, -0.034, 0.076, -0.052, 0.068);
  s.bezierCurveTo(-0.096, 0.132, -0.142, 0.242, -0.166, 0.272);
  s.bezierCurveTo(-0.182, 0.286, -0.196, 0.262, -0.182, 0.232);
  s.bezierCurveTo(-0.142, 0.162, -0.102, 0.096, -0.076, 0.066);
  s.bezierCurveTo(-0.092, 0.030, -0.102, -0.006, -0.096, -0.036);

  // Bass lower wing
  s.bezierCurveTo(-0.172, -0.132, -0.252, -0.212, -0.302, -0.252);
  s.bezierCurveTo(-0.316, -0.262, -0.302, -0.242, -0.276, -0.212);
  s.bezierCurveTo(-0.206, -0.152, -0.132, -0.082, -0.066, -0.042);
  s.bezierCurveTo(-0.040, -0.026, -0.020, -0.052, 0, -0.082);

  // Center tail spike
  s.bezierCurveTo(0.020, -0.118, 0.042, -0.156, 0.066, -0.176);
  s.bezierCurveTo(0.082, -0.186, 0.072, -0.168, 0.056, -0.144);

  // Treble lower wing
  s.bezierCurveTo(0.112, -0.186, 0.172, -0.216, 0.202, -0.226);
  s.bezierCurveTo(0.216, -0.216, 0.206, -0.196, 0.182, -0.170);
  s.bezierCurveTo(0.132, -0.116, 0.096, -0.064, 0.076, -0.022);

  // Treble upper horn
  s.bezierCurveTo(0.106, 0.062, 0.142, 0.172, 0.172, 0.232);
  s.bezierCurveTo(0.186, 0.252, 0.172, 0.242, 0.146, 0.212);
  s.bezierCurveTo(0.102, 0.152, 0.066, 0.096, 0.046, 0.076);
  s.bezierCurveTo(0.030, 0.080, 0.014, 0.080, 0, 0.080);

  return s;
}

/** Jackson Randy Rhoads — offset asymmetrical flying V */
export function createRhoadsBodyGeometry() {
  return new THREE.ExtrudeGeometry(buildRhoadsBodyShape(), { ...V_EXTRUDE, depth: 0.038 });
}

/** Gibson-style symmetric Flying V — classic V wings. */
export function createFlyingVBodyGeometry() {
  return new THREE.ExtrudeGeometry(buildFlyingVBodyShape(), { ...V_EXTRUDE, depth: 0.036 });
}

/** Dean ML Razorback — sharp offset wings + center tail spike */
export function createDeanMlBodyGeometry() {
  return new THREE.ExtrudeGeometry(buildDeanMlBodyShape(), { ...V_EXTRUDE, depth: 0.040 });
}

export function createIbanezHeadGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.024, 0);
  s.bezierCurveTo(-0.030, 0.028, -0.034, 0.058, -0.038, 0.092);
  s.quadraticCurveTo(-0.040, 0.128, -0.034, 0.158);
  s.quadraticCurveTo(-0.022, 0.178, 0.006, 0.186);
  s.quadraticCurveTo(0.042, 0.182, 0.046, 0.152);
  s.bezierCurveTo(0.048, 0.118, 0.042, 0.072, 0.038, 0.038);
  s.quadraticCurveTo(0.032, 0.018, 0.026, 0);
  s.lineTo(-0.024, 0);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.0025,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 24,
  });
}

/** Jackson sharp arrow headstock */
export function createJacksonHeadGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.020, 0);
  s.bezierCurveTo(-0.024, 0.032, -0.022, 0.072, -0.016, 0.112);
  s.bezierCurveTo(-0.008, 0.146, 0.014, 0.172, 0.040, 0.184);
  s.lineTo(0.044, 0.158);
  s.bezierCurveTo(0.034, 0.102, 0.026, 0.056, 0.020, 0);
  s.lineTo(-0.020, 0);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 20,
  });
}

/** Dean pointed headstock */
export function createDeanHeadGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.022, 0);
  s.bezierCurveTo(-0.028, 0.034, -0.026, 0.082, -0.018, 0.122);
  s.quadraticCurveTo(-0.008, 0.156, 0, 0.174);
  s.quadraticCurveTo(0.008, 0.156, 0.018, 0.122);
  s.bezierCurveTo(0.026, 0.082, 0.028, 0.034, 0.022, 0);
  s.lineTo(-0.022, 0);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 20,
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
  s.moveTo(-0.030, 0.146);
  s.quadraticCurveTo(-0.026, 0.42, -0.021, NUT_Y);
  s.lineTo(0.021, NUT_Y);
  s.quadraticCurveTo(0.026, 0.42, 0.030, 0.146);
  s.lineTo(-0.030, 0.146);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.0025,
    bevelSize: 0.002,
    bevelSegments: 2,
    curveSegments: 12,
  });
}

/** AANJ heel scoop — bolt-on all-access neck joint (RG Iron Label). */
export function createRgHeelScoopGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.038, 0);
  s.quadraticCurveTo(-0.040, 0.016, -0.034, 0.028);
  s.quadraticCurveTo(-0.022, 0.042, 0, 0.046);
  s.quadraticCurveTo(0.022, 0.042, 0.034, 0.028);
  s.quadraticCurveTo(0.040, 0.016, 0.038, 0);
  s.lineTo(-0.038, 0);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.0015,
    bevelSegments: 2,
    curveSegments: 16,
  });
}
