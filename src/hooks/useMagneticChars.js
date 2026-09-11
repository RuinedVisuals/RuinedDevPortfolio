import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Nudges every `.split-char` inside the returned ref's element toward the
 * cursor as it passes nearby, falling off with distance and springing back
 * on mouse leave. Pair with SplitReveal type="chars" so those spans exist.
 * Skipped entirely on touch/coarse-pointer devices.
 */
export function useMagneticChars({ radius = 90, strength = 0.5 } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return undefined;

    let cancelled = false;
    let cleanup = () => {};

    // SplitText re-splits (replacing the DOM nodes) once web fonts finish
    // loading, which can happen after this effect first runs. Waiting for
    // fonts.ready first means the `.split-char` spans we grab below are the
    // final ones, not stale nodes that already got swapped out.
    document.fonts.ready.then(() => {
      if (cancelled) return;

      const chars = [...container.querySelectorAll('.split-char')];
      if (!chars.length) return;

      const quicks = chars.map((c) => ({
        x: gsap.quickTo(c, 'x', { duration: 0.4, ease: 'power3.out' }),
        y: gsap.quickTo(c, 'y', { duration: 0.4, ease: 'power3.out' }),
      }));

      let raf = null;

      const apply = (clientX, clientY) => {
        raf = null;
        chars.forEach((c, i) => {
          const rect = c.getBoundingClientRect();
          const dx = clientX - (rect.left + rect.width / 2);
          const dy = clientY - (rect.top + rect.height / 2);
          const dist = Math.hypot(dx, dy);
          const pull = Math.max(0, 1 - dist / radius);
          quicks[i].x(dx * pull * strength);
          quicks[i].y(dy * pull * strength);
        });
      };

      const handleMove = (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => apply(e.clientX, e.clientY));
      };

      const handleLeave = () => {
        quicks.forEach(({ x, y }) => {
          x(0);
          y(0);
        });
      };

      window.addEventListener('mousemove', handleMove);
      container.addEventListener('mouseleave', handleLeave);

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', handleMove);
        container.removeEventListener('mouseleave', handleLeave);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [radius, strength]);

  return containerRef;
}
