"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { createBrownLeatherTexture } from "@/lib/guitarTextures";
import { KEY_ANCHOR, PianoKeyboard, openFallboardGeometry } from "@/components/rooms/PianoKeyboard";

/**
 * Baby grand piano — GLB with UV PBR body + instanced keyboard.
 */

const MODEL_PATH = "/models/grand-piano.glb";
const ROOM_SCALE = 1.55;
const MODEL_UNIT_SCALE = 2.4 / 30.49;
const MODEL_YAW = Math.PI;

const WEST_WALL_X = -21.91;
const SOUTH_WALL_Z = 5.91;
const WALL_GAP = 0.55;
const CENTER_INSET_X = 3.0;
const CENTER_INSET_Z = 1.0;
const PIANO_CENTER: [number, number, number] = [
  WEST_WALL_X + WALL_GAP + CENTER_INSET_X + 0.82,
  0.1,
  SOUTH_WALL_Z - WALL_GAP - CENTER_INSET_Z - 0.82,
];
const PIANO_YAW = (3 * Math.PI) / 4 + Math.PI;

const HIDDEN_PARTS = new Set([
  "pianoScreenPlaceholder",
  "metronomeDick",
  "metronomeBod",
  "ambience",
  "White",
  "Black",
]);

function configureAtlasTexture(tex: THREE.Texture, srgb = false) {
  tex.flipY = false;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function createBodyMaterial(maps: {
  diffuse: THREE.Texture;
  metalness: THREE.Texture;
  roughness: THREE.Texture;
  bump: THREE.Texture;
  emissive: THREE.Texture;
}) {
  return new THREE.MeshPhysicalMaterial({
    map: maps.diffuse,
    metalnessMap: maps.metalness,
    roughnessMap: maps.roughness,
    bumpMap: maps.bump,
    emissiveMap: maps.emissive,
    color: new THREE.Color("#5e4535"),
    metalness: 0.38,
    roughness: 0.78,
    bumpScale: 0.018,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0.22,
    clearcoat: 0.9,
    clearcoatRoughness: 0.07,
    envMapIntensity: 0.9,
  });
}

function createWhiteKeyMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#f0ebe2"),
    roughness: 0.44,
    metalness: 0.03,
    clearcoat: 0.28,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.6,
    polygonOffset: true,
    polygonOffsetFactor: -10,
    polygonOffsetUnits: -10,
  });
}

function createBlackKeyMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0c0a08"),
    roughness: 0.36,
    metalness: 0.06,
    clearcoat: 0.32,
    clearcoatRoughness: 0.14,
    envMapIntensity: 0.5,
    polygonOffset: true,
    polygonOffsetFactor: -10,
    polygonOffsetUnits: -10,
  });
}

function createBenchCushionMaterial(leatherMap: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    map: leatherMap,
    color: new THREE.Color("#c8a880"),
    roughness: 0.58,
    metalness: 0.02,
    bumpMap: leatherMap,
    bumpScale: 0.014,
    clearcoat: 0.18,
    clearcoatRoughness: 0.35,
    envMapIntensity: 0.7,
  });
}

/** Split bench mesh — legs/frame vs tufted cushion top. */
function splitBenchGeometry(source: THREE.BufferGeometry, yThreshold = 0.06) {
  const geometry = source.clone();
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const index = geometry.index;
  if (!index) return geometry;

  const legTri: number[] = [];
  const topTri: number[] = [];

  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);
    const avgY = (position.getY(a) + position.getY(b) + position.getY(c)) / 3;
    const bucket = avgY >= yThreshold ? topTri : legTri;
    bucket.push(a, b, c);
  }

  geometry.setIndex([...legTri, ...topTri]);
  geometry.clearGroups();
  geometry.addGroup(0, legTri.length, 0);
  geometry.addGroup(legTri.length, topTri.length, 1);
  return geometry;
}

function removeTemplateMeshes(root: THREE.Object3D) {
  for (const name of ["White", "Black"] as const) {
    const mesh = root.getObjectByName(name);
    mesh?.parent?.remove(mesh);
  }
}

function computeFloorOffset(object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  box.getCenter(center);
  return new THREE.Vector3(-center.x, -box.min.y, -center.z);
}

function GrandPianoModel() {
  const gltf = useGLTF(MODEL_PATH);
  const scene = gltf.scene;
  const leatherTex = useMemo(() => createBrownLeatherTexture(), []);

  useEffect(() => {
    return () => {
      leatherTex.dispose();
    };
  }, [leatherTex]);

  const [diffuse, metalness, roughness, bump, emissive] = useTexture([
    "/models/grand-piano-diffuse.png",
    "/models/grand-piano-metalness.png",
    "/models/grand-piano-roughness-map.png",
    "/models/grand-piano-bump.png",
    "/models/grand-piano-emissive.png",
  ]);

  const assets = useMemo(() => {
    configureAtlasTexture(diffuse, true);
    configureAtlasTexture(metalness);
    configureAtlasTexture(roughness);
    configureAtlasTexture(bump);
    configureAtlasTexture(emissive, true);

    const mapSet = { diffuse, metalness, roughness, bump, emissive };
    const bodyMaterial = createBodyMaterial(mapSet);
    const benchCushionMaterial = createBenchCushionMaterial(leatherTex);
    const whiteKeyMaterial = createWhiteKeyMaterial();
    const blackKeyMaterial = createBlackKeyMaterial();

    const whiteNode = scene.getObjectByName("White") as THREE.Mesh | null;
    const blackNode = scene.getObjectByName("Black") as THREE.Mesh | null;
    const whiteGeometry = whiteNode?.geometry?.clone() ?? new THREE.BoxGeometry(0.25, 0.03, 0.14);
    const blackGeometry = blackNode?.geometry?.clone() ?? new THREE.BoxGeometry(0.16, 0.04, 0.1);

    const body = scene.clone(true);
    removeTemplateMeshes(body);

    const shell = body.getObjectByName("pianoGroupFuck") as THREE.Mesh | null;
    if (shell?.geometry) {
      shell.geometry = openFallboardGeometry(shell.geometry);
    }

    body.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (HIDDEN_PARTS.has(child.name)) {
        child.visible = false;
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.name === "butt") {
        child.geometry = splitBenchGeometry(child.geometry);
        child.material = [bodyMaterial, benchCushionMaterial];
        return;
      }

      child.material = bodyMaterial;
    });

    const pivot = new THREE.Group();
    pivot.rotation.y = MODEL_YAW;
    pivot.add(body);
    pivot.updateMatrixWorld(true);
    const floorOffset = computeFloorOffset(pivot);

    return {
      body,
      floorOffset,
      whiteGeometry,
      blackGeometry,
      whiteKeyMaterial,
      blackKeyMaterial,
    };
  }, [scene, diffuse, metalness, roughness, bump, emissive, leatherTex]);

  const scale = MODEL_UNIT_SCALE * ROOM_SCALE;

  return (
    <group position={PIANO_CENTER} rotation={[0, PIANO_YAW, 0]}>
      <group scale={scale}>
        <group rotation={[0, MODEL_YAW, 0]} position={assets.floorOffset}>
          <primitive object={assets.body} />
          <PianoKeyboard
            anchor={KEY_ANCHOR}
            whiteGeometry={assets.whiteGeometry}
            blackGeometry={assets.blackGeometry}
            whiteMaterial={assets.whiteKeyMaterial}
            blackMaterial={assets.blackKeyMaterial}
          />
        </group>
      </group>
    </group>
  );
}

export function GrandPiano() {
  return (
    <Suspense fallback={null}>
      <GrandPianoModel />
    </Suspense>
  );
}

useGLTF.preload(MODEL_PATH);
