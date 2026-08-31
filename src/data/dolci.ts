/**
 * Dolci — de kaart naast het ijs.
 *
 * Namen, omschrijvingen en prijzen van 1 t/m 6 komen van de eigen bestelkaart
 * van de zaak (Thuisbezorgd.nl, menu's "Koekjes" en "Desserts"). Dat zijn de
 * bezorgprijzen; controleer of het afhaaltarief hetzelfde is.
 *
 * Wat er daarna staat is wel in de winkel maar niet op die kaart, dus zonder
 * prijs. De laatste is nog een lege plek (`concept: true`): geen foto, en de
 * kaart zegt dat er zelf bij. Negen stuks, precies drie rijen van drie —
 * één kaart die alleen achterblijft leest als een fout. Allergenen ontbreken
 * nog volledig.
 */

import type { Vertaald } from '@/i18n/taal'
import type { AllergeenSleutel } from '@/data/allergenen'

export type Dolce = {
  /**
   * Naam zoals op de kaart. Italiaanse eigennamen zijn in alle drie de talen
   * gelijk; waar de kaart een Nederlands woord gebruikt (taart, koekje) staat
   * daar de vertaling naast — anders leest de Engelse pagina half Nederlands.
   */
  name: Vertaald
  italian: string
  description: Vertaald
  tags: Vertaald[]
  /** Bezorgprijs in euro; null zolang die niet bekend is. */
  price: number | null
  /** Zie data/allergenen.ts: alleen wat uit de omschrijving zelf volgt. */
  allergenen?: AllergeenSleutel[]
  /** Ontbreekt zolang er geen eigen foto van dit gebak is. */
  image?: string
  tintHex: string
  accentHex: string
  /** Nog niet bevestigd door de zaak; de kaart staat wel klaar. */
  concept?: boolean
}

const metLepel: Vertaald = { nl: 'Met de lepel', en: 'Eaten with a spoon', it: 'Al cucchiaio' }
const bevatEi: Vertaald = { nl: 'Bevat ei', en: 'Contains egg', it: 'Contiene uovo' }
const bevatNoten: Vertaald = { nl: 'Bevat noten', en: 'Contains nuts', it: 'Contiene frutta secca' }
const drieVullingen: Vertaald = { nl: 'Drie vullingen', en: 'Three fillings', it: 'Tre ripieni' }
const tweeVullingen: Vertaald = { nl: 'Twee vullingen', en: 'Two fillings', it: 'Due ripieni' }
const uitDeOven: Vertaald = { nl: 'Uit de oven', en: 'From the oven', it: 'Dal forno' }
const metEspresso: Vertaald = { nl: 'Met espresso', en: 'With espresso', it: 'Con espresso' }
const warm: Vertaald = { nl: 'Warm geserveerd', en: 'Served warm', it: 'Servito caldo' }
const nogBevestigen: Vertaald = { nl: 'Nog bevestigen', en: 'To be confirmed', it: 'Da confermare' }

export const dolci: Dolce[] = [
  {
    name: {
      nl: 'Tiramisù',
      en: 'Tiramisù',
      it: 'Tiramisù',
    },
    italian: 'Tiramisù al cucchiaio',
    description: {
      nl: 'Mascarpone, espresso en savoiardi, in een potje opgebouwd. Eén portie, in de ochtend gemaakt.',
      en: 'Mascarpone, espresso and savoiardi, layered in a jar. One portion, made that morning.',
      it: 'Mascarpone, espresso e savoiardi, montati in vasetto. Monoporzione, fatta al mattino.',
    },
    tags: [metLepel, bevatEi],
    allergenen: ['melk', 'ei', 'gluten'],
    price: 7.65,
    image: '/media/tiramisu.jpg',
    tintHex: '#f4ece2',
    accentHex: '#5d321c',
  },
  {
    name: {
      nl: 'Nonna’s Taart',
      en: 'Nonna’s Tart',
      it: 'Torta della Nonna',
    },
    italian: 'Torta della nonna',
    description: {
      nl: 'Zanddeeg met banketbakkersroom en geroosterde pijnboompitten. Het recept van de nonna, één portie per keer.',
      en: 'Shortcrust with custard and toasted pine nuts. Nonna’s recipe, one portion at a time.',
      it: 'Pasta frolla con crema pasticcera e pinoli tostati. La ricetta della nonna, monoporzione.',
    },
    tags: [metLepel, bevatNoten],
    allergenen: ['gluten', 'ei', 'melk', 'noten'],
    price: 5,
    // Nog geen eigen foto van dit gebak; de kaart toont het streeppatroon.
    tintHex: '#fdf7ea',
    accentHex: '#8f5720',
  },
  {
    name: {
      nl: 'Nonna’s Sandwich Cookie',
      en: 'Nonna’s Sandwich Cookie',
      it: 'Biscotto farcito della Nonna',
    },
    italian: 'Biscotto farcito',
    description: {
      nl: 'Twee lagen zandkoek gedoopt in chocolade, met amandelpasta en gekaramelliseerde hazelnoot ertussen.',
      en: 'Two layers of shortbread dipped in chocolate, with almond spread and caramelised hazelnut between them.',
      it: 'Due strati di frolla immersi nel cioccolato, con crema di mandorle e nocciola caramellata.',
    },
    tags: [bevatNoten],
    allergenen: ['gluten', 'melk', 'noten'],
    price: 5.85,
    image: '/media/cioccolato.jpg',
    tintHex: '#f1dfd0',
    accentHex: '#5d321c',
  },
  {
    name: {
      nl: 'Nonna’s Koekjes',
      en: 'Nonna’s Cookies',
      it: 'Biscotti della Nonna',
    },
    italian: 'Occhi di bue',
    description: {
      nl: 'Bros zandkoekje met een venster poedersuiker. Te vullen met huisgemaakte nutella, pistache of kersenjam.',
      en: 'Crisp shortbread with a window of icing sugar. Filled with house-made nutella, pistachio or cherry jam.',
      it: 'Frolla friabile con la finestra di zucchero a velo. Ripieno di nutella fatta in casa, pistacchio o amarena.',
    },
    tags: [drieVullingen, bevatNoten],
    allergenen: ['gluten', 'ei', 'melk', 'noten'],
    price: 3.75,
    image: '/media/dolci-koekjes.jpg',
    tintHex: '#fdf1cf',
    accentHex: '#8f5720',
  },
  {
    name: {
      nl: 'Basket Koekje',
      en: 'Basket Cookie',
      it: 'Cestino',
    },
    italian: 'Cestino',
    description: {
      nl: 'Klein mandje van koekdeeg, tot de rand gevuld met huisgemaakte nutella of pistache.',
      en: 'A small basket of biscuit dough, filled to the rim with house-made nutella or pistachio.',
      it: 'Un cestino di frolla, riempito fino all’orlo di nutella fatta in casa o pistacchio.',
    },
    tags: [tweeVullingen, bevatNoten],
    allergenen: ['gluten', 'melk', 'noten'],
    price: 3.25,
    // Nog geen eigen foto van dit koekje; de kaart toont het streeppatroon.
    tintHex: '#eef3e4',
    accentHex: '#5f6b3a',
  },
  {
    name: {
      nl: 'Cannoncini',
      en: 'Cannoncini',
      it: 'Cannoncini',
    },
    italian: 'Cannoncini alla crema',
    description: {
      nl: 'Bladerdeegrolletjes uit de oven, gevuld met banketbakkersroom, chocolade of slagroom.',
      en: 'Puff pastry horns from the oven, filled with custard, chocolate or whipped cream.',
      it: 'Cannoncini di sfoglia dal forno, farciti con crema, cioccolato o panna.',
    },
    tags: [uitDeOven, drieVullingen],
    // Los verkocht in de winkel; op de bestelkaart alleen als 3 voor € 14,50.
    allergenen: ['gluten', 'melk', 'ei'],
    price: null,
    tintHex: '#fbdde6',
    accentHex: '#b4544c',
  },
  {
    name: {
      nl: 'Affogato',
      en: 'Affogato',
      it: 'Affogato',
    },
    italian: 'Affogato al caffè',
    description: {
      nl: 'Een bol vanille, verzopen in een verse espresso. Het antwoord op de vraag of je ijs of koffie wil.',
      en: 'A scoop of vanilla, drowned in a fresh espresso. The answer to whether you want gelato or coffee.',
      it: 'Una pallina di vaniglia, affogata in un espresso appena fatto. La risposta a gelato o caffè.',
    },
    tags: [metEspresso],
    allergenen: ['melk'],
    price: null,
    image: '/media/affogato.jpg',
    tintHex: '#f0e2d3',
    accentHex: '#5d321c',
  },
  {
    name: {
      nl: 'Cake met chocoladesaus',
      en: 'Cake with chocolate sauce',
      it: 'Ciambellone al cioccolato',
    },
    italian: 'Ciambellone al cioccolato',
    description: {
      nl: 'Marmercake uit eigen oven, met warme chocolade eroverheen geschonken bij het serveren.',
      en: 'Marble cake from our own oven, with warm chocolate poured over it as it’s served.',
      it: 'Ciambellone del nostro forno, con cioccolata calda versata al momento.',
    },
    tags: [warm, uitDeOven],
    allergenen: ['gluten', 'ei', 'melk'],
    price: null,
    image: '/media/cake-chocoladesaus.jpg',
    tintHex: '#fdf7ea',
    accentHex: '#8f5720',
  },
  {
    name: {
      nl: 'Maritozzo',
      en: 'Maritozzo',
      it: 'Maritozzo',
    },
    italian: 'Maritozzo con la panna',
    description: {
      nl: 'Zacht broodje, doormidden en volgespoten met slagroom. Romeins ontbijt, hier als middagzonde.',
      en: 'A soft bun, split and filled with whipped cream. A Roman breakfast, here an afternoon sin.',
      it: 'Un panino morbido, tagliato e riempito di panna. Colazione romana, qui peccato del pomeriggio.',
    },
    tags: [nogBevestigen],
    allergenen: ['gluten', 'melk'],
    price: null,
    tintHex: '#f4ece2',
    accentHex: '#5d321c',
    concept: true,
  },
]
