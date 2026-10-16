// Pre-build: pulls projects from Sanity into src/data/projects.json and mirrors
// their screenshots into public/images/work/<slug>/ so the site keeps serving
// same-origin images. No-op (keeps the committed projects.json) unless
// SANITY_PROJECT_ID is set, so local dev and builds without a CMS still work.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
if (!id) {
  console.log('sync-content: SANITY_PROJECT_ID not set, using committed projects.json');
  process.exit(0);
}

const query = `*[_type == "project"] | order(order asc) {
  "slug": slug.current, name, tagline, category, tag, contribution, year, color, url, client,
  services, technologies, description, challenge, solution,
  "desktop": desktopShots[].asset->url,
  "mobile": mobileShots[].asset->url
}`;
const api = `https://${id}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
const headers = process.env.SANITY_READ_TOKEN ? { Authorization: `Bearer ${process.env.SANITY_READ_TOKEN}` } : {};
const res = await fetch(api, { headers });
if (!res.ok) throw new Error(`sync-content: Sanity query failed (${res.status}) ${await res.text()}`);
const { result } = await res.json();
if (!result?.length) throw new Error('sync-content: Sanity returned no projects; refusing to overwrite projects.json');

async function mirror(urls = [], slug, prefix) {
  const out = [];
  for (let i = 0; i < urls.length; i++) {
    const r = await fetch(`${urls[i]}?fm=jpg&q=85`);
    if (!r.ok) throw new Error(`sync-content: image download failed ${urls[i]}`);
    const dir = join(root, 'public', 'images', 'work', slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${prefix}-${i + 1}.jpg`), Buffer.from(await r.arrayBuffer()));
    out.push(`/images/work/${slug}/${prefix}-${i + 1}.jpg`);
  }
  return out;
}

const projects = [];
for (const { desktop, mobile, ...p } of result) {
  projects.push({
    ...p,
    shots: { desktop: await mirror(desktop, p.slug, 'desktop'), mobile: await mirror(mobile, p.slug, 'mobile') },
  });
}
writeFileSync(join(root, 'src', 'data', 'projects.json'), JSON.stringify(projects, null, 2) + '\n');
console.log(`sync-content: ${projects.length} projects from Sanity`);
