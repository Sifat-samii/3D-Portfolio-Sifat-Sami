"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Dark studio floor mat — rounded rectangle with rubber backing,
 * woven pile surface, and stitched border. Sits on the ash carpet
 * in front of the workstation area.
 */

const CX = -14.5;
const CZ = 3.9;
const MAT_W = 5.0;
const MAT_D = 2.8;
const CORNER_R = 0.22;
const THICKNESS = 0.014;

function roundedRectShape(halfW: number, halfD: number, r: number) {
  const s = new THREE.Shape();
  const x0 = -halfW;
  const y0 = -halfD;
  const x1 = halfW;
  const y1 = halfD;

  s.moveTo(x0 + r, y0);
  s.lineTo(x1 - r, y0);
  s.quadraticCurveTo(x1, y0, x1, y0 + r);
  s.lineTo(x1, y1 - r);
  s.quadraticCurveTo(x1, y1, x1 - r, y1);
  s.lineTo(x0 + r, y1);
  s.quadraticCurveTo(x0, y1, x0, y1 - r);
  s.lineTo(x0, y0 + r);
  s.quadraticCurveTo(x0, y0, x0 + r, y0);

  return s;
}

function createMatWeaveTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Base charcoal pile
  ctx.fillStyle = "#1c1c24";
  ctx.fillRect(0, 0, size, size);

  // Cross-weave fibres
  for (let y = 0; y < size; y += 3) {
    ctx.strokeStyle = y % 6 === 0 ? "#262630" : "#181820";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }
  for (let x = 0; x < size; x += 3) {
    ctx.strokeStyle = x % 6 === 0 ? "#222228" : "#15151c";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, size);
    ctx.stroke();
  }

  // Subtle noise speckle
  for (let i = 0; i < 2800; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const v = Math.random() > 0.5 ? 38 : 18;
    ctx.fillStyle = `rgba(${v},${v},${v + 6},0.35)`;
    ctx.fillRect(px, py, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 5.6);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function StudioFloorMat() {
  const weaveMap = useMemo(() => createMatWeaveTexture(), []);

  const backingGeom = useMemo(() => {
    const shape = roundedRectShape(MAT_W / 2 + 0.04, MAT_D / 2 + 0.04, CORNER_R + 0.04);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.006,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.003,
      bevelSegments: 2,
      curveSegments: 24,
    });
  }, []);

  const bodyGeom = useMemo(() => {
    const shape = roundedRectShape(MAT_W / 2, MAT_D / 2, CORNER_R);
    return new THREE.ExtrudeGeometry(shape, {
      depth: THICKNESS,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 3,
      curveSegments: 28,
    });
  }, []);

  const stitchGeom = useMemo(() => {
    const inset = 0.14;
    const shape = roundedRectShape(MAT_W / 2 - inset, MAT_D / 2 - inset, CORNER_R - 0.06);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.002,
      bevelEnabled: false,
      curveSegments: 24,
    });
  }, []);

  const matY = 0.125;

  return (
    <group position={[CX, matY, CZ]}>
      {/* Rubber backing — slightly larger, peeks out as a thin rim */}
      <mesh geometry={backingGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.004, 0]}>
        <meshStandardMaterial color="#0a0a0e" roughness={0.92} metalness={0.04} />
      </mesh>

      {/* Main mat body — rounded, bevelled edges */}
      <mesh geometry={bodyGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <meshStandardMaterial
          color="#1e1e26"
          map={weaveMap ?? undefined}
          roughness={0.94}
          metalness={0.0}
          bumpMap={weaveMap ?? undefined}
          bumpScale={0.0018}
        />
      </mesh>

      {/* Double stitched border ring */}
      <mesh geometry={stitchGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, THICKNESS + 0.003, 0]}>
        <meshStandardMaterial color="#2a2a34" roughness={0.88} metalness={0.02} />
      </mesh>
      <mesh
        geometry={stitchGeom}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, THICKNESS + 0.0045, 0]}
        scale={[0.992, 1, 0.992]}
      >
        <meshStandardMaterial color="#333340" roughness={0.85} metalness={0.03} />
      </mesh>

      {/* Fine pile direction lines (subtle brushed-fabric look) */}
      {Array.from({ length: 42 }, (_, i) => {
        const z = -MAT_D / 2 + 0.12 + i * ((MAT_D - 0.24) / 41);
        return (
          <mesh key={`pile-${i}`} position={[0, THICKNESS + 0.005, z]}>
            <boxGeometry args={[MAT_W - 0.50, 0.0008, 0.012]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#242430" : "#1a1a22"}
              roughness={0.96}
              metalness={0.0}
            />
          </mesh>
        );
      })}
    </group>
  );
}
