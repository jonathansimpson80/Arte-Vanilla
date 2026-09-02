/**
 * Wie het beheerdocument mag openen, en of het wachtwoord klopt.
 *
 * Drie bronnen, in deze volgorde:
 *
 * 1. De sleutelopslag, als die er is. Daar zet het beheerdocument zelf de
 *    lijst neer als een beheerder iemand toevoegt, en dan geldt dat meteen.
 * 2. `lib/beheer-toegang.ts` in de repo. Per persoon staat daar alleen
 *    een afdruk: PBKDF2-SHA256 met een eigen zout. Er staat nooit een
 *    wachtwoord in de repo, ook niet versleuteld.
 * 3. De omgeving, als de lijst leeg is. `BEHEER_LOGINS` met regels
 *    `naam:wachtwoord`, of anders `BEHEER_WACHTWOORD` als een gedeeld
 *    wachtwoord zonder naam.
 *
 * Staat er in geen van de drie iets, dan gaat de deur op slot en niet open.
 * Een beheerdocument dat per ongeluk open staat is erger dan een
 * beheerdocument dat niemand kan openen: in het eerste geval staat het adres
 * van de zaak, elke tekst en elke foto voor iedereen klaar om aan te passen.
 *
 * Waarom PBKDF2 en niet iets modernere: dit draait op de rand van het netwerk,
 * en daar is `crypto.subtle` het enige wat er is. Geen bcrypt, geen argon2,
 * geen native module. PBKDF2 met tweehonderdduizend rondes is daar de beste
 * die beschikbaar is.
 */

import { lees, telOp, stand, wis, erIsOpslag } from './beheer-opslag'
import { mensen as repoLijst } from './beheer-toegang'

export type Persoon = {
  naam: string
  zout: string
  afdruk: string
  iteraties: number
  beheerder?: boolean
}

/** De sleutel waaronder de lijst in de opslag staat. */
export const OPSLAGSLEUTEL = 'beheer:mensen'

/** Standaard aantal rondes voor een nieuwe afdruk. */
export const RONDES = 210000

const REM_POGINGEN = 10
const REM_SECONDEN = 10 * 60

/**
 * Meetellen zonder opslag.
 *
 * Dit leeft in het geheugen van één machine en is dus lek: een volgende
 * aanvraag kan ergens anders landen en begint dan weer bij nul. Het houdt een
 * script tegen dat vanuit één verbinding staat te rammen, en meer belooft het
 * niet. Wil je een rem die echt telt, koppel dan een sleutelopslag.
 */
const geheugenRem = new Map<string, { aantal: number; tot: number }>()

function hexNaarBytes(hex: string): Uint8Array {
  const uit = new Uint8Array(hex.length / 2)
  for (let i = 0; i < uit.length; i++) uit[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return uit
}

function bytesNaarHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** De afdruk van een wachtwoord bij dit zout. */
export async function maakAfdruk(wachtwoord: string, zoutHex: string, rondes: number) {
  const sleutel = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(wachtwoord),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexNaarBytes(zoutHex), iterations: rondes, hash: 'SHA-256' },
    sleutel,
    256,
  )
  return bytesNaarHex(new Uint8Array(bits))
}

/** Een nieuw zout, als hexadecimale tekst. */
export function nieuwZout() {
  return bytesNaarHex(crypto.getRandomValues(new Uint8Array(16)))
}

/**
 * Twee afdrukken vergelijken zonder dat de tijd verraadt hoever hij kwam.
 *
 * Een gewone vergelijking stopt bij het eerste verschil. Uit hoe lang dat
 * duurt is een afdruk teken voor teken te raden.
 */
function gelijk(a: string, b: string) {
  if (a.length !== b.length) return false
  let verschil = 0
  for (let i = 0; i < a.length; i++) verschil |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return verschil === 0
}

/** De lijst zoals hij nu geldt: opslag als die er is, anders de repo. */
export async function haalMensen(): Promise<Persoon[]> {
  const uitOpslag = await lees<Persoon[]>(OPSLAGSLEUTEL)
  if (uitOpslag && uitOpslag.length) return uitOpslag
  return Array.isArray(repoLijst) ? (repoLijst as Persoon[]) : []
}

/** De terugval uit de omgeving, als de lijst leeg is. */
function uitDeOmgeving(naam: string, wachtwoord: string) {
  const regels = (process.env.BEHEER_LOGINS ?? '')
    .split(/[\n,]/)
    .map((regel) => regel.trim())
    .filter(Boolean)

  if (regels.length) {
    for (const regel of regels) {
      const scheiding = regel.indexOf(':')
      if (scheiding < 0) continue
      const wie = regel.slice(0, scheiding)
      const woord = regel.slice(scheiding + 1)
      if (wie === naam && gelijk(woord, wachtwoord)) return { naam: wie, beheerder: true }
    }
    return null
  }

  const gedeeld = process.env.BEHEER_WACHTWOORD
  if (gedeeld && gelijk(gedeeld, wachtwoord)) return { naam: naam || 'shared', beheerder: true }
  return null
}

export type Uitslag =
  | { klopt: true; naam: string; beheerder: boolean }
  | { klopt: false; reden: 'onbekend' | 'geremd' | 'geenlijst' }

/**
 * Controleert naam en wachtwoord, met de rem erop.
 *
 * `adres` is het IP van de bezoeker. Na tien misgetikte pogingen vanaf
 * hetzelfde adres gaat dat adres tien minuten dicht.
 */
export async function controleer(
  naam: string,
  wachtwoord: string,
  adres: string,
): Promise<Uitslag> {
  const remSleutel = `beheer:rem:${adres}`

  if (erIsOpslag) {
    if ((await stand(remSleutel)) >= REM_POGINGEN) return { klopt: false, reden: 'geremd' }
  } else {
    const rem = geheugenRem.get(adres)
    if (rem && rem.tot > Date.now() && rem.aantal >= REM_POGINGEN) {
      return { klopt: false, reden: 'geremd' }
    }
  }

  const misgeteld = async () => {
    if (erIsOpslag) await telOp(remSleutel, REM_SECONDEN)
    else {
      const rem = geheugenRem.get(adres)
      if (!rem || rem.tot <= Date.now()) {
        geheugenRem.set(adres, { aantal: 1, tot: Date.now() + REM_SECONDEN * 1000 })
      } else {
        rem.aantal++
      }
    }
  }

  const mensen = await haalMensen()

  if (mensen.length) {
    for (const persoon of mensen) {
      if (persoon.naam !== naam) continue
      const afdruk = await maakAfdruk(wachtwoord, persoon.zout, persoon.iteraties || RONDES)
      if (gelijk(afdruk, persoon.afdruk)) {
        if (erIsOpslag) await wis(remSleutel)
        else geheugenRem.delete(adres)
        return { klopt: true, naam: persoon.naam, beheerder: Boolean(persoon.beheerder) }
      }
    }
    await misgeteld()
    return { klopt: false, reden: 'onbekend' }
  }

  const uitOmgeving = uitDeOmgeving(naam, wachtwoord)
  if (uitOmgeving) {
    if (erIsOpslag) await wis(remSleutel)
    else geheugenRem.delete(adres)
    return { klopt: true, naam: uitOmgeving.naam, beheerder: uitOmgeving.beheerder }
  }

  // Geen lijst en geen terugval: dan is er niemand die mag, en dus gaat de
  // deur op slot in plaats van open.
  if (!process.env.BEHEER_LOGINS && !process.env.BEHEER_WACHTWOORD) {
    return { klopt: false, reden: 'geenlijst' }
  }

  await misgeteld()
  return { klopt: false, reden: 'onbekend' }
}

/** Het adres van de bezoeker, zoals het platform het meegeeft. */
export function adresVan(verzoek: Request) {
  const doorgestuurd = verzoek.headers.get('x-forwarded-for')
  if (doorgestuurd) return doorgestuurd.split(',')[0].trim()
  return verzoek.headers.get('x-real-ip') ?? 'onbekend'
}

/** Leest de naam en het wachtwoord uit een inlogkop. */
export function uitInlogkop(kop: string | null): { naam: string; wachtwoord: string } | null {
  if (!kop || !kop.toLowerCase().startsWith('basic ')) return null
  try {
    const platgeslagen = atob(kop.slice(6))
    const scheiding = platgeslagen.indexOf(':')
    if (scheiding < 0) return null
    return { naam: platgeslagen.slice(0, scheiding), wachtwoord: platgeslagen.slice(scheiding + 1) }
  } catch {
    return null
  }
}

/* ---------------------------------------------------------------------------
 * Het bewijsje dat de middleware meegeeft
 *
 * Het inlogvenster hoort bij /beheer. Een browser stuurt die kop niet vanzelf
 * mee naar /api/…: dat is een ander pad, en dus wat de standaard een andere
 * ruimte noemt. Het gevolg is dat "Submit" in het document nooit zou werken,
 * of dat de salon zijn wachtwoord bij elke inzending opnieuw moet intikken.
 *
 * Daarom zet de middleware na een geslaagde login een klein koekje: de naam,
 * of hij beheerder is, tot wanneer het geldig is, en een handtekening
 * daaroverheen. De functies vertrouwen alleen de handtekening, nooit de
 * inhoud: zonder het geheim is er geen geldig koekje te maken.
 *
 * Het geheim staat in `BEHEER_GEHEIM`. Staat dat er niet, dan wordt er geen
 * koekje gezet en werkt Submit niet. Het document zegt dan in het Engels dat
 * de salon het bestand kan opslaan en opsturen. Dat is beter dan een koekje
 * ondertekenen met iets wat in de repo staat.
 * ------------------------------------------------------------------------ */

/** Hoe lang een bewijsje meegaat. Lang genoeg voor een middag tekstwerk. */
const KOEKJE_UREN = 12

export const KOEKJENAAM = 'beheer_sessie'

function grondslag(tekst: string) {
  return btoa(unescape(encodeURIComponent(tekst))).replace(/=+$/, '')
}

function uitGrondslag(tekst: string) {
  return decodeURIComponent(escape(atob(tekst)))
}

async function teken(lading: string, geheim: string) {
  const sleutel = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(geheim),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const handtekening = await crypto.subtle.sign('HMAC', sleutel, new TextEncoder().encode(lading))
  return bytesNaarHex(new Uint8Array(handtekening))
}

/** Maakt het koekje, of null als er geen geheim is ingesteld. */
export async function maakBewijs(naam: string, beheerder: boolean): Promise<string | null> {
  const geheim = process.env.BEHEER_GEHEIM
  if (!geheim) return null
  const lading = grondslag(
    JSON.stringify({ naam, beheerder, tot: Date.now() + KOEKJE_UREN * 3600 * 1000 }),
  )
  return `${lading}.${await teken(lading, geheim)}`
}

/** Leest het koekje terug. Alles wat niet klopt levert null. */
export async function leesBewijs(
  koekjes: string | null,
): Promise<{ naam: string; beheerder: boolean } | null> {
  const geheim = process.env.BEHEER_GEHEIM
  if (!geheim || !koekjes) return null

  const stuk = koekjes
    .split(';')
    .map((k) => k.trim())
    .find((k) => k.startsWith(`${KOEKJENAAM}=`))
  if (!stuk) return null

  const waarde = stuk.slice(KOEKJENAAM.length + 1)
  const punt = waarde.lastIndexOf('.')
  if (punt < 0) return null

  const lading = waarde.slice(0, punt)
  const handtekening = waarde.slice(punt + 1)
  if (!gelijk(handtekening, await teken(lading, geheim))) return null

  try {
    const inhoud = JSON.parse(uitGrondslag(lading)) as {
      naam: string
      beheerder: boolean
      tot: number
    }
    if (!inhoud.tot || inhoud.tot < Date.now()) return null
    return { naam: inhoud.naam, beheerder: Boolean(inhoud.beheerder) }
  } catch {
    return null
  }
}
