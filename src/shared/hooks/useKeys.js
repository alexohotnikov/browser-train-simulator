import { useEffect, useState } from "react";

export function useKeys() {
  const [keys, set] = useState({});
  useEffect(() => {
    const down = (e) => set((k) => ({ ...k, [e.key.toLowerCase()]: true }));
    const up = (e) => set((k) => ({ ...k, [e.key.toLowerCase()]: false }));
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

