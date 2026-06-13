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

/** Tufted brown leather — piano bench cushion top. */
export function createBrownLeatherTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#7a5538");
  grad.addColorStop(0.45, "#9a7048");
  grad.addColorStop(1, "#6b4a32");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 90; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.globalAlpha = 0.04 + Math.random() * 0.05;
    ctx.strokeStyle = i % 2 === 0 ? "#4a3020" : "#b08858";
    ctx.lineWidth = 0.5 + Math.random();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8 + Math.random() * 14, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }

  for (let i = 0; i < 3; i++) {
    const cx = w * (0.28 + i * 0.22);
    const cy = h * 0.5;
    const r = 14;
    const spot = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    spot.addColorStop(0, "#4a3020");
    spot.addColorStop(0.55, "#7a5538");
    spot.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = spot;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.2, 1.2);
  return tex;
}

/** Horizontal grain — polished dark walnut lacquer for grand piano case. */
export function createPremiumPianoWoodTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#1a0f08");
  grad.addColorStop(0.3, "#2a180d");
  grad.addColorStop(0.55, "#3a2414");
  grad.addColorStop(0.8, "#241610");
  grad.addColorStop(1, "#1c1008");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 140; i++) {
    const y = (i / 140) * h + (Math.random() - 0.5) * 1.5;
    const shades = ["#120a06", "#4a3020", "#2e1c10", "#5c3c28", "#1e1208"];
    ctx.globalAlpha = 0.05 + (i % 5) * 0.018;
    ctx.fillStyle = shades[i % shades.length]!;
    ctx.fillRect(0, y, w, 1 + (i % 2));
  }

  for (let x = 0; x < w; x += 64) {
    ctx.globalAlpha = 0.025;
    ctx.fillStyle = "#0e0804";
    ctx.fillRect(x, 0, 3, h);
  }

  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.4, 1.6);
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
