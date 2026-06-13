"use client";

import { RoundedBox } from "@react-three/drei";
import { scaleWorldZ } from "@/lib/roomLayout";
import * as THREE from "three";

/**
 * Media wall — big LED TV + HiFi sound system, centre of the north wall.
 *
 * Placement (north wall, wall inner face z ≈ -6.88):
 *   CX = -14.5  → horizontal centre of the wall
 *   TV : 4.40 m × 2.48 m (16:9) screen, centre y = 2.30 — screen OFF (black)
 *   Below: 3.6 m media console + 2.9 m soundbar + 0.75 m subwoofer
 *   Sides: two floor-standing HiFi towers (≈ 2.3 m tall) at CX ± 3.0
 */

const CX = -14.5;
const WZ = -6.88;

const TV_CY = 2.30;
const TV_W = 4.40;
const TV_H = 2.48;

const CABINET = "#12100e";
const METAL = "#1c1a18";
const GRILLE = "#0a0a0c";
const BAFFLE = "#1a1816";
const BRASS = "#8a7040";

const MEDIA_GROUP_Z = scaleWorldZ(-5.88) - WZ;

const cabinetMat = new THREE.MeshStandardMaterial({
  color: CABINET,
  roughness: 0.68,
  metalness: 0.06,
});

const metalMat = new THREE.MeshStandardMaterial({
  color: METAL,
  metalness: 0.72,
  roughness: 0.32,
});

const grilleMat = new THREE.MeshStandardMaterial({
  color: GRILLE,
  roughness: 0.92,
  metalness: 0.04,
});

const baffleMat = new THREE.MeshStandardMaterial({
  color: BAFFLE,
  roughness: 0.62,
  metalness: 0.08,
});

const brassMat = new THREE.MeshStandardMaterial({
  color: BRASS,
  metalness: 0.88,
  roughness: 0.28,
});

const surroundMat = new THREE.MeshStandardMaterial({
  color: "#1e1e22",
  roughness: 0.78,
  metalness: 0.05,
});

const coneMat = new THREE.MeshStandardMaterial({
  color: "#141418",
  roughness: 0.82,
  metalness: 0.02,
});

const capMat = new THREE.MeshStandardMaterial({
  color: "#2a2a30",
  roughness: 0.48,
  metalness: 0.28,
});

const tweeterMat = new THREE.MeshStandardMaterial({
  color: "#222228",
  metalness: 0.55,
  roughness: 0.34,
});

const screenMat = new THREE.MeshPhysicalMaterial({
  color: "#010102",
  roughness: 0.04,
  metalness: 0.65,
  clearcoat: 0.35,
  clearcoatRoughness: 0.08,
  reflectivity: 0.9,
});

const bezelMat = new THREE.MeshStandardMaterial({
  color: "#0e0e10",
  metalness: 0.55,
  roughness: 0.22,
});

type DriverProps = {
  radius: number;
  surround: number;
  cap?: number;
  segments?: number;
  tweeter?: boolean;
};

/** Layered driver — rubber surround, cone, dust cap. */
function SpeakerDriver({
  position,
  radius,
  surround,
  cap = radius * 0.36,
  segments = 32,
  tweeter = false,
}: DriverProps & { position: [number, number, number] }) {
  if (tweeter) {
    return (
      <group position={position}>
        <mesh rotation={[0, 0, 0]} material={tweeterMat}>
          <torusGeometry args={[radius * 0.82, surround, 10, segments]} />
        </mesh>
        <mesh position={[0, 0, 0.003]} material={tweeterMat}>
          <circleGeometry args={[radius * 0.62, segments]} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh material={surroundMat}>
        <torusGeometry args={[radius * 0.88, surround, 10, segments]} />
      </mesh>
      <mesh position={[0, 0, 0.003]} material={coneMat}>
        <circleGeometry args={[radius * 0.78, segments]} />
      </mesh>
      <mesh position={[0, 0, 0.006]} material={capMat}>
        <circleGeometry args={[cap, Math.max(14, segments - 8)]} />
      </mesh>
    </group>
  );
}

function LedTv() {
  const screenZ = WZ + 0.092;
  const bodyZ = WZ + 0.058;

  return (
    <group>
      <mesh position={[CX, TV_CY, WZ + 0.012]}>
        <boxGeometry args={[1.1, 0.6, 0.024]} />
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.35} />
      </mesh>

      <mesh position={[CX, TV_CY, WZ + 0.028]}>
        <boxGeometry args={[TV_W + 0.18, TV_H + 0.18, 0.008]} />
        <meshStandardMaterial
          color="#080604"
          emissive="#2a1e10"
          emissiveIntensity={0.06}
          roughness={0.85}
        />
      </mesh>

      <RoundedBox
        args={[TV_W + 0.048, TV_H + 0.048, 0.042]}
        radius={0.012}
        smoothness={10}
        position={[CX, TV_CY, bodyZ]}
        material={bezelMat}
        castShadow
      />

      <mesh position={[CX, TV_CY, screenZ]} material={screenMat}>
        <planeGeometry args={[TV_W - 0.02, TV_H - 0.02]} />
      </mesh>

      <mesh position={[CX, TV_CY + TV_H / 2 - 0.018, screenZ + 0.002]}>
        <planeGeometry args={[TV_W * 0.35, 0.004]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.04}
          roughness={0.1}
          metalness={0}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[CX, TV_CY - TV_H / 2 - 0.052, screenZ + 0.002]}>
        <boxGeometry args={[0.34, 0.024, 0.006]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.78} roughness={0.22} />
      </mesh>

      <mesh position={[CX + 0.12, TV_CY - TV_H / 2 - 0.052, screenZ + 0.006]}>
        <boxGeometry args={[0.014, 0.01, 0.004]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#cc2018"
          emissiveIntensity={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function SoundbarUnit() {
  return (
    <group position={[CX, 0.8, -6.56]}>
      <RoundedBox args={[2.9, 0.15, 0.14]} radius={0.038} smoothness={10} material={grilleMat} castShadow />
      {[-1.42, 1.42].map((ox) => (
        <RoundedBox
          key={`cap-${ox}`}
          args={[0.07, 0.155, 0.145]}
          radius={0.02}
          smoothness={8}
          position={[ox, 0, 0]}
          material={metalMat}
        />
      ))}
      {[-0.9, -0.3, 0.3, 0.9].map((ox) => (
        <mesh key={`sb-${ox}`} position={[ox, 0, 0.072]}>
          <circleGeometry args={[0.028, 20]} />
          <meshStandardMaterial color="#18181c" roughness={0.75} metalness={0.08} />
        </mesh>
      ))}
      <mesh position={[1.3, 0, 0.075]}>
        <boxGeometry args={[0.014, 0.014, 0.006]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#22c858" emissiveIntensity={1.2} roughness={0.3} />
      </mesh>
    </group>
  );
}

function SubwooferUnit() {
  return (
    <group position={[CX + 2.3, 0.5, -6.5]}>
      <RoundedBox args={[0.75, 0.75, 0.75]} radius={0.04} smoothness={10} material={cabinetMat} castShadow />
      <mesh position={[0, 0, 0.378]} material={baffleMat}>
        <boxGeometry args={[0.58, 0.58, 0.012]} />
      </mesh>
      <SpeakerDriver position={[0, 0, 0.39]} radius={0.26} surround={0.016} cap={0.09} />
    </group>
  );
}

function TowerSpeaker({ offsetX }: { offsetX: number }) {
  const frontZ = 0.262;

  return (
    <group position={[CX + offsetX, 0, -6.46]}>
      <RoundedBox args={[0.66, 0.08, 0.6]} radius={0.018} smoothness={8} position={[0, 0.16, 0]} material={metalMat} />

      <RoundedBox
        args={[0.54, 2.04, 0.48]}
        radius={0.035}
        smoothness={10}
        position={[0, 1.22, 0]}
        material={cabinetMat}
        castShadow
      />

      <mesh position={[0, 1.22, 0.242]}>
        <boxGeometry args={[0.46, 1.96, 0.01]} />
        <meshStandardMaterial color={GRILLE} roughness={0.94} metalness={0.03} transparent opacity={0.92} />
      </mesh>

      <mesh position={[0, 1.22, 0.248]} material={baffleMat}>
        <boxGeometry args={[0.44, 1.9, 0.008]} />
      </mesh>

      <SpeakerDriver position={[0, 2.04, frontZ]} radius={0.055} surround={0.006} tweeter />
      <SpeakerDriver position={[0, 1.74, frontZ]} radius={0.105} surround={0.011} cap={0.038} />
      <SpeakerDriver position={[0, 1.3, frontZ]} radius={0.16} surround={0.014} cap={0.058} />
      <SpeakerDriver position={[0, 0.8, frontZ]} radius={0.16} surround={0.014} cap={0.058} />

      <RoundedBox
        args={[0.54, 0.022, 0.48]}
        radius={0.008}
        smoothness={8}
        position={[0, 2.3, 0]}
        material={brassMat}
      />
    </group>
  );
}

function MediaConsole() {
  return (
    <group>
      <RoundedBox
        args={[3.6, 0.56, 0.48]}
        radius={0.02}
        smoothness={8}
        position={[CX, 0.4, -6.62]}
        material={cabinetMat}
        castShadow
      />
      <mesh position={[CX, 0.695, -6.62]}>
        <boxGeometry args={[3.74, 0.035, 0.54]} />
        <meshStandardMaterial color="#241a10" roughness={0.55} metalness={0.1} />
      </mesh>
      {[-0.88, 0.88].map((ox) => (
        <mesh key={`door-${ox}`} position={[CX + ox, 0.4, -6.375]}>
          <boxGeometry args={[1.66, 0.44, 0.018]} />
          <meshStandardMaterial color="#0f0c09" roughness={0.65} metalness={0.08} />
        </mesh>
      ))}
      <mesh position={[CX, 0.46, -6.372]}>
        <boxGeometry args={[0.3, 0.025, 0.012]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#ffb030" emissiveIntensity={1.2} roughness={0.3} />
      </mesh>
      {[-1.7, 1.7].map((ox) => (
        <mesh key={`foot-${ox}`} position={[CX + ox, 0.16, -6.62]}>
          <boxGeometry args={[0.08, 0.1, 0.4]} />
          <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function MediaWall() {
  return (
    <group position={[0, 0, MEDIA_GROUP_Z]}>
      <LedTv />
      <MediaConsole />
      <SoundbarUnit />
      <SubwooferUnit />
      <TowerSpeaker offsetX={-3.0} />
      <TowerSpeaker offsetX={3.0} />
    </group>
  );
}
