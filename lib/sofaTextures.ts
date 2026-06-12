import * as THREE from "three";

/** Chunky wool weave — single-hue; luminance variation only. */
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

  for (let y = 0; y < size; y += 4) {
    shade(8, 6, 4, 0.12);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }

  for (let x = 0; x < size; x += 4) {
    shade(-6, -5, -4, 0.10);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, size);
    ctx.stroke();
  }

  for (let i = 0; i < 2200; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const v = Math.random() > 0.5 ? 12 : -10;
    ctx.fillStyle = `rgba(${r + v},${g + v},${b + v},0.08)`;
    ctx.fillRect(px, py, 1.5, 1.5);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}
