import { useEffect, useRef } from 'react';
import Pattern from '../../components/Pattern/Pattern';
import './lab.scss';

const sketches = [
  { n: '01', type: 'flow', title: 'Flow field', meta: 'Canvas 2D · noise vectors · cursor swirl', opts: { particles: 700 } },
  { n: '02', type: 'ascii', title: 'ASCII field', meta: 'Glyph shading · interference · cursor falloff', opts: {} },
  { n: '03', type: 'moire', title: 'Moiré', meta: 'Two-point ring interference, follows the pointer', opts: {} },
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
        <span className="eyebrow">(L) The lab</span>
        <span className="eyebrow lab__years">Experiments 2024 — 2026</span>
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
          Where code is the medium, not just the means. Shaders, generative systems and motion studies — the
          playground that feeds every client build.
        </p>
        <div className="lab__oval">
          <span className="lab__oval-title">Creative development</span>
          <span className="lab__oval-meta">WebGL · GLSL · Canvas</span>
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
