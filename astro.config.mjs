import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://losgigantesguide.com',
  trailingSlash: 'ignore',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  build: {
    format: 'directory',
  },
  integrations: [
    react(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/tags/'),
      serialize(item) {
        return {
          ...item,
          changefreq: 'weekly',
          priority: item.url === 'https://losgigantesguide.com/' ? 1.0 : 0.7,
        };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@keystatic/core', '@keystatic/astro'],
    },
  },
});
