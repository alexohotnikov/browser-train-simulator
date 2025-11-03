import { useMemo } from "react";
import * as THREE from "three";
import { SpeedLimitSign } from "./SpeedLimitSign";
import { SPEED_LIMIT_ZONES } from "../../shared/hooks/useSpeedLimitScoring";

export function Scenery({ curve }) {
  const trees = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 24; i++) {
      const u = (i / 24) + Math.random() * 0.1;
      const pos = curve.getPointAt(u % 1);
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 20;
      positions.push({
        x: pos.x + Math.cos(angle) * dist,
        z: pos.z + Math.sin(angle) * dist,
      });
    }
    return positions;
  }, [curve]);

  const trunkMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#4a2c1a",
    flatShading: false,
  }), []);

  const foliageMaterials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: "#24461a", roughness: 0.8, flatShading: false }),
    new THREE.MeshStandardMaterial({ color: "#2d5016", roughness: 0.8, flatShading: false }),
    new THREE.MeshStandardMaterial({ color: "#355e1e", roughness: 0.8, flatShading: false }),
  ], []);

  return (
    <group>
      {trees.map((tree, i) => {
        const scale = 0.8 + (i % 5) * 0.05;
        const foliageMat = foliageMaterials[i % 3];
        return (
          <group key={i} position={[tree.x, 0, tree.z]} scale={scale}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 2, 10]} />
              <primitive object={trunkMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 2, 0]} castShadow>
              <coneGeometry args={[1.6, 3.2, 12]} />
              <primitive object={foliageMat} attach="material" />
            </mesh>
          </group>
        );
      })}
      {SPEED_LIMIT_ZONES.map((zone, i) => (
        <SpeedLimitSign 
          key={i} 
          curve={curve} 
          position={zone.start} 
          limit={zone.limit}
        />
      ))}
    </group>
  );
}

