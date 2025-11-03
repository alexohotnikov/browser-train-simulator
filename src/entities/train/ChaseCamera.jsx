import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function ChaseCamera({ targetRef, enabled, speed }) {
  const { camera } = useThree();
  useFrame((_, dt) => {
    if (!enabled || !targetRef.current) return;
    const obj = targetRef.current;
    const speedValue = speed || 0;
    const distance = 8 + Math.abs(speedValue) * 0.2;
    const height = 2.8 + Math.abs(speedValue) * 0.1;
    const behind = new THREE.Vector3(0, height, distance).applyQuaternion(obj.quaternion);
    const desired = obj.position.clone().add(behind);
    camera.position.lerp(desired, 1 - Math.exp(-8 * dt));
    const look = obj.position.clone().addScaledVector(new THREE.Vector3(1, 0.2, 0).applyQuaternion(obj.quaternion), 5);
    camera.lookAt(look);
  });
  return null;
}

