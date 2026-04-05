import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://losgigantesguide.com',
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [
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
  },
});
