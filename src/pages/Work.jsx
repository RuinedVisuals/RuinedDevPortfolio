import { useMemo, useRef, useState } from 'react';
import Arrow from '../components/Arrow/Arrow';
import { Link, useNavigate } from 'react-router-dom';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import MagneticButton from '../components/MagneticButton/MagneticButton';
import Pattern from '../components/Pattern/Pattern';
import Gallery3D from '../components/Gallery3D/Gallery3D';
import CtaFooter from '../components/CtaFooter/CtaFooter';
import ProjectIndex from '../components/ProjectIndex/ProjectIndex';
import { GALLERY_MODES } from '../lib/gallery3d';
import { projects } from '../data/projects';
import './work.scss';

const pad = (n) => String(n).padStart(2, '0');
const TAGS = ['Web', 'E-commerce', 'Experimental'];
const countFor = (f) => (f === 'All' ? projects.length : projects.filter((p) => p.tag === f).length);
// Only offer filters that actually have work behind them.
const FILTERS = ['All', ...TAGS.filter((t) => countFor(t) > 0)];
const years = projects.map((p) => +p.year);

export default function Work() {
  const navigate = useNavigate();
  const galleryRef = useRef(null);
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState('arc');
  const [active, setActive] = useState(0);

  const items = useMemo(
    () => projects.map((_, i) => i).filter((i) => filter === 'All' || projects[i].tag === filter),
    [filter]
  );
  const activeProject = projects[active] || projects[0];
  const filterLabel = filter === 'All' ? 'All work' : filter;

  const pickFilter = (f) => {
    setFilter(f);
    const first = projects.findIndex((p) => f === 'All' || p.tag === f);
    if (first >= 0) setActive(first);
  };

  return (
    <>
      <section className="work-hero">
        <Pattern type="moire" transparent alpha={0.22} gap={11} lw={1.2} />
        <div className="above-pattern">
          <p className="eyebrow work-hero__eyebrow">Selected work</p>
          <SplitReveal as="h1" type="lines" immediate stagger={0.11} className="work-hero__title">
            Everything I&rsquo;ve
            <br />
            shipped, lately.
          </SplitReveal>
          <div className="work-hero__foot">
            <p className="serif-line work-hero__sub">
              Villas, stores, studios and artists — sites built for people with something to show.
            </p>
            <span className="work-hero__count">
              {pad(projects.length)} projects · {Math.min(...years)} — {Math.max(...years)}
            </span>
          </div>
        </div>
      </section>

      <section className="work-gallery">
        <div className="work-gallery__bar">
          <div className="work-gallery__filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`chip ${filter === f ? 'is-active' : ''}`}
                aria-pressed={filter === f}
                data-cursor="Filter"
                onClick={() => pickFilter(f)}
              >
                {f}
                <span className="chip__count">{pad(countFor(f))}</span>
              </button>
            ))}
          </div>
          <div className="mode-switch" role="group" aria-label="Gallery layout">
            {Object.entries(GALLERY_MODES).map(([key, m]) => (
              <button
                key={key}
                type="button"
                className={mode === key ? 'is-active' : ''}
                aria-pressed={mode === key}
                data-cursor={m.label}
                onClick={() => setMode(key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <Gallery3D
          ref={galleryRef}
          mode={mode}
          items={items}
          onActive={setActive}
          onOpen={(i) => navigate(`/work/${projects[i].slug}`)}
          className="work-gallery__stage"
        >
          {mode === 'pile' && (
            <div className="pile-card">
              <span className="pile-card__eyebrow">AG. archive</span>
              <span className="pile-card__title">{filterLabel}</span>
              <span className="pile-card__count">{pad(items.length)} projects</span>
            </div>
          )}
        </Gallery3D>

        <div className="gallery-caption">
          <span className="gallery-caption__title">{activeProject.name}</span>
          <span className="gallery-caption__sub">{activeProject.category}</span>
        </div>
        <div className="gallery-controls">
          <button
            type="button"
            className="gallery-controls__arrow"
            onClick={() => galleryRef.current?.step(-1)}
            data-cursor="Prev"
            aria-label="Previous project"
          >
            <Arrow dir="left" />
          </button>
          <MagneticButton as={Link} to={`/work/${activeProject.slug}`} cursorLabel="Open">
            Open project <Arrow className="arrow" />
          </MagneticButton>
          <button
            type="button"
            className="gallery-controls__arrow"
            onClick={() => galleryRef.current?.step(1)}
            data-cursor="Next"
            aria-label="Next project"
          >
            <Arrow dir="right" />
          </button>
        </div>
      </section>

      <section className="work-page">
        <div className="work-page__head">
          <h2 className="work-page__title">Index</h2>
          <span className="eyebrow work-page__meta">
            {filterLabel} — {pad(items.length)} projects
          </span>
        </div>

        <ProjectIndex items={items} />
      </section>

      <CtaFooter />
    </>
  );
}
