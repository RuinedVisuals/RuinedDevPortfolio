import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import Pattern from '../components/Pattern/Pattern';
import CtaFooter from '../components/CtaFooter/CtaFooter';
import Process from '../sections/Process/Process';
import { projects } from '../data/projects';
import './about.scss';

gsap.registerPlugin(ScrollTrigger);

// *word* = Georgia italic emphasis.
const MANIFESTO =
  'I treat every site like a short film — *pacing*, light, and type that moves with intent. Engineering keeps it fast and accessible; *curiosity* keeps it a little strange. No templates, no autopilot — just the *right* thing, built properly.';
const words = MANIFESTO.split(' ').map((t) => ({ t: t.replace(/\*/g, ''), em: t.startsWith('*') }));

const capabilities = [
  { n: '01', pattern: 'moire', title: 'UI & UX design', note: 'Thoughtful experiences, from idea to interface.' },
  { n: '02', pattern: 'ascii', title: 'Websites & e-commerce', note: 'Distinctive, high-performing websites that convert.' },
  { n: '03', pattern: 'flow', title: 'Creative development', note: 'Clean, flexible solutions built for what’s next.' },
];

const STACK = ['React', 'GSAP', 'Three.js', 'WebGL', 'Lenis', 'SCSS', 'Vite', 'Shopify', 'Webflow', 'WordPress'];

const PORTRAIT = '/images/about/portrait.jpg';

export default function About() {
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
              I build the web,
              <br />
              cinematically.
            </SplitReveal>
            <p className="about-page__lead">
              I&rsquo;m Apostolis — an independent creative developer and UI/UX designer based in Athens. I partner
              with founders, studios and agencies to turn ideas into distinctive, fast, intuitive websites — from
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

      <section className="about-capabilities">
        <div className="about-capabilities__head">
          <h2 className="about-capabilities__title">
            Creative thinking.
            <br />
            Solid execution.
          </h2>
          <span className="eyebrow about-capabilities__tag">(02) Capabilities</span>
        </div>
        <div className="about-capabilities__grid">
          {capabilities.map((c) => (
            <div key={c.n} className="about-capabilities__item">
              <div className="about-capabilities__tile" data-cursor="Play">
                <Pattern type={c.pattern} on="b" local className="about-capabilities__canvas" />
              </div>
              <span className="about-capabilities__n">{c.n}</span>
              <h3 className="about-capabilities__item-title">{c.title}</h3>
              <p className="about-capabilities__note">{c.note}</p>
            </div>
          ))}
        </div>
        <div className="about-capabilities__stack">
          <span className="eyebrow">Toolbox</span>
          {STACK.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>
      </section>

      <Process />

      <section className="about-clients">
        <div className="about-clients__head">
          <h2 className="about-clients__title">Worked with</h2>
          <span className="eyebrow about-clients__tag">(03) Clients</span>
        </div>
        <ul className="about-clients__list">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link to={`/work/${p.slug}`} className="about-clients__row" data-cursor="View">
                <span className="about-clients__client">{p.client}</span>
                <span className="about-clients__meta">{p.category}</span>
                <span className="about-clients__meta">{p.year}</span>
                <span className="about-clients__arrow">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaFooter />
    </>
  );
}
