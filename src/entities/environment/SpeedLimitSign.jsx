import { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export function SpeedLimitSign({ curve, position, limit }) {
  const signPos = useMemo(() => curve.getPointAt(position), [curve, position]);
  const tangent = useMemo(() => curve.getTangentAt(position), [curve, position]);
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(up, tangent).normalize();
  
  const redMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ff0000",
    flatShading: false,
  }), []);

  const whiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffffff",
    flatShading: false,
  }), []);
  
  return (
    <group position={signPos}>
      <group position={[0, 2.5, 0]}>
        <mesh position={right.clone().multiplyScalar(2)}>
          <boxGeometry args={[0.1, 1.5, 1]} />
          <primitive object={redMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.51]}>
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <primitive object={whiteMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.56]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <primitive object={redMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.61]}>
          <boxGeometry args={[0.6, 0.6, 0.1]} />
          <primitive object={whiteMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.66]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <primitive object={redMaterial} attach="material" />
        </mesh>
        {limit && (
          <Text
            position={[0, 0, 0.62]}
            fontSize={0.35}
            color="#000000"
            anchorX="center"
            anchorY="center"
            renderOrder={10}
          >
            {limit}
          </Text>
        )}
      </group>
    </group>
  );
}

