# Wat er in deze codebase staat (stap 0)

Dit is de uitleesronde die aan het beheerdocument voorafging. Het staat hier
zodat de volgende die aan `scripts/beheer-*.cjs` werkt niet opnieuw hoeft te
zoeken, en zodat je kunt zien waarop de indeling in modules gebaseerd is.

## 1. Waar de teksten staan

| Bestand | Exports met tekst | Vorm |
|---|---|---|
| `src/i18n/teksten.ts` | `ui` | één plat object, elke waarde `{ nl, en, it }` |
| `src/data/home.ts` | `moods`, `cabinet`, `moments`, `tickerWords` | lijsten met `{ nl, en, it }`-velden |
| `src/data/flavours.ts` | `categoryLabels`, `tagLabels`, `flavours`, `panels`, `families` | idem; `flavours[].name` is eentalig, `naam` is de vertaling |
| `src/data/dolci.ts` | `dolci` | `name`, `description`, `tags[]` vertaald; `italian` eentalig |
| `src/data/deals.ts` | `deals` | `name`, `description` vertaald; `keuzes[]` eentalig |
| `src/data/koffie.ts` | `koffie`, `extras` | `name`, `description` vertaald; `italian` eentalig |
| `src/data/thuis.ts` | `bakken` | `description` vertaald; `name`, `formaat` eentalig |
| `src/data/afhalen.ts` | `formaten`, `extras` | `toelichting`/`naam` vertaald; `naam` van een formaat eentalig |
| `src/data/bestelsoorten.ts` | `taartmaten`, `bonbedragen` | `omschrijving` vertaald |
| `src/data/serveervormen.ts` | `serveervormen` | `name`, `description` vertaald |
| `src/data/allergenen.ts` | `allergeen` | `{ nl, en, it }` per allergeen |
| `src/data/reviews.ts` | `reviews`, `veelGenoemd` | eentalig: een quote hertaal je niet |
| `src/data/contact.ts` | `contact` | eentalig: naam, straat, postcode, stad, land |
| `src/pages/home/feedBeelden.ts` | `feedBeelden` | eentalige alt-teksten plus fotopaden |

De volgorde in de objectliteral is `{ nl, en, it }`, maar de **bron is Engels**:
`src/i18n/taal.tsx` zet `STANDAARDTAAL = 'en'`, Engels staat zonder voorvoegsel
op de wortel van de site, en `t()` valt bij een ontbrekende vertaling terug op
`veld[STANDAARDTAAL]`. Het beheerdocument zet Engels daarom links.

Eentalig zijn: eigennamen van formaten (Piccolo, Medio, Grande, Large, Sei,
Dodici, Venti), Italiaanse ondertitels (`italian`), smaaknamen die in elke taal
gelijk zijn (`flavours[].name`), de gastquotes in `reviews`, en de NAW-gegevens
in `contact`. Die staan één keer in het document.

Afgeleide exports worden **niet** uitgelezen, want ze staan niet als tekst in de
code en zijn dus niet terug te zetten: `adresRegel`, `kaartEmbed`, `kaartLink`,
`routeLink`, `whatsappNummer`, `openingHours` (samengesteld uit
`openingstijden`), `alsTijd`, `tijdenVoor`, `nuOpen`, `afhaaldagen`,
`tijdvakken`.

## 2. Waar de fotopaden staan

Bijna alle paden staan in de data, als los pad onder `image` of `src`:
`/media/<naam>.jpg`. `src/components/ui/Foto.tsx` bouwt daar zelf een srcset
omheen uit `src/data/beeldmaten.ts` en de breedtes 320/480/720/960/1440 die
`tools/beelden.mjs` aanmaakt. Het pad in de data is dus het origineel, en dat is
wat vervangen wordt. Video staat er niet op deze site.

Een handvol beelden staat in de opmaak in plaats van in de data
(`Header.tsx`, `KoffieKaart.tsx`, `OverOns.tsx`, `Bezoek.tsx`, `Dolci.tsx`,
`Ambacht.tsx`, `lib/seo.tsx`). Die staan in de korte overgetypte lijst in
`scripts/beheer-modules.cjs` en worden bij het bouwen tegen de bron gecontroleerd.

## 3. Waar het merk staat

* Kleuren en typografische schaal: `src/styles/tokens.css` (`@theme`-blok).
* Lettertypes: Grand Hotel (wordmark), Bricolage Grotesque (koppen), Baloo 2
  (labels en cijfers), Hanken Grotesk (lopende tekst). Ze komen van Google
  Fonts, geladen in `index.html`.
* Woordmerk: `public/media/wordmark-960.png` (uit `brand/logo-wordmark.png` via
  `tools/logo.mjs`).
* Tabbladicoon: `public/favicon.svg`.
* De site heeft zelf **geen** donkere stand. De donkere stand van het
  beheerdocument is daarom afgeleid van dezelfde tokens: espresso als grond,
  crème als tekst. Zie de toelichting boven in `scripts/beheer-sjabloon.html`.

## 4. Pagina's en routes, in de volgorde van het menu

`/` · `/smaken` · `/dolci` · `/afhalen` · `/over-ons`, elk ook onder `/nl` en
`/it` (`src/router.tsx`, `src/components/Header.tsx`). Daarnaast omleidingen
`/koffie` en `/aanbieding` naar de gebakpagina, en een 404.

## 5. Waar de prijzen staan

`price` of `prijs` als getal naast de naam, in `dolci`, `deals`, `koffie`,
`bakken`, `formaten`, `serveervormen`, `taartmaten` en `bonbedragen`. `null`
betekent "nog niet bekend" en toont een streepje op de site.

## 6. Zoekmachines en deelbeeld

`src/lib/seo.tsx`: `<Seo>` krijgt per pagina een titel en omschrijving uit `ui`
(bv. `ui.smakenEyebrow` en `ui.smakenSeo`), `SeoBasis` zet canonical, hreflang,
og-tags en het bedrijfsblok. Het deelbeeld is
`/media/gevel-bankjes.jpg`. De vaste titel en omschrijving in `index.html` zijn
alleen wat een bot ziet voordat React draait.

## 7. Bouwen en deployen

Vite 8 + React 19 + Tailwind 4, `npm run build` = `tsc -b && vite build && node
tools/sitemap.mjs`. Deploy op Vercel (`vercel.json`, rewrites naar
`index.html`), met `npm run deploy` als tweede weg naar GitHub Pages.
Serverloze functies draaien al: `api/bestelling.ts` en `api/bezet.ts`, in de
Web-handler-vorm (`export async function GET()`). Vercel kan dus ook de twee
functies van het beheerdocument draaien, plus `middleware.ts` voor het slot.
