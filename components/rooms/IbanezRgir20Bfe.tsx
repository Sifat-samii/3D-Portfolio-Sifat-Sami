"use client";

import { createIbanezLogoTexture, createWalnutFlatTexture } from "@/lib/guitarTextures";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  BRIDGE_Y,
  FRETS,
  NUT_Y,
  RG_BODY_DEPTH,
  SINGLE_DOTS,
  createFretboardGeometry,
  createIbanezHeadGeometry,
  createNeckGeometry,
  createRgBodyGeometry,
  getRgBindingSegments,
  createRgHeelScoopGeometry,
  dotY,
  fbWidth,
} from "@/lib/guitarShapes";

export type IbanezIronLabelFinish = {
  body: string;
  neck: string;
  fretboard: string;
  inlay?: string;
};

export const WALNUT_FLAT_FINISH: IbanezIronLabelFinish = {
  body: "#5d4037",
  neck: "#4a3224",
  fretboard: "#241810",
};

export const IRON_LABEL_FINISH = WALNUT_FLAT_FINISH;

const METAL = "#0a0a0a";
const BINDING = "#f0ece4";
const STEEL = "#c8c4bc";
const STEEL_WOUND = "#8a8274";

const BODY_Z = -RG_BODY_DEPTH;
const FRONT = 0.008;

const NECK_PU_Y = 0.112;
const BRIDGE_PU_Y = -0.096;

function useWalnutMaterials() {
  const walnutTex = useMemo(() => createWalnutFlatTexture(), []);
  const logoTex = useMemo(() => createIbanezLogoTexture(), []);

  useEffect(() => {
    return () => {
      walnutTex.dispose();
      logoTex.dispose();
    };
  }, [walnutTex, logoTex]);

  const walnut = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: walnutTex,
        color: "#f0e0d0",
        roughness: 0.68,
        metalness: 0.02,
      }),
    [walnutTex],
  );

  const binding = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: BINDING,
        roughness: 0.62,
        metalness: 0.02,
      }),
    [],
  );

  const logo = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: logoTex,
        transparent: true,
        roughness: 0.55,
        metalness: 0,
        depthWrite: false,
      }),
    [logoTex],
  );

  return { walnut, binding, logo };
}

function EmgPickup({ y }: { y: number }) {
  return (
    <group position={[0, y, FRONT]}>
      <mesh>
        <boxGeometry args={[0.084, 0.032, 0.009]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.52} metalness={0.08} />
      </mesh>
      <mesh position={[0.028, -0.007, 0.005]}>
        <planeGeometry args={[0.016, 0.005]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>
    </group>
  );
}

function GibraltarBridge() {
  return (
    <group position={[0, BRIDGE_Y, FRONT - 0.001]}>
      <mesh>
        <boxGeometry args={[0.074, 0.024, 0.008]} />
        <meshStandardMaterial color={METAL} metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.068, 0.016, 0.0025]} />
        <meshStandardMaterial color="#141414" metalness={0.8} roughness={0.24} />
      </mesh>
      {[-0.0205, -0.0123, -0.0041, 0.0041, 0.0123, 0.0205].map((ox) => (
        <mesh key={ox} position={[ox, 0, 0.006]}>
          <boxGeometry args={[0.006, 0.011, 0.004]} />
          <meshStandardMaterial color={METAL} metalness={0.74} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function IronLabelControls() {
  return (
    <group position={[0, 0, FRONT]}>
      <mesh position={[0.070, -0.100, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.008, 20]} />
        <meshStandardMaterial color={METAL} metalness={0.58} roughness={0.36} />
      </mesh>
      <group position={[0.054, -0.116, 0]}>
        <mesh>
          <cylinderGeometry args={[0.005, 0.005, 0.009, 10]} />
          <meshStandardMaterial color="#141414" metalness={0.45} roughness={0.42} />
        </mesh>
        <mesh position={[0.003, 0.005, 0.001]} rotation={[0, 0, 0.28]}>
          <boxGeometry args={[0.0025, 0.007, 0.003]} />
          <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
      <group position={[0.080, -0.154, 0]} rotation={[0, 0, -0.4]}>
        <mesh>
          <boxGeometry args={[0.0055, 0.022, 0.006]} />
          <meshStandardMaterial color="#9a9a9a" metalness={0.88} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.012, 0.001]}>
          <boxGeometry args={[0.007, 0.01, 0.004]} />
          <meshStandardMaterial color={METAL} metalness={0.4} roughness={0.48} />
        </mesh>
      </group>
      <mesh position={[0.124, -0.184, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0065, 0.0065, 0.0035, 12]} />
        <meshStandardMaterial color="#888" metalness={0.85} roughness={0.22} />
      </mesh>
    </group>
  );
}

type IbanezRgir20BfeProps = {
  finish?: IbanezIronLabelFinish;
  showInlays?: boolean;
};

/**
 * RGIR20BFE Walnut Flat — local +Y neck, front hardware on +Z.
 * Walnut grain via canvas texture; binding is one ring mesh (no face grid).
 */
export function IbanezRgir20Bfe({
  finish = IRON_LABEL_FINISH,
  showInlays = false,
}: IbanezRgir20BfeProps) {
  const bodyGeom = useMemo(() => createRgBodyGeometry(), []);
  const bindingSegs = useMemo(() => getRgBindingSegments(), []);
  const headGeom = useMemo(() => createIbanezHeadGeometry(), []);
  const fboardGeom = useMemo(() => createFretboardGeometry(), []);
  const neckGeom = useMemo(() => createNeckGeometry(), []);
  const heelGeom = useMemo(() => createRgHeelScoopGeometry(), []);

  const { walnut, binding, logo } = useWalnutMaterials();

  const fretboardMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: finish.fretboard,
        roughness: 0.84,
        metalness: 0.01,
      }),
    [finish.fretboard],
  );

  const neckMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: finish.neck,
        roughness: 0.76,
        metalness: 0.02,
      }),
    [finish.neck],
  );

  const inlay = finish.inlay ?? "#e8e2d4";
  const yMid = (0.148 + NUT_Y) / 2;
  const neckBindLen = NUT_Y - 0.145;
  const neckBindW = fbWidth(0.35);

  return (
    <group>
      <mesh geometry={bodyGeom} position={[0, 0, BODY_Z]} material={walnut} castShadow receiveShadow />

      {bindingSegs.map((seg, i) => (
        <mesh
          key={`bind-${i}`}
          position={seg.pos}
          rotation={[0, 0, seg.rotZ]}
          material={binding}
        >
          <boxGeometry args={seg.size} />
        </mesh>
      ))}

      <mesh geometry={neckGeom} position={[0, 0, -0.020]} material={neckMat} />
      <mesh geometry={heelGeom} position={[0, 0.148, -0.017]} material={neckMat} />

      <mesh geometry={fboardGeom} position={[0, 0, -0.001]} material={fretboardMat} />

      <mesh position={[neckBindW / 2 + 0.001, yMid, 0.011]} material={binding}>
        <boxGeometry args={[0.002, neckBindLen, 0.0018]} />
      </mesh>
      <mesh position={[-neckBindW / 2 - 0.001, yMid, 0.011]} material={binding}>
        <boxGeometry args={[0.002, neckBindLen, 0.0018]} />
      </mesh>

      <mesh position={[0, NUT_Y, 0.0105]}>
        <boxGeometry args={[0.043, 0.007, 0.007]} />
        <meshStandardMaterial color={METAL} roughness={0.55} metalness={0.15} />
      </mesh>

      {FRETS.map((y, i) => (
        <mesh key={`fret-${i}`} position={[0, y, 0.012]}>
          <boxGeometry args={[fbWidth(y) - 0.003, 0.003, 0.003]} />
          <meshStandardMaterial color="#b0aca4" metalness={0.72} roughness={0.25} />
        </mesh>
      ))}

      {showInlays && (
        <>
          {SINGLE_DOTS.map((y, i) => (
            <mesh key={`dot-${i}`} position={[0, y, 0.0125]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.002, 10]} />
              <meshStandardMaterial color={inlay} roughness={0.55} metalness={0} />
            </mesh>
          ))}
          {[-0.012, 0.012].map((ox, i) => (
            <mesh key={`dot12-${i}`} position={[ox, dotY(12), 0.0125]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.002, 10]} />
              <meshStandardMaterial color={inlay} roughness={0.55} metalness={0} />
            </mesh>
          ))}
        </>
      )}

      <mesh geometry={headGeom} position={[0, NUT_Y, -0.015]} material={walnut} />

      <mesh position={[-0.002, NUT_Y + 0.095, 0.007]} rotation={[0, 0, -0.28]} material={logo}>
        <planeGeometry args={[0.11, 0.032]} />
      </mesh>

      <mesh position={[0, NUT_Y + 0.021, 0.006]}>
        <boxGeometry args={[0.024, 0.014, 0.0025]} />
        <meshStandardMaterial color={METAL} roughness={0.65} metalness={0.1} />
      </mesh>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={`tpost-${i}`}
          position={[-0.017, NUT_Y + 0.027 + i * 0.0205, 0.006]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.004, 0.004, 0.013, 8]} />
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.28} />
        </mesh>
      ))}

      <EmgPickup y={NECK_PU_Y} />
      <EmgPickup y={BRIDGE_PU_Y} />
      <GibraltarBridge />
      <IronLabelControls />

      <mesh position={[-0.150, 0.272, 0.007]}>
        <cylinderGeometry args={[0.0045, 0.0045, 0.007, 10]} />
        <meshStandardMaterial color={METAL} metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.230, 0.007]}>
        <cylinderGeometry args={[0.0045, 0.0045, 0.007, 10]} />
        <meshStandardMaterial color={METAL} metalness={0.65} roughness={0.35} />
      </mesh>

      {[-0.0205, -0.0123, -0.0041, 0.0041, 0.0123, 0.0205].map((ox, i) => (
        <mesh key={`str-${i}`} position={[ox, (NUT_Y + BRIDGE_Y) / 2, 0.016]}>
          <boxGeometry args={[i < 3 ? 0.002 : 0.0013, NUT_Y - BRIDGE_Y, 0.001]} />
          <meshStandardMaterial
            color={i < 3 ? STEEL_WOUND : STEEL}
            metalness={0.88}
            roughness={0.16}
          />
        </mesh>
      ))}
    </group>
  );
}
