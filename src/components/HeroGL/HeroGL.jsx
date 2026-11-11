import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { createHeroGL } from '../../lib/heroGL';
import { getPoster } from '../../lib/posters';

/** Full-bleed WebGL poster for project `index`; fills its positioned parent. */
export default function HeroGL({ index, grain = 0.12, reveal = true }) {
  const elRef = useRef(null);
  const heroRef = useRef(null);
  const { colors } = useTheme();
  const colorsRef = useRef(colors);
  useLayoutEffect(() => {
    colorsRef.current = colors;
  });

  useEffect(() => {
    let dead = false;
    getPoster(index, 2.5).then((poster) => {
      if (dead || !elRef.current) return;
      heroRef.current = createHeroGL(elRef.current, poster, { colors: colorsRef.current, grain, reveal });
    });
    return () => {
      dead = true;
      heroRef.current?.destroy();
      heroRef.current = null;
    };
  }, [index, grain, reveal]);

  useEffect(() => heroRef.current?.setColors(colors), [colors]);

  return <div ref={elRef} className="hero-gl" aria-hidden="true" style={{ position: 'absolute', inset: 0 }} />;
}
