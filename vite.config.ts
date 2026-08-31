import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

/**
 * GitHub Pages serveert een project-repo onder /<repo>/, niet onder de wortel.
 * De workflow zet `VITE_BASE` op de juiste waarde; lokaal en op een eigen
 * domein blijft het gewoon '/'.
 */
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    {
      /**
       * GitHub Pages kent geen rewrite-regels: elk onbekend pad krijgt 404.html.
       * Door daar dezelfde app neer te zetten werkt /smaken en /nl/afhalen ook
       * als iemand die link rechtstreeks opent of ververst.
       */
      name: 'spa-fallback-404',
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})
