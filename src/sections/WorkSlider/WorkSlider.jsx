import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SplitReveal from '../../components/SplitReveal/SplitReveal';
import MagneticButton from '../../components/MagneticButton/MagneticButton';
import Gallery3D from '../../components/Gallery3D/Gallery3D';
import { GALLERY_MODES } from '../../lib/gallery3d';
import { projects } from '../../data/projects';
import './work-slider.scss';

const pad = (n) => String(n).padStart(2, '0');

export default function WorkSlider() {
  const galleryRef = useRef(null);
  const navigate = useNavigate();
  const [mode, setMode] = useState('ring');
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <section className="work-slider" id="work">
      <div className="work-slider__head">
        <SplitReveal as="h2" type="lines" className="serif-line work-slider__title">
          Selected work,
          <br />a different perspective.
        </SplitReveal>
      </div>

      <div className="work-slider__bar">
        <span className="eyebrow work-slider__hint">Drag to explore — click to open</span>
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
        onActive={setActive}
        onOpen={(i) => navigate(`/work/${projects[i].slug}`)}
      >
        {mode === 'pile' && (
          <div className="pile-card">
            <span className="pile-card__eyebrow">AG. archive</span>
            <span className="pile-card__title">
              Selected
              <br />
              work
            </span>
            <span className="pile-card__count">{pad(projects.length)} projects</span>
          </div>
        )}
      </Gallery3D>

      <div className="gallery-caption">
        <span className="gallery-caption__title">{project.name}</span>
        <span className="gallery-caption__sub">{project.category}</span>
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
        <span className="gallery-controls__count">
          {pad(active + 1)} / {pad(projects.length)}
        </span>
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

      <div className="work-slider__foot">
        <MagneticButton as={Link} to="/work" cursorLabel="See all">
          View all work <span className="arrow">↗</span>
        </MagneticButton>
      </div>
    </section>
  );
}
