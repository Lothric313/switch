import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { searchPages } from './scripts/search-pages.mjs';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss(), searchPages(process.env), {
    name: 'production-csp',
    apply: 'build',
    transformIndexHtml: () => [{
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self' https://api.web3forms.com https://api.country.is; object-src 'none'; base-uri 'self'; form-action 'self'" },
      injectTo: 'head-prepend',
    }],
  }],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  build: { target: 'es2022', outDir: 'dist/client' },
});
