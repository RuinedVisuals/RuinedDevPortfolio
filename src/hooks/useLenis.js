import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let sharedLenis = null;

/**
 * Creates (once) a single Lenis instance shared across the app and drives it
 * from GSAP's ticker so ScrollTrigger, curtain transitions and Lenis all
 * agree on the same clock. Returns the live instance via a ref.
 */
export function useLenis({ enabled = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    if (!sharedLenis) {
      sharedLenis = new Lenis({
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        touchMultiplier: 1.2,
      });
    }
    ref.current = sharedLenis;

    const onTick = (time) => {
      sharedLenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    sharedLenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
    };
  }, [enabled]);

  return ref;
}

export function getLenis() {
  return sharedLenis;
}
