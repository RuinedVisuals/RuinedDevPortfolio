import { useEffect, useRef } from 'react';
import Arrow from '../../components/Arrow/Arrow';
import { gsap } from 'gsap';
import SplitReveal from '../../components/SplitReveal/SplitReveal';
import MagneticButton from '../../components/MagneticButton/MagneticButton';
import Pattern from '../../components/Pattern/Pattern';
import { useMagneticChars } from '../../hooks/useMagneticChars';
import './hero.scss';

export default function Hero() {
  const heroRef = useRef(null);
  const eyebrowRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
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
        .fromTo(ctaRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <Pattern type="flow" transparent alpha={0.32} />
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
            Start a project <Arrow className="arrow" />
          </MagneticButton>
        </div>
      </div>

    </section>
  );
}
