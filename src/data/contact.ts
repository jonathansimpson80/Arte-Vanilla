/**
 * De harde gegevens van de zaak.
 *
 * Adres en beoordeling komen van de eigen pagina op Thuisbezorgd.nl.
 * Telefoon en e-mail zijn nergens openbaar te vinden; zolang die null zijn
 * wijzen de knoppen naar de bezoekpagina in plaats van naar een leeg nummer.
 */

export const contact = {
  naam: 'Arte Vanilla',
  straat: 'Kinkerstraat 368H',
  postcode: '1053 GH',
  stad: 'Amsterdam',
  land: 'Nederland',
  /** Staat nergens openbaar; op Google is het veld zelfs nog leeg. */
  telefoon: null as string | null,
  /** PLACEHOLDER — vervangen door het echte WhatsApp-nummer van de zaak. */
  whatsapp: '+31629582729',
  /** PLACEHOLDER — vervangen door het bestel-adres van de zaak zelf. */
  email: 'info@jonathansimpson.nl',
  website: 'artevanilla.nl',
  pluscode: '9V76+RG Amsterdam',
} as const

/** Eén regel, zoals je het op een envelop zou schrijven. */
export const adresRegel = `${contact.straat}, ${contact.postcode} ${contact.stad}`

const zoekterm = encodeURIComponent(`${contact.naam}, ${adresRegel}`)

/**
 * Google Maps met `output=embed` geocodeert het adres zelf. Daardoor hoeven
 * we geen coördinaten te verzinnen — een pin op de verkeerde plek is erger
 * dan geen kaart.
 */
export const kaartEmbed = `https://www.google.com/maps?q=${zoekterm}&output=embed`
export const kaartLink = `https://www.google.com/maps/search/?api=1&query=${zoekterm}`
export const routeLink = `https://www.google.com/maps/dir/?api=1&destination=${zoekterm}`

/** Alleen de cijfers, zoals wa.me het wil. */
export const whatsappNummer = contact.whatsapp.replace(/\D/g, '')

/** Waar je nu al kunt bestellen. */
export const platforms = {
  thuisbezorgd: 'https://www.thuisbezorgd.nl/menu/arte-vanilla',
  ubereats: 'https://www.ubereats.com/nl/store/arte-vanilla/Wff4QeqeU0-aoaofy6Pnmw',
  instagram: 'https://www.instagram.com/arte_vanilla/',
} as const

/** Beoordeling zoals die op het Google-profiel van de zaak staat. */
export const beoordeling = {
  score: 4.9,
  aantal: 324,
  bron: 'Google',
  link: kaartLink,
} as const

/**
 * Openingstijden van het Google-profiel van de zaak.
 *
 * Let op: op Instagram stond eerder maandag 15:30–22:00 en dinsdag t/m zondag
 * vanaf 12:00. Google is nieuwer en wordt door de zaak zelf beheerd, dus die
 * staat hier. Eén keer navragen welke klopt.
 */
export type Dagtijden = { van: number; tot: number } | null

/** Per weekdag, 0 = zondag. `null` betekent gesloten. */
export const openingstijden: Record<number, Dagtijden> = {
  0: { van: 14, tot: 22 },
  1: null,
  2: { van: 14, tot: 22 },
  3: { van: 14, tot: 22 },
  4: { van: 14, tot: 22 },
  5: { van: 14, tot: 22 },
  6: { van: 14, tot: 22 },
}

/**
 * Dagen waarop de zaak dicht is ondanks de gewone tijden: feestdagen,
 * vakantie, een verbouwing. Formaat JJJJ-MM-DD.
 */
export const uitzonderingen: string[] = []

/** Een tijd als 14.5 wordt "14:30". */
export function alsTijd(uur: number) {
  const u = Math.floor(uur)
  return `${String(u).padStart(2, '0')}:${uur % 1 === 0 ? '00' : '30'}`
}

function datumSleutel(datum: Date) {
  return [
    datum.getFullYear(),
    String(datum.getMonth() + 1).padStart(2, '0'),
    String(datum.getDate()).padStart(2, '0'),
  ].join('-')
}

/** De tijden voor één datum, met de uitzonderingen erin verwerkt. */
export function tijdenVoor(datum: Date): Dagtijden {
  if (uitzonderingen.includes(datumSleutel(datum))) return null
  return openingstijden[datum.getDay()] ?? null
}

/**
 * Of de winkel op dit moment open is, en tot hoe laat. Wordt gebruikt voor de
 * melding in de balk; die is alleen iets waard als hij klopt, dus hij rekent
 * met de echte klok van de bezoeker.
 */
export function nuOpen(nu = new Date()) {
  const vandaag = tijdenVoor(nu)
  const uur = nu.getHours() + nu.getMinutes() / 60

  if (vandaag && uur >= vandaag.van && uur < vandaag.tot) {
    return { open: true as const, tot: alsTijd(vandaag.tot) }
  }

  // Zoek het eerstvolgende moment dat we opengaan.
  for (let i = 0; i < 8; i++) {
    const dag = new Date(nu)
    dag.setDate(nu.getDate() + i)
    const tijden = tijdenVoor(dag)
    if (!tijden) continue
    if (i === 0 && uur >= tijden.van) continue
    return { open: false as const, vanaf: alsTijd(tijden.van), dagVerschil: i }
  }

  return { open: false as const, vanaf: null, dagVerschil: null }
}
