import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { OBJCarModel } from "./OBJCarModel";

function FallbackCar() {
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#4a5568",
    metalness: 0.2,
    roughness: 0.6,
    flatShading: false,
  }), []);

  const windowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a1a2e",
    metalness: 0.3,
    roughness: 0.1,
    flatShading: false,
    transparent: true,
    opacity: 0.7,
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

  return (
    <group>
      {/* Основной корпус */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[10, 3.0, 2.6]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      
      {/* Крыша */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[10.2, 0.3, 2.8]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* Окна */}
      {[-3.5, -1.5, 1.5, 3.5].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.8, 1.31]} castShadow>
            <boxGeometry args={[1.2, 1.0, 0.08]} />
            <primitive object={windowMaterial} attach="material" />
          </mesh>
          <mesh position={[x, 1.8, -1.31]} castShadow>
            <boxGeometry args={[1.2, 1.0, 0.08]} />
            <primitive object={windowMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Колеса */}
      {[-4, -2, 2, 4].map((x) => (
        <group key={x} position={[x, -1.5, 0]}>
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
    </group>
  );
}

export function Car() {
  return (
    <Suspense fallback={<FallbackCar />}>
      <OBJCarModel />
    </Suspense>
  );
}

