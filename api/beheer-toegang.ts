/**
 * De lijst met logins lezen en bijwerken vanuit het beheerdocument.
 *
 * Het wachtwoord van de beheerder gaat in de body en niet in de inlogkop. Dat
 * lijkt omgekeerd, maar het inlogvenster van de browser hoort bij /beheer en
 * gaat niet vanzelf mee naar een adres onder /api. Wie de toegang verandert
 * tikt zijn eigen wachtwoord dus nog een keer in. Dat is bovendien precies wat
 * je wilt bij deze handeling: het is de enige die bepaalt wie er morgen nog in
 * kan.
 *
 * Is er een sleutelopslag gekoppeld, dan geldt een wijziging meteen. Is die er
 * niet, dan kan er hier niets bewaard worden en zegt dit adres dat in het
 * Engels; het beheerdocument laat de wijziging dan in het bestand meereizen en
 * `scripts/beheer-toepassen.cjs` meldt hem.
 *
 * Alle meldingen die op het scherm kunnen belanden zijn Engels.
 */

import {
  OPSLAGSLEUTEL,
  RONDES,
  adresVan,
  controleer,
  haalMensen,
  maakAfdruk,
  nieuwZout,
  type Persoon,
} from '../lib/beheer-mensen'
import { erIsOpslag, schrijf } from '../lib/beheer-opslag'

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

function antwoord(gegevens: unknown, code = 200) {
  return new Response(JSON.stringify(gegevens), {
    status: code,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

type Opdracht = {
  actie?: 'lijst' | 'voegtoe' | 'verwijder'
  naam?: string
  wachtwoord?: string
  wie?: string
  nieuwWachtwoord?: string
  beheerder?: boolean
}

export async function POST(verzoek: Request) {
  let opdracht: Opdracht
  try {
    opdracht = (await verzoek.json()) as Opdracht
  } catch {
    return antwoord({ melding: 'We could not read that request.' }, 400)
  }

  /*
   * De naam wordt van spaties ontdaan, het wachtwoord niet.
   *
   * Een spatie die bij het plakken meekomt zie je niet staan, en hij leverde
   * hier een weigering op die niet uit te leggen was. Bij een wachtwoord mag
   * dat juist nooit: daar kan een spatie een echt teken zijn.
   */
  const uitslag = await controleer(
    (opdracht.naam ?? '').trim(),
    opdracht.wachtwoord ?? '',
    adresVan(verzoek),
  )

  if (!uitslag.klopt) {
    if (uitslag.reden === 'geremd') {
      return antwoord(
        { melding: 'Too many wrong passwords. Please wait ten minutes and try again.' },
        429,
      )
    }
    if (uitslag.reden === 'geenlijst') {
      return antwoord(
        { melding: 'Nobody has been given access to this document yet. Ask us to set it up.' },
        403,
      )
    }
    return antwoord({ melding: 'That name and password do not match.' }, 401)
  }

  if (!uitslag.beheerder) {
    return antwoord({ melding: 'Only an administrator can change who may sign in.' }, 403)
  }

  const mensen = await haalMensen()

  if (!opdracht.actie || opdracht.actie === 'lijst') {
    // Alleen de namen. De afdrukken blijven waar ze horen.
    return antwoord({
      opslag: erIsOpslag,
      mensen: mensen.map((persoon) => ({
        naam: persoon.naam,
        beheerder: Boolean(persoon.beheerder),
      })),
    })
  }

  if (!erIsOpslag) {
    return antwoord(
      {
        melding:
          'This document is not connected to a place where the list can be kept. ' +
          'Your change will travel in the file you save instead.',
      },
      503,
    )
  }

  let nieuweLijst: Persoon[]

  if (opdracht.actie === 'voegtoe') {
    const wie = (opdracht.wie ?? '').trim()
    const woord = opdracht.nieuwWachtwoord ?? ''
    if (!wie) return antwoord({ melding: 'Give the person a name.' }, 400)
    if (woord.length < 8) {
      return antwoord({ melding: 'A password of at least eight characters, please.' }, 400)
    }

    const zout = nieuwZout()
    const afdruk = await maakAfdruk(woord, zout, RONDES)
    nieuweLijst = mensen
      .filter((persoon) => persoon.naam !== wie)
      .concat([{ naam: wie, zout, afdruk, iteraties: RONDES, beheerder: Boolean(opdracht.beheerder) }])
  } else if (opdracht.actie === 'verwijder') {
    const wie = (opdracht.wie ?? '').trim()
    nieuweLijst = mensen.filter((persoon) => persoon.naam !== wie)

    // De laatste beheerder weghalen zou de deur voorgoed dichttrekken.
    if (!nieuweLijst.some((persoon) => persoon.beheerder)) {
      return antwoord(
        { melding: 'That would leave nobody who can manage access. Add someone else first.' },
        400,
      )
    }
  } else {
    return antwoord({ melding: 'We do not know that request.' }, 400)
  }

  const gelukt = await schrijf(OPSLAGSLEUTEL, nieuweLijst)
  if (!gelukt) return antwoord({ melding: 'We could not save that change.' }, 503)

  return antwoord({
    melding: opdracht.actie === 'voegtoe' ? 'Added.' : 'Removed.',
    mensen: nieuweLijst.map((persoon) => ({
      naam: persoon.naam,
      beheerder: Boolean(persoon.beheerder),
    })),
  })
}
