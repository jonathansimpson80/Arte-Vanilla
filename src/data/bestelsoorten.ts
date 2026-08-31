/**
 * VOORSTEL — taarten en cadeaubonnen.
 *
 * Dit is een uitbreiding die aan de zaak wordt voorgelegd, niet iets wat ze
 * vandaag verkopen. Alles hieronder is daarom bewust prijsloos: `price: null`
 * toont een streepje in plaats van een bedrag, en de pagina zegt er zelf bij
 * dat het nog niet vaststaat.
 *
 * De opzet volgt wél uit wat ze al maken: een torta gelato is een bak ijs in
 * een andere vorm, met dezelfde smaken van hun eigen kaart.
 *
 * Weghalen doe je met één regel: zet `TOON_VOORSTEL` op false. De keuzebalk
 * verdwijnt dan en het bestelformulier is precies zoals het was.
 */

import type { Vertaald } from '@/i18n/taal'

export const TOON_VOORSTEL = true

export type Bestelsoort = 'bak' | 'gebak' | 'taart' | 'bon'

export type Taartmaat = {
  id: string
  /** Eigennaam; in alle talen gelijk. */
  naam: string
  personen: string
  /** Hoeveel smaken er in deze taart passen. */
  maxSmaken: number
  price: number | null
  omschrijving: Vertaald
  tintHex: string
  accentHex: string
}

export const taartmaten: Taartmaat[] = [
  {
    id: 'sei',
    naam: 'Sei',
    personen: '6',
    maxSmaken: 2,
    price: null,
    omschrijving: {
      nl: 'Voor een verjaardag thuis, met twee smaken naast elkaar.',
      en: 'For a birthday at home, with two flavours side by side.',
      it: 'Per un compleanno a casa, con due gusti affiancati.',
    },
    tintHex: '#fdf7ea',
    accentHex: '#8f5720',
  },
  {
    id: 'dodici',
    naam: 'Dodici',
    personen: '12',
    maxSmaken: 3,
    price: null,
    omschrijving: {
      nl: 'De maat voor een volle tafel. Drie smaken in lagen.',
      en: 'The size for a full table. Three flavours in layers.',
      it: 'La misura per una tavolata. Tre gusti a strati.',
    },
    tintHex: '#fbdde6',
    accentHex: '#b4544c',
  },
  {
    id: 'venti',
    naam: 'Venti',
    personen: '20',
    maxSmaken: 4,
    price: null,
    omschrijving: {
      nl: 'Voor een feest. Vier smaken, en een tekst erop als je wilt.',
      en: 'For a party. Four flavours, with a message on top if you like.',
      it: 'Per una festa. Quattro gusti, con una scritta sopra se vuoi.',
    },
    tintHex: '#eef3e4',
    accentHex: '#5f6b3a',
  },
]

/**
 * Een taart wordt niet uit de vitrine geschept: hij moet opgebouwd worden en
 * hard worden in de vriezer. Twee dagen vooruit is voor een gelateria krap
 * maar haalbaar — te bevestigen door de zaak.
 */
export const TAART_DAGEN_VOORUIT = 2

export type Bonbedrag = { id: string; bedrag: number | null; vrij?: boolean }

export const bonbedragen: Bonbedrag[] = [
  { id: '10', bedrag: 10 },
  { id: '25', bedrag: 25 },
  { id: '50', bedrag: 50 },
  { id: 'vrij', bedrag: null, vrij: true },
]

/** Maximale lengte van de tekst op de taart of op de bon. */
export const MAX_BOODSCHAP = 60
