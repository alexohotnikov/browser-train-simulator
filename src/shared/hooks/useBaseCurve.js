import { useMemo } from "react";
import * as THREE from "three";

export function useBaseCurve() {
  return useMemo(() => {
    const pts = [];
    const R = 150; // radius of main loop
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const jitterR = R + (i % 2 === 0 ? 25 : -25);
      pts.push(new THREE.Vector3(Math.cos(a) * jitterR, 0, Math.sin(a) * jitterR));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.1);
    curve.curveType = "centripetal";
    return curve;
  }, []);
}

