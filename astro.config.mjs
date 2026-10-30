// Written by Kone Tshivhinda & Claude
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The public URL. Change this one value when the site moves to a custom domain.
const SITE_URL = process.env.SITE_URL ?? 'https://k-one-it-solutions-website.erictshivhinda.workers.dev';

export default defineConfig({
  site: SITE_URL,
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
