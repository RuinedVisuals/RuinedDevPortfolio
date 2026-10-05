import { useEffect, useRef } from 'react';
import { useTheme, useThemeColorsRef } from '../../context/ThemeContext';
import { createSketch } from '../../lib/sketches';

// Default ink: surface-a background / ink-on-a. `on="b"` swaps to the
// surface-b pair for patterns sitting on a --sb section.
const pick = (c, on) => (on === 'b' ? { bg: c.sb, ink: c.ib } : { bg: c.sa, ink: c.ia });

/**
 * Generative canvas pattern (flow / ascii / moire). Fills its positioned
 * parent by default (`.pattern`); pass className/style to mask or resize.
 */
export default function Pattern({ type, on = 'a', className = 'pattern', style, ...opts }) {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const colorsRef = useThemeColorsRef();
  const { colors } = useTheme();
  const optsKey = JSON.stringify(opts);

  useEffect(() => {
    const sketch = createSketch(canvasRef.current, type, () => pick(colorsRef.current, on), JSON.parse(optsKey));
    sketchRef.current = sketch;
    return () => sketch.destroy();
  }, [type, on, optsKey, colorsRef]);

  // Repaint from scratch on palette change so old-color trails don't linger.
  useEffect(() => {
    sketchRef.current?.reset();
  }, [colors]);

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden="true" />;
}
