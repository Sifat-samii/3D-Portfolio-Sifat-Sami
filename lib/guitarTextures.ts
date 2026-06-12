import * as THREE from "three";

/** Satin walnut flat — vertical grain for RGIR20BFE body / headstock. */
export function createWalnutFlatTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, "#5a3c28");
  grad.addColorStop(0.35, "#6d5040");
  grad.addColorStop(0.65, "#523828");
  grad.addColorStop(1, "#5d4037");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 100; i++) {
    const x = (i / 100) * w + (Math.random() - 0.5) * 2;
    const shades = ["#4a3224", "#7a5848", "#5c4030", "#6a4c38"];
    ctx.globalAlpha = 0.06 + (i % 4) * 0.025;
    ctx.fillStyle = shades[i % shades.length]!;
    ctx.fillRect(x, 0, 1 + (i % 3), h);
  }

  for (let y = 0; y < h; y += 52) {
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = "#3a2818";
    ctx.fillRect(0, y, w, 4);
  }

  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.4, 2.2);
  return tex;
}

/** White Ibanez script for headstock face — no SDF / drei Text. */
export function createIbanezLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(24, 68);
  ctx.rotate(-0.28);
  ctx.fillStyle = "#f4f4ee";
  ctx.font = "italic 700 52px Georgia, 'Times New Roman', serif";
  ctx.fillText("Ibanez", 0, 0);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
