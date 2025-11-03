import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeys } from "../../shared/hooks/useKeys";
import { useSpeedLimitScoring } from "../../shared/hooks/useSpeedLimitScoring";
import {
  MAX_TRACTIVE_EFFORT,
  TRAIN_MASS,
  ROLLING_RESIST_C,
  AERO_DRAG_CD,
  FRONTAL_AREA,
  AIR_RHO,
  SERVICE_BRAKE_MAX,
  EMERGENCY_BRAKE_MAX,
  MAX_SPEED,
} from "../../shared/constants";

export function useTrainPhysics(curve, uiState) {
  const train = useRef();
  const length = useMemo(() => curve.getLength(), [curve]);
  const keys = useKeys();
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [dir, setDir] = useState(1);
  const [cameraMode, setCameraMode] = useState('chase'); // 'chase' | 'cab' | 'car' | 'top'
  const [isNight, setIsNight] = useState(false);

  // Система подсчёта баллов за соблюдение ограничений скорости
  const { score, currentLimit } = useSpeedLimitScoring(t, speed, uiState);

  useEffect(() => {
    function toggle(e) {
      if (e.key.toLowerCase() === "r") setDir((d) => -d);
      if (e.key === "1") setIsNight(false);
      if (e.key === "2") setIsNight(true);
      if (e.key.toLowerCase() === "c") {
        // Циклическое переключение: chase -> cab -> car -> top -> chase
        setCameraMode((mode) => {
          if (mode === 'chase') return 'cab';
          if (mode === 'cab') return 'car';
          if (mode === 'car') return 'top';
          return 'chase';
        });
      }
      if (e.key.toLowerCase() === "x") uiState.current.throttle = 0;
    }
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, [uiState]);

  useFrame((_, dt) => {
    if (keys["w"]) uiState.current.throttle = Math.min(1, uiState.current.throttle + dt * 0.6);
    if (keys["s"]) uiState.current.throttle = Math.max(-0.2, uiState.current.throttle - dt * 0.6);
    if (keys["b"]) uiState.current.brake = Math.min(1, uiState.current.brake + dt * 1.0);
    if (keys["n"]) uiState.current.brake = Math.max(0, uiState.current.brake - dt * 1.0);
    uiState.current.emergency = !!keys[" "];
    if (keys[" "]) uiState.current.brake = Math.min(1, uiState.current.brake + dt * 1.5);

    const v = speed;
    const sign = Math.sign(v || dir);
    const te = MAX_TRACTIVE_EFFORT * uiState.current.throttle * sign;
    const aero = 0.5 * AIR_RHO * AERO_DRAG_CD * FRONTAL_AREA * v * v * sign;
    const rolling = (ROLLING_RESIST_C * (TRAIN_MASS / 1000)) * sign;

    const brakeG = uiState.current.emergency ? EMERGENCY_BRAKE_MAX : SERVICE_BRAKE_MAX * uiState.current.brake;
    const brake = brakeG * 9.81 * TRAIN_MASS * sign;

    let force = te - aero - rolling - brake;
    const maxAccel = 0.35 * 9.81;
    force = THREE.MathUtils.clamp(force, -TRAIN_MASS * maxAccel, TRAIN_MASS * maxAccel);

    let a = force / TRAIN_MASS;
    let newV = v + a * dt;
    newV = Math.max(Math.min(newV, MAX_SPEED), -MAX_SPEED);
    if (Math.abs(newV) < 0.02 && Math.abs(uiState.current.throttle) < 0.01 && uiState.current.brake > 0.2) newV = 0;

    setSpeed(newV);

    const ds = newV * dt * dir;
    const du = ds / length;
    setT((u) => (u + du + 1) % 1);

    const pos = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    train.current.position.copy(pos);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), tan);
    train.current.quaternion.slerp(q, 1);

    uiState.current.speed = newV * 3.6;
    uiState.current.t = t;
    uiState.current.dir = dir;
    uiState.current.cameraMode = cameraMode;
    uiState.current.speedLimit = currentLimit;
    uiState.current.score = score;
  });

  return { train, speed, isNight, cameraMode, dir, t };
}

