// Post-build: writes a per-route copy of dist/index.html with the right
// <title>, description, canonical, social tags and a crawler-readable snapshot
// inside #root (React replaces it on load). Vercel serves dist/<route>/index.html
// before falling back to the SPA rewrite.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allRoutes } from '../src/data/seo.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const site = (template.match(/<link rel="canonical" href="([^"]*?)\/?"/) || [])[1] || '';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const setAttr = (html, re, value) => html.replace(re, (_, a, b) => `${a}${esc(value)}${b}`);

// Visually hidden but present in the DOM (not display:none, so it still counts as content).
const HIDDEN =
  'position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';

for (const r of allRoutes()) {
  const url = `${site}${r.path === '/' ? '/' : r.path}`;
  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(r.title)}</title>`);
  html = setAttr(html, /(<meta name="description" content=")[^"]*(")/, r.description);
  html = setAttr(html, /(<meta property="og:title" content=")[^"]*(")/, r.title);
  html = setAttr(html, /(<meta property="og:description" content=")[^"]*(")/, r.description);
  html = setAttr(html, /(<meta property="og:url" content=")[^"]*(")/, url);
  html = setAttr(html, /(<meta name="twitter:title" content=")[^"]*(")/, r.title);
  html = setAttr(html, /(<meta name="twitter:description" content=")[^"]*(")/, r.description);
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*(")/, url);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><main style="${HIDDEN}"><h1>${esc(r.h1)}</h1><p>${esc(r.body)}</p></main></div>`
  );
  const out = r.path === '/' ? join(dist, 'index.html') : join(dist, r.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
console.log(`prerendered ${allRoutes().length} routes`);
