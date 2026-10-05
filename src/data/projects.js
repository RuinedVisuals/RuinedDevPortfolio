// `tag` drives the Work page filters ('Web' | 'E-commerce' | 'Experimental').
// `image` is optional — until a real shot exists, a generative poster is
// drawn in its place (see src/lib/posters.js) and duotoned per palette.
export const projects = [
  {
    slug: 'rocks-villas',
    name: 'Rocks Villas',
    tagline: 'Privacy, comfort and authentic island living.',
    category: 'Web design & development',
    tag: 'Web',
    year: '2026',
    color: '#2a1612',
    image: null,
    url: 'https://rocksvillas.com/',
    client: 'Rocks Villas',
    services: ['Art direction', 'Web design', 'Front-end development'],
    description:
      'A refined collection of handpicked villas across Mykonos and Paros. One brand, two destination portals — a calm, image-led site that leads with philosophy and story before it ever asks you to book.',
  },
  {
    slug: 'magnetica',
    name: 'Magnetica',
    tagline: 'Your moments, in your hands.',
    category: 'E-commerce',
    tag: 'E-commerce',
    year: '2026',
    color: '#241b1c',
    image: null,
    url: 'https://magnetica.ruinedvisuals.com/',
    client: 'Magnetica',
    services: ['UX/UI design', 'E-commerce build', 'Product customizer'],
    description:
      'Custom photo magnets, printed in Greece. The store is built around an in-browser editor — upload, crop and adjust your photo — wrapped in a three-step order flow that keeps a personal gift feeling simple.',
  },
  {
    slug: 'michael-mantas',
    name: 'Michael Mantas',
    tagline: 'The camera as witness. Between memory and projection.',
    category: 'Artist portfolio',
    tag: 'Web',
    year: '2026',
    color: '#1c1210',
    image: null,
    url: 'https://michaelmantas.ruinedvisuals.com/',
    client: 'Michael Mantas',
    services: ['Art direction', 'Web design', 'Front-end development'],
    description:
      'A home for a Greek-Canadian filmmaker and performance artist working in autoethnographic cinema. Films, performances, writing and talks — paced like a screening rather than a CV.',
  },
  {
    slug: 'nove-graphics',
    name: 'Nove Graphics',
    tagline: 'Digging culture.',
    category: 'Studio portfolio',
    tag: 'Experimental',
    year: '2025',
    color: '#150d0c',
    image: null,
    url: 'https://novegraphics.vercel.app/',
    client: 'Nove Graphics',
    services: ['Web design', 'Front-end development', 'Interaction design'],
    description:
      'An Athens graphic design studio working in posters, album art and identity. A monochrome, retro-system interface — NOVE_GRAPHICS.EXE — built around oversized type, cinematic texture and print.',
  },
  {
    slug: 'melina-tsagkataki',
    name: 'Melina Tsagkataki',
    tagline: 'Balanced nutrition, without restrictions.',
    category: 'Web design & development',
    tag: 'Web',
    year: '2025',
    color: '#2a0f0a',
    image: null,
    url: 'https://melinatsagdiet.gr/',
    client: 'Melina Tsagkataki — Clinical Dietitian',
    services: ['Web design', 'Front-end development', 'Online booking'],
    description:
      'A clinical dietitian’s practice, online. Clear paths for individuals and businesses, recipes and articles, and booking for consultations by phone or video — warm, approachable and easy to act on.',
  },
  {
    slug: 'shma',
    name: 'ΣΗΜΑ',
    tagline: 'Road safety equipment, catalogued.',
    category: 'E-commerce · B2B',
    tag: 'E-commerce',
    year: '2025',
    color: '#3a1410',
    image: null,
    url: 'https://shma.gr/',
    client: 'ΣΗΜΑ Α.Β.Ε.Ε.',
    services: ['UX/UI design', 'E-commerce build', 'Catalogue architecture'],
    description:
      'A Greek manufacturer of traffic signs and road safety equipment. A deep, bilingual product catalogue — signage, site equipment, pavement materials — organised so contractors find the right part fast.',
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
