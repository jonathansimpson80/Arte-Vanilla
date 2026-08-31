/**
 * Famiglia Pack — het ijs uit de vitrine, meegenomen voor thuis.
 *
 * Maten, prijzen en het aantal smaken per bak komen uit de eigen kaart van de
 * zaak op Thuisbezorgd.nl (menu "Gelato", item "Famiglia Pack Gelato").
 *
 * Twee dingen om bij de zaak te checken:
 * 1. Dit zijn de bezorgprijzen. Reken je bij afhalen hetzelfde tarief?
 * 2. Het aantal smaken per bak verschilt per kanaal. Uber Eats loopt netjes op
 *    met de maat (3 · 3 · 4 · 5) en staat daarom hier; Thuisbezorgd zet
 *    Piccolo op 4 en Large op 4.
 */

import type { Vertaald } from '@/i18n/taal'

export type Bak = {
  /** Eigennaam van het formaat — in alle talen gelijk, dus niet vertaald. */
  name: string
  formaat: string
  price: number
  /** Aantal smaken dat je in deze bak mag samenstellen. */
  maxSmaken: number
  description: Vertaald
  tintHex: string
  accentHex: string
}

export const bakken: Bak[] = [
  {
    name: 'Piccolo',
    formaat: '450 ml',
    price: 22.75,
    maxSmaken: 3,
    description: {
      nl: 'Voor met z’n tweeën op de bank, zonder dat er een halve week overblijft.',
      en: 'For two on the sofa, without half a week left over.',
      it: 'Per due sul divano, senza che ne avanzi mezza settimana.',
    },
    tintHex: '#fdf7ea',
    accentHex: '#8f5720',
  },
  {
    name: 'Medio',
    formaat: '700 ml',
    price: 32.5,
    maxSmaken: 3,
    description: {
      nl: 'De maat voor een avond met bezoek, of een weekend vooruit.',
      en: 'The size for an evening with guests, or a weekend ahead.',
      it: 'La misura per una serata con ospiti, o per il weekend.',
    },
    tintHex: '#fbdde6',
    accentHex: '#b4544c',
  },
  {
    name: 'Grande',
    formaat: '1000 ml',
    price: 37,
    maxSmaken: 4,
    description: {
      nl: 'Een liter uit de vitrine. Genoeg om het hele huis mee te nemen.',
      en: 'A litre straight from the cabinet. Enough for the whole house.',
      it: 'Un litro dal banco. Abbastanza per tutta la casa.',
    },
    tintHex: '#eef3e4',
    accentHex: '#5f6b3a',
  },
  {
    name: 'Large',
    formaat: '1450 ml',
    price: 49,
    maxSmaken: 5,
    description: {
      nl: 'De grootste bak die we vullen. Voor een verjaardag of een volle tafel.',
      en: 'The biggest tub we fill. For a birthday or a full table.',
      it: 'La vaschetta più grande che riempiamo. Per un compleanno o una tavolata.',
    },
    tintHex: '#f1dfd0',
    accentHex: '#5d321c',
  },
]
