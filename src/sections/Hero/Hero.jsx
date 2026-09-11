import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitReveal from '../../components/SplitReveal/SplitReveal';
import MagneticButton from '../../components/MagneticButton/MagneticButton';
import { useMagneticChars } from '../../hooks/useMagneticChars';
import './hero.scss';

const WAVE_COUNT = 26;

// mx/my are the cursor's position within the hero, normalized to -1..1.
// At rest (0, 0) this reproduces the original static curve exactly.
function wavePath(i, mx, my) {
  const offset = i * 9;
  const sway = 36;
  const c1x = 350 - offset + mx * sway;
  const c1y = 120 + my * sway * 0.5;
  const c2x = 420 - offset + mx * sway * 0.6;
  const c2y = 260 + my * sway;
  return `M ${500 - offset} 0 C ${c1x} ${c1y}, ${c2x} ${c2y}, ${180 - offset} 400`;
}

export default function Hero() {
  const heroRef = useRef(null);
  const eyebrowRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const linesRef = useRef(null);
  const pathRefs = useRef([]);
  const titleRef = useMagneticChars({ radius: 90, strength: 0.5 });

  useEffect(() => {
    // gsap.context + revert() is required here (not just tl.kill()) because
    // React 18 StrictMode runs this effect mount -> cleanup -> mount once in
    // dev. gsap.from()/fromTo() apply their start values synchronously on
    // creation; if a tween is killed mid-flight its target is left at that
    // in-between value, and the *next* run's fromTo() would then animate
    // from-and-to that same stuck value (invisible forever). ctx.revert()
    // restores every affected property to its pre-animation inline value,
    // so the second (real) mount always starts from a clean slate.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo(subRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')
        .fromTo(ctaRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo(
          linesRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' },
          '-=0.9'
        );
    });

    return () => ctx.revert();
  }, []);

  // Wave lines sway toward the cursor. Runs its own rAF loop (independent of
  // the entrance timeline above) so it keeps lerping back to rest on mouse
  // leave. Skipped on touch/coarse-pointer devices and reduced-motion.
  useEffect(() => {
    const section = heroRef.current;
    const paths = pathRefs.current;
    if (!section || !paths.length) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduceMotion || !fine) return undefined;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf;

    const render = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      paths.forEach((p, i) => p?.setAttribute('d', wavePath(i, mouse.x, mouse.y)));
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const handleMove = (e) => {
      const rect = section.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const handleLeave = () => {
      mouse.tx = 0;
      mouse.ty = 0;
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <p ref={eyebrowRef} className="eyebrow hero__eyebrow">
        Independent design &amp; development / Athens, GR
      </p>

      <h1 className="hero__title" ref={titleRef}>
        <SplitReveal as="span" type="chars" immediate delay={0.35} stagger={0.03} className="hero__line">
          Creative
        </SplitReveal>
        <SplitReveal as="span" type="chars" immediate delay={0.5} stagger={0.03} className="hero__line">
          Developer.
        </SplitReveal>
      </h1>

      <div className="hero__foot">
        <p ref={subRef} className="hero__sub">
          I design and build
          <br />
          distinctive websites.
        </p>
        <div ref={ctaRef}>
          <MagneticButton href="#contact" cursorLabel="Let's talk" className="hero__cta">
            Start a project <span className="arrow">↗</span>
          </MagneticButton>
        </div>
      </div>

      <svg
        ref={linesRef}
        className="hero__waves"
        viewBox="0 0 500 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {Array.from({ length: WAVE_COUNT }).map((_, i) => (
          <path
            key={i}
            ref={(el) => (pathRefs.current[i] = el)}
            d={wavePath(i, 0, 0)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity={0.12 + (i % 5) * 0.03}
          />
        ))}
      </svg>
    </section>
  );
}
