import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function TopCamera({ targetRef, enabled }) {
  const { camera } = useThree();
  const enabledTimeRef = useRef(0);
  const timeoutRef = useRef(2.0); // Таймаут в секундах перед возвратом камеры
  
  useEffect(() => {
    if (enabled) {
      enabledTimeRef.current = performance.now() / 1000; // Время активации в секундах
    }
  }, [enabled]);
  
  useFrame((_, dt) => {
    if (!enabled || !targetRef.current) return;
    
    const obj = targetRef.current;
    const currentTime = performance.now() / 1000;
    const timeSinceEnabled = currentTime - enabledTimeRef.current;
    
    // Позиция камеры сверху поезда с большим отступом
    const localUp = new THREE.Vector3(0, 1, 0);
    const worldUp = localUp.applyQuaternion(obj.quaternion);
    const height = 50; // Высота над поездом
    
    // Смещение вверх
    const upOffset = worldUp.multiplyScalar(height);
    
    // Позиция камеры прямо над поездом
    const topPosition = obj.position.clone().add(upOffset);
    
    // Начинаем возврат камеры только после таймаута
    if (timeSinceEnabled >= timeoutRef.current) {
      const lerpSpeed = 5.0; // Более медленное плавное движение
      camera.position.lerp(topPosition, 1 - Math.exp(-lerpSpeed * dt));
    }
    
    // Камера всегда смотрит вниз на поезд
    const lookAtPosition = obj.position.clone();
    camera.lookAt(lookAtPosition);
    
    // Устанавливаем камеру вертикально сверху (без наклона)
    camera.up.set(0, 1, 0);
  });
  
  return null;
}

