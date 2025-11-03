import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAudioContext } from "../../shared/hooks/useAudioContext";

export function AudioManager({ uiState, speed }) {
  const { getContext } = useAudioContext();
  const engineSound = useRef(null);
  const brakeSound = useRef(null);
  const [brakeLevel, setBrakeLevel] = useState(0);
  const [audioReady, setAudioReady] = useState(false);

  // Engine sound
  useEffect(() => {
    const ctx = getContext();
    if (!ctx) return;

    const initEngine = () => {
      try {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        if (!engineSound.current && ctx.state !== 'closed') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.value = 100;
          gain.gain.value = 0;
          osc.connect(gain).connect(ctx.destination);
          osc.start();
          engineSound.current = { osc, gain };
          setAudioReady(true);
        }
      } catch (error) {
        console.warn('Engine sound initialization failed:', error);
      }
    };

    if (ctx.state === 'running') {
      initEngine();
    } else {
      ctx.resume().then(() => {
        initEngine();
      }).catch(() => {
        // Wait for user interaction
      });
    }

    return () => {
      if (engineSound.current) {
        try {
          engineSound.current.osc.stop();
          engineSound.current.osc.disconnect();
          engineSound.current.gain.disconnect();
        } catch {
          // Audio context may be closed
        }
        engineSound.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    if (!audioReady || !engineSound.current) return;
    
    const ctx = getContext();
    if (!ctx) return;

    try {
      const throttle = Math.max(0, uiState.current.throttle);
      const baseFreq = 80 + throttle * 120 + Math.abs(speed) * 5;
      engineSound.current.osc.frequency.setTargetAtTime(baseFreq, ctx.currentTime, 0.1);
      engineSound.current.gain.gain.setTargetAtTime(throttle * 0.03, ctx.currentTime, 0.1);
    } catch {
      // Audio context may be closed
    }
  });

  // Brake sound
  useEffect(() => {
    const interval = setInterval(() => {
      setBrakeLevel(uiState.current.brake);
    }, 100);
    return () => clearInterval(interval);
  }, [uiState]);

  useEffect(() => {
    const ctx = getContext();
    if (!ctx || ctx.state === 'closed') return;

    if (brakeLevel > 0.3 && !brakeSound.current && audioReady) {
      try {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 200;
        gain.gain.value = 0.02 * brakeLevel;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        brakeSound.current = { osc, gain };
      } catch (error) {
        console.warn('Brake sound initialization failed:', error);
      }
    } else if (brakeLevel <= 0.3 && brakeSound.current) {
      try {
        brakeSound.current.osc.stop();
        brakeSound.current.osc.disconnect();
        brakeSound.current.gain.disconnect();
      } catch {
        // Audio context may be closed
      }
      brakeSound.current = null;
    }
    
    if (brakeSound.current && ctx) {
      try {
        brakeSound.current.gain.gain.setTargetAtTime(0.02 * brakeLevel, ctx.currentTime, 0.1);
      } catch {
        // Audio context may be closed
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brakeLevel, audioReady]);

  return null;
}
