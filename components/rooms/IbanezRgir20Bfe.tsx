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
  createRgBindingGeometry,
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
const STRING_X = [-0.0205, -0.0123, -0.0041, 0.0041, 0.0123, 0.0205] as const;

const NECK_PU_Y = 0.108;
const BRIDGE_PU_Y = -0.100;

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

function PickupCavity({ y, w = 0.092, h = 0.036 }: { y: number; w?: number; h?: number }) {
  return (
    <mesh position={[0, y, FRONT - 0.003]}>
      <boxGeometry args={[w, h, 0.004]} />
      <meshStandardMaterial color="#1a1410" roughness={0.92} metalness={0.02} />
    </mesh>
  );
}

function EmgPickup({ y }: { y: number }) {
  return (
    <group position={[0, y, FRONT]}>
      <mesh>
        <boxGeometry args={[0.090, 0.036, 0.01]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.48} metalness={0.1} />
      </mesh>
      <mesh position={[0.026, -0.008, 0.0055]}>
        <planeGeometry args={[0.016, 0.005]} />
        <meshBasicMaterial color="#d8d8d8" />
      </mesh>
    </group>
  );
}

function GibraltarBridge() {
  return (
    <group position={[0, BRIDGE_Y, FRONT - 0.001]}>
      <mesh>
        <boxGeometry args={[0.078, 0.026, 0.009]} />
        <meshStandardMaterial color={METAL} metalness={0.74} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.002, 0.005]}>
        <boxGeometry args={[0.072, 0.018, 0.003]} />
        <meshStandardMaterial color="#181818" metalness={0.82} roughness={0.22} />
      </mesh>
      {STRING_X.map((ox) => (
        <group key={ox} position={[ox, 0, 0.006]}>
          <mesh>
            <boxGeometry args={[0.007, 0.012, 0.005]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.78} roughness={0.26} />
          </mesh>
          <mesh position={[0, 0.007, 0.001]}>
            <cylinderGeometry args={[0.0012, 0.0012, 0.003, 6]} />
            <meshStandardMaterial color="#888" metalness={0.88} roughness={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function IronLabelControls() {
  return (
    <group position={[0, 0, FRONT]}>
      <mesh position={[0.078, -0.102, 0]}>
        <cylinderGeometry args={[0.0095, 0.0095, 0.009, 24]} />
        <meshStandardMaterial color={METAL} metalness={0.58} roughness={0.36} />
      </mesh>
      <mesh position={[0.078, -0.102, 0.005]}>
        <cylinderGeometry args={[0.006, 0.006, 0.0015, 20]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.45} roughness={0.42} />
      </mesh>

      <group position={[0.062, -0.124, 0]}>
        <mesh>
          <boxGeometry args={[0.0055, 0.008, 0.006]} />
          <meshStandardMaterial color="#9a9a9a" metalness={0.88} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.094, -0.158, 0]} rotation={[0, 0, -0.42]}>
        <mesh>
          <boxGeometry args={[0.006, 0.024, 0.007]} />
          <meshStandardMaterial color="#9a9a9a" metalness={0.88} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.013, 0.001]}>
          <boxGeometry args={[0.008, 0.011, 0.004]} />
          <meshStandardMaterial color={METAL} metalness={0.4} roughness={0.48} />
        </mesh>
      </group>
    </group>
  );
}

function OutputJack() {
  return (
    <group position={[0.118, -0.192, FRONT - 0.001]} rotation={[0, 0, -0.35]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.006, 14]} />
        <meshStandardMaterial color={METAL} metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.004, 10]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.45} />
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
 * Walnut grain via canvas texture; cream binding; EMG + Gibraltar hardware.
 */
export function IbanezRgir20Bfe({
  finish = IRON_LABEL_FINISH,
  showInlays = false,
}: IbanezRgir20BfeProps) {
  const bodyGeom = useMemo(() => createRgBodyGeometry(), []);
  const bindingGeom = useMemo(() => createRgBindingGeometry(), []);
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

      <mesh geometry={bindingGeom} position={[0, 0, 0.0002]} material={binding} />

      <mesh geometry={neckGeom} position={[0, 0, -0.021]} material={neckMat} />
      <mesh geometry={heelGeom} position={[0, 0.148, -0.018]} material={neckMat} />

      <mesh geometry={fboardGeom} position={[0, 0, -0.001]} material={fretboardMat} />

      <mesh position={[neckBindW / 2 + 0.0012, yMid, 0.011]} material={binding}>
        <boxGeometry args={[0.0022, neckBindLen, 0.002]} />
      </mesh>
      <mesh position={[-neckBindW / 2 - 0.0012, yMid, 0.011]} material={binding}>
        <boxGeometry args={[0.0022, neckBindLen, 0.002]} />
      </mesh>

      <mesh position={[0, NUT_Y, 0.0105]}>
        <boxGeometry args={[0.044, 0.007, 0.007]} />
        <meshStandardMaterial color="#d0ccc4" roughness={0.48} metalness={0.12} />
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
              <cylinderGeometry args={[0.004, 0.004, 0.002, 12]} />
              <meshStandardMaterial color={inlay} roughness={0.55} metalness={0} />
            </mesh>
          ))}
          {[-0.012, 0.012].map((ox, i) => (
            <mesh key={`dot12-${i}`} position={[ox, dotY(12), 0.0125]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.002, 12]} />
              <meshStandardMaterial color={inlay} roughness={0.55} metalness={0} />
            </mesh>
          ))}
        </>
      )}

      <group position={[0, NUT_Y, -0.014]} rotation={[-0.18, 0, 0]}>
        <mesh geometry={headGeom} material={walnut} />

        <mesh position={[-0.002, 0.098, 0.009]} rotation={[0.18, 0, -0.28]} material={logo}>
          <planeGeometry args={[0.112, 0.034]} />
        </mesh>

        <mesh position={[0, 0.022, 0.008]}>
          <boxGeometry args={[0.026, 0.015, 0.0025]} />
          <meshStandardMaterial color={METAL} roughness={0.65} metalness={0.1} />
        </mesh>

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={`tpost-${i}`}
            position={[-0.018, 0.028 + i * 0.0205, 0.008]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.0042, 0.0042, 0.014, 10]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.28} />
          </mesh>
        ))}

        {[0, 1].map((i) => (
          <mesh key={`stree-${i}`} position={[0.008, 0.014 + i * 0.006, 0.009]}>
            <boxGeometry args={[0.014, 0.003, 0.003]} />
            <meshStandardMaterial color={METAL} metalness={0.65} roughness={0.35} />
          </mesh>
        ))}
      </group>

      <PickupCavity y={NECK_PU_Y} />
      <PickupCavity y={BRIDGE_PU_Y} />
      <EmgPickup y={NECK_PU_Y} />
      <EmgPickup y={BRIDGE_PU_Y} />
      <GibraltarBridge />
      <IronLabelControls />
      <OutputJack />

      <mesh position={[0.108, 0.212, 0.007]}>
        <cylinderGeometry args={[0.0048, 0.0048, 0.008, 10]} />
        <meshStandardMaterial color={METAL} metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.238, 0.007]}>
        <cylinderGeometry args={[0.0048, 0.0048, 0.008, 10]} />
        <meshStandardMaterial color={METAL} metalness={0.65} roughness={0.35} />
      </mesh>

      {STRING_X.map((ox, i) => (
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
