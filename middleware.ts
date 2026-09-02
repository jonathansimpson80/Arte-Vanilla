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
import { adresVan, controleer, maakBewijs, KOEKJENAAM, uitInlogkop } from './api/_beheer-mensen.ts'

export const config = {
  matcher: ['/beheer', '/beheer.html', '/beheer/:pad*'],
}

/** Het gebied waar de browser naar vraagt. Engels, want de salon leest het. */
const GEBIED = 'Arte Vanilla content'

const KOPPEN = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
}

function vraagOmInloggen(bericht: string, code = 401) {
  return new Response(bericht, {
    status: code,
    headers: {
      ...KOPPEN,
      'Content-Type': 'text/plain; charset=utf-8',
      'WWW-Authenticate': `Basic realm="${GEBIED}", charset="UTF-8"`,
    },
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

  const kop = uitInlogkop(verzoek.headers.get('authorization'))
  if (!kop) return vraagOmInloggen('Please sign in to open this document.')

  const uitslag = await controleer(kop.naam, kop.wachtwoord, adresVan(verzoek))

  if (!uitslag.klopt) {
    if (uitslag.reden === 'geremd') {
      return new Response(
        'Too many wrong passwords from this connection. Please wait ten minutes and try again.',
        { status: 429, headers: { ...KOPPEN, 'Content-Type': 'text/plain; charset=utf-8' } },
      )
    }
    if (uitslag.reden === 'geenlijst') {
      return new Response(
        'Nobody has been given access to this document yet. Please ask us to set it up.',
        { status: 503, headers: { ...KOPPEN, 'Content-Type': 'text/plain; charset=utf-8' } },
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
