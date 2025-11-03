import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three";
import * as THREE from "three";
import trainObjPath from "./models/train/11709_train_v1_L3.obj?url";
import trainMtlPath from "./models/train/11709_train_v1_L3.mtl?url";

// Импортируем текстуры
import textureWood from "./models/train/11709_train_wood_diff.jpg?url";
import textureWoodBlue from "./models/train/11709_train_wood_blue_diff.jpg?url";
import textureWoodBlack from "./models/train/11709_train_wood_black_diff.jpg?url";

export function OBJTrainModel() {
  // Загружаем материалы
  const materials = useLoader(MTLLoader, trainMtlPath);
  
  // Загружаем текстуры через useLoader
  const woodTexture = useLoader(TextureLoader, textureWood);
  const woodBlueTexture = useLoader(TextureLoader, textureWoodBlue);
  const woodBlackTexture = useLoader(TextureLoader, textureWoodBlack);
  
  // Настраиваем текстуры после загрузки
  useMemo(() => {
    if (woodTexture) {
      woodTexture.flipY = false;
      woodTexture.colorSpace = THREE.SRGBColorSpace;
    }
    if (woodBlueTexture) {
      woodBlueTexture.flipY = false;
      woodBlueTexture.colorSpace = THREE.SRGBColorSpace;
    }
    if (woodBlackTexture) {
      woodBlackTexture.flipY = false;
      woodBlackTexture.colorSpace = THREE.SRGBColorSpace;
    }
    return null; // useMemo должен возвращать значение
  }, [woodTexture, woodBlueTexture, woodBlackTexture]);

  // Загружаем OBJ модель
  const obj = useLoader(OBJLoader, trainObjPath, (loader) => {
    if (materials) {
      loader.setMaterials(materials);
    }
  });

  // Клонируем объект и настраиваем
  const trainModel = useMemo(() => {
    if (!obj || !materials) return null;
    
    const cloned = obj.clone();
    
    // Создаем маппинг текстур к материалам
    const textureMap = {
      wood: woodTexture,
      wood_dark_blue: woodBlueTexture,
      wood_black: woodBlackTexture,
    };
    
    // Настраиваем тени и применяем текстуры к материалам
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Применяем текстуры к материалам
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat && mat.name) {
                const texture = textureMap[mat.name];
                if (texture) {
                  // Присваиваем текстуру напрямую
                  mat.map = texture;
                  mat.needsUpdate = true;
                  // Включаем текстуру
                  if (mat.map) {
                    mat.map.needsUpdate = true;
                  }
                }
              }
            });
          } else if (child.material && child.material.name) {
            const mat = child.material;
            const texture = textureMap[mat.name];
            if (texture) {
              // Присваиваем текстуру напрямую
              mat.map = texture;
              mat.needsUpdate = true;
              // Включаем текстуру
              if (mat.map) {
                mat.map.needsUpdate = true;
              }
            }
          }
        }
      }
    });

    // Вычисляем bounding box для автоматического масштабирования
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    
    // Нормализуем модель: цель - локомотив длиной ~12 метров
    const targetLength = 12;
    const scaleFactor = targetLength / Math.max(size.x, size.y, size.z);
    // Уменьшаем масштаб еще больше, так как модель слишком большая
    cloned.scale.set(scaleFactor * 0.5, scaleFactor * 0.5, scaleFactor * 0.5);
    
    // Выравниваем модель: поворачиваем чтобы она стояла на рельсах
    // Если модель лежит на боку, поворачиваем вокруг оси X
    cloned.rotation.x = -Math.PI / 2; // Поворот чтобы модель стояла вертикально
    cloned.rotation.y = 0; // Убираем поворот по Y если не нужен
    cloned.rotation.z = 0;
    
    // Пересчитываем bounding box после поворота
    box.setFromObject(cloned);
    
    // Поднимаем модель чтобы она стояла на рельсах (высота рельсов примерно 0.1-0.2)
    // Используем минимальную Y координату bounding box
    const minY = box.min.y;
    cloned.position.y = -minY + 0.15; // Поднимаем модель так чтобы низ был на уровне рельсов
    
    return cloned;
  }, [obj, materials, woodTexture, woodBlueTexture, woodBlackTexture]);

  if (!trainModel) return null;

  return <primitive object={trainModel} castShadow receiveShadow />;
}

