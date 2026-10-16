// One-off: uploads the projects in src/data/projects.json (and their local
// screenshots) to Sanity. Needs SANITY_PROJECT_ID and SANITY_WRITE_TOKEN
// (an Editor token from sanity.io/manage -> API -> Tokens).
// Safe to re-run: documents use fixed ids (project-<slug>), so they are replaced.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
if (!id || !token) throw new Error('Set SANITY_PROJECT_ID and SANITY_WRITE_TOKEN');

const base = `https://${id}.api.sanity.io/v2024-01-01`;
const auth = { Authorization: `Bearer ${token}` };

async function upload(publicPath) {
  const buf = readFileSync(join(root, 'public', publicPath));
  const r = await fetch(`${base}/assets/images/${dataset}?filename=${publicPath.split('/').pop()}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'image/jpeg' },
    body: buf,
  });
  if (!r.ok) throw new Error(`upload ${publicPath}: ${r.status} ${await r.text()}`);
  return (await r.json()).document._id;
}
const imgRef = (assetId) => ({ _type: 'image', _key: assetId.slice(-12), asset: { _type: 'reference', _ref: assetId } });

const projects = JSON.parse(readFileSync(join(root, 'src', 'data', 'projects.json'), 'utf8'));
const mutations = [];
for (const [order, p] of projects.entries()) {
  const { shots, slug, ...rest } = p;
  const desktopShots = [];
  for (const f of shots.desktop) desktopShots.push(imgRef(await upload(f)));
  const mobileShots = [];
  for (const f of shots.mobile) mobileShots.push(imgRef(await upload(f)));
  mutations.push({
    createOrReplace: {
      _id: `project-${slug}`,
      _type: 'project',
      ...rest,
      slug: { _type: 'slug', current: slug },
      order: order + 1,
      desktopShots,
      mobileShots,
    },
  });
  console.log('prepared', slug);
}
const r = await fetch(`${base}/data/mutate/${dataset}`, {
  method: 'POST',
  headers: { ...auth, 'Content-Type': 'application/json' },
  body: JSON.stringify({ mutations }),
});
if (!r.ok) throw new Error(`mutate: ${r.status} ${await r.text()}`);
console.log(`migrated ${mutations.length} projects`);
