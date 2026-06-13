"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/** Satin white studio monitor — muted off-white. */
const CABINET = "#c8c2b6";
const CABINET_EDGE = "#b4ada2";
const BAFFLE = "#d2cdc4";
const BAFFLE_RECESS = "#c8c2b8";

/** Desk walnut — matches StudioDesk tabletop. */
const WALNUT = "#2c1c0c";
const WALNUT_LT = "#3e2814";
const REAR = "#2a2a2e";
const PORT = "#141416";
const SURROUND = "#121214";
const WOOFER_CONE = "#1a191c";
const WOOFER_CAP = "#3a3a42";
const TWEETER_HORN = "#1e1e24";
const TWEETER_DOME = "#5c5c66";
const LED = "#a8d4ff";

const cabinetMat = new THREE.MeshStandardMaterial({
  color: CABINET,
  roughness: 0.72,
  metalness: 0.02,
});

const baffleMat = new THREE.MeshStandardMaterial({
  color: BAFFLE,
  roughness: 0.64,
  metalness: 0.03,
});

const baffleRecessMat = new THREE.MeshStandardMaterial({
  color: BAFFLE_RECESS,
  roughness: 0.68,
  metalness: 0.02,
});

const surroundMat = new THREE.MeshStandardMaterial({
  color: SURROUND,
  roughness: 0.86,
  metalness: 0.04,
});

const wooferMat = new THREE.MeshStandardMaterial({
  color: WOOFER_CONE,
  roughness: 0.84,
  metalness: 0.02,
});

const capMat = new THREE.MeshStandardMaterial({
  color: WOOFER_CAP,
  roughness: 0.42,
  metalness: 0.35,
});

const tweeterHornMat = new THREE.MeshStandardMaterial({
  color: TWEETER_HORN,
  roughness: 0.58,
  metalness: 0.12,
});

const tweeterDomeMat = new THREE.MeshStandardMaterial({
  color: TWEETER_DOME,
  roughness: 0.28,
  metalness: 0.72,
});

const walnutMat = new THREE.MeshStandardMaterial({
  color: WALNUT,
  roughness: 0.42,
  metalness: 0.05,
});

const walnutLtMat = new THREE.MeshStandardMaterial({
  color: WALNUT_LT,
  roughness: 0.46,
  metalness: 0.03,
});

type StudioMonitorSpeakerProps = {
  /** Yaw applied by parent stand group */
  frontZ?: number;
};

/** Nearfield studio monitor — satin white cabinet, black drivers. */
export function StudioMonitorSpeaker({ frontZ = 0.162 }: StudioMonitorSpeakerProps) {
  return (
    <group>
      {/* Main cabinet — rounded satin-white shell */}
      <RoundedBox
        args={[0.36, 0.50, 0.32]}
        radius={0.014}
        smoothness={6}
        material={cabinetMat}
        castShadow
      />

      {/* Side edge shadow lines */}
      {[-0.178, 0.178].map((sx) => (
        <mesh key={`edge-${sx}`} position={[sx, 0, 0]}>
          <boxGeometry args={[0.004, 0.46, 0.30]} />
          <meshStandardMaterial color={CABINET_EDGE} roughness={0.78} metalness={0.02} />
        </mesh>
      ))}

      {/* Rear panel */}
      <mesh position={[0, 0, -0.158]}>
        <boxGeometry args={[0.32, 0.44, 0.006]} />
        <meshStandardMaterial color={REAR} roughness={0.62} metalness={0.1} />
      </mesh>
      {/* Bass reflex port */}
      <mesh position={[0, -0.14, -0.162]}>
        <boxGeometry args={[0.10, 0.028, 0.012]} />
        <meshStandardMaterial color={PORT} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Rear power socket cluster */}
      <mesh position={[0.10, 0.02, -0.162]}>
        <boxGeometry args={[0.05, 0.04, 0.008]} />
        <meshStandardMaterial color="#0e0e10" roughness={0.55} metalness={0.35} />
      </mesh>

      {/* Front baffle plate */}
      <mesh position={[0, 0, frontZ]} material={baffleMat}>
        <boxGeometry args={[0.33, 0.47, 0.008]} />
      </mesh>
      {/* Baffle recess ring */}
      <mesh position={[0, 0, frontZ - 0.003]} material={baffleRecessMat}>
        <boxGeometry args={[0.31, 0.45, 0.004]} />
      </mesh>

      {/* Woofer — surround, cone, dust cap */}
      <group position={[0, -0.075, frontZ + 0.006]}>
        <mesh material={surroundMat}>
          <torusGeometry args={[0.105, 0.013, 10, 36]} />
        </mesh>
        <mesh position={[0, 0, 0.002]} material={wooferMat}>
          <circleGeometry args={[0.088, 36]} />
        </mesh>
        <mesh position={[0, 0, 0.004]} material={capMat}>
          <circleGeometry args={[0.034, 20]} />
        </mesh>
      </group>

      {/* Tweeter — waveguide ring + aluminium dome */}
      <group position={[0, 0.135, frontZ + 0.005]}>
        <mesh material={tweeterHornMat}>
          <torusGeometry args={[0.046, 0.008, 8, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.002]} material={tweeterDomeMat}>
          <circleGeometry args={[0.028, 18]} />
        </mesh>
      </group>

      {/* Brand badge */}
      <mesh position={[0, -0.205, frontZ + 0.002]}>
        <boxGeometry args={[0.06, 0.012, 0.003]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Power LED */}
      <mesh position={[0.13, -0.21, frontZ]}>
        <boxGeometry args={[0.008, 0.008, 0.004]} />
        <meshStandardMaterial
          color="#080808"
          emissive={LED}
          emissiveIntensity={1.4}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

/** Floor stand + isolation pad for a studio monitor. */
export function StudioMonitorStand({
  position,
  yaw,
}: {
  position: [number, number, number];
  yaw: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} material={walnutMat}>
        <boxGeometry args={[0.40, 0.04, 0.40]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={walnutMat}>
        <boxGeometry args={[0.10, 1.06, 0.10]} />
      </mesh>
      {/* Grain accents — same stripe language as the desk top */}
      {[-0.14, 0, 0.14].map((oz) => (
        <mesh key={`st-gr-${oz}`} position={[0.051, 0.55, oz]} material={walnutLtMat}>
          <boxGeometry args={[0.002, 1.02, 0.018]} />
        </mesh>
      ))}
      <mesh position={[0, 1.095, 0]}>
        <boxGeometry args={[0.32, 0.035, 0.30]} />
        <meshStandardMaterial color="#242220" roughness={0.94} metalness={0.0} />
      </mesh>
      <group position={[0, 1.36, 0]} rotation={[0, yaw, 0]}>
        <StudioMonitorSpeaker />
      </group>
    </group>
  );
}
