import { projects } from './projects.js';

// Single source of truth for per-route SEO. Read by usePageMeta at runtime and
// by scripts/prerender.mjs at build time (plain ESM, no JSX / Vite-only imports).
// `h1` + `body` only feed the static HTML snapshot crawlers see without JS.
export const SITE_NAME = 'RUINED';

export const pages = {
  '/': {
    title: 'RUINED — Creative Developer & Web Development',
    description:
      'Independent creative developer and UI/UX designer in Athens, GR. Custom websites, e-commerce and creative front-end — for brands, and as a development partner for agencies.',
    h1: 'Creative Developer.',
    body: 'I design and build distinctive websites. Custom websites, e-commerce, creative front-end and collaborations with agencies. Independent design & development, Athens, GR.',
  },
  '/work': {
    title: 'Selected Work — RUINED',
    description:
      'Websites and e-commerce stores for villas, studios, artists and brands — designed and built by an independent creative developer in Athens.',
    h1: 'Selected work',
    body: 'Villas, stores, studios and artists — sites built for people with something to show.',
  },
  '/approach': {
    title: 'Approach & Services — RUINED',
    description:
      'How I work: UI/UX design, websites & e-commerce and creative development — as a development partner for agencies, or end to end on a full project.',
    h1: 'Good design. Solid development.',
    body: 'From first concept to final build. UI/UX design, websites and e-commerce, creative development. Work as a development partner for agencies and studios, or take a full project from strategy to launch. Process: Discover, Design, Develop, Deliver. Stack: WordPress, WooCommerce, Sanity, React, Next.js, JavaScript, PHP, GSAP, Three.js.',
  },
  '/about': {
    title: 'About Apostolis — RUINED',
    description:
      'Apostolis — independent creative developer and UI/UX designer in Athens. I design and build distinctive, fast, intuitive websites and e-commerce stores.',
    h1: 'Creative development, done properly.',
    body: 'I’m Apostolis — an independent creative developer and UI/UX designer based in Athens. I work with founders, studios and agencies to design and build distinctive, fast, intuitive websites.',
  },
  '/contact': {
    title: 'Contact — RUINED',
    description:
      'Tell me about your project — a launch, a store, or something experimental. I read every message and usually reply within a day.',
    h1: 'Tell me about your project.',
    body: 'A launch, a store, or something a little experimental — write to me. I read every message and usually reply within a day.',
  },
};

for (const [path, m] of Object.entries(pages)) m.path = path;

export function projectMeta(p) {
  return {
    title: `${p.name} — ${p.category} | ${SITE_NAME}`,
    description: p.description,
    h1: p.name,
    body: `${p.tagline} ${p.description}`,
  };
}

// Every public route, for the prerender step.
export function allRoutes() {
  return [
    ...Object.entries(pages).map(([path, m]) => ({ path, ...m })),
    ...projects.map((p) => ({ path: `/work/${p.slug}`, ...projectMeta(p) })),
  ];
}
