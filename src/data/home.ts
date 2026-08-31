import type { Vertaald } from '@/i18n/taal'
import type { GlyphName } from '@/components/ui/Glyph'
import { alsTijd, openingstijden } from '@/data/contact'

/** Content voor de homepage. Feiten komen uit het profiel van de zaak zelf. */

/**
 * Het ijs, in de drie rijen waarin het in de vitrine ligt: fruit boven,
 * crème in het midden, noten en chocolade onder. De smaken per rij zijn de
 * echte namen van de kaart (zie data/flavours.ts). Daarachter twee kaarten
 * die één smaak uitlichten.
 */
export type Mood = {
  number: string
  label: Vertaald
  italian: string
  title: Vertaald
  body: Vertaald
  /** Rij uit de vitrine; de smaken komen dan uit data/flavours.ts. */
  categorie?: 'fruit' | 'creme' | 'noten'
  /** Losse smaaknamen, voor een kaart die er één uitlicht. */
  smaken?: string[]
  chipLabel?: Vertaald
  swatch: string
  image: string
  tint: string
  dot: string
  tintHex: string
  numberHex: string
  wash: string
  glyphs: readonly GlyphName[]
}

export const moods: Mood[] = [
  {
    number: '01',
    label: { nl: 'Fruit', en: 'Fruit', it: 'Frutta' },
    italian: 'La frutta',
    title: {
      nl: 'De bovenste rij is fruit.',
      en: 'The top row is fruit.',
      it: 'La fila in alto è la frutta.',
    },
    body: {
      nl: 'Water, suiker en fruit — verder niets. Fel, zuiver en zuivelvrij; de rij die met het seizoen meebeweegt.',
      en: 'Water, sugar and fruit — nothing else. Bright, clean and dairy-free; the row that moves with the season.',
      it: 'Acqua, zucchero e frutta: nient’altro. Vivo, pulito e senza latticini; la fila che segue la stagione.',
    },
    categorie: 'fruit',
    swatch: 'bg-fragola-500',
    image: '/media/bak-fragola.jpg',
    tint: 'bg-fragola-500/12',
    dot: 'bg-fragola-500',
    tintHex: '#fbe9ee',
    numberHex: '#b4544c',
    wash: '#e2bfc9',
    glyphs: ['kers', 'citrus'] as const,
  },
  {
    number: '02',
    label: { nl: 'Crème', en: 'Cream', it: 'Crema' },
    italian: 'La crema',
    title: {
      nl: 'De middelste rij is room.',
      en: 'The middle row is cream.',
      it: 'La fila di mezzo è la crema.',
    },
    body: {
      nl: 'Melk, room en echte vanillepeulen. De rustige rij, waar bijna iedereen op terugvalt.',
      en: 'Milk, cream and real vanilla pods. The quiet row, the one nearly everyone falls back on.',
      it: 'Latte, panna e bacche di vaniglia vere. La fila tranquilla, quella a cui quasi tutti tornano.',
    },
    categorie: 'creme',
    swatch: 'bg-vaniglia-400',
    image: '/media/bak-vaniglia-cacao.jpg',
    tint: 'bg-vaniglia-300/45',
    dot: 'bg-vaniglia-500',
    tintHex: '#fdf7ea',
    numberHex: '#8f5720',
    wash: '#e2cd9c',
    glyphs: ['hoorntje', 'druppel'] as const,
  },
  {
    number: '03',
    label: { nl: 'Noten & chocolade', en: 'Nuts & chocolate', it: 'Frutta secca e cioccolato' },
    italian: 'La frutta secca',
    title: {
      nl: 'De onderste rij is de zware.',
      en: 'The bottom row is the heavy one.',
      it: 'La fila in basso è quella corposa.',
    },
    body: {
      nl: 'Siciliaanse pistache zonder kleurstof, fondente op water, hazelnoot en amarena. De volwassen bollen.',
      en: 'Sicilian pistachio without colouring, dark chocolate on water, hazelnut and amarena. The grown-up scoops.',
      it: 'Pistacchio siciliano senza coloranti, fondente all’acqua, nocciola e amarena. Le palline adulte.',
    },
    categorie: 'noten',
    swatch: 'bg-cacao-700',
    image: '/media/bak-cioccolato.jpg',
    tint: 'bg-cacao-700/10',
    dot: 'bg-cacao-700',
    tintHex: '#f1dfd0',
    numberHex: '#5d321c',
    wash: '#d8c2ac',
    glyphs: ['boon', 'blad'] as const,
  },

  /**
   * Twee uitgelichte smaken na de drie rijen. Allebei op iets echts gebaseerd:
   * Sinaas Aperol staat op de poster in de winkel, en pistache is met afstand
   * het vaakst genoemd in de Google-reviews (39 keer).
   */
  {
    number: '04',
    label: { nl: 'Seizoensgast', en: 'Seasonal guest', it: 'Ospite di stagione' },
    italian: 'Di stagione',
    title: {
      nl: 'Sinaas Aperol, zolang het duurt.',
      en: 'Sinaas Aperol, while it lasts.',
      it: 'Sinaas Aperol, finché c’è.',
    },
    body: {
      nl: 'Sinaasappel met Aperol: bitter, fris en fel oranje. Hij hangt op de poster naast de deur en verdwijnt weer met het seizoen.',
      en: 'Orange with Aperol: bitter, fresh and bright orange. It’s on the poster by the door, and it leaves with the season.',
      it: 'Arancia e Aperol: amaro, fresco e arancione acceso. È sul poster accanto alla porta e se ne va con la stagione.',
    },
    smaken: ['Sinaas Aperol'],
    chipLabel: { nl: 'Nu in de vitrine', en: 'In the cabinet now', it: 'Ora al banco' },
    swatch: 'bg-caramello-500',
    image: '/media/sinaas-aperol.jpg',
    tint: 'bg-caramello-500/14',
    dot: 'bg-caramello-500',
    tintHex: '#fcefdc',
    numberHex: '#8f5720',
    wash: '#e0c493',
    glyphs: ['citrus', 'sprankel'] as const,
  },
  {
    number: '05',
    label: { nl: 'Signature', en: 'Signature', it: 'Signature' },
    italian: 'La firma',
    title: {
      nl: 'Pistacchio, onze signature.',
      en: 'Pistacchio, our signature.',
      it: 'Pistacchio, la nostra firma.',
    },
    body: {
      nl: 'Siciliaanse pistache zonder kleurstof — daarom kaki en niet knalgroen. In de Google-reviews wordt hij 39 keer met naam genoemd, meer dan elke andere smaak.',
      en: 'Sicilian pistachio without colouring — khaki, not bright green. Our Google reviews name it 39 times, more than any other flavour.',
      it: 'Pistacchio siciliano senza coloranti: cachi, non verde acceso. Nelle recensioni Google è citato 39 volte, più di ogni altro gusto.',
    },
    smaken: ['Pistacchio'],
    chipLabel: { nl: 'Onze signature', en: 'Our signature', it: 'La nostra firma' },
    swatch: 'bg-pistacchio-500',
    image: '/media/bak-pistacchio.jpg',
    tint: 'bg-pistacchio-500/18',
    dot: 'bg-pistacchio-500',
    tintHex: '#eef4e4',
    numberHex: '#5f6b3a',
    wash: '#c5d2a4',
    glyphs: ['blad', 'ster'] as const,
  },
]

/**
 * Het gebak, in de vier stukken die er het vaakst staan. Namen en prijzen
 * komen van de eigen bestelkaart van de zaak; zie data/dolci.ts.
 */
export const cabinet = [
  {
    number: '01',
    name: { nl: 'Tiramisù', en: 'Tiramisù', it: 'Tiramisù' },
    italian: 'Al cucchiaio',
    body: {
      nl: 'Mascarpone, espresso en savoiardi, in een potje opgebouwd. Eén portie, in de ochtend gemaakt.',
      en: 'Mascarpone, espresso and savoiardi, layered in a jar. One portion, made that morning.',
      it: 'Mascarpone, espresso e savoiardi, montati in vasetto. Monoporzione, fatta al mattino.',
    },
    tone: 'bg-cacao-700 text-crema-50',
    image: '/media/tiramisu.jpg',
    tintHex: '#f4ece2',
    accentHex: '#5d321c',
  },
  {
    number: '02',
    name: { nl: 'Nonna’s Taart', en: 'Nonna’s Tart', it: 'Torta della Nonna' },
    italian: 'Torta della nonna',
    body: {
      nl: 'Zanddeeg met banketbakkersroom en geroosterde pijnboompitten. Het recept van de nonna.',
      en: 'Shortcrust with custard and toasted pine nuts. Nonna’s own recipe.',
      it: 'Pasta frolla con crema pasticcera e pinoli tostati. La ricetta della nonna.',
    },
    tone: 'bg-vaniglia-400 text-espresso-900',
    image: '/media/vitrine-gebak.jpg',
    tintHex: '#fdf7ea',
    accentHex: '#a5864d',
  },
  {
    number: '03',
    name: { nl: 'Nonna’s Koekjes', en: 'Nonna’s Cookies', it: 'Biscotti della Nonna' },
    italian: 'Occhi di bue',
    body: {
      nl: 'Bros zandkoekje met poedersuiker, gevuld met huisgemaakte nutella, pistache of kersenjam.',
      en: 'Crisp shortbread with icing sugar, filled with house-made nutella, pistachio or cherry jam.',
      it: 'Frolla friabile con zucchero a velo, ripiena di nutella fatta in casa, pistacchio o amarena.',
    },
    tone: 'bg-crema-100 text-espresso-900',
    image: '/media/dolci-koekjes.jpg',
    tintHex: '#fdf1cf',
    accentHex: '#8f5720',
  },
  {
    number: '04',
    name: { nl: 'Cannoncini', en: 'Cannoncini', it: 'Cannoncini' },
    italian: 'Alla crema',
    body: {
      nl: 'Bladerdeegrolletjes uit de oven, gevuld met banketbakkersroom, chocolade of slagroom.',
      en: 'Puff pastry horns from the oven, filled with custard, chocolate or whipped cream.',
      it: 'Cannoncini di sfoglia dal forno, farciti con crema, cioccolato o panna.',
    },
    tone: 'bg-espresso-900 text-crema-50',
    image: '/media/cake-chocoladesaus.jpg',
    tintHex: '#fbe9ee',
    accentHex: '#b4544c',
  },
]

export const moments = [
  {
    title: { nl: 'Na het eten', en: 'After dinner', it: 'Dopo cena' },
    body: {
      nl: 'Het ommetje dat de avond afmaakt.',
      en: 'The little walk that finishes the evening.',
      it: 'La passeggiata che chiude la serata.',
    },
    image: '/media/hoorntje-gevel.jpg',
  },
  {
    title: { nl: 'Zondagmiddag', en: 'Sunday afternoon', it: 'Domenica pomeriggio' },
    body: {
      nl: 'Eén hoorntje, verder geen plan.',
      en: 'One cone, no other plans.',
      it: 'Un cono, nessun altro programma.',
    },
    image: '/media/gevel-bankjes.jpg',
  },
  {
    title: { nl: 'Met z’n tweeën', en: 'The two of you', it: 'In due' },
    body: {
      nl: 'Twee lepels, één bakje.',
      en: 'Two spoons, one cup.',
      it: 'Due cucchiaini, una coppetta.',
    },
    image: '/media/beker-wafel.jpg',
  },
  {
    title: { nl: 'Met de kinderen', en: 'With the kids', it: 'Con i bambini' },
    body: {
      nl: 'Kleine handen, grote bollen.',
      en: 'Small hands, big scoops.',
      it: 'Mani piccole, palline grandi.',
    },
    image: '/media/hoorntje-drie-bollen.jpg',
  },
  {
    title: { nl: 'Bankavond', en: 'Sofa night', it: 'Serata sul divano' },
    body: {
      nl: 'Een bak, een lepel, een goede serie.',
      en: 'A tub, a spoon, a good series.',
      it: 'Una vaschetta, un cucchiaio, una buona serie.',
    },
    image: '/media/tiramisu.jpg',
  },
]

export const tickerWords = [
  'Gelato',
  'Sorbetto',
  'Cannoli',
  'Affogato',
  'Tiramisù',
  'Pistacchio',
  'Fragola',
  'Caffè',
]

/**
 * De regels die in de voettekst en op de bezoeksectie staan, afgeleid van de
 * echte tijden in data/contact.ts. Verander je die daar, dan verandert dit
 * mee — en niet één van de twee.
 */
export const openingHours: { day: Vertaald; time: string }[] = [
  {
    day: { nl: 'Maandag', en: 'Monday', it: 'Lunedì' },
    time: openingstijden[1]
      ? `${alsTijd(openingstijden[1].van)} – ${alsTijd(openingstijden[1].tot)}`
      : '—',
  },
  {
    day: { nl: 'Dinsdag t/m zondag', en: 'Tuesday to Sunday', it: 'Da martedì a domenica' },
    time: openingstijden[2]
      ? `${alsTijd(openingstijden[2].van)} – ${alsTijd(openingstijden[2].tot)}`
      : '—',
  },
]

/**
 * PLACEHOLDER — vervang door echte recensies van gasten.
 * Verzin hier niets: haal de tekst uit Google of Instagram, met toestemming.
 */
