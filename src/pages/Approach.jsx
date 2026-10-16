import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../hooks/useLenis';
import { usePageMeta } from '../components/Seo/usePageMeta';
import { pages } from '../data/seo';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import Pattern from '../components/Pattern/Pattern';
import CtaFooter from '../components/CtaFooter/CtaFooter';
import './approach.scss';

const disciplines = [
  {
    n: '01',
    pattern: 'moire',
    title: 'UI/UX Design',
    note: 'Interfaces designed around how people actually use them.',
    items: ['Art direction & visual identity', 'UX flows & wireframes', 'Interface & design systems', 'Prototypes in Figma'],
  },
  {
    n: '02',
    pattern: 'ascii',
    title: 'Websites & E-commerce',
    note: 'Fast, maintainable sites and stores that are easy to run.',
    items: ['Custom WordPress & WooCommerce', 'Headless builds with Sanity', 'Catalogues, checkout & integrations', 'SEO, performance & accessibility'],
  },
  {
    n: '03',
    pattern: 'flow',
    title: 'Creative Development',
    note: 'Motion and interaction that carry the brand, not decorate it.',
    items: ['React & Next.js front-ends', 'GSAP animation & scroll experiences', 'WebGL / Three.js', 'Pixel-perfect build from your designs'],
  },
];

const ways = [
  {
    n: 'A',
    title: 'Development Partner',
    lead: 'For agencies and studios with designs ready to build.',
    points: [
      'Contract me as your development partner — white-label if you prefer, under your name and your client relationship',
      'I join your workflow: your tools, your reviews, your deadlines',
      'You bring the finished design; I build it faithfully, with motion and detail intact',
      'Clean handover, documented and ready to scale',
    ],
  },
  {
    n: 'B',
    title: 'Full Project',
    lead: 'From strategy and UI/UX to development and launch.',
    points: ['One person owns design and build', 'What you approve is what ships', 'Launch, handover and post-launch support'],
  },
];

const steps = [
  { n: '01', title: 'Discover', note: 'Goals, audience, content and constraints. For partner projects: a review of your designs and specs.' },
  { n: '02', title: 'Design', note: 'Structure, look and feel, then motion. Skipped when the design is already done.' },
  { n: '03', title: 'Develop', note: 'Built in the open on a staging link, tested on real devices and browsers.' },
  { n: '04', title: 'Deliver', note: 'Launch, handover and support, so the site keeps working after I step away.' },
];

const stack = [
  { group: 'Platforms', items: ['WordPress', 'WooCommerce', 'Sanity', 'Custom PHP'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'JavaScript', 'SCSS', 'Vite'] },
  { group: 'Motion & Interaction', items: ['GSAP', 'Lenis', 'Three.js', 'WebGL'] },
];

export default function Approach() {
  usePageMeta(pages['/approach']);
  const { hash, key } = useLocation();

  // "/approach#disciplines": scroll once the route curtain has cleared.
  useEffect(() => {
    if (!hash) return undefined;
    const transitioning = document.body.classList.contains('is-transitioning');
    const id = window.setTimeout(
      () => {
        const el = document.querySelector(hash);
        if (!el) return;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(el, { force: true });
        else el.scrollIntoView({ behavior: 'smooth' });
      },
      transitioning ? 900 : 0
    );
    return () => window.clearTimeout(id);
  }, [hash, key]);

  return (
    <>
      <section className="approach-hero">
        <Pattern type="flow" transparent alpha={0.38} />
        <div className="above-pattern">
          <p className="eyebrow">Approach</p>
          <SplitReveal as="h1" type="lines" immediate stagger={0.11} className="approach-hero__title">
            Good design.
            <br />
            Solid development.
          </SplitReveal>
          <p className="approach-hero__lead">
            From first concept to final build. Creative thinking backed by considered engineering.
          </p>
        </div>
      </section>

      <section className="approach-disciplines" id="disciplines">
        <div className="approach-head">
          <SplitReveal as="h2" type="lines" className="approach-head__title">
            Three disciplines.
            <br />
            One connected process.
          </SplitReveal>
          <span className="eyebrow approach-head__tag">(01) What I do</span>
        </div>
        <div className="approach-disciplines__grid">
          {disciplines.map((d) => (
            <div key={d.n} className="approach-disciplines__item">
              <div className="approach-disciplines__tile">
                <Pattern type={d.pattern} on="b" local className="approach-disciplines__canvas" />
              </div>
              <span className="approach-disciplines__n">{d.n}</span>
              <h3 className="approach-disciplines__title">{d.title}</h3>
              <p className="approach-disciplines__note">{d.note}</p>
              <ul className="approach-disciplines__list">
                {d.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="approach-ways">
        <div className="approach-head">
          <SplitReveal as="h2" type="lines" className="approach-head__title">
            Different projects.
            <br />
            Different setups.
          </SplitReveal>
          <span className="eyebrow approach-head__tag">(02) Ways of working</span>
        </div>
        <div className="approach-ways__grid">
          {ways.map((w) => (
            <article key={w.title} className="approach-ways__card">
              <span className="approach-ways__n">{w.n}</span>
              <h3 className="approach-ways__title">{w.title}</h3>
              <p className="approach-ways__lead">{w.lead}</p>
              <ul className="approach-ways__list">
                {w.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="approach-ways__ongoing">
          <span className="serif-line">Ongoing collaborations.</span> Many projects continue after launch — new
          features, content updates, performance work. Happy to stay on as your go-to developer.
        </p>
      </section>

      <section className="approach-process">
        <Pattern type="moire" transparent alpha={0.3} gap={11} lw={1.2} className="pattern approach-process__pattern" />
        <div className="approach-head above-pattern">
          <SplitReveal as="h2" type="lines" className="approach-head__title">
            Discover. Design.
            <br />
            Develop. Deliver.
          </SplitReveal>
          <span className="eyebrow approach-head__tag">(03) The process</span>
        </div>
        <p className="approach-process__scope above-pattern">
          The process adapts to the scope. On development-only projects we skip straight to Develop, starting from
          your designs and specs.
        </p>
        <div className="approach-process__grid above-pattern">
          {steps.map((s) => (
            <div key={s.n} className="approach-process__col">
              <span className="approach-process__n">{s.n}</span>
              <h3 className="approach-process__title">{s.title}</h3>
              <p className="approach-process__note">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="approach-stack">
        <div className="approach-head">
          <SplitReveal as="h2" type="lines" className="approach-head__title">
            Tools chosen for the job.
            <br />
            Not the other way around.
          </SplitReveal>
          <span className="eyebrow approach-head__tag">(04) The stack</span>
        </div>
        <div className="approach-stack__grid">
          {stack.map((g) => (
            <div key={g.group} className="approach-stack__group">
              <span className="eyebrow">{g.group}</span>
              <div className="approach-stack__pills">
                {g.items.map((t) => (
                  <span key={t} className="pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaFooter eyebrow="Got something in mind?" title={<>Let&rsquo;s build it properly.</>} description={false} />
    </>
  );
}
