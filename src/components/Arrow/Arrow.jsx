const PATHS = {
  ne: ['M7 17 17 7', 'M8 7h9v9'],
  right: ['M4 12h16', 'M14 6l6 6-6 6'],
  left: ['M20 12H4', 'M10 6l-6 6 6 6'],
};

/**
 * Inline SVG arrow — replaces the ↗ ← → glyphs, which Chrome can swap for a
 * color emoji. Sized in em and colored via currentColor, so it drops in
 * wherever the glyph was. `dir`: 'ne' | 'right' | 'left'.
 */
export default function Arrow({ dir = 'ne', className = '', ...rest }) {
  return (
    <svg
      className={`arrow-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[dir].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
