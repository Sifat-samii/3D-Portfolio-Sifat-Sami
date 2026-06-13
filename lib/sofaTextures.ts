import * as THREE from "three";

/** Fine bouclé weave — premium upholstery with soft loop texture. */
export function createBoucleTexture(base = "#b0a898"): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  const r = parseInt(base.slice(1, 3), 16);
  const g = parseInt(base.slice(3, 5), 16);
  const b = parseInt(base.slice(5, 7), 16);

  for (let i = 0; i < 2200; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const rad = 0.8 + Math.random() * 1.6;
    const v = Math.random() > 0.5 ? 14 : -12;
    ctx.fillStyle = `rgba(${r + v},${g + v},${b + v},${0.08 + Math.random() * 0.12})`;
    ctx.beginPath();
    ctx.arc(px, py, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let y = 0; y < size; y += 8) {
    ctx.strokeStyle = `rgba(${r + 8},${g + 6},${b + 4},0.04)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3.5, 3.5);
  return tex;
}

/** Fine linen weave — low-contrast, smooth upholstery read. */
export function createWoolTexture(base = "#e8e0d4"): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  const r = parseInt(base.slice(1, 3), 16);
  const g = parseInt(base.slice(3, 5), 16);
  const b = parseInt(base.slice(5, 7), 16);

  const shade = (dr: number, dg: number, db: number, alpha: number) => {
    ctx.strokeStyle = `rgba(${r + dr},${g + dg},${b + db},${alpha})`;
  };

  for (let y = 0; y < size; y += 6) {
    shade(5, 4, 3, 0.05);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }

  for (let x = 0; x < size; x += 6) {
    shade(-4, -3, -2, 0.04);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, size);
    ctx.stroke();
  }

  for (let i = 0; i < 900; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const v = Math.random() > 0.5 ? 6 : -5;
    ctx.fillStyle = `rgba(${r + v},${g + v},${b + v},0.035)`;
    ctx.fillRect(px, py, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

/** Warm travertine marble — soft veins for tabletop surfaces. */
export function createMarbleTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const grad = ctx.createRadialGradient(size * 0.45, size * 0.42, size * 0.05, size * 0.5, size * 0.5, size * 0.72);
  grad.addColorStop(0, "#f2ece4");
  grad.addColorStop(0.55, "#e6ddd2");
  grad.addColorStop(1, "#d8cec2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const vein = (x1: number, y1: number, x2: number, y2: number, width: number, alpha: number) => {
    ctx.strokeStyle = `rgba(122, 104, 88, ${alpha})`;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(
      x1 + (x2 - x1) * 0.35 + 30,
      y1 + (y2 - y1) * 0.2 - 20,
      x1 + (x2 - x1) * 0.65 - 25,
      y1 + (y2 - y1) * 0.8 + 15,
      x2,
      y2,
    );
    ctx.stroke();
  };

  vein(40, 420, 470, 80, 5, 0.14);
  vein(80, 60, 430, 460, 3.5, 0.1);
  vein(300, 500, 520, 180, 2.5, 0.08);
  vein(20, 200, 280, 40, 2, 0.07);
  vein(350, 30, 180, 350, 2.2, 0.06);

  for (let i = 0; i < 1800; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const v = Math.random() > 0.5 ? 5 : -4;
    ctx.fillStyle = `rgba(${226 + v},${218 + v},${206 + v},0.04)`;
    ctx.fillRect(px, py, 1.2, 1.2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.15, 1.15);
  return tex;
}
