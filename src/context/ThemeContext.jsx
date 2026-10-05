import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { EASE_CINEMATIC } from '../lib/ease';
import { PALETTES, DEFAULT_PALETTE, DEFAULT_REVERSED, computeColors, applyColors } from '../lib/palettes';

const ThemeContext = createContext(null);

const THEME_KEY = 'ag-theme';
const PALETTE_KEY = 'ag-pal';

function readStored() {
  try {
    const pal = window.localStorage.getItem(PALETTE_KEY);
    const theme = window.localStorage.getItem(THEME_KEY);
    return {
      palette: PALETTES[pal] ? pal : DEFAULT_PALETTE,
      reversed: theme ? theme === 'reversed' : DEFAULT_REVERSED,
    };
  } catch {
    return { palette: DEFAULT_PALETTE, reversed: DEFAULT_REVERSED };
  }
}

export function ThemeProvider({ children }) {
  // Vars are applied inside the initializer (not an effect) so the very
  // first paint is already in the stored palette — no flash of Signal red.
  const [colors, setColors] = useState(() => {
    const { palette, reversed } = readStored();
    const c = computeColors(palette, reversed);
    applyColors(c);
    return c;
  });
  const panelRefs = useRef([]);
  const busy = useRef(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(PALETTE_KEY, colors.palette);
      window.localStorage.setItem(THEME_KEY, colors.reversed ? 'reversed' : 'default');
    } catch {
      /* storage unavailable — ignore */
    }
  }, [colors]);

  // Same two-panel sweep as CurtainTransition, but colored in the *incoming*
  // palette so the swap happens while the screen is fully covered.
  const switchTo = useCallback((palette, reversed) => {
    if (busy.current) return;
    const next = computeColors(palette, reversed);
    const [a, b] = panelRefs.current;
    const commit = () => {
      applyColors(next);
      setColors(next);
    };

    if (!a || !b || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      commit();
      return;
    }

    busy.current = true;
    a.style.background = next.sb;
    b.style.background = next.sa;
    gsap
      .timeline({ defaults: { duration: 0.65, ease: EASE_CINEMATIC }, onComplete: () => (busy.current = false) })
      .set([a, b], { yPercent: 100, y: 0 })
      .to(a, { yPercent: 0 }, 0)
      .to(b, { yPercent: 0 }, 0.05)
      .call(commit)
      .to(b, { yPercent: -100 }, '+=0.08')
      .to(a, { yPercent: -100 }, '<0.05');
  }, []);

  const toggle = useCallback(() => switchTo(colors.palette, !colors.reversed), [colors, switchTo]);
  const setPalette = useCallback((p) => p !== colors.palette && switchTo(p, colors.reversed), [colors, switchTo]);

  return (
    <ThemeContext.Provider
      value={{ colors, palette: colors.palette, reversed: colors.reversed, toggle, setPalette }}
    >
      <div className="theme-curtain" aria-hidden="true">
        <div ref={(el) => (panelRefs.current[0] = el)} className="theme-curtain__panel" />
        <div ref={(el) => (panelRefs.current[1] = el)} className="theme-curtain__panel" />
      </div>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/**
 * Live theme colors for imperative render loops (canvas / WebGL) that
 * shouldn't re-run their setup effect every time the palette changes.
 */
export function useThemeColorsRef() {
  const { colors } = useTheme();
  const ref = useRef(colors);
  useLayoutEffect(() => {
    ref.current = colors;
  });
  return ref;
}
