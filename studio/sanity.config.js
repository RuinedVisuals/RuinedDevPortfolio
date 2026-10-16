import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import project from './schemaTypes/project';

export default defineConfig({
  name: 'ruined',
  title: 'RUINED',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()],
  schema: { types: [project] },
});
