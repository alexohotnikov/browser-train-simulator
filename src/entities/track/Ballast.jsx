import { useMemo } from "react";
import * as THREE from "three";

export function Ballast() {
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#777",
    roughness: 1,
    flatShading: false,
  }), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[220, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

