import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../components/Seo/usePageMeta';
import { pages } from '../data/seo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import Pattern from '../components/Pattern/Pattern';
import CtaFooter from '../components/CtaFooter/CtaFooter';
import MagneticButton from '../components/MagneticButton/MagneticButton';
import Arrow from '../components/Arrow/Arrow';
import './about.scss';

gsap.registerPlugin(ScrollTrigger);

// *word* = Georgia italic emphasis.
const MANIFESTO =
  'Creative development is where design and engineering meet. I design the interface and build it myself, so what you approve is what ships — *fast*, accessible and easy to use. Motion, WebGL and interaction are there to *clarify* and give a brand personality, never as decoration. No templates, no shortcuts — just the *right* solution, built properly.';
const words = MANIFESTO.split(' ').map((t) => ({ t: t.replace(/\*/g, ''), em: t.startsWith('*') }));

const answers = [
  {
    n: '01',
    q: 'Who am I?',
    a: 'Apostolis — an independent creative developer and UI/UX designer based in Athens. I work with founders, studios and agencies, from brochure sites to full e-commerce builds.',
  },
  {
    n: '02',
    q: 'How do I think?',
    a: 'Design and engineering are one job. I design with the build in mind and build with the design in mind, so motion, performance and accessibility are decisions made early, not patched in later.',
  },
  {
    n: '03',
    q: 'Why work with me?',
    a: 'You work directly with the person who designs and develops your project. No hand-offs, no middle layers — clear communication and a result that matches what you approved.',
  },
];

const PORTRAIT = '/images/about/portrait.jpg';

export default function About() {
  usePageMeta(pages['/about']);
  const manifestoRef = useRef(null);
  const [hasPortrait, setHasPortrait] = useState(true);

  // Manifesto words brighten .15 → 1 in reading order, scrubbed to scroll.
  useEffect(() => {
    const sec = manifestoRef.current;
    if (!sec) return undefined;
    const els = [...sec.querySelectorAll('.about-manifesto__word')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => (el.style.opacity = '1'));
      return undefined;
    }
    const st = ScrollTrigger.create({
      trigger: sec,
      start: 'top 85%',
      end: 'bottom 60%',
      scrub: true,
      onUpdate: ({ progress }) => {
        const n = els.length;
        els.forEach((el, i) => {
          const k = Math.min(1, Math.max(0, progress * n * 1.15 - i));
          el.style.opacity = String(0.15 + 0.85 * k);
        });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <>
      <section className="about-page">
        <Pattern type="flow" transparent alpha={0.38} />
        <div className="about-page__grid above-pattern">
          <div>
            <p className="eyebrow">About</p>
            <SplitReveal as="h1" type="lines" immediate stagger={0.11} className="about-page__title">
              Creative development,
              <br />
              done properly.
            </SplitReveal>
            <p className="about-page__lead">
              I&rsquo;m Apostolis — an independent creative developer and UI/UX designer based in Athens. I work
              with founders, studios and agencies to design and build distinctive, fast, intuitive websites — from
              brochure sites to full e-commerce builds.
            </p>
          </div>

          <figure className="about-portrait">
            <div className="about-portrait__frame">
              {hasPortrait && (
                <img
                  className="about-portrait__img"
                  src={PORTRAIT}
                  alt="Apostolis G."
                  onError={() => setHasPortrait(false)}
                />
              )}
              <div className="about-portrait__tint" />
              <div className="about-portrait__ribs" />
            </div>
            <figcaption className="about-portrait__caption">
              <span>Apostolis G.</span>
              <span>Athens, GR</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-manifesto" ref={manifestoRef}>
        <span className="eyebrow about-manifesto__tag">(01) How I work</span>
        <p className="about-manifesto__text">
          {words.map((w, i) => (
            <span key={i} className={`about-manifesto__word ${w.em ? 'serif-line' : ''}`}>
              {w.t}
            </span>
          ))}
        </p>
      </section>

      <section className="about-answers">
        <div className="about-answers__head">
          <h2 className="about-answers__title">
            Creative thinking.
            <br />
            Solid execution.
          </h2>
          <span className="eyebrow about-answers__tag">(02) The person behind it</span>
        </div>
        <div className="about-answers__grid">
          {answers.map((x) => (
            <div key={x.n} className="about-answers__item">
              <span className="about-answers__n">{x.n}</span>
              <h3 className="about-answers__q">{x.q}</h3>
              <p className="about-answers__a">{x.a}</p>
            </div>
          ))}
        </div>
        <div className="about-answers__cta">
          <MagneticButton as={Link} to="/approach" cursorLabel="Approach">
            See how I work <Arrow className="arrow" />
          </MagneticButton>
        </div>
      </section>

      <CtaFooter />
    </>
  );
}
