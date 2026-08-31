import type { Vertaald } from '@/i18n/taal'
import { tijdenVoor } from '@/data/contact'

/**
 * Afhaalbestelling.
 *
 * De formaten, prijzen en het aantal smaken zijn de echte Famiglia Pack van de
 * zaak (zie data/thuis.ts). De openingstijden komen van het Google-profiel.
 * Alleen de extra's zijn nog suggesties.
 *
 * De prijzen zijn de bezorgtarieven; check of afhalen hetzelfde kost. Over het
 * aantal smaken spreken de twee bestelkanalen elkaar tegen: Thuisbezorgd zet
 * Piccolo op 4 en Large op 4, Uber Eats op 3 en 5. Uber Eats loopt netjes op
 * met de maat (3 · 3 · 4 · 5), dus die staat hier — één keer navragen.
 */

export type Formaat = {
  id: 'piccolo' | 'medio' | 'grande' | 'large'
  /** Eigennaam van het formaat; in alle talen gelijk. */
  naam: string
  inhoud: string
  prijs: number
  /** Hoeveel smaken er in deze bak passen. */
  maxSmaken: number
  toelichting: Vertaald
  tintHex: string
  accentHex: string
}

export const formaten: Formaat[] = [
  {
    id: 'piccolo',
    naam: 'Piccolo',
    inhoud: '450 ml',
    prijs: 22.75,
    maxSmaken: 3,
    toelichting: {
      nl: 'Kies 3 smaken',
      en: 'Pick 3 flavours',
      it: 'Scegli 3 gusti',
    },
    tintHex: '#fdf7ea',
    accentHex: '#8f5720',
  },
  {
    id: 'medio',
    naam: 'Medio',
    inhoud: '700 ml',
    prijs: 32.5,
    maxSmaken: 3,
    toelichting: {
      nl: 'Kies 3 smaken',
      en: 'Pick 3 flavours',
      it: 'Scegli 3 gusti',
    },
    tintHex: '#fbdde6',
    accentHex: '#b4544c',
  },
  {
    id: 'grande',
    naam: 'Grande',
    inhoud: '1000 ml',
    prijs: 37,
    maxSmaken: 4,
    toelichting: {
      nl: 'Kies 4 smaken',
      en: 'Pick 4 flavours',
      it: 'Scegli 4 gusti',
    },
    tintHex: '#eef3e4',
    accentHex: '#5f6b3a',
  },
  {
    id: 'large',
    naam: 'Large',
    inhoud: '1450 ml',
    prijs: 49,
    maxSmaken: 5,
    toelichting: {
      nl: 'Kies 5 smaken',
      en: 'Pick 5 flavours',
      it: 'Scegli 5 gusti',
    },
    tintHex: '#f1dfd0',
    accentHex: '#5d321c',
  },
]

export type Extra = { id: string; naam: Vertaald }

/** Suggesties; nog te bevestigen door de zaak. */
export const extras: Extra[] = [
  { id: 'wafels', naam: { nl: 'Wafels erbij', en: 'Wafers on the side', it: 'Cialde a parte' } },
  { id: 'slagroom', naam: { nl: 'Slagroom', en: 'Whipped cream', it: 'Panna montata' } },
  { id: 'lepels', naam: { nl: 'Extra lepels', en: 'Extra spoons', it: 'Cucchiaini extra' } },
  { id: 'koelelement', naam: { nl: 'Koelelement', en: 'Cooling pack', it: 'Siberino' } },
]

// De openingstijden staan op één plek, in data/contact.ts. Uitzonderingsdagen
// (feestdagen, vakantie) worden daar ook afgehandeld.

/** Laatste afhaalmoment ligt een half uur voor sluitingstijd. */
const MARGE_VOOR_SLUITING = 0.5

/** Minimale voorbereidingstijd; een bak wordt niet uit het niets geschept. */
const VOORBEREIDING_UREN = 1

/** De eerstvolgende dagen waarop de winkel open is; gesloten dagen vallen weg. */
export function afhaaldagen(vanaf = new Date(), aantal = 7): Date[] {
  const dagen: Date[] = []
  for (let i = 0; dagen.length < aantal && i < aantal * 2; i++) {
    const dag = new Date(vanaf)
    dag.setDate(vanaf.getDate() + i)
    if (tijdenVoor(dag)) dagen.push(dag)
  }
  return dagen
}

/**
 * Tijdvakken van een half uur voor één dag. Voor vandaag vervallen de vakken
 * die te dichtbij liggen, zodat de winkel de bestelling nog kan klaarzetten.
 */
export function tijdvakken(dag: Date, nu = new Date()): string[] {
  const uren = tijdenVoor(dag)
  if (!uren) return []

  const isVandaag = dag.toDateString() === nu.toDateString()
  const vroegst = isVandaag ? nu.getHours() + nu.getMinutes() / 60 + VOORBEREIDING_UREN : 0

  const vakken: string[] = []
  for (let t = uren.van; t <= uren.tot - MARGE_VOOR_SLUITING; t += 0.5) {
    if (t < vroegst) continue
    const uur = Math.floor(t)
    const minuten = t % 1 === 0 ? '00' : '30'
    vakken.push(`${String(uur).padStart(2, '0')}:${minuten}`)
  }
  return vakken
}
