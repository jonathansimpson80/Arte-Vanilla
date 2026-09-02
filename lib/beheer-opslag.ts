/**
 * Een plek om inzendingen en logins te bewaren.
 *
 * De site heeft geen database. Zolang die er niet is moet alles wat hierop
 * leunt gewoon blijven werken: de twee functies van het beheerdocument geven
 * dan een lege lijst terug, en de logins komen uit het bestand in de repo. Dat
 * is beter dan een foutmelding op het scherm van iemand die alleen een tekst
 * wilde aanpassen.
 *
 * Er hoeft dus niets ingesteld te worden. Wil je het wél, koppel dan een
 * sleutelopslag met een REST-adres (Vercel KV of Upstash Redis) en zet twee
 * omgevingsvariabelen. Beide namen worden gelezen, want Vercel en Upstash
 * gebruiken elk hun eigen:
 *
 *   KV_REST_API_URL        of  UPSTASH_REDIS_REST_URL
 *   KV_REST_API_TOKEN      of  UPSTASH_REDIS_REST_TOKEN
 *
 * Waarom een REST-adres en niet een echte databaseverbinding: dit draait ook
 * in de middleware, en die draait op de rand van het netwerk. Daar bestaan
 * geen sockets, alleen `fetch`.
 *
 * Dit bestand begint met een underscore en is daarom geen adres op de site:
 * Vercel maakt er geen functie van.
 */

const ADRES = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? ''
const SLEUTEL = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? ''

/** Is er iets om in te bewaren? Zo nee, dan valt alles terug op de repo. */
export const erIsOpslag = Boolean(ADRES && SLEUTEL)

/**
 * De grens van wat er in een inzending past.
 *
 * Een sleutelopslag weigert grote waarden, en dat komt terug als een fout uit
 * de database die niemand kan lezen. Liever hier een Engelse zin die zegt wat
 * de klant kan doen.
 */
export const MAX_INZENDING = 900 * 1024

async function roep(opdracht: (string | number)[]): Promise<unknown> {
  const antwoord = await fetch(ADRES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLEUTEL}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(opdracht),
  })
  if (!antwoord.ok) throw new Error(`opslag gaf ${antwoord.status}`)
  const uitslag = (await antwoord.json()) as { result?: unknown; error?: string }
  if (uitslag.error) throw new Error(uitslag.error)
  return uitslag.result
}

/**
 * Doet de opslag het echt?
 *
 * `erIsOpslag` zegt alleen dat de twee variabelen ingevuld zijn, niet dat ze
 * kloppen. Een adres met een aanhalingsteken erin of een half gekopieerde
 * sleutel geeft precies hetzelfde beeld als helemaal geen opslag: elke
 * schrijfpoging mislukt stil en elke lijst komt leeg terug. Dat verschil moet
 * je kunnen zien zonder in de logs te duiken, want anders zoek je bij de
 * verkeerde oorzaak.
 *
 * PING is de goedkoopste opdracht die er is en verandert niets.
 */
export async function opslagWerkt(): Promise<'niet-ingesteld' | 'onbereikbaar' | 'werkt'> {
  if (!erIsOpslag) return 'niet-ingesteld'
  try {
    return (await roep(['PING'])) === 'PONG' ? 'werkt' : 'onbereikbaar'
  } catch {
    return 'onbereikbaar'
  }
}

/** Leest een waarde. Geen opslag of niets gevonden levert null. */
export async function lees<T>(sleutel: string): Promise<T | null> {
  if (!erIsOpslag) return null
  try {
    const rauw = await roep(['GET', sleutel])
    if (typeof rauw !== 'string') return null
    return JSON.parse(rauw) as T
  } catch {
    return null
  }
}

/** Schrijft een waarde weg. Zonder opslag gebeurt er niets en zegt hij dat. */
export async function schrijf(sleutel: string, waarde: unknown): Promise<boolean> {
  if (!erIsOpslag) return false
  try {
    await roep(['SET', sleutel, JSON.stringify(waarde)])
    return true
  } catch {
    return false
  }
}

/** Zet iets achteraan een lijst. */
export async function duwAchteraan(sleutel: string, waarde: unknown): Promise<boolean> {
  if (!erIsOpslag) return false
  try {
    await roep(['RPUSH', sleutel, JSON.stringify(waarde)])
    return true
  } catch {
    return false
  }
}

/** De hele lijst, oudste eerst. Zonder opslag een lege lijst. */
export async function leesLijst<T>(sleutel: string): Promise<T[]> {
  if (!erIsOpslag) return []
  try {
    const rauw = await roep(['LRANGE', sleutel, 0, -1])
    if (!Array.isArray(rauw)) return []
    return rauw
      .map((regel) => {
        try {
          return JSON.parse(String(regel)) as T
        } catch {
          return null
        }
      })
      .filter((regel): regel is T => regel !== null)
  } catch {
    return []
  }
}

/** Schrijft een hele lijst opnieuw weg. */
export async function schrijfLijst(sleutel: string, waarden: unknown[]): Promise<boolean> {
  if (!erIsOpslag) return false
  try {
    await roep(['DEL', sleutel])
    for (const waarde of waarden) await roep(['RPUSH', sleutel, JSON.stringify(waarde)])
    return true
  } catch {
    return false
  }
}

/**
 * Telt een teller op en laat hem na `seconden` vanzelf verlopen.
 *
 * Hiermee wordt bijgehouden hoe vaak er vanaf een adres een verkeerd
 * wachtwoord is ingetikt. Zonder opslag telt niemand mee en geeft dit 0
 * terug: de rem staat er dan niet op, en dat is een bewuste keuze boven een
 * slot dat iedereen buitensluit zodra de database hapert.
 */
export async function telOp(sleutel: string, seconden: number): Promise<number> {
  if (!erIsOpslag) return 0
  try {
    const stand = await roep(['INCR', sleutel])
    if (stand === 1) await roep(['EXPIRE', sleutel, seconden])
    return Number(stand) || 0
  } catch {
    return 0
  }
}

/** De huidige stand van zo'n teller. */
export async function stand(sleutel: string): Promise<number> {
  if (!erIsOpslag) return 0
  try {
    const rauw = await roep(['GET', sleutel])
    return Number(rauw) || 0
  } catch {
    return 0
  }
}

/** Gooit een teller weg, bijvoorbeeld na een geslaagde login. */
export async function wis(sleutel: string): Promise<void> {
  if (!erIsOpslag) return
  try {
    await roep(['DEL', sleutel])
  } catch {
    // Een teller die blijft staan is hinderlijk, geen ramp.
  }
}
