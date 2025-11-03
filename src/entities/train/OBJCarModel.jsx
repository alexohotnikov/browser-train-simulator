import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import * as THREE from "three";
import carObjPath from "./models/train-car/11811_Lumber_car_v1_L1.obj?url";
import carMtlPath from "./models/train-car/11811_Lumber_car_v1_L1.mtl?url";

export function OBJCarModel() {
  // Загружаем материалы
  const materials = useLoader(MTLLoader, carMtlPath);
  
  // Создаем текстуры для материалов
  useMemo(() => {
    if (materials) {
      materials.preload();
      // Убеждаемся что текстуры загружены
      materials.materialsArray?.forEach((material) => {
        if (material.map) {
          material.map.flipY = false;
        }
      });
    }
  }, [materials]);

  // Загружаем OBJ модель
  const obj = useLoader(OBJLoader, carObjPath, (loader) => {
    if (materials) {
      loader.setMaterials(materials);
    }
  });

  // Клонируем объект и настраиваем
  const carModel = useMemo(() => {
    if (!obj) return null;
    
    const cloned = obj.clone();
    
    // Настраиваем тени и материалы
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Убеждаемся что материалы правильно настроены
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat) {
                mat.needsUpdate = true;
              }
            });
          } else if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      }
    });

    // Вычисляем bounding box для автоматического масштабирования
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    
    // Нормализуем модель: цель - вагон длиной ~10 метров (как старая модель)
    const targetLength = 10;
    const scaleFactor = targetLength / Math.max(size.x, size.y, size.z);
    // Увеличиваем масштаб - вагоны должны быть больше
    cloned.scale.set(scaleFactor * 1.5, scaleFactor * 1.5, scaleFactor * 1.5);
    
    // Выравниваем модель: поворачиваем чтобы она стояла на рельсах
    cloned.rotation.x = -Math.PI / 2; // Поворот чтобы модель стояла вертикально
    cloned.rotation.y = 0;
    cloned.rotation.z = 0;
    
    // Пересчитываем bounding box после поворота
    box.setFromObject(cloned);
    
    // Поднимаем модель чтобы она стояла на рельсах
    const minY = box.min.y;
    cloned.position.y = -minY + 0.15; // Поднимаем модель так чтобы низ был на уровне рельсов
    
    return cloned;
  }, [obj]);

  if (!carModel) return null;

  return <primitive object={carModel} castShadow receiveShadow />;
}

