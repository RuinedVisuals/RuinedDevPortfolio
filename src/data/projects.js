import data from './projects.json' with { type: 'json' };

// `tag` drives the Work page filters ('Web' | 'E-commerce' | 'Experimental').
// `shots` = captures of the live site (public/images/work/<slug>/), shown in
// browser / phone frames on the project page.
// `contribution` = 'Design' | 'Development' | 'Design & Development'.
// `challenge` / `solution` feed the project page's case study; add an optional
// `results` string (and `highlights: []`) per project once there is something real to say.
// Content lives in projects.json: seeded from the original list, then overwritten at
// build time by scripts/sync-content.mjs when Sanity is configured (see studio/).
// `image` is optional — until a real shot exists, a generative poster is
// drawn in its place (see src/lib/posters.js) and duotoned per palette.
export const projects = data;

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
