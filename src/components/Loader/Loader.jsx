import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './loader.scss';

export default function Loader({ onComplete }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          delay: 0.2,
          onComplete,
        });
      },
    });

    tl.to(counter, {
      val: 100,
      duration: 2.1,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(counter.val)),
    }).to(
      barRef.current,
      { scaleX: 1, duration: 2.1, ease: 'power2.inOut' },
      '<'
    );

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div ref={rootRef} className="loader">
      <div className="loader__top">
        <span className="loader__mark">AG.</span>
        <span className="loader__count">{String(count).padStart(2, '0')}</span>
      </div>
      <div className="loader__bar-track">
        <div ref={barRef} className="loader__bar-fill" />
      </div>
      <div className="loader__bottom">
        <span>Independent design &amp; development</span>
        <span>Athens, GR</span>
      </div>
    </div>
  );
}
