/**
 * Schrijft sitemap.xml en robots.txt naar dist/ na de build.
 *
 * Elke pagina staat er drie keer in — één keer per taal — met onderling
 * hreflang-verwijzingen. Zonder die verwijzingen ziet een zoekmachine drie
 * vertalingen als drie concurrerende pagina's.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Vercel geeft het productie-adres mee bij het bouwen; anders VITE_SITE_URL.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
const SITE = (
  process.env.VITE_SITE_URL ??
  (vercel ? `https://${vercel}` : 'https://artevanilla.nl')
).replace(/\/$/, '')
// Op GitHub Pages staat de site onder /<repo>/; dat pad hoort in elke URL.
const BASIS = (process.env.VITE_BASE ?? '/').replace(/\/$/, '')
const TALEN = ['en', 'nl', 'it']
const STANDAARD = 'en'
const PADEN = ['/', '/smaken', '/dolci', '/afhalen', '/over-ons']

const url = (taal, pad) => {
  const voorvoegsel = taal === STANDAARD ? '' : `/${taal}`
  return `${SITE}${BASIS}${voorvoegsel}${pad === '/' ? '' : pad}` || `${SITE}/`
}

const items = PADEN.flatMap((pad) =>
  TALEN.map((taal) => {
    const alternates = TALEN.map(
      (ander) => `    <xhtml:link rel="alternate" hreflang="${ander}" href="${url(ander, pad)}"/>`,
    ).join('\n')

    return [
      '  <url>',
      `    <loc>${url(taal, pad)}</loc>`,
      alternates,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(STANDAARD, pad)}"/>`,
      `    <changefreq>${pad === '/' ? 'weekly' : 'monthly'}</changefreq>`,
      `    <priority>${pad === '/' ? '1.0' : '0.7'}</priority>`,
      '  </url>',
    ].join('\n')
  }),
).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items}
</urlset>
`

const robots = `User-agent: *
Allow: /

# De styleguide is een intern document, geen pagina voor bezoekers.
Disallow: /styleguide

Sitemap: ${SITE}/sitemap.xml
`

const dist = resolve(process.cwd(), 'dist')
mkdirSync(dist, { recursive: true })
writeFileSync(resolve(dist, 'sitemap.xml'), sitemap)
writeFileSync(resolve(dist, 'robots.txt'), robots)

console.log(`sitemap.xml (${PADEN.length * TALEN.length} adressen) en robots.txt geschreven`)
