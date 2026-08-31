import { useLocation } from 'react-router'
import { adresRegel, beoordeling, contact, platforms } from '@/data/contact'
import { openingHours } from '@/data/home'
import { padInTaal, talen, useTaal } from '@/i18n/taal'

/**
 * Het adres waar de site straks staat. Alles wat een zoekmachine nodig heeft
 * — canonical, hreflang, og-beeld — moet absoluut zijn, dus dit moet kloppen
 * bij het bouwen. Zet het per omgeving in `VITE_SITE_URL`.
 */
/**
 * Het adres waar de site staat.
 *
 * Zonder `VITE_SITE_URL` pakken we het adres uit de adresbalk. Dat klopt op
 * elke omgeving — een preview-URL van Vercel, een eigen domein, of localhost —
 * zonder dat er per omgeving iets ingesteld hoeft te worden.
 */
const SITE = (
  import.meta.env.VITE_SITE_URL ??
  (typeof window !== 'undefined' ? window.location.origin : 'https://artevanilla.nl')
).replace(/\/$/, '')

/**
 * Op GitHub Pages staat de site onder /<repo>/. De router haalt dat pad uit
 * `pathname`, dus voor een absolute URL moet het er weer voor.
 */
const BASIS = import.meta.env.BASE_URL.replace(/\/$/, '')

/**
 * React 19 hijst <title>, <meta> en <link> vanzelf naar de <head>,
 * dus dit kan gewoon in een pagina-component staan.
 */
export function Seo({ title, description }: { title: string; description: string }) {
  return (
    <>
      <title>{`${title} — Arte Vanilla`}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${title} — Arte Vanilla`} />
      <meta property="og:description" content={description} />
    </>
  )
}

/**
 * Wat op elke pagina hetzelfde is: welk adres het origineel is, welke talen
 * er nog meer zijn, hoe de site eruitziet als iemand hem deelt, en de
 * bedrijfsgegevens in een vorm die Google kan lezen.
 *
 * Die laatste is voor een buurtgelateria belangrijker dan wat dan ook: de
 * meeste mensen vinden de zaak via de kaart, niet via de site.
 */
export function SeoBasis() {
  const { taal } = useTaal()
  const { pathname } = useLocation()

  const canonical = `${SITE}${BASIS}${pathname === '/' ? '' : pathname}`

  const bedrijf = {
    '@context': 'https://schema.org',
    '@type': 'IceCreamShop',
    name: contact.naam,
    description: 'Handgemaakt Italiaans gelato, dolci en caffè in Amsterdam-West.',
    url: `${SITE}${BASIS}` || SITE,
    image: `${SITE}${BASIS}/media/gevel-bankjes.jpg`,
    logo: `${SITE}${BASIS}/media/logo.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.straat,
      postalCode: contact.postcode,
      addressLocality: contact.stad,
      addressCountry: 'NL',
    },
    servesCuisine: 'Italian',
    priceRange: '€€',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: beoordeling.score,
      reviewCount: beoordeling.aantal,
      bestRating: 5,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '14:00',
        closes: '22:00',
      },
    ],
    sameAs: [platforms.instagram, platforms.thuisbezorgd, platforms.ubereats],
  }

  return (
    <>
      <link rel="canonical" href={canonical} />

      {/* Elke taal wijst naar de andere twee, plus een x-default. Zonder deze
          regels ziet een zoekmachine drie vertalingen als één pagina. */}
      {talen.map((code) => (
        <link
          key={code}
          rel="alternate"
          hrefLang={code}
          href={`${SITE}${BASIS}${padInTaal(pathname, code)}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE}${BASIS}${padInTaal(pathname, 'en')}`} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={contact.naam} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={taal} />
      <meta property="og:image" content={`${SITE}${BASIS}/media/gevel-bankjes.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="geo.placename" content={adresRegel} />

      <script
        type="application/ld+json"
        // De gegevens komen uit data/contact.ts, niet uit losse tekst in de
        // opmaak: één plek om bij te werken als de zaak iets verandert.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bedrijf) }}
      />
    </>
  )
}

/** Alleen om te voorkomen dat de openingstijden hier stilletjes uit de pas lopen. */
export const openingstijdenBron = openingHours
