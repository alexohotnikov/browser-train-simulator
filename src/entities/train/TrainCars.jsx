import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Car } from "./Car";

// Реальная длина локомотива (~12м * 0.5 масштаб = ~6м) + вагон (~10м * 1.5 масштаб = ~15м)
// Используем половину длины для расчета интервала между центрами
const TRAIN_LENGTH = 6; // Реальная длина локомотива
const CAR_LENGTH = 15; // Реальная длина вагона
const COUPLER_GAP = 0.5; // Небольшая щель между вагонами для сцепки
const NUM_CARS = 3;

export function TrainCars({ curve, trainRef, dir, trainT, onCarRefReady }) {
  const carsRef = useRef([]);
  const length = useMemo(() => curve?.getLength() || 1, [curve]);
  const carPositions = useMemo(() => {
    return Array.from({ length: NUM_CARS }, (_, i) => i + 1);
  }, []);

  // Отдаем ссылку на первый вагон для камеры при создании
  useEffect(() => {
    if (onCarRefReady && carsRef.current[0]) {
      onCarRefReady(carsRef.current[0]);
    }
  });

  useFrame(() => {
    if (!trainRef?.current || !curve || trainT === undefined) return;

    // Обновляем позиции вагонов
    carsRef.current.forEach((carGroup, index) => {
      if (!carGroup) return;

      const carIndex = carPositions[index];
      // Расстояние от центра локомотива до центра вагона
      // = половина длины локомотива + половина длины вагона + щели между ними
      const distanceToFirstCar = TRAIN_LENGTH / 2 + COUPLER_GAP + CAR_LENGTH / 2;
      // Для следующих вагонов добавляем полную длину вагона + щель
      const additionalDistance = (carIndex - 1) * (CAR_LENGTH + COUPLER_GAP);
      const offsetDistance = (distanceToFirstCar + additionalDistance) * dir;
      const offsetU = offsetDistance / length;
      let carT = trainT - offsetU;
      
      // Обертываем значение
      if (carT < 0) carT += 1;
      if (carT >= 1) carT -= 1;

      const carPos = curve.getPointAt(carT);
      const carTan = curve.getTangentAt(carT);
      
      carGroup.position.copy(carPos);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), carTan);
      carGroup.quaternion.copy(q);
    });
  });

  return (
    <group>
      {carPositions.map((_, index) => (
        <group 
          key={index} 
          ref={(el) => { 
            if (el) carsRef.current[index] = el; 
          }}
        >
          <Car />
        </group>
      ))}
    </group>
  );
}

