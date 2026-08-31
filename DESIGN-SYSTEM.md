# Arte Vanilla — designsysteem v1

Afgeleid van het Instagram-account [@arte_vanilla](https://www.instagram.com/arte_vanilla/)
(bekeken op 29 augustus 2026, publiek profiel — logo, gevelfoto's, interieur en
productfotografie). Levende versie in de app: **`/styleguide`**.

## Wat het merk is

> "Bringing Nonna's recipes to Amsterdam" — handgemaakt Italiaans gelato, dolci
> en caffè. Ma 15:30–22:00, di t/m zo 12:00–22:00. Bestellen loopt nu via Uber Eats.

Karakter uit de feed: warm, ambachtelijk, familiaal, Italiaans zonder cliché-vlag.
Fotografie is close-up, ongefilterd en bij daglicht — het product doet het werk.
Het interieur (licht hout, gele muur, crèmewitte stoelen) hoort bij het merk;
de website mag daar niet koeler uitzien dan de winkel.

## Herkomst van de kleuren

| Waar gemeten | Kleur | Token |
|---|---|---|
| Logo-achtergrond | `#fcf3e2` | `crema-100` |
| Logostrepen / gevel | `#f4cf64` | `vaniglia-400` |
| Schaduwtint in logo | `#a5864d` | `oro-600` |
| Wordmark in logo | `#1d0805` | `espresso-900` |
| Chocolade in productfoto's | `#5d321c` | `cacao-700` |
| Caramel / gebak in foto's | `#af6e2c` | `caramello-500` |

`pistacchio-*` en `fragola-*` zijn een **uitbreiding**: ze staan niet in het logo,
maar zijn nodig om smaken uit elkaar te houden. Ze zijn zo gekozen dat ze naast
het merkgeel niet gaan schreeuwen.

Alle tokens staan in [`src/styles/tokens.css`](src/styles/tokens.css) en zijn
direct beschikbaar als Tailwind-utility (`bg-vaniglia-400`, `text-cacao-700`, …).

## Contrast — de belangrijkste regel

Het merkgeel is licht: **1.37:1 op crème**. Dat is geen tekstkleur.

| Combinatie | Ratio | Oordeel |
|---|---|---|
| `espresso-900` op `crema-50` | 18.67:1 | lopende tekst |
| `espresso-900` op `vaniglia-400` | 12.81:1 | tekst op geel vlak |
| `cacao-700` op `crema-100` | 9.83:1 | secundaire tekst |
| `neutral-600` op `crema-100` | 5.90:1 | gedempte tekst (AA) |
| `caramello-500` op `crema-100` | 3.74:1 | alleen ≥ 24px of grafisch |
| `oro-600` op `crema-100` | 3.12:1 | alleen randen en iconen |
| `vaniglia-400` op `crema-100` | 1.37:1 | **nooit tekst** |

## Typografie

| Rol | Font | Inzet |
|---|---|---|
| Wordmark | **Grand Hotel** | Alleen "Arte Vanilla". Nooit voor koppen of lopende tekst. |
| Koppen | **Bricolage Grotesque** | Display en sectiekoppen, vet en strak (-3% tracking op groot formaat). |
| Labels en cijfers | **Baloo 2** | Rond en bonkig: eyebrows, pillen, mega-cijfers (`.chunk`, `text-mega`). |
| UI en tekst | **Hanken Grotesk** | Alles wat gelezen of aangeklikt wordt. |

Alle vier zijn open-source Google Fonts. De eerste opzet gebruikte Fraunces en
DM Sans; die zijn vervangen omdat het merk speelser en bonkiger moet lezen dan
editorial.

Schaal: `text-mega` (clamp 4.5→10.5rem, voor cijfers en statements),
`text-display` (clamp 3→6rem), `text-title`, `text-xl`, `text-lead`,
`text-base`, `text-sm`, `text-eyebrow` (0.75rem, 0.18em tracking, uppercase — de
"GELATO, DOLCI & CAFFÈ"-regel uit het logo).

Het script-font is de zwakste schakel: het echte logo gebruikt een custom script.
Grand Hotel is de dichtstbijzijnde webfont-benadering. Voor de header hoort
uiteindelijk het **echte logobestand (SVG)** gebruikt te worden — vraag dat op bij
de klant. `Wordmark`/`LogoMark` zijn tot die tijd de fallback.

## Merkelementen

- **Streeppatroon** — het herkenbaarste element (logo, gevel, muur in de winkel).
  Drie utilities: `.stripes` (12px), `.stripes-soft` (14px, zachter),
  `.stripes-diagonal` (-45°). Nooit direct achter lopende tekst; zet er een
  crème vlak overheen.
- **Rondingen** — `radius-soft` (12px, velden), `radius-scoop` (24px, kaarten),
  `radius-cone` (40px, secties). Knoppen zijn altijd pill-vormig; dat rijmt met
  het ronde logo.
- **Schaduw** — `shadow-lift` en `shadow-float`, beide warm getint
  (`rgb(29 8 5 / …)`), nooit neutraal grijs.

## Componenten

In [`src/components/ui/`](src/components/ui):

| Component | Varianten |
|---|---|
| `Button` | `primary` (espresso), `secondary` (geel vlak), `ghost` · `sm`/`md`/`lg` · `to` rendert als router-link |
| `Badge` | `vaniglia`, `pistacchio`, `fragola`, `cacao`, `neutral` |
| `Card` / `FlavourCard` | basisvlak en smaakkaart (kleurvlak + Italiaanse naam als eyebrow) |
| `Field` | invoerveld met label, hint en cacao-focusring |
| `Wordmark` / `LogoMark` | tekstwordmark en rond logovlak met streeppatroon |

## Fotografie

Overnemen uit de feed: close-up, daglicht, geen filter, warme tinten, mensen en
handen in beeld. Vermijden: stockfoto's, koele witbalans, strak uitgesneden
packshots op wit — dat is het tegenovergestelde van dit merk.

In `public/media/` staan nu acht beelden uit het Instagram-account van de zaak,
als tijdelijke invulling. Ze zijn 360–512px breed: bruikbaar om de opzet te
beoordelen, te klein voor een hero op een retina-scherm. Vervangen door de
originelen voordat dit live gaat.

## Beweging

De motion-toolkit staat in `src/motion/` en gebruikt geen animatiebibliotheek —
alleen IntersectionObserver, `position: sticky`, CSS-keyframes en één gedeelde
rAF-loop. Zie MOTION.md voor wat elk onderdeel doet.

## Openstaande punten voor de klant

1. Het **echte logobestand** (vector) en de naam van het script-font.
2. Zijn `pistacchio` en `fragola` als merkuitbreiding akkoord, of ligt er al een
   uitgebreider palet bij de vormgever van de gevel?
3. Echte adres-, contact- en assortimentsgegevens (nu nog niet ingevuld).
4. Eigen fotografie in hoge resolutie — de Instagram-beelden zijn te klein voor
   web-hero's en het gebruiksrecht moet expliciet zijn.

## Status van de rest van de repo

De pagina's uit de eerste opzet (`Home`, `Work`, `About`, `Contact`) bevatten nog
placeholder-content voor een *kunststudio* — dat was een verkeerde aanname over
wat Arte Vanilla is. De kleurtokens zijn omgezet zodat er niets kapot staat, maar
die inhoud wordt vervangen zodra we de echte site bouwen.
