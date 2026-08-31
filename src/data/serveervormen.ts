/**
 * Hoe het ijs over de toonbank gaat.
 *
 * Stond eerst bij de dolci, maar een hoorntje is geen gebak — het hoort bij
 * het ijs. De prijzen staan op het menubord in de winkel; die is op de foto
 * te klein om af te lezen, dus ze blijven null tot de zaak ze doorgeeft.
 */

import type { Vertaald } from '@/i18n/taal'

export type Serveervorm = {
  name: Vertaald
  italian: string
  description: Vertaald
  price: number | null
  image: string
  tintHex: string
  accentHex: string
}

export const serveervormen: Serveervorm[] = [
  {
    name: { nl: 'Hoorntje', en: 'Cone', it: 'Cono' },
    italian: 'Cono',
    description: {
      nl: 'Bollen op een hoorntje, gestapeld tot het net niet meer kan. Buiten opeten aanbevolen.',
      en: 'Scoops on a cone, stacked to just before it topples. Best eaten outside.',
      it: 'Palline sul cono, impilate fin quasi al limite. Meglio mangiarlo fuori.',
    },
    price: null,
    image: '/media/hoorntje-gevel.jpg',
    tintHex: '#eef3e4',
    accentHex: '#5f6b3a',
  },
  {
    name: { nl: 'Beker met wafel', en: 'Cup with a wafer', it: 'Coppetta con cialda' },
    italian: 'Coppa con cialda',
    description: {
      nl: 'Bollen naar keuze in een beker, met een wafel erbij. De klassieke manier om mee te nemen.',
      en: 'Scoops of your choice in a cup, with a wafer. The classic way to take it with you.',
      it: 'Palline a scelta in coppetta, con la cialda. Il modo classico per portarlo via.',
    },
    price: null,
    image: '/media/beker-wafel.jpg',
    tintHex: '#fbdde6',
    accentHex: '#b4544c',
  },
]
