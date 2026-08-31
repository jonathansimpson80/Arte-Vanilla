/**
 * Koffiekaart.
 *
 * De namen komen van het menubord in de zaak; die zijn in alle drie de talen
 * gelijk en blijven dus onvertaald. Het bord is op de foto niet scherp genoeg
 * om de prijzen af te lezen, en koffie staat niet op de bestelkaart — de
 * prijzen blijven daarom null en de pagina toont een streepje.
 */

import type { Vertaald } from '@/i18n/taal'

export type Drank = {
  name: Vertaald
  italian?: string
  description: Vertaald
  /** In euro's; null zolang de prijs niet bevestigd is. */
  price: number | null
}

export const koffie: Drank[] = [
  {
    name: {
      nl: 'Espresso',
      en: 'Espresso',
      it: 'Espresso',
    },
    italian: 'Caffè',
    description: {
      nl: 'Kort en sterk, zoals aan de bar in Italië.',
      en: 'Short and strong, the way it’s served at the bar in Italy.',
      it: 'Corto e forte, come al bancone in Italia.',
    },
    price: null,
  },
  {
    name: {
      nl: 'Dubbele espresso',
      en: 'Double espresso',
      it: 'Caffè doppio',
    },
    italian: 'Doppio',
    description: {
      nl: 'Twee shots in één kopje, voor wie de dag nog voor zich heeft.',
      en: 'Two shots in one cup, for whoever still has the day ahead.',
      it: 'Due shot in una tazzina, per chi ha ancora tutta la giornata davanti.',
    },
    price: null,
  },
  {
    name: {
      nl: 'Cappuccino',
      en: 'Cappuccino',
      it: 'Cappuccino',
    },
    italian: 'Cappuccino',
    description: {
      nl: 'Espresso met opgeschuimde melk. In Italië tot elf uur, hier de hele dag.',
      en: 'Espresso with steamed milk. Until eleven in Italy, all day here.',
      it: 'Espresso con latte montato. In Italia fino alle undici, qui tutto il giorno.',
    },
    price: null,
  },
  {
    name: {
      nl: 'Latte macchiato',
      en: 'Latte macchiato',
      it: 'Latte macchiato',
    },
    italian: 'Latte macchiato',
    description: {
      nl: 'Veel melk, een shot espresso erdoorheen.',
      en: 'Plenty of milk, with a shot of espresso through it.',
      it: 'Tanto latte, con dentro uno shot di espresso.',
    },
    price: null,
  },
  {
    name: {
      nl: 'Affogato',
      en: 'Affogato',
      it: 'Affogato',
    },
    italian: 'Affogato al caffè',
    description: {
      nl: 'Een bol vanille, verzopen in verse espresso. Half koffie, half toetje.',
      en: 'A scoop of vanilla, drowned in fresh espresso. Half coffee, half dessert.',
      it: 'Una pallina di vaniglia affogata nell’espresso. Metà caffè, metà dolce.',
    },
    price: null,
  },
  {
    name: {
      nl: 'IJskoffie',
      en: 'Iced coffee',
      it: 'Caffè freddo',
    },
    italian: 'Caffè freddo',
    description: {
      nl: 'Koud gezette koffie, in de zomer met een bol erbij.',
      en: 'Cold-brewed coffee, with a scoop alongside in summer.',
      it: 'Caffè freddo, d’estate con una pallina accanto.',
    },
    price: null,
  },
]

/** Losse aanvullingen die op het bord staan maar geen eigen kaartje verdienen. */
export const extras: Vertaald[] = [
  { nl: 'Thee', en: 'Tea', it: 'Tè' },
  { nl: 'Warme chocolademelk', en: 'Hot chocolate', it: 'Cioccolata calda' },
  { nl: 'Verse muntthee', en: 'Fresh mint tea', it: 'Tè alla menta fresca' },
  { nl: 'Frisdrank', en: 'Soft drinks', it: 'Bibite' },
]
