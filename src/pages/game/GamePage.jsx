import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, StatsGl } from "@react-three/drei";
import * as THREE from "three";
import { useBaseCurve } from "../../shared/hooks/useBaseCurve";
import { Rails } from "../../entities/track/Rails";
import { Scenery } from "../../entities/environment/Scenery";
import { TrainOnCurve } from "../../entities/train/TrainOnCurve";
import { HUD } from "../../widgets/hud/HUD";
import { ControlsPanel } from "../../widgets/controls/ControlsPanel";

export function GamePage() {
  const uiState = useRef({ throttle: 0, brake: 0, emergency: false, speed: 0 });
  const baseCurve = useBaseCurve();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [0, 6, 20], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.shadowMap.needsUpdate = false;
          gl.physicallyCorrectLights = true;
        }}
      >
        <fog attach="fog" args={["#0a0d10", 80, 600]} />
        <Rails curve={baseCurve} />
        <Scenery curve={baseCurve} />
        <TrainOnCurve curve={baseCurve} uiState={uiState} />
        <OrbitControls enablePan={false} enableDamping dampingFactor={0.05} />
        <StatsGl className="md:block" />
      </Canvas>

      <HUD uiState={uiState} />
      <ControlsPanel uiState={uiState} />
    </div>
  );
}

