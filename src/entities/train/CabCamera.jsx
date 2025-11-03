import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CabCamera({ targetRef, enabled }) {
  const { camera } = useThree();
  const rotationRef = useRef({ x: 0, y: 0 });
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
    if (!enabled || !targetRef.current) return;
    
    const obj = targetRef.current;
    
    // Позиция кабины - внутри локомотива, на высоте кабины машиниста
    // Используем локальное смещение вверх относительно объекта
    const localUp = new THREE.Vector3(0, 1, 0);
    const worldUp = localUp.applyQuaternion(obj.quaternion);
    const cabHeight = 5.8; // Высота кабины машиниста над центром объекта
    const cabOffset = worldUp.multiplyScalar(cabHeight);
    
    // Добавляем смещение вперед по локальной оси X (вдоль локомотива)
    const localForward = new THREE.Vector3(1, 0, 0);
    const worldForward = localForward.applyQuaternion(obj.quaternion);
    const forwardOffset = worldForward.multiplyScalar(1.5); // Смещение вперед
    
    const cabPosition = obj.position.clone().add(cabOffset).add(forwardOffset);
    
    // Направление взгляда из кабины
    const euler = new THREE.Euler(
      rotationRef.current.x,
      obj.rotation.y + rotationRef.current.y,
      0,
      'YXZ'
    );
    
    camera.position.copy(cabPosition);
    camera.rotation.copy(euler);
  });

  return null;
}

