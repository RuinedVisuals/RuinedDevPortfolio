import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SplitReveal from '../components/SplitReveal/SplitReveal';
import MagneticButton from '../components/MagneticButton/MagneticButton';
import Pattern from '../components/Pattern/Pattern';
import Gallery3D from '../components/Gallery3D/Gallery3D';
import CtaFooter from '../components/CtaFooter/CtaFooter';
import { GALLERY_MODES } from '../lib/gallery3d';
import { getPosterURLs } from '../lib/posters';
import { useTheme } from '../context/ThemeContext';
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
  const previewRef = useRef(null);
  const { colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState('arc');
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(-1);
  const [posters, setPosters] = useState([]);

  const items = useMemo(
    () => projects.map((_, i) => i).filter((i) => filter === 'All' || projects[i].tag === filter),
    [filter]
  );
  const activeProject = projects[active] || projects[0];
  const filterLabel = filter === 'All' ? 'All work' : filter;

  useEffect(() => {
    let dead = false;
    getPosterURLs(colors).then((urls) => !dead && setPosters(urls));
    return () => {
      dead = true;
    };
  }, [colors]);

  // Hover preview card trails the cursor, tilting with horizontal velocity.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const m = { x: 0, y: 0, cx: 0, cy: 0, r: 0 };
    let raf = 0;
    const move = (e) => {
      m.x = e.clientX;
      m.y = e.clientY;
    };
    const loop = () => {
      const dx = m.x - m.cx;
      m.cx += dx * 0.14;
      m.cy += (m.y - m.cy) * 0.14;
      m.r += (Math.max(-12, Math.min(12, dx * 0.08)) - m.r) * 0.1;
      el.style.transform = `translate(${m.cx}px,${m.cy}px) translate(-50%,-60%) rotate(${m.r}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
    };
  }, []);

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
            ←
          </button>
          <MagneticButton as={Link} to={`/work/${activeProject.slug}`} cursorLabel="Open">
            Open project <span className="arrow">↗</span>
          </MagneticButton>
          <button
            type="button"
            className="gallery-controls__arrow"
            onClick={() => galleryRef.current?.step(1)}
            data-cursor="Next"
            aria-label="Next project"
          >
            →
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

        <ul className={`work-page__list ${hover >= 0 ? 'has-hover' : ''}`}>
          {items.map((i, k) => {
            const p = projects[i];
            return (
              <li
                key={p.slug}
                className={`work-page__row ${hover === i ? 'is-hovered' : ''}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
              >
                <Link to={`/work/${p.slug}`} className="work-page__row-link" data-cursor="View">
                  <span className="work-page__row-index">{pad(k + 1)}</span>
                  <span className="work-page__row-name">{p.name}</span>
                  <span className="work-page__row-cat">{p.category}</span>
                  <span className="work-page__row-year">{p.year}</span>
                  <span className="work-page__row-arrow">↗</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div
        ref={previewRef}
        className={`work-preview ${hover >= 0 ? 'is-visible' : ''}`}
        style={{ backgroundImage: hover >= 0 && posters[hover] ? `url(${posters[hover]})` : 'none' }}
        aria-hidden="true"
      />

      <CtaFooter />
    </>
  );
}
