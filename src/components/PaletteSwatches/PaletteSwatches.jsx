import { useTheme } from '../../context/ThemeContext';
import { PALETTES } from '../../lib/palettes';
import './palette-swatches.scss';

export default function PaletteSwatches() {
  const { palette, setPalette } = useTheme();

  return (
    <div className="palette-swatches" role="group" aria-label="Color palette">
      {Object.entries(PALETTES).map(([key, p]) => (
        <button
          key={key}
          type="button"
          className={`palette-swatches__dot ${palette === key ? 'is-active' : ''}`}
          style={{ background: `linear-gradient(135deg, ${p.a} 50%, ${p.b} 50%)` }}
          onClick={() => setPalette(key)}
          data-cursor={p.label}
          aria-label={`${p.label} palette`}
          aria-pressed={palette === key}
        />
      ))}
    </div>
  );
}
