import * as THREE from "three";

export function offsetCurve(curve, offset) {
  const divisions = 800;
  const pts = [];
  for (let i = 0; i <= divisions; i++) {
    const u = i / divisions;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const lateral = new THREE.Vector3(-t.z, 0, t.x).normalize(); // perpendicular on XZ
    const op = p.clone().addScaledVector(lateral, offset);
    pts.push(op);
  }
  return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.1);
}

