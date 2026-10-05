// a = surface-a, b = surface-b (ink-on-a = b, ink-on-b = a; reversed swaps
// a/b). pd / pl / ph are the shader duotone dark / light / hover-light.
export const PALETTES = {
  signal: { label: 'Signal', a: '#F40C3F', b: '#0a0a0a', pd: '#1c0f10', pl: '#F40C3F', ph: '#f4efe9' },
  riso: { label: 'Riso', a: '#8930e8', b: '#c49dee', pd: '#8930e8', pl: '#3039e8', ph: '#ffd84a' },
  ember: { label: 'Ember', a: '#ff5b1f', b: '#22130f', pd: '#140a07', pl: '#ff5b1f', ph: '#f4efe9' },
};

export const DEFAULT_PALETTE = 'signal';
// First visit starts on the reversed scheme (black canvas / red ink).
export const DEFAULT_REVERSED = true;

export function computeColors(palette, reversed) {
  const P = PALETTES[palette] || PALETTES[DEFAULT_PALETTE];
  const sa = reversed ? P.b : P.a;
  const sb = reversed ? P.a : P.b;
  return { palette, reversed, sa, sb, ia: sb, ib: sa, pd: P.pd, pl: P.pl, ph: P.ph };
}

export function applyColors(c) {
  const s = document.documentElement.style;
  s.setProperty('--sa', c.sa);
  s.setProperty('--sb', c.sb);
  s.setProperty('--ia', c.ia);
  s.setProperty('--ib', c.ib);
  document.documentElement.setAttribute('data-theme', c.reversed ? 'reversed' : 'default');
  document.documentElement.setAttribute('data-palette', c.palette);
}
