import { useEffect, useRef, useState } from 'react';
import Arrow from '../Arrow/Arrow';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getPosterURLs } from '../../lib/posters';
import { projects } from '../../data/projects';
import './project-index.scss';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Hoverable project index: numbered rows that dim their siblings on hover,
 * with the project's poster trailing the cursor (fine pointers only).
 * `items` are indices into `projects`; `nameKey` picks what the big label
 * shows ('name' | 'client').
 */
export default function ProjectIndex({ items, nameKey = 'name' }) {
  const previewRef = useRef(null);
  const { colors } = useTheme();
  const [hover, setHover] = useState(-1);
  const [posters, setPosters] = useState([]);

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

  return (
    <>
      <ul className={`project-index ${hover >= 0 ? 'has-hover' : ''}`}>
        {items.map((i, k) => {
          const p = projects[i];
          return (
            <li
              key={p.slug}
              className={`project-index__row ${hover === i ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
            >
              <Link to={`/work/${p.slug}`} className="project-index__link" data-cursor="View">
                <span className="project-index__index">{pad(k + 1)}</span>
                <span className="project-index__name">{p[nameKey]}</span>
                <span className="project-index__cat">{p.category}</span>
                <span className="project-index__year">{p.year}</span>
                <Arrow className="project-index__arrow" />
              </Link>
            </li>
          );
        })}
      </ul>

      <div
        ref={previewRef}
        className={`work-preview ${hover >= 0 ? 'is-visible' : ''}`}
        style={{ backgroundImage: hover >= 0 && posters[hover] ? `url(${posters[hover]})` : 'none' }}
        aria-hidden="true"
      />
    </>
  );
}
