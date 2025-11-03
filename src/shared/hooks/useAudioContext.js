import { useRef, useEffect } from "react";

let sharedContext = null;

export function useAudioContext() {
  const ctxRef = useRef(null);

  const initContext = () => {
    if (sharedContext) {
      ctxRef.current = sharedContext;
      return sharedContext;
    }

    try {
      sharedContext = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = sharedContext;
      
      // Handle suspended state
      if (sharedContext.state === 'suspended') {
        sharedContext.resume().catch(() => {
          console.warn('AudioContext resume failed');
        });
      }

      sharedContext.addEventListener('statechange', () => {
        if (sharedContext.state === 'suspended') {
          sharedContext.resume().catch(() => {});
        }
      });
    } catch (error) {
      console.warn('AudioContext creation failed:', error);
      return null;
    }

    return sharedContext;
  };

  const getContext = () => {
    if (ctxRef.current) {
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume().catch(() => {});
      }
      return ctxRef.current;
    }
    return null;
  };

  // Initialize on first user interaction
  useEffect(() => {
    const initOnInteraction = () => {
      if (!sharedContext) {
        initContext();
      }
    };

    // Try to initialize immediately if possible
    if (document.visibilityState === 'visible') {
      const ctx = initContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    }

    // Fallback: initialize on any user interaction
    window.addEventListener('click', initOnInteraction, { once: true });
    window.addEventListener('keydown', initOnInteraction, { once: true });
    window.addEventListener('touchstart', initOnInteraction, { once: true });

    return () => {
      window.removeEventListener('click', initOnInteraction);
      window.removeEventListener('keydown', initOnInteraction);
      window.removeEventListener('touchstart', initOnInteraction);
    };
  }, []);

  return { getContext, initContext };
}

