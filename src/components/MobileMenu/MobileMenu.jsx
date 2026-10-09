import { useEffect, useRef, useState } from 'react';
import Arrow from '../Arrow/Arrow';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Pattern from '../Pattern/Pattern';
import PaletteSwatches from '../PaletteSwatches/PaletteSwatches';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { getLenis } from '../../hooks/useLenis';
import { EASE_CINEMATIC } from '../../lib/ease';
import { projects } from '../../data/projects';
import { useTheme } from '../../context/ThemeContext';
import { getPosterURLs } from '../../lib/posters';
import './mobile-menu.scss';

const pad = (n) => String(n).padStart(2, '0');

const athensTime = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Athens' }).format(new Date());

// While open: no page scroll (Lenis stopped + native overflow locked, which
// also covers iOS rubber-banding via overscroll-behavior on the menu).
function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const html = document.documentElement;
    const prev = html.style.overflow;
    const lenis = getLenis();
    lenis?.stop();
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
      lenis?.start();
    };
  }, [locked]);
}

/**
 * Full-screen mobile menu: two theme-colored layers sweep up (same motion
 * as the route curtain), a flow-field pattern runs behind giant masked
 * links, and the palette / reverse controls + contact live in the footer.
 */
export default function MobileMenu({ open, onClose, links }) {
  const location = useLocation();
  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const [mounted, setMounted] = useState(false); // keeps the pattern alive through the close animation
  const [time, setTime] = useState(athensTime);
  const { colors } = useTheme();
  const [posters, setPosters] = useState([]);
  const [hoverProject, setHoverProject] = useState(0);

  // Duotone posters for the desktop project preview; only fetched while open.
  useEffect(() => {
    if (!open) return undefined;
    let dead = false;
    getPosterURLs(colors).then((urls) => !dead && setPosters(urls));
    return () => {
      dead = true;
    };
  }, [open, colors]);

  // On open: mount the pattern and refresh the clock (render-phase update,
  // not an effect, so it lands in the same commit as the opening frame).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
      setTime(athensTime());
    }
  }

  useScrollLock(open);

  useEffect(() => {
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.set(root, { autoAlpha: 0 });
      gsap.set(q('.menu__layer'), { yPercent: 100 });
      gsap.set(q('.menu__line'), { yPercent: 115 });
      gsap.set(q('.menu__fade'), { autoAlpha: 0, y: 14 });

      tlRef.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            gsap.set(root, { autoAlpha: 0 });
            setMounted(false);
          },
        })
        .set(root, { autoAlpha: 1 })
        .to(q('.menu__layer'), { yPercent: 0, duration: 0.7, stagger: 0.07, ease: EASE_CINEMATIC })
        .to(q('.menu__line'), { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'power4.out' }, 0.45)
        .to(q('.menu__fade'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' }, 0.65);
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (open) {
      if (reduce) tl.progress(1).pause();
      else tl.timeScale(1).play();
      // Focus the first link once it's on its way in.
      const id = window.setTimeout(() => rootRef.current?.querySelector('.menu__link')?.focus(), 400);
      return () => window.clearTimeout(id);
    }
    if (reduce) {
      tl.progress(0).pause();
      tl.eventCallback('onReverseComplete')();
    } else tl.timeScale(1.7).reverse();
    return undefined;
  }, [open]);

  // Escape closes.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const clock = window.setInterval(() => setTime(athensTime()), 30000);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearInterval(clock);
    };
  }, [open, onClose]);

  const isCurrent = (to) =>
    to.includes('#') ? location.pathname === '/' && location.hash === to.slice(1) : location.pathname.startsWith(to);

  const meta = {
    '/work': `${pad(projects.length)} projects`,
    '/#lab': 'Why it works',
    '/about': 'Studio',
    '/contact': 'Say hi',
  };

  return createPortal(
    <div
      ref={rootRef}
      id="mobile-menu"
      className="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="menu__layer menu__layer--a" />
      <div className="menu__layer menu__layer--b">
        {mounted && <Pattern type="flow" on="b" transparent alpha={0.3} />}
      </div>

      <div className="menu__inner" data-lenis-prevent>
        <div className="menu__top menu__fade">
          <div className="menu__top-text">
            <span className="eyebrow">(M) Menu</span>
            <span className="eyebrow menu__muted">Athens, GR — {time}</span>
          </div>
          <button type="button" className="menu__close" onClick={onClose} data-cursor="Close">
            Close
            <span className="menu__close-x" aria-hidden="true" />
          </button>
        </div>

        <div className="menu__body">
        <nav className="menu__nav">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className={`menu__link ${isCurrent(l.to) ? 'is-current' : ''}`}
              aria-current={isCurrent(l.to) ? 'page' : undefined}
              onClick={onClose}
            >
              <span className="menu__mask">
                <span className="menu__line">
                  <span className="menu__n">{pad(i + 1)}</span>
                  <span className="menu__label">{l.label}</span>
                  <span className="menu__meta">
                    {isCurrent(l.to) ? <span className="serif-line">you&rsquo;re here</span> : meta[l.to]}
                  </span>
                  <Arrow className="menu__arrow" />
                </span>
              </span>
            </Link>
          ))}
        </nav>

        <aside className="menu__aside menu__fade" aria-label="Selected work">
          <div className="menu__poster" aria-hidden="true">
            {projects.map((p, i) => (
              <div
                key={p.slug}
                className={`menu__poster-img ${hoverProject === i ? 'is-active' : ''}`}
                style={{ backgroundColor: p.color, backgroundImage: posters[i] ? `url(${posters[i]})` : undefined }}
              />
            ))}
          </div>
          <span className="eyebrow menu__muted">Selected work</span>
          <ul className="menu__projects">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Link
                  to={`/work/${p.slug}`}
                  className={`menu__project ${hoverProject === i ? 'is-active' : ''}`}
                  onClick={onClose}
                  onMouseEnter={() => setHoverProject(i)}
                  onFocus={() => setHoverProject(i)}
                >
                  <span className="menu__project-n">{pad(i + 1)}</span>
                  <span className="menu__project-name">{p.name}</span>
                  <span className="menu__project-year">{p.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        </div>

        <div className="menu__foot">
          <div className="menu__controls menu__fade">
            <span className="eyebrow menu__muted">Palette</span>
            <PaletteSwatches />
            <span className="menu__divider" />
            <span className="eyebrow menu__muted">Reverse</span>
            <ThemeToggle />
          </div>
          <a href="mailto:hello@apostolisgkanatsios.com" className="menu__mail menu__fade">
            hello@apostolisgkanatsios.com <Arrow />
          </a>
          <p className="serif-line menu__tag menu__fade">Creative developer — available for new projects.</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
