import type { Vertaald } from '@/i18n/taal'
import type { AllergeenSleutel } from '@/data/allergenen'

/**
 * De kaart zoals hij in de winkel hangt: altijd twaalf smaken in drie rijen
 * van vier. Bovenste rij fruit, middelste rij crème, onderste de zwaardere
 * met noten of chocolade. Overgenomen van een foto van het bord in de zaak;
 * twee namen zijn niet scherp te lezen en dragen het label 'checken'.
 *
 * Smaaknamen die in elke taal hetzelfde heten — Zabaglione, Gianduia,
 * Stracciatella, Croccantino all'Amarena, Mango — staan als gewone string.
 * Alleen wat echt anders heet is vertaald.
 */

export const categories = ['fruit', 'creme', 'noten'] as const
export type Category = (typeof categories)[number]

export const categoryLabels: Record<Category, Vertaald> = {
  fruit: { nl: 'Fruit', en: 'Fruit', it: 'Frutta' },
  creme: { nl: 'Crème', en: 'Cream', it: 'Crema' },
  noten: {
    nl: 'Noten & chocolade',
    en: 'Nuts & chocolate',
    it: 'Frutta secca e cioccolato',
  },
}

export const tags = ['klassieker', 'seizoen', 'vegan', 'glutenvrij', 'checken'] as const
export type Tag = (typeof tags)[number]

export const tagLabels: Record<Tag, Vertaald> = {
  klassieker: { nl: 'Klassieker', en: 'Classic', it: 'Classico' },
  seizoen: { nl: 'Seizoen', en: 'Seasonal', it: 'Di stagione' },
  vegan: { nl: 'Vegan', en: 'Vegan', it: 'Vegano' },
  glutenvrij: { nl: 'Zonder gluten', en: 'Gluten-free', it: 'Senza glutine' },
  checken: { nl: 'Naam checken', en: 'Name to check', it: 'Nome da verificare' },
}

export type Flavour = {
  /** Blijft in elke taal hetzelfde tenzij `naam` is ingevuld. */
  name: string
  naam?: Vertaald
  category: Category
  description: Vertaald
  tags: Tag[]
  /** Zie data/allergenen.ts: alleen wat uit de omschrijving zelf volgt. */
  allergenen?: AllergeenSleutel[]
  tintHex: string
  accentHex: string
  image?: string
}

/**
 * De twaalf van het bord in de winkel, afgelezen van de foto van de vitrine:
 *
 *   fruit    Lemon · Strawberry · Mango · Melon & Mint
 *   crème    Vanilla · Dark Chocolate · Zabaglione · Pineapple & Rosemary
 *   noten    Pistacchio · Gianduia · Stracciatella · Croccantino all'Amarena
 *
 * Daarnaast twee die wisselen: Maracuya & Lemon Thyme (van de bestelkaart) en
 * Sinaas Aperol (van de poster naast de deur). Die staan er niet altijd.
 */
export const flavours: Flavour[] = [
  // ---------- bovenste rij: fruit ----------
  {
    name: 'Lemon',
    naam: { nl: 'Citroen', en: 'Lemon', it: 'Limone' },
    category: 'fruit',
    description: {
      nl: 'Scherp en ijskoud. De opfrisser tussen twee bollen door.',
      en: 'Sharp and ice-cold. The palate cleanser between two scoops.',
      it: 'Deciso e ghiacciato. Il rinfrescante tra una pallina e l’altra.',
    },
    tags: ['klassieker'],
    tintHex: '#fdf1cf',
    accentHex: '#8f5720',
  },
  {
    name: 'Strawberry',
    naam: { nl: 'Aardbei', en: 'Strawberry', it: 'Fragola' },
    category: 'fruit',
    description: {
      nl: 'Aardbei met stukken fruit erdoor; wisselt mee met het seizoen.',
      en: 'Strawberry with pieces of fruit through it; changes with the season.',
      it: 'Fragola con pezzi di frutta; cambia con la stagione.',
    },
    tags: ['seizoen'],
    tintHex: '#fbdde6',
    accentHex: '#b4544c',
    image: '/media/bak-fragola.jpg',
  },
  {
    name: 'Mango',
    category: 'fruit',
    description: {
      nl: 'Rijpe mango, zoet zonder plakkerig te worden.',
      en: 'Ripe mango, sweet without turning sticky.',
      it: 'Mango maturo, dolce senza diventare stucchevole.',
    },
    tags: [],
    image: '/media/bak-mango.jpg',
    tintHex: '#fce6c6',
    accentHex: '#8f5720',
  },
  {
    name: 'Melon & Mint',
    naam: { nl: 'Meloen & munt', en: 'Melon & mint', it: 'Melone e menta' },
    category: 'fruit',
    description: {
      nl: 'Meloen met munt — licht, fris en verrassend hardnekkig lekker.',
      en: 'Melon with mint — light, fresh and stubbornly moreish.',
      it: 'Melone e menta: leggero, fresco e sorprendentemente irresistibile.',
    },
    tags: [],
    tintHex: '#eef3e4',
    accentHex: '#5f6b3a',
  },


  // ---------- middelste rij: crème ----------
  {
    name: 'Vanilla',
    naam: { nl: 'Vanille', en: 'Vanilla', it: 'Vaniglia' },
    category: 'creme',
    description: {
      nl: 'Het huisrecept met echte peulen. Waar bijna iedereen begint.',
      en: 'The house recipe with real pods. Where nearly everyone starts.',
      it: 'La ricetta della casa con bacche vere. Dove quasi tutti cominciano.',
    },
    allergenen: ['melk'],
    tags: ['klassieker'],
    tintHex: '#fdf7ea',
    accentHex: '#8f5720',
    image: '/media/bak-vaniglia-cacao.jpg',
  },
  {
    name: 'Dark Chocolate',
    naam: { nl: 'Pure chocolade', en: 'Dark chocolate', it: 'Cioccolato fondente' },
    category: 'creme',
    description: {
      nl: 'Donkere chocolade, intens en zonder omwegen.',
      en: 'Dark chocolate, intense and straight to the point.',
      it: 'Cioccolato fondente, intenso e senza giri di parole.',
    },
    allergenen: ['melk'],
    tags: [],
    tintHex: '#f4ece2',
    accentHex: '#5d321c',
    image: '/media/bak-cioccolato.jpg',
  },
  {
    name: 'Zabaglione',
    category: 'creme',
    description: {
      nl: 'Eierlikeurcrème uit de Italiaanse keuken: zacht, rijk, ouderwets goed.',
      en: 'The Italian custard of egg and wine: soft, rich, old-fashioned in the best way.',
      it: 'Crema di uova e vino: morbida, ricca, buona come una volta.',
    },
    allergenen: ['melk', 'ei'],
    tags: [],
    image: '/media/bak-zabaglione.jpg',
    tintHex: '#fdf1cf',
    accentHex: '#8f5720',
  },
  {
    name: 'Pineapple & Rosemary',
    naam: {
      nl: 'Ananas & rozemarijn',
      en: 'Pineapple & rosemary',
      it: 'Ananas e rosmarino',
    },
    category: 'creme',
    description: {
      nl: 'Ananas met rozemarijn. Zoet fruit met een kruidige nasmaak — de eigenzinnige van de rij.',
      en: 'Pineapple with rosemary. Sweet fruit with a herbal finish — the odd one out, in a good way.',
      it: 'Ananas e rosmarino. Frutta dolce con una chiusura erbacea: il tipo strano della fila.',
    },
    allergenen: ['melk'],
    tags: [],
    tintHex: '#eef3e4',
    accentHex: '#5f6b3a',
  },

  // ---------- onderste rij: noten en chocolade ----------
  {
    name: 'Pistacchio',
    category: 'noten',
    description: {
      nl: 'Geroosterde pistache, licht gezouten. Zonder kleurstof, dus kaki en niet knalgroen.',
      en: 'Roasted pistachio, lightly salted. No colouring, so khaki rather than bright green.',
      it: 'Pistacchio tostato, leggermente salato. Senza coloranti: cachi, non verde acceso.',
    },
    allergenen: ['melk', 'noten'],
    tags: ['klassieker'],
    tintHex: '#eef3e4',
    accentHex: '#5f6b3a',
    image: '/media/bak-pistacchio.jpg',
  },
  {
    name: 'Gianduia',
    category: 'noten',
    description: {
      nl: 'Chocolade met hazelnoot, het Piemontese recept. Zacht en vol.',
      en: 'Chocolate with hazelnut, the Piedmontese recipe. Soft and full.',
      it: 'Cioccolato e nocciola, la ricetta piemontese. Morbido e pieno.',
    },
    allergenen: ['melk', 'noten'],
    tags: [],
    image: '/media/bak-gianduia.jpg',
    tintHex: '#f4ece2',
    accentHex: '#5d321c',
  },
  {
    name: 'Stracciatella',
    category: 'noten',
    description: {
      nl: 'Melkijs met flinters chocolade die breken bij het scheppen.',
      en: 'Milk gelato with chocolate shards that crack as you scoop.',
      it: 'Fiordilatte con scaglie di cioccolato che si rompono al cucchiaio.',
    },
    allergenen: ['melk'],
    tags: ['klassieker'],
    image: '/media/bak-stracciatella.jpg',
    tintHex: '#fdf7ea',
    accentHex: '#8f5720',
  },
  {
    name: "Croccantino all'Amarena",
    category: 'noten',
    description: {
      nl: 'Knapperige noot met amarenekers. De zwaarste van het bord.',
      en: 'Crunchy nut with amarena cherry. The heaviest one on the board.',
      it: 'Croccante alla nocciola con amarena. Il più corposo del cartello.',
    },
    allergenen: ['melk', 'noten'],
    tags: ['klassieker'],
    tintHex: '#fbdde6',
    accentHex: '#b4544c',
  },
]

/** Panelen voor de uitklaprij; zelfde indeling als de vitrine in de winkel. */
export const panels = [
  {
    label: { nl: 'Romig', en: 'Creamy', it: 'Cremoso' },
    title: {
      nl: 'De rustige rij',
      en: 'The quiet row',
      it: 'La fila tranquilla',
    },
    body: {
      nl: 'Melkijs, zacht en dik geschept. Waar bijna iedereen aan de vitrine begint.',
      en: 'Milk gelato, soft and thickly scooped. Where nearly everyone starts.',
      it: 'Fiordilatte, morbido e servito generoso. Dove quasi tutti iniziano.',
    },
    kiezer: {
      label: { nl: 'Als je twijfelt', en: 'If you can’t decide', it: 'Se sei indeciso' },
      zin: {
        nl: 'Begin bij de romige rij en werk naar buiten.',
        en: 'Start at the creamy row and work outward.',
        it: 'Parti dalla fila cremosa e allargati.',
      },
    },
    hint: {
      nl: 'Vraag welke romige er vandaag staan.',
      en: 'Ask which creamy ones are in today.',
      it: 'Chiedi quali cremosi ci sono oggi.',
    },
    image: '/media/bak-vaniglia-cacao.jpg',
  },
  {
    label: { nl: 'Fruitig', en: 'Fruity', it: 'Fruttato' },
    title: {
      nl: 'Het fruit doet het werk',
      en: 'The fruit does the work',
      it: 'È la frutta a lavorare',
    },
    body: {
      nl: 'Aardbei staat er bijna altijd; de rest wisselt met wat de markt geeft.',
      en: 'Strawberry is nearly always there; the rest changes with the market.',
      it: 'La fragola c’è quasi sempre; il resto cambia con il mercato.',
    },
    kiezer: {
      label: { nl: 'Voor tussendoor', en: 'For in between', it: 'Per uno spuntino' },
      zin: {
        nl: 'Het fruit doet het werk: fel van kleur, licht van smaak.',
        en: 'The fruit does the work: loud in colour, light on the tongue.',
        it: 'È la frutta a lavorare: colore acceso, gusto leggero.',
      },
    },
    hint: {
      nl: 'Meestal twee of drie tegelijk.',
      en: 'Usually two or three at a time.',
      it: 'Di solito due o tre alla volta.',
    },
    image: '/media/bak-fragola.jpg',
  },
  {
    label: { nl: 'Chocolade', en: 'Chocolate', it: 'Cioccolato' },
    title: {
      nl: 'Het diepe deel',
      en: 'The deep end',
      it: 'La parte profonda',
    },
    body: {
      nl: 'Fondente op water in plaats van melk. Donker, intens en toevallig vegan.',
      en: 'Dark chocolate on water instead of milk. Deep, intense and vegan by accident.',
      it: 'Fondente all’acqua invece che al latte. Scuro, intenso e per caso vegano.',
    },
    kiezer: {
      label: { nl: 'Voor de echte trek', en: 'For a real craving', it: 'Per una voglia vera' },
      zin: {
        nl: 'De chocoladebakken. Donker, cacao-zwaar, voor de serieuze trek.',
        en: 'The chocolate tubs. Dark, cocoa-heavy, for a serious craving.',
        it: 'Le vaschette al cioccolato. Scure, cariche di cacao, per una voglia seria.',
      },
    },
    hint: {
      nl: 'Ook als affogato te bestellen.',
      en: 'Also available as an affogato.',
      it: 'Si può ordinare anche come affogato.',
    },
    image: '/media/bak-cioccolato.jpg',
  },
  {
    label: { nl: 'Noten', en: 'Nutty', it: 'Frutta secca' },
    title: {
      nl: 'Geroosterd en zout',
      en: 'Roasted and salted',
      it: 'Tostato e salato',
    },
    body: {
      nl: 'Pistache uit Sicilië en hazelnoot uit Piemonte, in huis geroosterd.',
      en: 'Sicilian pistachio and Piedmontese hazelnut, roasted in house.',
      it: 'Pistacchio siciliano e nocciola piemontese, tostati in casa.',
    },
    kiezer: {
      label: { nl: 'Voor de fijnproever', en: 'For the connoisseur', it: 'Per gli intenditori' },
      zin: {
        nl: 'Geroosterd, licht zout en niet te zoet. Lekker bij een espresso.',
        en: 'Roasted, lightly salted and not too sweet. Good with an espresso.',
        it: 'Tostato, appena salato e non troppo dolce. Ottimo con un espresso.',
      },
    },
    hint: {
      nl: 'De volwassen bol.',
      en: 'The grown-up scoop.',
      it: 'La pallina adulta.',
    },
    image: '/media/bak-pistacchio.jpg',
  },
  {
    label: { nl: 'Sorbet', en: 'Sorbet', it: 'Sorbetto' },
    title: {
      nl: 'IJskoud en wakker',
      en: 'Ice-cold and awake',
      it: 'Ghiacciato e sveglio',
    },
    body: {
      nl: 'Alleen fruit, water en suiker. Zuiver, scherp en zonder zuivel.',
      en: 'Just fruit, water and sugar. Clean, sharp and dairy-free.',
      it: 'Solo frutta, acqua e zucchero. Puro, deciso e senza latticini.',
    },
    kiezer: {
      label: { nl: 'Na het eten', en: 'After a big meal', it: 'Dopo un pasto' },
      zin: {
        nl: 'Ga naar de sorbet. Scherp, ijzig, klaarwakker.',
        en: 'Head for the sorbet. Sharp, icy, wide awake.',
        it: 'Vai sul sorbetto. Deciso, ghiacciato, ben sveglio.',
      },
    },
    hint: {
      nl: 'Citroen staat vast.',
      en: 'Lemon is always there.',
      it: 'Il limone c’è sempre.',
    },
    image: '/media/bak-mango.jpg',
  },
  {
    label: { nl: 'Dolci', en: 'Pastry', it: 'Dolci' },
    title: {
      nl: 'Naast het ijs',
      en: 'Beside the gelato',
      it: 'Accanto al gelato',
    },
    body: {
      nl: 'Cannoli, tiramisù en wat er die ochtend gebakken is.',
      en: 'Cannoli, tiramisù and whatever was baked that morning.',
      it: 'Cannoli, tiramisù e quel che è stato sfornato la mattina.',
    },
    kiezer: {
      label: { nl: 'Bij de koffie', en: 'With your coffee', it: 'Con il caffè' },
      zin: {
        nl: 'Vraag naar de dolci — cannoli, tiramisù en wat er vers is.',
        en: 'Ask about the dolci — cannoli, tiramisù and whatever is fresh.',
        it: 'Chiedi dei dolci: cannoli, tiramisù e quel che è fresco.',
      },
    },
    hint: { nl: 'Op is op.', en: 'When it’s gone, it’s gone.', it: 'Fino a esaurimento.' },
    image: '/media/vitrine-gebak.jpg',
  },
]

/**
 * De zes smaakfamilies voor de flip-kaarten. Voorkant vertelt wat de familie
 * is, achterkant waar hij bij past.
 */
export const families = [
  {
    id: 'romig',
    eyebrow: { nl: 'De rustige rij', en: 'The quiet row', it: 'La fila tranquilla' },
    name: { nl: 'Romig', en: 'Creamy', it: 'Cremoso' },
    front: {
      nl: 'Zacht, melkig en dik te scheppen. De vertrouwde kant van de vitrine.',
      en: 'Soft, milky and thickly scooped. The familiar side of the cabinet.',
      it: 'Morbido, latteo e generoso. Il lato familiare del banco.',
    },
    /** Wat er in deze familie op het bord staat; zie de lijst bovenaan. */
    smaken: ['Vanilla', 'Zabaglione', 'Stracciatella', 'Pineapple & Rosemary'],
    tags: [
      { nl: 'Melkig', en: 'Milky', it: 'Latteo' },
      { nl: 'Zacht', en: 'Soft', it: 'Morbido' },
      { nl: 'Klassiek', en: 'Classic', it: 'Classico' },
    ],
    mood: {
      nl: 'Rustig, vertrouwd en zonder verrassingen.',
      en: 'Calm, familiar and free of surprises.',
      it: 'Tranquillo, familiare e senza sorprese.',
    },
    bestFor: {
      nl: 'Na het eten, of als je niet kunt kiezen.',
      en: 'After dinner, or when you can’t choose.',
      it: 'Dopo cena, o quando non riesci a scegliere.',
    },
    ask: {
      nl: 'Vraag welke romige er vandaag staan.',
      en: 'Ask which creamy ones are in today.',
      it: 'Chiedi quali cremosi ci sono oggi.',
    },
    image: '/media/bak-vaniglia-cacao.jpg',
    tintHex: '#fdf7ea',
    backHex: '#8f5720',
    accentHex: '#8f5720',
  },
  {
    id: 'fruitig',
    eyebrow: { nl: 'Luid en licht', en: 'Loud and light', it: 'Squillante e leggero' },
    name: { nl: 'Fruitig', en: 'Fruity', it: 'Fruttato' },
    front: {
      nl: 'Helder, fris en op kleur gemaakt. Voor de lichtere bui.',
      en: 'Bright, fresh and led by colour. For the lighter mood.',
      it: 'Vivace, fresco e guidato dal colore. Per l’umore leggero.',
    },
    /** Wat er in deze familie op het bord staat; zie de lijst bovenaan. */
    smaken: ['Strawberry', 'Mango', 'Lemon', 'Melon & Mint'],
    tags: [
      { nl: 'Helder', en: 'Bright', it: 'Vivace' },
      { nl: 'Fris', en: 'Fresh', it: 'Fresco' },
      { nl: 'Luid', en: 'Loud', it: 'Squillante' },
    ],
    mood: {
      nl: 'Fel en fruitgestuurd; wisselt met wat rijp is.',
      en: 'Vivid and fruit-led; changes with whatever is ripe.',
      it: 'Acceso e guidato dalla frutta; cambia con ciò che è maturo.',
    },
    bestFor: {
      nl: 'Zonnige middagen en een ommetje langs de gracht.',
      en: 'Sunny afternoons and a walk along the canal.',
      it: 'Pomeriggi di sole e una passeggiata lungo il canale.',
    },
    ask: {
      nl: 'Vraag welk fruit deze week het hoogste woord voert.',
      en: 'Ask which fruit is doing the talking this week.',
      it: 'Chiedi quale frutta comanda questa settimana.',
    },
    image: '/media/bak-fragola.jpg',
    tintHex: '#fbdde6',
    backHex: '#b4544c',
    accentHex: '#b4544c',
  },
  {
    id: 'chocolade',
    eyebrow: { nl: 'Het diepe deel', en: 'The deep end', it: 'La parte profonda' },
    name: { nl: 'Chocolade', en: 'Chocolate', it: 'Cioccolato' },
    front: {
      nl: 'Donker, vol en met de lepel te eten. Voor de serieuze trek.',
      en: 'Dark, full and spoon-ready. For a serious craving.',
      it: 'Scuro, pieno e da cucchiaio. Per una voglia seria.',
    },
    /** Wat er in deze familie op het bord staat; zie de lijst bovenaan. */
    smaken: ['Dark Chocolate', 'Gianduia'],
    tags: [
      { nl: 'Vol', en: 'Full', it: 'Pieno' },
      { nl: 'Diep', en: 'Deep', it: 'Profondo' },
      { nl: 'Cacao', en: 'Cocoa', it: 'Cacao' },
    ],
    mood: {
      nl: 'Zwaar in de goede zin; fondente op water.',
      en: 'Heavy in the good sense; dark chocolate on water.',
      it: 'Corposo nel senso buono; fondente all’acqua.',
    },
    bestFor: {
      nl: 'Late avonden en gedeelde bakjes.',
      en: 'Late evenings and shared cups.',
      it: 'Serate tarde e coppette condivise.',
    },
    ask: {
      nl: 'Vraag of de fondente vandaag staat.',
      en: 'Ask whether the fondente is in today.',
      it: 'Chiedi se oggi c’è il fondente.',
    },
    image: '/media/bak-cioccolato.jpg',
    tintHex: '#f4ece2',
    backHex: '#5d321c',
    accentHex: '#5d321c',
  },
  {
    id: 'noten',
    eyebrow: { nl: 'Geroosterd en zout', en: 'Roasted and salted', it: 'Tostato e salato' },
    name: { nl: 'Noten', en: 'Nutty', it: 'Frutta secca' },
    front: {
      nl: 'Rond, geroosterd en licht hartig. De rijkere rij van de vitrine.',
      en: 'Rounded, roasted and lightly savoury. The richer row of the cabinet.',
      it: 'Rotondo, tostato e leggermente sapido. La fila più ricca del banco.',
    },
    /** Wat er in deze familie op het bord staat; zie de lijst bovenaan. */
    smaken: ['Pistacchio', 'Gianduia', "Croccantino all'Amarena"],
    tags: [
      { nl: 'Geroosterd', en: 'Roasted', it: 'Tostato' },
      { nl: 'Zout', en: 'Salted', it: 'Salato' },
      { nl: 'Boterig', en: 'Buttery', it: 'Burroso' },
    ],
    mood: {
      nl: 'Volwassen en niet te zoet.',
      en: 'Grown-up and not too sweet.',
      it: 'Adulto e non troppo dolce.',
    },
    bestFor: {
      nl: 'Bij een espresso, staand aan de bar.',
      en: 'With an espresso, standing at the bar.',
      it: 'Con un espresso, in piedi al bancone.',
    },
    ask: {
      nl: 'Vraag naar de pistache uit Sicilië.',
      en: 'Ask about the Sicilian pistachio.',
      it: 'Chiedi del pistacchio siciliano.',
    },
    image: '/media/bak-pistacchio.jpg',
    tintHex: '#eef3e4',
    backHex: '#5f6b3a',
    accentHex: '#5f6b3a',
  },
  {
    id: 'sorbet',
    eyebrow: { nl: 'Klaarwakker', en: 'Wide awake', it: 'Ben sveglio' },
    name: { nl: 'Sorbet', en: 'Sorbet', it: 'Sorbetto' },
    front: {
      nl: 'Helder, ijskoud en verfrissend. Fruit zonder de zware afdronk.',
      en: 'Clear, ice-cold and refreshing. Fruit without the heavy finish.',
      it: 'Limpido, ghiacciato e rinfrescante. Frutta senza chiusura pesante.',
    },
    /** Wat er in deze familie op het bord staat; zie de lijst bovenaan. */
    smaken: ['Lemon', 'Mango', 'Strawberry'],
    tags: [
      { nl: 'IJzig', en: 'Icy', it: 'Ghiacciato' },
      { nl: 'Scherp', en: 'Sharp', it: 'Deciso' },
      { nl: 'Fris', en: 'Fresh', it: 'Fresco' },
    ],
    mood: {
      nl: 'Zuiver: fruit, water en suiker, verder niets.',
      en: 'Pure: fruit, water and sugar, nothing else.',
      it: 'Puro: frutta, acqua e zucchero, nient’altro.',
    },
    bestFor: {
      nl: 'Warme dagen en tussen twee bollen door.',
      en: 'Warm days and between two scoops.',
      it: 'Giornate calde e tra una pallina e l’altra.',
    },
    ask: {
      nl: 'Citroen staat vast; vraag naar de rest.',
      en: 'Lemon is always there; ask about the rest.',
      it: 'Il limone c’è sempre; chiedi del resto.',
    },
    image: '/media/bak-mango.jpg',
    tintHex: '#fce6c6',
    backHex: '#8f5720',
    accentHex: '#8f5720',
  },
  {
    id: 'dolci',
    eyebrow: { nl: 'De zoete plank', en: 'The sweet shelf', it: 'Lo scaffale dolce' },
    name: { nl: 'Dolci', en: 'Pastry', it: 'Dolci' },
    front: {
      nl: 'Alles wat naast het ijs staat: gebak, cannoli en wat er die ochtend uit de oven kwam.',
      en: 'Everything beside the gelato: pastry, cannoli and whatever left the oven that morning.',
      it: 'Tutto accanto al gelato: dolci, cannoli e quel che è uscito dal forno la mattina.',
    },
    /** Wat er in deze familie op het bord staat; zie de lijst bovenaan. */
    smaken: ['Tiramisù', 'Cannoncini', 'Nonna’s Koekjes'],
    tags: [
      { nl: 'Bakjes', en: 'Cups', it: 'Coppette' },
      { nl: 'Taart', en: 'Cake', it: 'Torta' },
      { nl: 'Gelaagd', en: 'Layered', it: 'A strati' },
    ],
    mood: {
      nl: 'Wisselt per dag, want het wordt vers gemaakt.',
      en: 'Changes daily, because it is made fresh.',
      it: 'Cambia ogni giorno, perché è fatto fresco.',
    },
    bestFor: {
      nl: 'Meenemen naar huis, of bij de koffie.',
      en: 'Taking home, or alongside the coffee.',
      it: 'Da portare a casa, o con il caffè.',
    },
    ask: {
      nl: 'Vraag wat er vandaag gebakken is.',
      en: 'Ask what was baked today.',
      it: 'Chiedi cosa è stato sfornato oggi.',
    },
    image: '/media/vitrine-gebak.jpg',
    tintHex: '#f6e6d3',
    backHex: '#b4544c',
    accentHex: '#7d6229',
  },
]

/** Hulp bij kiezen aan de vitrine; wijst door naar een familie. */
