import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './cursor.scss';

/**
 * Custom cursor with a dot that tracks the pointer 1:1 and a ring that
 * eases behind it. Expands + can show a short label when hovering any
 * element carrying [data-cursor] (e.g. data-cursor="View" or "Drag").
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return undefined;

    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });

    const handleMove = (e) => {
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const handleOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setActive(true);
        setLabel(target.getAttribute('data-cursor') || '');
      } else {
        setActive(false);
        setLabel('');
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className={`cursor-ring ${active ? 'is-active' : ''}`} aria-hidden="true">
        {label && <span className="cursor-ring__label">{label}</span>}
      </div>
    </>
  );
}
