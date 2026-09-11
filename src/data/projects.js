export const projects = [
  {
    slug: 'kora-hospitality',
    name: 'KORA',
    tagline: 'A place to belong.',
    category: 'Web design & development',
    year: '2024',
    color: '#3a1410',
    image: '/images/work/kora-hospitality.jpg',
    client: 'Kora Hospitality',
    services: ['Art direction', 'Web design', 'Webflow development'],
    description:
      'A boutique hospitality brand set along the Aegean coastline. The site leans into warm, cinematic photography and a slow-scroll pace that mirrors the pace of a stay on the island.',
  },
  {
    slug: 'vera-studio',
    name: 'VÉRA',
    tagline: 'Modern pieces for a calmer world.',
    category: 'E-commerce · Shopify',
    year: '2024',
    color: '#241b1c',
    image: '/images/work/vera-studio.jpg',
    client: 'Véra Studio',
    services: ['UX/UI design', 'Shopify build', 'Design system'],
    description:
      'A quiet, considered fashion label. The store favours negative space and restrained motion so the product photography carries the whole experience.',
  },
  {
    slug: 'aegean-culture-festival',
    name: 'Aegean Culture Festival',
    tagline: 'A brighter tomorrow.',
    category: 'Web design & development',
    year: '2024',
    color: '#1c1210',
    image: '/images/work/aegean-culture-festival.jpg',
    client: 'Aegean Culture Festival',
    services: ['Brand extension', 'Web design', 'Front-end development'],
    description:
      'A three-day festival across music, ideas and people. The site needed to feel monumental on a phone screen — full-bleed imagery, a single moon motif, and a countdown that never lets you forget the date.',
  },
  {
    slug: 'nos-wines',
    name: 'NÓS',
    tagline: 'More than wine. A brighter tomorrow.',
    category: 'E-commerce · Headless',
    year: '2023',
    color: '#2a0f0a',
    image: '/images/work/nos-wines.jpg',
    client: 'Nós Estate',
    services: ['Web design', 'Headless commerce', 'Photography direction'],
    description:
      'Estate wines from Greece, sold direct. Bottle-first product pages and a checkout that stays out of the way.',
  },
  {
    slug: 'type-human-again',
    name: 'Type Human Again',
    tagline: 'Experimental typography, human again.',
    category: 'Concept preview',
    year: '2025',
    color: '#150d0c',
    image: '/images/work/type-human-again.jpg',
    client: 'Self-initiated',
    services: ['Type design', 'WebGL experiments'],
    description:
      'A personal study in kinetic, oversized type — pushing how legible letterforms can get before they stop being letters at all.',
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
