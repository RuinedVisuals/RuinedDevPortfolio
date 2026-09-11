import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../MagneticButton/MagneticButton';
import { projects } from '../../data/projects';
import './footer.scss';

gsap.registerPlugin(ScrollTrigger);

const NUM_COLUMNS = 3;
const GRID_SIZE = 12;
// Cycle the real project shots to fill the grid, so this finale doubles as a
// last look at the work rather than needing its own dedicated photo set.
const gridImages = Array.from({ length: GRID_SIZE }, (_, i) => projects[i % projects.length]);

/**
 * Adapted from Codrops' "Sticky Grid Scroll" (Theo Plawinski, MIT) — a tall
 * pinned block where a photo grid assembles then zooms outward as you
 * scroll, revealing the contact CTA underneath. Reworked here with our own
 * GSAP/Lenis setup, tokens and copy instead of the original demo markup.
 */
export default function Footer({ ready = true }) {
  const footerRef = useRef(null);
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonWrapRef = useRef(null);
  const gridRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    // Footer stays mounted for the app's whole lifetime (it's outside the
    // routed/swapped page content), so without this it sets up its
    // ScrollTrigger the moment it mounts — while the loader is still up and
    // the rest of the page hasn't mounted yet, i.e. against a near-empty
    // document. That bakes in trigger positions for a page a fraction of
    // its real height, so the scroll-scrubbed reveal never lines up on a
    // fresh load (it only looks right after a route change refreshes
    // things). Waiting for `ready` means the real page height is already in
    // place before ScrollTrigger ever measures it.
    if (!ready) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const items = itemRefs.current.filter(Boolean);
      const columns = Array.from({ length: NUM_COLUMNS }, () => []);
      items.forEach((item, i) => columns[i % NUM_COLUMNS].push(item));

      // Vertically center the title inside the content box while the
      // description/button are hidden, then slide it up to make room once
      // they fade in below it.
      const dy = (contentRef.current.offsetHeight - titleRef.current.offsetHeight) / 2;
      const titleOffsetY = (dy / contentRef.current.offsetHeight) * 100;
      gsap.set(titleRef.current, { yPercent: titleOffsetY });
      gsap.set([descRef.current, buttonWrapRef.current], { opacity: 0, pointerEvents: 'none' });

      gsap.from(wrapperRef.current, {
        yPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });

      function gridRevealTimeline() {
        const tl = gsap.timeline();
        const wh = window.innerHeight;
        const dyOut = wh - (wh - gridRef.current.offsetHeight) / 2;

        columns.forEach((column, colIndex) => {
          const fromTop = colIndex % 2 === 0;
          tl.from(
            column,
            {
              y: dyOut * (fromTop ? -1 : 1),
              stagger: { each: 0.06, from: fromTop ? 'end' : 'start' },
              ease: 'power1.inOut',
            },
            'grid-reveal'
          );
        });

        return tl;
      }

      function gridZoomTimeline() {
        const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } });

        tl.to(gridRef.current, { scale: 2.05 });
        tl.to(columns[0], { xPercent: -40 }, '<');
        tl.to(columns[2], { xPercent: 40 }, '<');
        tl.to(
          columns[1],
          {
            yPercent: (index) => (index < Math.floor(columns[1].length / 2) ? -1 : 1) * 40,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '-=0.5'
        );

        return tl;
      }

      function toggleContent(isVisible) {
        gsap
          .timeline({ defaults: { overwrite: true } })
          .to(titleRef.current, { yPercent: isVisible ? 0 : titleOffsetY, duration: 0.7, ease: 'power2.inOut' })
          .to(
            [descRef.current, buttonWrapRef.current],
            {
              opacity: isVisible ? 1 : 0,
              duration: 0.4,
              ease: `power1.${isVisible ? 'inOut' : 'out'}`,
              pointerEvents: isVisible ? 'all' : 'none',
            },
            isVisible ? '-=90%' : '<'
          );
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 25%',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      timeline
        .add(gridRevealTimeline())
        .add(gridZoomTimeline(), '-=0.6')
        .add(() => toggleContent(timeline.scrollTrigger.direction === 1), '-=0.32');
    }, footerRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <footer className="site-footer" id="contact" ref={footerRef}>
      <div className="site-footer__wrapper" ref={wrapperRef}>
        <ul className="site-footer__grid" ref={gridRef}>
          {gridImages.map((p, i) => (
            <li key={`${p.slug}-${i}`} className="site-footer__item" ref={(el) => (itemRefs.current[i] = el)}>
              <div
                className="site-footer__item-image"
                style={{
                  backgroundColor: p.color,
                  backgroundImage: p.image ? `url(${p.image})` : undefined,
                }}
              />
            </li>
          ))}
        </ul>

        <div className="site-footer__content" ref={contentRef}>
          <p className="eyebrow site-footer__eyebrow">Got a project in mind?</p>
          <h2 className="site-footer__title" ref={titleRef}>
            Let&rsquo;s talk.
          </h2>
          <p className="site-footer__description" ref={descRef}>
            Tell me about it — I read every message and usually reply within a day.
          </p>
          <div className="site-footer__button-wrap" ref={buttonWrapRef}>
            <MagneticButton href="mailto:hello@apostolisgkanatsios.com" cursorLabel="Say hi" className="site-footer__link">
              Contact <span className="arrow">↗</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
