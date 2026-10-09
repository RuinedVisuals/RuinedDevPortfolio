import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Arrow from '../components/Arrow/Arrow';
import { useParams, Link, Navigate } from 'react-router-dom';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import MagneticButton from '../components/MagneticButton/MagneticButton';
import Pattern from '../components/Pattern/Pattern';
import HeroGL from '../components/HeroGL/HeroGL';
import CtaFooter from '../components/CtaFooter/CtaFooter';
import { useTheme } from '../context/ThemeContext';
import { getPosterURLs } from '../lib/posters';
import { projects } from '../data/projects';
import './project-detail.scss';

gsap.registerPlugin(ScrollTrigger);

const pad = (n) => String(n).padStart(2, '0');
const ECHOES = [1, 2, 3];
const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

// Gallery layout: one full-width browser, then alternating browser / phone
// rows. Falls back gracefully when a project has fewer captures.
function buildShots(shots) {
  const d = shots?.desktop || [];
  const m = shots?.mobile || [];
  const out = [];
  if (d[0]) out.push({ kind: 'full', src: d[0], label: 'Homepage', speed: 0 });
  if (d[1]) out.push({ kind: 'wide', src: d[1], label: 'Desktop', speed: 4 });
  if (m[0]) out.push({ kind: 'phone', src: m[0], label: 'Mobile', speed: 12 });
  if (d[2] && m[1]) {
    out.push({ kind: 'phone', src: m[1], label: 'Mobile', speed: 8 });
    out.push({ kind: 'wide', src: d[2], label: 'Desktop', speed: 3 });
  }
  return out;
}

// Keyed by slug so moving project → project (same route component)
// remounts with fresh hover state, shader and reveal.
export default function ProjectDetailRoute() {
  const { slug } = useParams();
  return <ProjectDetail key={slug} slug={slug} />;
}

function ProjectDetail({ slug }) {
  const { colors } = useTheme();
  const [posters, setPosters] = useState([]);
  const [nextHover, setNextHover] = useState(false);
  const echoRefs = useRef([]);

  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];

  useEffect(() => {
    let dead = false;
    getPosterURLs(colors).then((urls) => !dead && setPosters(urls));
    return () => {
      dead = true;
    };
  }, [colors]);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const move = (e) => {
      const ex = e.clientX / window.innerWidth - 0.5;
      echoRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateX(${ex * ECHOES[i] * 36}px)`;
      });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const gallery = buildShots(project?.shots);
  // Cells drift at slightly different speeds as they scroll through.
  const galleryRef = useRef(null);
  useEffect(() => {
    const root = galleryRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      root.querySelectorAll('[data-speed]').forEach((el) => {
        const speed = Number(el.dataset.speed);
        if (!speed) return;
        gsap.fromTo(
          el,
          { yPercent: speed },
          { yPercent: -speed, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      });
      root.querySelectorAll('.project-detail__cell').forEach((el) => {
        gsap.from(el.querySelector('.project-detail__frame'), {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [gallery.length]);

  if (!project) return <Navigate to="/work" replace />;

  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];
  const word = project.name.split(' ')[0];
  const host = hostOf(project.url);

  return (
    <>
      <section className="project-detail__hero" data-cursor="Move">
        <HeroGL index={index} />
        <div className="project-detail__hero-shade" />
        <div className="project-detail__pos">
          {pad(index + 1)} / {pad(projects.length)}
        </div>
        <div className="project-detail__hero-inner">
          <p className="eyebrow">
            {project.category} — {project.year}
          </p>
          <SplitReveal as="h1" type="lines" immediate delay={0.25} className="project-detail__title">
            {project.name}
          </SplitReveal>
          <p className="project-detail__tagline">{project.tagline}</p>
        </div>
      </section>

      <section className="project-detail__body">
        <div className="project-detail__meta">
          <div>
            <span className="eyebrow">Client</span>
            <p>{project.client}</p>
          </div>
          <div>
            <span className="eyebrow">Services</span>
            <div className="project-detail__pills">
              {project.services.map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="eyebrow">Year</span>
            <p>{project.year}</p>
          </div>
        </div>
        <div className="project-detail__desc-wrap">
          <p className="project-detail__desc">{project.description}</p>
          {project.url && (
            <MagneticButton href={project.url} target="_blank" rel="noopener noreferrer" cursorLabel="Visit">
              Visit live site <Arrow className="arrow" />
            </MagneticButton>
          )}
        </div>
      </section>

      <section className="project-detail__idea">
        <span className="eyebrow project-detail__idea-tag">(01) The idea</span>
        <div className="project-detail__echo">
          <div className="project-detail__word">{word}</div>
          {ECHOES.map((k, i) => (
            <div
              key={k}
              ref={(el) => (echoRefs.current[i] = el)}
              className={`project-detail__word project-detail__word--echo project-detail__word--echo-${k}`}
              aria-hidden="true"
            >
              {word}
            </div>
          ))}
        </div>
        <p className="serif-line project-detail__quote">&ldquo;{project.tagline}&rdquo;</p>
      </section>

      <section className="project-detail__gallery" ref={galleryRef}>
        <div className="project-detail__gallery-head">
          <span className="eyebrow">(02) In the browser</span>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" data-cursor="Visit">
              {host} <Arrow className="arrow" />
            </a>
          )}
        </div>

        {gallery.length ? (
          <div className="project-detail__grid">
            {gallery.map((s, i) => (
              <figure
                key={s.src}
                className={`project-detail__cell project-detail__cell--${s.kind}`}
                data-speed={s.speed}
              >
                <div className="project-detail__frame">
                  {s.kind === 'phone' ? (
                    <div className="project-detail__phone">
                      <span className="project-detail__phone-notch" aria-hidden="true" />
                      <img src={s.src} alt={`${project.name} — ${s.label}`} loading="lazy" />
                    </div>
                  ) : (
                    <div className="project-detail__browser">
                      <div className="project-detail__browser-bar">
                        <span className="project-detail__browser-dots" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className="project-detail__browser-url">{host || project.name}</span>
                      </div>
                      <div className="project-detail__browser-view">
                        <img src={s.src} alt={`${project.name} — ${s.label}`} loading="lazy" />
                      </div>
                    </div>
                  )}
                </div>
                <figcaption>
                  <span>{pad(i + 1)}</span>
                  <span>{s.label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <figure className="project-detail__cell project-detail__cell--full">
            <div className="project-detail__frame">
              <div className="project-detail__browser">
                <div className="project-detail__browser-bar">
                  <span className="project-detail__browser-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="project-detail__browser-url">{host || project.name}</span>
                </div>
                <div
                  className="project-detail__browser-view"
                  style={posters[index] ? { backgroundImage: `url(${posters[index]})` } : undefined}
                />
              </div>
            </div>
            <figcaption>
              <span>01</span>
              <span>Preview</span>
            </figcaption>
          </figure>
        )}
      </section>

      <Link
        to={`/work/${next.slug}`}
        className={`project-detail__next ${nextHover ? 'is-hovered' : ''}`}
        data-cursor="Next project"
        onMouseEnter={() => setNextHover(true)}
        onMouseLeave={() => setNextHover(false)}
      >
        <Pattern type="flow" transparent alpha={0.4} className="pattern project-detail__next-bg" />
        <div className="project-detail__next-row">
          <div>
            <span className="eyebrow">Next project</span>
            <span className="project-detail__next-name">{next.name} <Arrow className="project-detail__next-arrow" /></span>
          </div>
          <div
            className="project-detail__next-card"
            style={{ backgroundImage: posters[nextIndex] ? `url(${posters[nextIndex]})` : 'none' }}
          />
        </div>
      </Link>

      <CtaFooter description={false} short />
    </>
  );
}
