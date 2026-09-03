/**
 * Het slot op het beheerdocument.
 *
 * Dit draait op de rand van het netwerk, voor elk verzoek naar /beheer. Zonder
 * geldige naam en wachtwoord komt er niets door: niet het document, en ook
 * niet het HTML-bestand eronder.
 *
 * Drie adressen:
 *
 *   /beheer             vraagt om naam en wachtwoord en leidt door naar
 *                       /beheer.html
 *   /beheer.html        het document zelf, met noindex en no-store
 *   /beheer/uitloggen   weigert altijd, zodat de browser het onthouden
 *                       wachtwoord weggooit
 *
 * Waarom een inlogvenster van de browser en geen eigen inlogscherm: dit moet
 * werken vóór er ook maar iets van het document geladen is. Een eigen scherm
 * zou betekenen dat het document eerst wordt uitgeserveerd en daarna vraagt of
 * je erin mag, en dan staat de hele inhoud van de site al bij de bezoeker.
 *
 * Alles wat hierbij op het scherm komt is Engels: het gebied waar de browser
 * om vraagt, de melding na een verkeerd wachtwoord, de melding als de rem
 * erop staat, en de pagina na uitloggen. De salon leest dat.
 */

import { next } from '@vercel/edge'
import { WOORDMERK } from './lib/beheer-wordmerk'
import {
  adresVan,
  controleer,
  leesBewijs,
  maakBewijs,
  KOEKJENAAM,
  uitInlogkop,
} from './lib/beheer-mensen'

export const config = {
  matcher: ['/beheer', '/beheer.html', '/beheer/:pad*'],
}

/** Het gebied waar de browser naar vraagt. Engels, want de salon leest het. */
const GEBIED = 'Arte Vanilla content'

const KOPPEN = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
}

/**
 * De pagina die achter het inlogvenster van de browser staat.
 *
 * Hier stond een kale regel tekst op wit. Dat is precies het moment waarop
 * iemand voor het eerst met dit document te maken krijgt, en dan hoort het er
 * niet uit te zien als een storing maar als de zaak. Het streeppatroon komt
 * van de gevel en uit het logo; de kleuren zijn dezelfde tokens als in
 * src/styles/tokens.css.
 *
 * Alles staat in het bestand zelf. Deze pagina wordt uitgeserveerd voordat er
 * iemand is ingelogd, dus er mag niets van buiten gehaald worden: geen
 * lettertype, geen stylesheet, geen beeld.
 */
function pagina(bericht: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${GEBIED}</title>
<style>
  :root { color-scheme: light; }
  html, body { height: 100%; margin: 0; }
  body {
    display: grid;
    place-items: center;
    padding: 1.5rem;
    box-sizing: border-box;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #1d0805;
    background-color: #fcf3e2;
    /*
     * Het streeppatroon van het logo en de gevel.
     *
     * Dezelfde twee kleuren als de klasse stripes in src/index.css, maar veel
     * breder. Daar zijn de banen twaalf pixels, want daar staan ze als smalle band
     * onder een kop. Hier vullen ze een hele pagina, en dan moeten ze de
     * verhouding van het logo aanhouden: brede banen, rustig, niet het
     * flikkerende raster dat je krijgt als je een smalle band uitrekt.
     */
    background-image: repeating-linear-gradient(
      90deg,
      #f4cf64 0 44px,
      #fcf3e2 44px 88px
    );
  }
  .kaart {
    max-width: 26rem;
    background: #fffbf2;
    border-radius: 1.5rem;
    padding: 2rem 2.25rem;
    box-shadow: 0 2px 4px rgb(29 8 5 / 0.05), 0 24px 48px -20px rgb(29 8 5 / 0.28);
    text-align: center;
  }
  /* Het echte woordmerk, ingebakken als data-URI. Nagetekende letters komen
     nooit helemaal uit: de A en de r lopen in het origineel in elkaar door. */
  .merk {
    display: block;
    width: 100%;
    max-width: 15rem;
    height: auto;
    margin: 0 auto 1.25rem;
  }
  p { margin: 0; color: #5d321c; line-height: 1.55; }
</style>
</head>
<body>
  <div class="kaart">
    <img class="merk" src="${WOORDMERK}" alt="Arte Vanilla" width="1910" height="581">
    <p>${bericht}</p>
  </div>
</body>
</html>`
}

function vraagOmInloggen(bericht: string, code = 401) {
  return new Response(pagina(bericht), {
    status: code,
    headers: {
      ...KOPPEN,
      'Content-Type': 'text/html; charset=utf-8',
      'WWW-Authenticate': `Basic realm="${GEBIED}", charset="UTF-8"`,
    },
  })
}

/** Hetzelfde vlak, maar zonder dat de browser opnieuw om een wachtwoord vraagt. */
function melding(bericht: string, code: number) {
  return new Response(pagina(bericht), {
    status: code,
    headers: { ...KOPPEN, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export default async function middleware(verzoek: Request) {
  const url = new URL(verzoek.url)

  /**
   * Uitloggen kan alleen door te weigeren.
   *
   * Een browser die een wachtwoord onthouden heeft blijft het meesturen; er is
   * geen manier om het van buitenaf te wissen. Een adres dat altijd 401 geeft
   * laat de browser het onthouden wachtwoord weggooien, en daarna staat de
   * volgende bezoeker weer voor een leeg venster.
   */
  if (url.pathname === '/beheer/uitloggen') {
    const antwoord = vraagOmInloggen(
      'You are signed out. Close this tab, or go to /beheer to sign in again.',
    )
    antwoord.headers.append(
      'Set-Cookie',
      `${KOEKJENAAM}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
    )
    return antwoord
  }

  /**
   * Eerst kijken of er al een geldig bewijsje ligt.
   *
   * Het wachtwoord controleren kost tweehonderdduizend rondes PBKDF2, en dat is
   * met opzet: de repo is openbaar, dus de afdrukken zijn dat ook, en een
   * goedkope afdruk is een uitnodiging. Maar het is ook zo'n vijftig
   * milliseconden rekenwerk, en dit draait op de rand van het netwerk waar het
   * tijdsbudget krap is.
   *
   * Het koekje dat na de eerste keer inloggen wordt gezet is met een geheim
   * ondertekend en draagt zijn eigen houdbaarheid. Dat narekenen is een enkele
   * HMAC. Zo betaalt alleen de eerste pagina de volle prijs.
   *
   * Dit maakt het slot niet zwakker: zonder het geheim is er geen geldig
   * koekje te maken, en uitloggen gooit het weg.
   */
  const bewijsje = await leesBewijs(verzoek.headers.get('cookie'))
  if (bewijsje) {
    return url.pathname === '/beheer'
      ? new Response(null, { status: 307, headers: { ...KOPPEN, Location: '/beheer.html' } })
      : next({ headers: KOPPEN })
  }

  const kop = uitInlogkop(verzoek.headers.get('authorization'))
  if (!kop) return vraagOmInloggen('Please sign in to open this document.')

  const uitslag = await controleer(kop.naam, kop.wachtwoord, adresVan(verzoek))

  if (!uitslag.klopt) {
    if (uitslag.reden === 'geremd') {
      return melding(
        'Too many wrong passwords from this connection. Please wait ten minutes and try again.',
        429,
      )
    }
    if (uitslag.reden === 'geenlijst') {
      return melding(
        'Nobody has been given access to this document yet. Please ask us to set it up.',
        503,
      )
    }
    return vraagOmInloggen('That name and password do not match. Please try again.')
  }

  /**
   * Het bewijsje voor de twee serverfuncties.
   *
   * Zonder BEHEER_GEHEIM komt hier null uit en wordt er geen koekje gezet. Het
   * document werkt dan gewoon, alleen "Submit" niet: dat zegt in het Engels
   * dat de salon het bestand kan opslaan en opsturen.
   */
  const bewijs = await maakBewijs(uitslag.naam, uitslag.beheerder)

  // `next()` laat het verzoek door naar het bestand zelf; een omleiding doet
  // dat niet, want /beheer is geen bestand maar de deur ervoor.
  const antwoord =
    url.pathname === '/beheer'
      ? new Response(null, { status: 307, headers: { ...KOPPEN, Location: '/beheer.html' } })
      : next({ headers: KOPPEN })

  if (bewijs) {
    antwoord.headers.append(
      'Set-Cookie',
      `${KOEKJENAAM}=${bewijs}; Path=/; Max-Age=43200; HttpOnly; Secure; SameSite=Strict`,
    )
  }

  return antwoord
}
