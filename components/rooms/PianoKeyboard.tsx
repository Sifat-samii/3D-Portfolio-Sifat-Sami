"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
const NOTES_LEN = NOTES.length;

/** piano-v2 key anchor — matches GLB White/Black template placement. */
const KEY_ANCHOR: [number, number, number] = [10.34, 10.58, -5.03];

const OCTAVES = 9;
const OCTAVE_CODE_OFFSET = 1;
const START_NOTE = "A";
const END_NOTE = "F";

const W_OFF = 0;
const B_OFF = -0.32;
const OCTAVE_POS_OFF = -2.24;

const KEY_LIFT_Y = 0.12;

function isNatural(note: string) {
  return !/#|b/.test(note);
}

function noteInRange(
  midiCode: number,
  octaves: number,
  octaveCodeOffset: number,
  startNote: string,
  endNote: string,
) {
  const startMidi = NOTES.indexOf(startNote as (typeof NOTES)[number]) + NOTES_LEN * octaveCodeOffset;
  const endMidi =
    NOTES.indexOf(endNote as (typeof NOTES)[number]) +
    NOTES_LEN * (octaves - 1 + octaveCodeOffset);
  return midiCode >= startMidi && midiCode <= endMidi;
}

function buildKeyLayout() {
  const white: THREE.Vector3[] = [];
  const black: THREE.Vector3[] = [];

  for (let octave = 0; octave < OCTAVES; octave++) {
    const midiCodeOffset = (octave + OCTAVE_CODE_OFFSET) * NOTES_LEN;
    let kPosOff = 0;

    for (let i = 0; i < NOTES_LEN; i++) {
      const note = NOTES[i];
      const canWhite = isNatural(note);
      const midiCode = midiCodeOffset + i;

      if (i > 0) {
        if (canWhite) {
          kPosOff += W_OFF;
          if (isNatural(NOTES[i - 1])) kPosOff += B_OFF;
        } else {
          kPosOff += B_OFF;
        }
      }

      if (!noteInRange(midiCode, OCTAVES, OCTAVE_CODE_OFFSET, START_NOTE, END_NOTE)) continue;

      const x = kPosOff + octave * OCTAVE_POS_OFF;
      if (canWhite) white.push(new THREE.Vector3(x, KEY_LIFT_Y, 0));
      else black.push(new THREE.Vector3(x, KEY_LIFT_Y + 0.014, -0.006));
    }
  }

  return { white, black };
}

/** Fold back only the keybed fallboard — tight bounds avoid damaging the case curve. */
function openFallboardGeometry(source: THREE.BufferGeometry) {
  const geo = source.clone();
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const hingeY = 10.46;
  const hingeZ = 9.02;
  const angle = 1.72;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    if (x < 0.5 || x > 11.5 || y < 10.44 || y > 10.68 || z < 8.95 || z > 10.15) continue;

    const dy = y - hingeY;
    const dz = z - hingeZ;
    pos.setXYZ(i, x, hingeY + dy * cos - dz * sin, hingeZ + dy * sin + dz * cos);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function applyInstances(mesh: THREE.InstancedMesh, positions: THREE.Vector3[]) {
  const dummy = new THREE.Object3D();
  positions.forEach((p, i) => {
    dummy.position.copy(p);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

type PianoKeyboardProps = {
  anchor: [number, number, number];
  whiteGeometry: THREE.BufferGeometry;
  blackGeometry: THREE.BufferGeometry;
  whiteMaterial: THREE.Material;
  blackMaterial: THREE.Material;
};

function PianoKeyboard({
  anchor,
  whiteGeometry,
  blackGeometry,
  whiteMaterial,
  blackMaterial,
}: PianoKeyboardProps) {
  const layout = useMemo(() => buildKeyLayout(), []);
  const whiteRef = useRef<THREE.InstancedMesh>(null);
  const blackRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (whiteRef.current) applyInstances(whiteRef.current, layout.white);
    if (blackRef.current) applyInstances(blackRef.current, layout.black);
  }, [layout]);

  return (
    <group position={anchor} renderOrder={30}>
      <instancedMesh
        ref={whiteRef}
        args={[whiteGeometry, whiteMaterial, layout.white.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
        renderOrder={31}
      />
      <instancedMesh
        ref={blackRef}
        args={[blackGeometry, blackMaterial, layout.black.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
        renderOrder={32}
      />
    </group>
  );
}

export { KEY_ANCHOR, PianoKeyboard, buildKeyLayout, openFallboardGeometry };
