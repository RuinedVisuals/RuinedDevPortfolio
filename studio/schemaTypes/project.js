import { defineField, defineType } from 'sanity';

const shots = (name, title) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [{ type: 'image' }],
    description: 'Screenshots of the live site, in display order.',
  });

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers appear first.', validation: (r) => r.required() }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'category', type: 'string', description: 'e.g. Web design & development' }),
    defineField({
      name: 'tag',
      title: 'Filter tag',
      type: 'string',
      options: { list: ['Web', 'E-commerce', 'Experimental'] },
    }),
    defineField({
      name: 'contribution',
      type: 'string',
      options: { list: ['Design', 'Development', 'Design & Development'] },
    }),
    defineField({ name: 'year', type: 'string' }),
    defineField({ name: 'color', type: 'string', description: 'Hex, e.g. #2a1612' }),
    defineField({ name: 'url', title: 'Live URL', type: 'url' }),
    defineField({ name: 'client', type: 'string' }),
    defineField({ name: 'services', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'technologies', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'description', type: 'text', rows: 4 }),
    defineField({ name: 'challenge', type: 'text', rows: 3 }),
    defineField({ name: 'solution', type: 'text', rows: 3 }),
    shots('desktopShots', 'Desktop screenshots'),
    shots('mobileShots', 'Mobile screenshots'),
  ],
  preview: { select: { title: 'name', subtitle: 'category', media: 'desktopShots.0' } },
});
