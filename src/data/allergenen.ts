/**
 * Allergenen.
 *
 * Wat hier staat volgt rechtstreeks uit de ingrediënten die de zaak zelf in de
 * omschrijving noemt: mascarpone is melk, savoiardi is gluten en ei, pistache
 * en hazelnoot zijn noten. Meer dan dat staat er niet in — een allergeen dat
 * je niet ziet maar er wel is, is het enige op deze site dat echt gevaarlijk
 * kan zijn.
 *
 * Daarom staat er bij elke lijst dat hij op de omschrijving is gebaseerd en
 * dat navragen verstandig blijft. Een volledige opgave moet van de zaak komen.
 *
 * De fruitrij heeft bewust geen lijst: dat die zuivelvrij zijn is aannemelijk
 * maar niet bevestigd, en "geen allergenen" is een uitspraak die je niet doet
 * zonder het te weten.
 */

import type { Vertaald } from '@/i18n/taal'

export const allergeen = {
  melk: { nl: 'Melk', en: 'Milk', it: 'Latte' },
  ei: { nl: 'Ei', en: 'Egg', it: 'Uovo' },
  gluten: { nl: 'Gluten', en: 'Gluten', it: 'Glutine' },
  noten: { nl: 'Noten', en: 'Nuts', it: 'Frutta secca' },
  soja: { nl: 'Soja', en: 'Soy', it: 'Soia' },
} satisfies Record<string, Vertaald>

export type AllergeenSleutel = keyof typeof allergeen
