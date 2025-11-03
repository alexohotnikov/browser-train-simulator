import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function Sleepers({ curve }) {
  const inst = useRef();
  const count = 480;
  const geom = useMemo(() => new THREE.BoxGeometry(2.2, 0.15, 0.25), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5c4a3d" }), []);

  useEffect(() => {
    const m = inst.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const u = i / count;
      const p = curve.getPointAt(u);
      const t = curve.getTangentAt(u);
      const lateral = new THREE.Vector3(-t.z, 0, t.x).normalize();
      const pos = p.clone();
      dummy.position.copy(pos);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), lateral);
      dummy.quaternion.copy(q);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [curve]);

  return <instancedMesh ref={inst} args={[geom, mat, count]} castShadow receiveShadow />;
}

