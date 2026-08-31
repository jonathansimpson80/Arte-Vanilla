/**
 * Echte Google-reviews van de zaak (profiel "Arte Vanilla", Kinkerstraat 368H).
 *
 * De tekst staat er zoals de gast hem schreef en wordt dus niet vertaald —
 * een quote die je hertaalt is geen quote meer. De eerste drie hebben een
 * naam; de laatste drie zijn de fragmenten die Google zelf boven de reviews
 * uitlicht, zonder auteur erbij.
 */

export type Review = {
  tekst: string
  auteur: string | null
  /** Rol zoals Google die toont, bv. Local Guide. */
  rol: string | null
  sterren: number
  accentHex: string
}

export const reviews: Review[] = [
  {
    tekst:
      'Best new local ice cream shop in neighborhood. Not only you feel the love and passion with which this couple bake but also they treat you like family. The affogatto and the small sweet bites were top notch, plus it is vegan friendly!',
    auteur: 'Mire Yona',
    rol: 'Local Guide',
    sterren: 5,
    accentHex: '#c9455a',
  },
  {
    tekst:
      'Absolutely amazing! Everything is delicious. All vegan too which is incredible with how creamy the ice cream is! We ended up getting one of each pastry to take to the house for a cup of coffee. I recommend it 100%!',
    auteur: 'Tanja Marincich',
    rol: 'Local Guide',
    sterren: 5,
    accentHex: '#f4cf64',
  },
  {
    tekst:
      'If you are looking for real Italian gelato, look no further! This place absolutely delivers — from top-notch flavors to the service and atmosphere. Loved it and will definitely be coming back.',
    auteur: 'Deimante Cizaite',
    rol: null,
    sterren: 5,
    accentHex: '#9cb173',
  },
  {
    tekst: 'Delicious gelato specials, amazing Italian coffee, and incredible service!',
    auteur: null,
    rol: null,
    sterren: 5,
    accentHex: '#a5864d',
  },
  {
    tekst: 'Top quality gelato and the people are super friendly.',
    auteur: null,
    rol: null,
    sterren: 5,
    accentHex: '#c9455a',
  },
  {
    tekst: 'Fantastic ice cream and lovely owners who run the place.',
    auteur: null,
    rol: null,
    sterren: 5,
    accentHex: '#9cb173',
  },
]

/** Waar gasten het in hun reviews het vaakst over hebben, met het aantal keer. */
export const veelGenoemd = [
  { woord: 'pistachio gelato', aantal: 39 },
  { woord: 'tiramisù', aantal: 8 },
  { woord: 'affogato', aantal: 5 },
  { woord: 'homemade gelato', aantal: 4 },
]
