// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dev-lajarana.luminari.agency',
  integrations: [react(), sitemap({
    filter: (page) => !page.includes('/mi-cuenta/') && !page.includes('/checkout/') && !page.includes('/login') && !page.includes('/register'),
    customPages: [
      'https://dev-lajarana.luminari.agency/',
      'https://dev-lajarana.luminari.agency/eventos',
    ],
  })],
  adapter: node({ mode: 'standalone' }),
  output: 'server',
});
