import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { OBJTrainModel } from "./OBJTrainModel";

function FallbackTrainModel({ isNight }) {
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1976d2",
    metalness: 0.2,
    roughness: 0.6,
    flatShading: false,
  }), []);

  const cabinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1565c0",
    flatShading: false,
  }), []);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#333",
    metalness: 0.8,
    roughness: 0.2,
    flatShading: false,
  }), []);

  const wheelInnerMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    flatShading: false,
  }), []);

  const lightMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    emissive: "#fff",
    emissiveIntensity: isNight ? 2 : 0.8,
    flatShading: false,
  }), [isNight]);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[12, 3.2, 2.8]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      <mesh position={[-2, 2.2, 0]} castShadow>
        <boxGeometry args={[4, 2, 2.6]} />
        <primitive object={cabinMaterial} attach="material" />
      </mesh>
      {[-3, -1, 1, 3, 5].map((x) => (
        <group key={x} position={[x, -1.6, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
            <primitive object={wheelMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.55, 0.55, 0.02, 16]} />
            <primitive object={wheelInnerMaterial} attach="material" />
          </mesh>
        </group>
      ))}
      <spotLight 
        position={[6.2, 1.2, 0]} 
        intensity={isNight ? 8 : 2}
        angle={Math.PI / 6}
        penumbra={0.3}
        castShadow={isNight}
      />
      <mesh position={[6.2, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <primitive object={lightMaterial} attach="material" />
      </mesh>
      {isNight && (
        <mesh position={[6.9, 1.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[2.2, 6, 28, 1, true]} />
          <meshBasicMaterial color="#ffffcc" transparent opacity={0.08} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export function TrainModel({ isNight }) {
  return (
    <Suspense fallback={<FallbackTrainModel isNight={isNight} />}>
      <OBJTrainModel />
    </Suspense>
  );
}

