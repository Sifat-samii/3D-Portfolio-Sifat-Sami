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

export function createRgBodyGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0.0, -0.228);
  s.bezierCurveTo(0.095, -0.226, 0.152, -0.175, 0.164, -0.095);
  s.bezierCurveTo(0.170, -0.035, 0.148, 0.015, 0.136, 0.058);
  s.bezierCurveTo(0.126, 0.098, 0.116, 0.135, 0.112, 0.182);
  s.lineTo(0.097, 0.172);
  s.bezierCurveTo(0.083, 0.118, 0.058, 0.102, 0.037, 0.102);
  s.lineTo(0.030, 0.188);
  s.lineTo(-0.030, 0.188);
  s.lineTo(-0.039, 0.102);
  s.bezierCurveTo(-0.064, 0.103, -0.094, 0.124, -0.107, 0.186);
  s.lineTo(-0.127, 0.234);
  s.lineTo(-0.139, 0.212);
  s.bezierCurveTo(-0.153, 0.128, -0.163, 0.048, -0.168, -0.022);
  s.bezierCurveTo(-0.172, -0.105, -0.138, -0.192, -0.083, -0.216);
  s.bezierCurveTo(-0.048, -0.228, -0.018, -0.228, 0.0, -0.228);
  return new THREE.ExtrudeGeometry(s, { ...EXTRUDE, depth: 0.042 });
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
  s.bezierCurveTo(-0.030, 0.035, -0.034, 0.085, -0.027, 0.130);
  s.lineTo(-0.016, 0.158);
  s.lineTo(0.030, 0.172);
  s.bezierCurveTo(0.026, 0.115, 0.022, 0.055, 0.021, 0.0);
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
  s.moveTo(-0.026, 0.16);
  s.lineTo(-0.020, NUT_Y);
  s.lineTo(0.020, NUT_Y);
  s.lineTo(0.026, 0.16);
  s.lineTo(-0.026, 0.16);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 3,
  });
}
