import { useRef, useEffect } from "react";

// Зоны с ограничениями скорости по трассе (позиция от 0 до 1)
export const SPEED_LIMIT_ZONES = [
  { start: 0.0, end: 0.2, limit: 70 }, // 70 km/h
  { start: 0.2, end: 0.4, limit: 40 }, // 40 km/h - поворот
  { start: 0.4, end: 0.55, limit: 60 }, // 60 km/h
  { start: 0.55, end: 0.7, limit: 30 }, // 30 km/h - резкий поворот
  { start: 0.7, end: 0.85, limit: 50 }, // 50 km/h
  { start: 0.85, end: 1.0, limit: 70 }, // 70 km/h
];

const TIME_TO_REDUCE = 4; // секунды на снижение скорости
const POINTS_FOR_COMPLIANCE = 5; // баллы за соблюдение
const TOO_SLOW_THRESHOLD = 0.7; // если едет ниже 70% от ограничения - штраф

export function useSpeedLimitScoring(trainPosition, speed, uiState) {
  const scoreRef = useRef(0);
  const currentZoneRef = useRef(null);
  const zoneEntrySpeedRef = useRef(null);
  const zoneEntryTimeRef = useRef(null);
  const complianceCheckRef = useRef(null);

  useEffect(() => {
    // Найти текущую зону ограничения скорости
    const currentZone = SPEED_LIMIT_ZONES.find(
      zone => trainPosition >= zone.start && trainPosition < zone.end
    );

    // Если вошли в новую зону
    if (currentZone && currentZone !== currentZoneRef.current) {
      // Закрыть предыдущую проверку если была
      if (complianceCheckRef.current) {
        clearTimeout(complianceCheckRef.current);
        complianceCheckRef.current = null;
      }

      currentZoneRef.current = currentZone;
      zoneEntrySpeedRef.current = speed * 3.6; // сохраняем в km/h
      zoneEntryTimeRef.current = Date.now();

      // Установить проверку через 4 секунды
      complianceCheckRef.current = setTimeout(() => {
        // Получить актуальную скорость из uiState
        const currentSpeed = uiState.current?.speed || 0;
        if (currentSpeed <= currentZone.limit) {
          // Успел снизить скорость - проверяем на слишком медленную езду
          const speedRatio = currentSpeed / currentZone.limit;
          let points = POINTS_FOR_COMPLIANCE;
          
          // Если едет слишком медленно (< 70% от ограничения и не стоит на месте)
          if (speedRatio < TOO_SLOW_THRESHOLD && currentSpeed > 0.5) {
            points = Math.floor(POINTS_FOR_COMPLIANCE * 0.5);
            uiState.current.lastScoreEvent = {
              type: 'warning',
              points: points,
              message: `Соблюдено ограничение ${currentZone.limit} km/h (слишком медленно)`
            };
          } else {
            uiState.current.lastScoreEvent = {
              type: 'success',
              points: points,
              message: `Соблюдено ограничение ${currentZone.limit} km/h`
            };
          }
          
          scoreRef.current += points;
        } else {
          // Не успел снизить скорость - штраф
          uiState.current.lastScoreEvent = {
            type: 'penalty',
            points: 0,
            message: `Превышение скорости в зоне ${currentZone.limit} km/h`
          };
        }
        // Очистка события через 2 секунды
        setTimeout(() => {
          if (uiState.current?.lastScoreEvent) {
            uiState.current.lastScoreEvent = null;
          }
        }, 2000);
      }, TIME_TO_REDUCE * 1000);
    }

    return () => {
      if (complianceCheckRef.current) {
        clearTimeout(complianceCheckRef.current);
      }
    };
  }, [trainPosition, speed, uiState]);

  // Получить текущее ограничение скорости
  const currentLimit = SPEED_LIMIT_ZONES.find(
    zone => trainPosition >= zone.start && trainPosition < zone.end
  )?.limit || null;

  return {
    score: scoreRef.current,
    currentLimit,
    zones: SPEED_LIMIT_ZONES,
  };
}

