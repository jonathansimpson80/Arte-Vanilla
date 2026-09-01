/**
 * De vaste combinatiedeals van de zaak.
 *
 * Namen, samenstelling en prijzen komen van de eigen bestelkaart
 * (Thuisbezorgd.nl, menu "Deals"). Het zijn de bezorgtarieven; controleer of
 * afhalen in de winkel hetzelfde kost.
 */

import type { Vertaald } from '@/i18n/taal'

export type Deal = {
  /** Naam zoals op de kaart; zie de opmerking in data/dolci.ts. */
  name: Vertaald
  aantal: number
  price: number
  description: Vertaald
  /** Waar je bij deze deal uit kunt kiezen. */
  keuzes?: string[]
  image?: string
  tintHex: string
  accentHex: string
}

export const deals: Deal[] = [
  {
    name: {
      nl: 'Nonna experience deal',
      en: 'Nonna experience deal',
      it: 'Nonna experience deal',
    },
    aantal: 3,
    price: 11.5,
    description: {
      nl: 'Een punt Nonna’s taart met banketbakkersroom en pijnboompitten, een mandje met gianduia of pistache, en een occhio di bue met dezelfde vulling.',
      en: 'A slice of Nonna’s tart with custard and pine nuts, a basket with gianduia or pistachio, and an occhio di bue with the same filling.',
      it: 'Una fetta di torta della nonna con crema e pinoli, un cestino con gianduia o pistacchio, e un occhio di bue con lo stesso ripieno.',
    },
    keuzes: ['Gianduia', 'Pistache'],
    image: '/media/vitrine-dichtbij.jpg',
    tintHex: '#faeab4',
    accentHex: '#8f5720',
  },
  {
    name: {
      nl: 'Tiramisù',
      en: 'Tiramisù',
      it: 'Tiramisù',
    },
    aantal: 2,
    price: 14.9,
    description: {
      nl: 'Twee potjes tiramisù, in de ochtend opgebouwd met mascarpone, espresso en savoiardi.',
      en: 'Two jars of tiramisù, layered that morning with mascarpone, espresso and savoiardi.',
      it: 'Due vasetti di tiramisù, montati la mattina con mascarpone, espresso e savoiardi.',
    },
    image: '/media/tiramisu.jpg',
    tintHex: '#f4ece2',
    accentHex: '#5d321c',
  },
  {
    name: {
      nl: 'Cannoncini',
      en: 'Cannoncini',
      it: 'Cannoncini',
    },
    aantal: 3,
    price: 14.5,
    description: {
      nl: 'Drie bladerdeegrolletjes uit de oven, elk met de vulling die je kiest.',
      en: 'Three puff pastry horns from the oven, each with the filling you choose.',
      it: 'Tre cannoncini di sfoglia dal forno, ognuno con il ripieno che scegli.',
    },
    keuzes: ['Custard cream', 'Chocolate', 'Whipped cream'],
    tintHex: '#fbdde6',
    image: '/media/cannoncini-trio.jpg',
    accentHex: '#b4544c',
  },
  {
    name: {
      nl: 'Nonna’s sandwich cookie',
      en: 'Nonna’s sandwich cookie',
      it: 'Biscotto farcito della Nonna',
    },
    aantal: 2,
    price: 11,
    description: {
      nl: 'Twee lagen zandkoek gedoopt in chocolade, met amandelpasta en gekaramelliseerde hazelnoot ertussen.',
      en: 'Two layers of shortbread dipped in chocolate, with almond spread and caramelised hazelnut between them.',
      it: 'Due strati di frolla immersi nel cioccolato, con crema di mandorle e nocciola caramellata.',
    },
    image: '/media/sandwich-vitrine.jpg',
    tintHex: '#f1dfd0',
    accentHex: '#5d321c',
  },
  {
    name: {
      nl: 'Nonna’s Koekjes',
      en: 'Nonna’s Cookies',
      it: 'Biscotti della Nonna',
    },
    aantal: 3,
    price: 9.9,
    description: {
      nl: 'Drie occhi di bue met poedersuiker, elk met een vulling naar keuze.',
      en: 'Three occhi di bue with icing sugar, each with a filling of your choice.',
      it: 'Tre occhi di bue con zucchero a velo, ognuno con il ripieno che preferisci.',
    },
    keuzes: ['Nutella', 'Pistache', 'Kersenjam'],
    image: '/media/dolci-koekjes.jpg',
    tintHex: '#fdf1cf',
    accentHex: '#8f5720',
  },
]
