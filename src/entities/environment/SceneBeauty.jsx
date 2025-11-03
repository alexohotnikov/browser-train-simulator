import { useMemo } from "react";
import { Sky, Environment, Stars } from "@react-three/drei";

export function SceneBeauty({ isNightGlobal = false }) {
  return useMemo(() => (
    <group>
      {!isNightGlobal ? (
        <>
          <Sky distance={450000} sunPosition={[50, 60, 20]} turbidity={6} rayleigh={2} mieCoefficient={0.007} mieDirectionalG={0.95} inclination={0.49} azimuth={0.25} />
          <Environment preset="sunset" background blur={0.6} />
        </>
      ) : (
        <>
          <Environment preset="night" background blur={0.6} />
          <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade />
        </>
      )}
    </group>
  ), [isNightGlobal]);
}

