import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Attach to a button/link ref to make it "magnetic": it eases toward the
 * pointer while hovered and springs back on leave. `strength` controls how
 * far it travels relative to the pointer offset.
 */
export function useMagnetic({ strength = 0.4 } = {}) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return undefined;

    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return undefined;

    const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      quickX(relX * strength);
      quickY(relY * strength);
    };

    const handleLeave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return elRef;
}
