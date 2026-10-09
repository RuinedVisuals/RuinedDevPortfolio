import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { EASE_CINEMATIC } from '../../lib/ease';
import Logo from '../Logo/Logo';
import './loader.scss';

const WORDS = ['Design', 'Motion', 'Code', 'Craft'];
const FONTS = ['1em "Bigger Display"', '1em Anton', '600 1em Archivo'];

// Resolves once the display fonts are really in. The hero title is split into
// per-character spans; if the font lands *after* that (it used to, because it
// was only requested once the hero mounted), SplitText re-splits and the new,
// un-hidden characters flash in at full size before the reveal plays.
function loadFonts() {
  const all = Promise.all(FONTS.map((f) => document.fonts.load(f).catch(() => null))).then(() => document.fonts.ready);
  const cap = new Promise((r) => setTimeout(r, 4000));
  return Promise.race([all, cap]);
}

/**
 * Cinematic preloader. `onReveal` fires as the shutters are about to open
 * (mount the site so the hero reveal plays underneath), `onComplete` once the
 * loader can be removed.
 */
export default function Loader({ onReveal, onComplete }) {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const wordRef = useRef(null);
  const fillRef = useRef(null);
  const markRef = useRef(null);
  const contentRef = useRef(null);
  const topRef = useRef(null);
  const botRef = useRef(null);
  const lineRef = useRef(null);
  const cbs = useRef({ onReveal, onComplete });
  cbs.current = { onReveal, onComplete };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    html.style.overflow = 'hidden';

    let ready = false;
    let alive = true;

    const ctx = gsap.context(() => {
      const state = { p: 0 };
      const paint = () => {
        // ctx.revert() re-renders tweens at their start on unmount, after
        // React has already detached these nodes.
        if (!countRef.current) return;
        countRef.current.textContent = String(Math.round(state.p)).padStart(3, '0');
        fillRef.current.style.clipPath = `inset(${100 - state.p}% 0 0 0)`;
        lineRef.current.style.transform = `scaleX(${state.p / 100})`;
        const wi = Math.min(WORDS.length - 1, Math.floor((state.p / 100) * WORDS.length));
        if (wordRef.current.dataset.i !== String(wi)) {
          wordRef.current.dataset.i = String(wi);
          wordRef.current.textContent = WORDS[wi];
        }
      };
      paint();

      gsap.set(markRef.current, { opacity: 0, y: 24, scale: 0.97 });
      gsap.set('.loader__fade', { opacity: 0, y: 12 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });

      // Intro: wordmark letters rise out of their masks, meta fades in.
      tl.to(markRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, 0.1)
        .to('.loader__fade', { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' }, 0.3)
        // Progress: eases up to 90, then waits there if assets are still loading.
        .to(state, { p: 90, duration: reduce ? 0.6 : 2.2, ease: 'power2.inOut', onUpdate: paint }, 0.2)
        .call(() => {
          if (ready) return;
          tl.pause();
          loadFonts().then(() => {
            ready = true;
            if (alive) tl.resume();
          });
        })
        .to(state, { p: 100, duration: 0.5, ease: 'power2.out', onUpdate: paint })
        // Hold on the filled wordmark for a beat.
        .to(markRef.current, { scale: 1.03, duration: 0.7, ease: 'power1.inOut' }, '>-0.1')
        .call(() => cbs.current.onReveal?.(), null, '>-0.2')
        // Exit: content lifts away, shutters split top / bottom.
        .to(contentRef.current, { opacity: 0, scale: 1.08, duration: 0.55, ease: 'power3.in' }, '>0.05')
        .to(topRef.current, { yPercent: -100, duration: 1.1, ease: EASE_CINEMATIC }, '>-0.2')
        .to(botRef.current, { yPercent: 100, duration: 1.1, ease: EASE_CINEMATIC }, '<')
        .call(() => cbs.current.onComplete?.());

      // Start fetching right away so it's usually done long before 90%.
      loadFonts().then(() => {
        ready = true;
      });
    }, rootRef);

    return () => {
      alive = false;
      ctx.revert();
      html.style.overflow = '';
    };
  }, []);

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Loading">
      <div ref={topRef} className="loader__half loader__half--top" />
      <div ref={botRef} className="loader__half loader__half--bot" />

      <div ref={contentRef} className="loader__content">
        <div className="loader__top loader__fade">
          <span>AG. / Portfolio {new Date().getFullYear()}</span>
          <span>Athens, GR</span>
        </div>

        <div ref={markRef} className="loader__mark" aria-hidden="true">
          <Logo outline className="loader__logo" />
          <div ref={fillRef} className="loader__mark-fill">
            <Logo className="loader__logo" />
          </div>
        </div>

        <div className="loader__bottom loader__fade">
          <span ref={wordRef} className="loader__word" />
          <span ref={countRef} className="loader__count" />
        </div>
        <div className="loader__track loader__fade">
          <div ref={lineRef} className="loader__line" />
        </div>
      </div>
    </div>
  );
}
