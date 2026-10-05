import { useEffect, useRef, useState } from 'react';
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

const pad = (n) => String(n).padStart(2, '0');
const ECHOES = [1, 2, 3];
const SHOTS = [
  { label: 'Homepage', className: 'is-wide', hint: 'Homepage screenshot' },
  { label: 'Detail', className: '', hint: 'Detail / mobile view' },
  { label: 'Detail', className: '', hint: 'Second detail' },
];

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

  if (!project) return <Navigate to="/work" replace />;

  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];
  const word = project.name.split(' ')[0];
  const shots = project.shots || [];

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
              Visit live site <span className="arrow">↗</span>
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

      <section className="project-detail__gallery">
        {SHOTS.map((s, i) => (
          <figure key={i} className={`project-detail__shot ${s.className}`}>
            <div className="project-detail__shot-frame">
              {shots[i] ? (
                <img src={shots[i]} alt={`${project.name} — ${s.label}`} loading="lazy" />
              ) : (
                <span className="project-detail__shot-empty">{s.hint}</span>
              )}
            </div>
            <figcaption>
              <span>{pad(i + 1)}</span>
              <span>{s.label}</span>
            </figcaption>
          </figure>
        ))}
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
            <span className="project-detail__next-name">{next.name} ↗</span>
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
