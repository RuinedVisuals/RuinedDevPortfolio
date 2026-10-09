import { useEffect, useRef } from 'react';
import Pattern from '../../components/Pattern/Pattern';
import './lab.scss';

// The animated tiles are decoration; the copy under them is the pitch.
const sketches = [
  {
    n: '01',
    type: 'flow',
    title: 'Stand out',
    meta: 'A distinctive identity customers remember — not a template your competitors can copy.',
    opts: { particles: 700 },
  },
  {
    n: '02',
    type: 'ascii',
    title: 'Hold attention',
    meta: 'Purposeful motion and interaction keep visitors exploring and guide them to what matters.',
    opts: {},
  },
  {
    n: '03',
    type: 'moire',
    title: 'Turn visits into business',
    meta: 'Fast, clear, accessible pages that lead to enquiries, bookings and orders.',
    opts: {},
  },
];

const ECHOES = [1, 2, 3];

export default function Lab() {
  const echoRefs = useRef([]);

  // Echo copies of the giant word drift sideways with the pointer, each a
  // little further than the one above it.
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    let tx = 0;
    let x = 0;
    let raf = 0;
    const loop = () => {
      x += (tx - x) * 0.08;
      echoRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateX(${x * ECHOES[i] * 28}px)`;
      });
      raf = requestAnimationFrame(loop);
    };
    const move = (e) => (tx = e.clientX / window.innerWidth - 0.5);
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <section className="lab" id="lab">
      <div className="lab__top">
        <span className="eyebrow">(03) Why it works</span>
        <span className="eyebrow lab__years">Built to grow your business</span>
      </div>

      <div className="lab__echo">
        <div className="lab__word">Creative</div>
        {ECHOES.map((k, i) => (
          <div
            key={k}
            ref={(el) => (echoRefs.current[i] = el)}
            className={`lab__word lab__word--echo lab__word--echo-${k}`}
            aria-hidden="true"
          >
            Creative
          </div>
        ))}
        <div className="lab__sub">
          <span className="serif-line">development.</span>
        </div>
      </div>

      <div className="lab__intro">
        <p>
          Your website is the first thing customers judge. Creative development turns it into your best
          salesperson — memorable at first sight, fast on every device, and built so people take the next step.
        </p>
        <div className="lab__oval">
          <span className="lab__oval-title">Design + code</span>
          <span className="lab__oval-meta">Brand · Motion · Performance</span>
        </div>
      </div>

      <div className="lab__grid">
        {sketches.map((s) => (
          <div key={s.n} className="lab__item">
            <div className="lab__tile" data-cursor="Play">
              <Pattern type={s.type} local className="lab__canvas" {...s.opts} />
            </div>
            <div className="lab__caption">
              <span className="lab__n">{s.n}</span>
              <span className="lab__title">{s.title}</span>
              <span />
              <span className="lab__meta">{s.meta}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
