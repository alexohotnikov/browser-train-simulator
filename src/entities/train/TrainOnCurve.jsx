import { useCallback, useEffect, useRef } from "react";
import { TrainModel } from "./TrainModel";
import { ChaseCamera } from "./ChaseCamera";
import { CabCamera } from "./CabCamera";
import { CarCamera } from "./CarCamera";
import { TopCamera } from "./TopCamera";
import { TrainCars } from "./TrainCars";
import { useTrainPhysics } from "../../features/train/TrainPhysics";
import { AudioManager } from "../../features/audio/AudioManager";
import { SceneBeauty } from "../environment/SceneBeauty";
import { useAudioContext } from "../../shared/hooks/useAudioContext";

export function TrainOnCurve({ curve, uiState }) {
  const { train, speed, isNight, cameraMode, dir, t } = useTrainPhysics(curve, uiState);
  const { getContext } = useAudioContext();
  const carRef = useRef(null);

  const playHorn = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.value = 440;
      g.gain.value = 0.0001;
      o.connect(g).connect(ctx.destination);
      o.start();
      const now = ctx.currentTime;
      g.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
      o.frequency.exponentialRampToValueAtTime(220, now + 0.6);
      g.gain.exponentialRampToValueAtTime(0.00001, now + 1.2);
      o.stop(now + 1.3);
    } catch (error) {
      console.warn('Horn sound failed:', error);
    }
  }, [getContext]);

  useEffect(() => {
    const h = (e) => { if (e.key.toLowerCase() === "h") playHorn(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [playHorn]);

  return (
    <>
      <group ref={train}>
        <TrainModel isNight={isNight} />
      </group>
      <TrainCars 
        curve={curve} 
        trainRef={train} 
        dir={dir}
        trainT={t}
        onCarRefReady={(ref) => { carRef.current = ref; }}
      />
      <ChaseCamera targetRef={train} enabled={cameraMode === 'chase'} speed={speed} />
      <CabCamera targetRef={train} enabled={cameraMode === 'cab'} />
      <CarCamera carRef={carRef.current} enabled={cameraMode === 'car'} />
      <TopCamera targetRef={train} enabled={cameraMode === 'top'} />
      <AudioManager uiState={uiState} speed={speed} />
      {isNight ? (
        <>
          <SceneBeauty isNightGlobal />
          <ambientLight intensity={0.06} />
          <spotLight position={[30, 40, 30]} angle={0.5} intensity={2} castShadow />
        </>
      ) : (
        <>
          <SceneBeauty isNightGlobal={false} />
          <hemisphereLight intensity={0.9} />
          <directionalLight position={[30, 50, 10]} intensity={1.1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        </>
      )}
    </>
  );
}

