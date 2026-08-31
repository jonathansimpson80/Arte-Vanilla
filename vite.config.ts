import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
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
       * Statische hosts kennen geen rewrite-regels: een pad zonder bestand
       * krijgt 404.html. Dat toont de juiste pagina — de app pakt het pad zelf
       * op — maar de statuscode blijft 404, en dat is voor een zoekmachine het
       * verschil tussen "bestaat niet" en "bestaat".
       *
       * Daarom schrijven we elke route ook als echt bestand weg. Dan geeft
       * /over-ons netjes 200. 404.html blijft als vangnet voor de rest.
       */
      name: 'spa-paden',
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')

        const talen = ['', 'nl', 'it']
        const paden = ['smaken', 'dolci', 'afhalen', 'over-ons']

        for (const taal of talen) {
          // De taalwortel zelf (/nl, /it) heeft ook een eigen bestand nodig.
          if (taal) {
            mkdirSync(join('dist', taal), { recursive: true })
            copyFileSync('dist/index.html', join('dist', taal, 'index.html'))
          }
          for (const pad of paden) {
            const map = join('dist', taal, pad)
            mkdirSync(map, { recursive: true })
            copyFileSync('dist/index.html', join(map, 'index.html'))
          }
        }
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
