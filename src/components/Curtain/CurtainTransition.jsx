import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { getLenis } from '../../hooks/useLenis';
import { EASE_CINEMATIC } from '../../lib/ease';
import './curtain.scss';

/**
 * Curtain-style route transition.
 *
 * Why not Barba.js: Barba re-implements SPA-like navigation (PJAX) on top of
 * plain multi-page sites; its own maintainers advise against pairing it with
 * a framework that already owns routing and the DOM, since the two end up
 * fighting over the same nodes. This reproduces the same visual — a panel
 * sweeps up to fully cover the viewport, the outgoing view is swapped for
 * the incoming one behind it, then the panel sweeps on off the top — using
 * React Router's location changes to drive a GSAP timeline instead.
 *
 * Usage: wrap <Routes location={displayLocation}>…</Routes> via the render
 * prop so the previous page stays mounted until the curtain fully covers.
 */
export default function CurtainTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const displayLocationRef = useRef(displayLocation);
  const panelRefs = useRef([]);

  useEffect(() => {
    if (location.pathname === displayLocationRef.current.pathname) return undefined;

    const panelsEls = panelRefs.current.filter(Boolean);
    const lenis = getLenis();
    lenis?.stop();
    document.body.classList.add('is-transitioning');

    const tl = gsap.timeline({
      defaults: { ease: EASE_CINEMATIC },
      onComplete: () => {
        document.body.classList.remove('is-transitioning');
        lenis?.start();
      },
    });

    // y: 0 clears the pixel offset GSAP infers the first time it parses the
    // panel's resting `transform: translateY(100%)` from curtain.scss — left
    // unset, that offset gets baked in as a fixed baseline and every later
    // yPercent tween stacks a second translate() on top of it, so by the
    // final -100% step the two cancel out and the curtain never actually
    // clears the viewport.
    tl.set(panelsEls, { yPercent: 100, y: 0 })
      .to(panelsEls, { yPercent: 0, duration: 0.65, stagger: 0.05 })
      .call(() => {
        lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
        displayLocationRef.current = location;
        setDisplayLocation(location);
      })
      // Leaves top layer first (--sa), uncovering the --sb one beneath it.
      .to([...panelsEls].reverse(), { yPercent: -100, duration: 0.65, stagger: 0.05, delay: 0.08 });

    return () => {
      tl.kill();
      // If the timeline gets interrupted mid-flight (e.g. a second navigation
      // fires before this one finishes), it never reaches onComplete — so
      // force the same cleanup here too, or the curtain is left stuck
      // covering the screen with scrolling permanently disabled.
      gsap.set(panelsEls, { yPercent: -100 });
      document.body.classList.remove('is-transitioning');
      lenis?.start();
    };
  }, [location]);

  return (
    <>
      <div className="curtain" aria-hidden="true">
        {/* Two full-viewport layers: --sb underneath, --sa on top. */}
        <div ref={(el) => (panelRefs.current[0] = el)} className="curtain__panel" />
        <div ref={(el) => (panelRefs.current[1] = el)} className="curtain__panel" />
      </div>
      {children(displayLocation)}
    </>
  );
}
