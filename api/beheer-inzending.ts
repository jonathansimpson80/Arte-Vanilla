/**
 * Inzendingen uit het beheerdocument aannemen en beheren.
 *
 * Indienen mag iedereen die mag inloggen. De lijst zien, een inzending
 * ophalen, goedkeuren, afkeuren of weggooien mag alleen een beheerder.
 *
 * Goedkeuren is niet live zetten. Het betekent alleen "dit mag erin". Daarna
 * haalt Jonathan de goedgekeurde inzendingen in een bestand op en draait
 * `scripts/beheer-toepassen.cjs`. Dat onderscheid is met opzet: een salon die
 * een tekst goedkeurt hoort niet dezelfde seconde de site te veranderen.
 *
 * Een GET zonder wachtwoord zegt alleen hoeveel er klaarstaat. Daarmee kan de
 * tab in de browser oplichten zonder dat er iets uitlekt: een getal verraadt
 * niets, en de inhoud blijft achter het slot.
 *
 * Elke melding die op het scherm kan belanden is Engels, want de salon leest
 * die. Het commentaar hier is Nederlands, want Jonathan onderhoudt het.
 */

import {
  adresVan,
  controleer,
  leesBewijs,
  uitInlogkop,
} from '../lib/beheer-mensen'
import {
  MAX_INZENDING,
  duwAchteraan,
  erIsOpslag,
  leesLijst,
  opslagWerkt,
  schrijfLijst,
} from '../lib/beheer-opslag'

/**
 * Draait op de edge, net als de middleware.
 *
 * Niet om de snelheid, maar omdat het de enige manier is waarop de gedeelde
 * modules zich hetzelfde gedragen. Een functie op Node draait als kale ESM en
 * eist een .ts achter elke import; de edge-bundelaar weigert die juist. Alles
 * op de edge maakt dat verschil weg. Er zit hier niets in wat Node nodig heeft:
 * alleen fetch, Request, Response en crypto.
 */
export const config = { runtime: 'edge' }

const SLEUTEL = 'beheer:inzendingen'

type Inzending = {
  id: string
  ontvangen: string
  door: string
  stand: 'nieuw' | 'goedgekeurd' | 'afgekeurd'
  inhoud: unknown
}

function antwoord(gegevens: unknown, code = 200) {
  return new Response(JSON.stringify(gegevens), {
    status: code,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

/** Wie er belt: het koekje van de middleware, of naam en wachtwoord in de kop. */
async function wieIsDit(verzoek: Request) {
  const bewijs = await leesBewijs(verzoek.headers.get('cookie'))
  if (bewijs) return bewijs

  const kop = uitInlogkop(verzoek.headers.get('authorization'))
  if (!kop) return null
  const uitslag = await controleer(kop.naam, kop.wachtwoord, adresVan(verzoek))
  return uitslag.klopt ? { naam: uitslag.naam, beheerder: uitslag.beheerder } : null
}

/**
 * Hoeveel er klaarstaat. Zonder wachtwoord, en dus zonder inhoud.
 *
 * Met een wachtwoord van een beheerder komt de hele lijst mee.
 */
export async function GET(verzoek: Request) {
  const alles = await leesLijst<Inzending>(SLEUTEL)
  const wachtend = alles.filter((item) => item.stand === 'nieuw').length

  // Zonder wachtwoord alleen een getal en de staat van de opslag. Dat verraadt
  // niets over de inhoud, en het is het enige wat je van buitenaf nodig hebt om
  // te zien of het bewaren werkt.
  const wie = await wieIsDit(verzoek)
  if (!wie || !wie.beheerder) {
    return antwoord({ wachtend, opslag: await opslagWerkt() })
  }

  const url = new URL(verzoek.url)
  const id = url.searchParams.get('id')
  if (id) {
    const gevonden = alles.find((item) => item.id === id)
    if (!gevonden) return antwoord({ melding: 'That submission no longer exists.' }, 404)
    return antwoord(gevonden)
  }

  return antwoord({
    wachtend,
    opslag: await opslagWerkt(),
    inzendingen: alles.map((item) => ({
      id: item.id,
      ontvangen: item.ontvangen,
      door: item.door,
      stand: item.stand,
    })),
  })
}

/** Een nieuwe inzending aannemen. */
export async function POST(verzoek: Request) {
  const wie = await wieIsDit(verzoek)
  if (!wie) {
    return antwoord(
      {
        melding:
          'We could not tell who you are. Sign in again at /beheer, or save your file and send it to us.',
      },
      401,
    )
  }

  if (!erIsOpslag) {
    return antwoord(
      {
        melding:
          'There is nowhere to keep submissions right now. Please press Save and send us the file instead.',
      },
      503,
    )
  }

  let inhoud: unknown
  const rauw = await verzoek.text()
  if (rauw.length > MAX_INZENDING) {
    return antwoord(
      {
        melding:
          'This submission is too large to send from here. Press Save, and send us the file with the photos separately.',
      },
      413,
    )
  }
  try {
    inhoud = JSON.parse(rauw)
  } catch {
    return antwoord({ melding: 'We could not read that submission.' }, 400)
  }

  const inzending: Inzending = {
    id: crypto.randomUUID(),
    ontvangen: new Date().toISOString(),
    door: wie.naam,
    stand: 'nieuw',
    inhoud,
  }

  const gelukt = await duwAchteraan(SLEUTEL, inzending)
  if (!gelukt) {
    return antwoord(
      { melding: 'We could not store your submission. Please press Save and send us the file.' },
      503,
    )
  }

  return antwoord({ melding: 'Thank you. Your changes are with us.', id: inzending.id })
}

/** Goedkeuren, afkeuren of weggooien. Alleen een beheerder. */
export async function PATCH(verzoek: Request) {
  const wie = await wieIsDit(verzoek)
  if (!wie || !wie.beheerder) {
    return antwoord({ melding: 'Only an administrator can do that.' }, 403)
  }

  let opdracht: { id?: string; stand?: string; weg?: boolean }
  try {
    opdracht = (await verzoek.json()) as typeof opdracht
  } catch {
    return antwoord({ melding: 'We could not read that request.' }, 400)
  }

  const alles = await leesLijst<Inzending>(SLEUTEL)
  const gevonden = alles.find((item) => item.id === opdracht.id)
  if (!gevonden) return antwoord({ melding: 'That submission no longer exists.' }, 404)

  const overgebleven = opdracht.weg
    ? alles.filter((item) => item.id !== opdracht.id)
    : alles.map((item) =>
        item.id === opdracht.id
          ? { ...item, stand: (opdracht.stand as Inzending['stand']) ?? item.stand }
          : item,
      )

  const gelukt = await schrijfLijst(SLEUTEL, overgebleven)
  if (!gelukt) return antwoord({ melding: 'We could not save that change.' }, 503)

  return antwoord({ melding: opdracht.weg ? 'Deleted.' : 'Updated.' })
}
