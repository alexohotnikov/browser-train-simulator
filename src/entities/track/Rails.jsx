import { useMemo } from "react";
import * as THREE from "three";
import { GAUGE } from "../../shared/constants";
import { offsetCurve } from "../../shared/utils/offsetCurve";
import { Sleepers } from "./Sleepers";
import { Ballast } from "./Ballast";

export function Rails({ curve }) {
  const railLeft = useMemo(() => offsetCurve(curve, GAUGE / 2), [curve]);
  const railRight = useMemo(() => offsetCurve(curve, -GAUGE / 2), [curve]);
  
  const railMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    metalness: 0.95,
    roughness: 0.2,
    envMapIntensity: 1.5,
    color: "#b0b6c0",
    flatShading: false,
  }), []);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[railLeft, 1600, 0.035, 8, true]} />
        <primitive object={railMaterial} attach="material" />
      </mesh>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[railRight, 1600, 0.035, 8, true]} />
        <primitive object={railMaterial} attach="material" />
      </mesh>
      <Sleepers curve={curve} />
      <Ballast />
    </group>
  );
}

