import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CarCamera({ carRef, enabled }) {
  const { camera } = useThree();
  const rotationRef = useRef({ x: 0.3, y: 0 }); // Начальный наклон вниз
  const isDragging = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const onMouseDown = (e) => {
      if (e.button === 0) {
        isDragging.current = true;
      }
    };

    const onMouseMove = (e) => {
      if (!isDragging.current || !enabled) return;

      rotationRef.current.y -= e.movementX * 0.002;
      rotationRef.current.x -= e.movementY * 0.002;
      
      // Ограничиваем вертикальный поворот
      rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [enabled]);

  useFrame(() => {
    if (!enabled || !carRef) return;
    
    // Позиция внутри вагона - на высоте окон (~1.5-2 метра от центра вагона)
    // Используем локальное смещение вверх относительно вагона
    const localUp = new THREE.Vector3(0, 1, 0);
    const worldUp = localUp.applyQuaternion(carRef.quaternion);
    const carHeight = 5.4; // Высота камеры над центром вагона (на уровне окон)
    const carOffset = worldUp.multiplyScalar(carHeight);
    
    // Добавляем смещение вперед по локальной оси X (вдоль вагона)
    const localForward = new THREE.Vector3(1, 0, 0);
    const worldForward = localForward.applyQuaternion(carRef.quaternion);
    const forwardOffset = worldForward.multiplyScalar(1.0); // Смещение вперед
    
    const worldPosition = carRef.position.clone().add(carOffset).add(forwardOffset);
    
    // Направление взгляда из вагона
    const euler = new THREE.Euler(
      rotationRef.current.x,
      carRef.rotation.y + rotationRef.current.y,
      0,
      'YXZ'
    );
    
    camera.position.copy(worldPosition);
    camera.rotation.copy(euler);
  });

  return null;
}

