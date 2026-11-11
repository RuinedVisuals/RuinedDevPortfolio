import { useEffect, useRef, useState } from 'react';
import { usePageMeta } from '../components/Seo/usePageMeta';
import { projectMeta } from '../data/seo';
import Arrow from '../components/Arrow/Arrow';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import MagneticButton from '../components/MagneticButton/MagneticButton';
import Pattern from '../components/Pattern/Pattern';
import HeroGL from '../components/HeroGL/HeroGL';
import CtaFooter from '../components/CtaFooter/CtaFooter';
import { useTheme } from '../context/ThemeContext';
import { getPosterURLs } from '../lib/posters';
import { projects } from '../data/projects';
import './project-detail.scss';

const pad = (n) => String(n).padStart(2, '0');
const ECHOES = [1, 2, 3];
const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

// Gallery deck: one card per desktop capture (a screen recording leads when
// there is one), with all the phone captures sharing a single card.
function buildShots(shots, video) {
  const d = shots?.desktop || [];
  const m = shots?.mobile || [];
  const out = d.map((src, i) => ({ src, label: i ? 'Desktop' : 'Homepage' }));
  if (video) out[0] = { src: video, video: true, poster: d[0], label: 'Walkthrough' };
  if (m.length) out.splice(Math.min(2, out.length), 0, { src: m[0], phones: m.slice(0, 3), label: 'Mobile' });
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
  // Arrived by a gallery card expanding into this hero: skip its own wipe-in.
  const fromCard = !!useLocation().state?.expand;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  usePageMeta(project ? { ...projectMeta(project), path: `/work/${slug}` } : { title: 'Project | RUINED', path: `/work/${slug}` });
  const gallery = buildShots(project?.shots, project?.video);
  // Stacking deck: each card sticks under the header (CSS) and, as the next
  // one slides up over it, shrinks and dims. Read from live rects on scroll,
  // so it stays right however the page reflows.
  const galleryRef = useRef(null);
  useEffect(() => {
    const root = galleryRef.current;
    if (!root || reduce) return undefined;
    const cells = [...root.querySelectorAll('.project-detail__cell')];
    const update = () => {
      const vh = window.innerHeight;
      cells.forEach((el, i) => {
        const next = cells[i + 1];
        if (!next) return;
        const top = el.getBoundingClientRect().top;
        // 0 until the next card enters the viewport, 1 once it has slid up to this one.
        const p = top < vh ? Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / (vh - top))) : 0;
        const frame = el.firstElementChild;
        frame.style.transform = `scale(${1 - 0.08 * p})`;
        frame.style.filter = p ? `brightness(${1 - 0.5 * p})` : '';
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [gallery.length, reduce]);

  if (!project) return <Navigate to="/work" replace />;

  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];
  const word = project.name.split(' ')[0];
  const host = hostOf(project.url);

  return (
    <>
      <section className="project-detail__hero" data-cursor="Move">
        <HeroGL index={index} reveal={!fromCard} />
        <div className="project-detail__hero-shade" />
        <div className="project-detail__pos">
          {pad(index + 1)} / {pad(projects.length)}
        </div>
        <div className="project-detail__hero-inner">
          <p className="eyebrow">
            {project.category} · {project.year}
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
          {project.technologies?.length > 0 && (
            <div>
              <span className="eyebrow">Technologies</span>
              <div className="project-detail__pills">
                {project.technologies.map((t) => (
                  <span key={t} className="pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="eyebrow">Role</span>
            <p>{project.contribution}</p>
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

      {(project.challenge || project.solution || project.results) && (
        <section className="project-detail__case">
          {[
            ['Challenge', project.challenge],
            ['Solution', project.solution],
            ['Results', project.results],
          ]
            .filter(([, text]) => text)
            .map(([label, text]) => (
              <div key={label} className="project-detail__case-col">
                <span className="eyebrow">{label}</span>
                <p>{text}</p>
              </div>
            ))}
        </section>
      )}

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
              <figure key={s.src} className="project-detail__cell" style={{ '--i': i }}>
                <div className="project-detail__frame">
                  {s.phones ? (
                    <div className="project-detail__phones">
                      {s.phones.map((src) => (
                        <div key={src} className="project-detail__phone">
                          <span className="project-detail__phone-notch" aria-hidden="true" />
                          <img src={src} alt={`${project.name}, ${s.label}`} loading="lazy" />
                        </div>
                      ))}
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
                        {s.video ? (
                          <video
                            src={s.src}
                            poster={s.poster}
                            aria-label={`${project.name}, ${s.label}`}
                            muted
                            loop
                            playsInline
                            autoPlay={!reduce}
                            controls={reduce}
                          />
                        ) : (
                          <img src={s.src} alt={`${project.name}, ${s.label}`} loading="lazy" />
                        )}
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
          <figure className="project-detail__cell">
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
