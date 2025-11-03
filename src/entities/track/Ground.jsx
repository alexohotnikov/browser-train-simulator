import { useMemo, memo } from "react";
import * as THREE from "three";

function GroundComponent() {
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(1200, 1200);
    geom.computeBoundingSphere();
    return geom;
  }, []);
  
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x1a1a1a),
    });
    // Фиксируем все свойства материала
    mat.needsUpdate = false;
    mat.needsProgramUpdate = false;
    mat.envMap = null;
    mat.envMapIntensity = 0;
    mat.toneMapped = false;
    mat.color.convertSRGBToLinear = false;
    return mat;
  }, []);

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow={false}
      frustumCulled={false}
      matrixAutoUpdate={false}
    >
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export const Ground = memo(GroundComponent);

