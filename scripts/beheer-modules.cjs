/**
 * De indeling van het beheerdocument: welke pagina's er zijn, en welk blok op
 * welke plek in de site hoort.
 *
 * Een module is een blok zoals het op de site staat, niet zoals het in de code
 * staat. De salon denkt in "de kop bovenaan de smakenpagina", niet in
 * `ui.smakenKopAccent`. Daarom heeft elke module een `plek` (waar het staat,
 * zodat je het op de site kunt terugvinden) en een `wat` (wat je hier aanpast).
 *
 * `sleutels` zijn de voorvoegsels die bij dit blok horen. Drie vormen:
 *   'ui.heroLead'   precies deze sleutel
 *   'moods'         deze sleutel en alles eronder (moods.0.title)
 *   'ui.hero*'      alles wat hiermee begint (ui.heroKop1, ui.heroLead)
 *
 * De eerste module die past wint, dus de volgorde hieronder is de volgorde van
 * de site. Wat nergens in past valt in "Not yet placed" en wordt bij het bouwen
 * gemeld. Dat is met opzet luidruchtig: een nieuwe sectie die stilletjes uit
 * het document verdwijnt merk je pas als de klant erover belt.
 *
 * Alles wat de salon leest is Engels; de code eromheen blijft Nederlands.
 *
 * `OVERGETYPT` is de enige plek in dit hele beheerdocument waar iets met de
 * hand is overgeschreven uit de bron. Het gaat om beelden en regels die in de
 * opmaak staan in plaats van in de data, en er kan dus niets automatisch
 * gevonden worden. Elke regel draagt daarom een `zoek`-tekst; bij het bouwen
 * wordt gecontroleerd of die er nog staat, en anders staat het in het verslag.
 * Hou deze lijst zo kort mogelijk: elke regel erbij is een regel die kan gaan
 * afwijken zonder dat iemand het merkt.
 */

/** De pagina's, in de volgorde van het menu. Zie src/components/Header.tsx. */
const paginas = [
  {
    id: 'overal',
    naam: 'Everywhere',
    route: '/',
    uitleg: 'The bar at the top, the footer and the wording that returns on every page.',
  },
  {
    id: 'home',
    naam: 'Home',
    route: '/',
    uitleg: 'One long walk past the shop: the opening, the gelato, the pastry, the craft, the guests and the way there.',
  },
  {
    id: 'smaken',
    naam: 'Ice cream',
    route: '/smaken',
    uitleg: 'The board with twelve flavours, how it is served, and the flavour families.',
  },
  {
    id: 'dolci',
    naam: 'Pastry and coffee',
    route: '/dolci',
    uitleg: 'The pastry counter, the coffee list and the set combinations.',
  },
  {
    id: 'afhalen',
    naam: 'Pickup',
    route: '/afhalen',
    uitleg: 'The order form: sizes, flavours, extras, collection time and the message the shop receives.',
  },
  {
    id: 'over-ons',
    naam: 'About us',
    route: '/over-ons',
    uitleg: 'Who is behind the counter, the story and the neighbourhood.',
  },
]

/**
 * De modules, in de volgorde waarin ze op de site staan.
 *
 * `anker` is de id in de HTML waar het voorbeeldvenster heen springt. Leeg
 * betekent: bovenaan de pagina.
 */
const modules = [
  // ---------------------------------------------------------------- overal
  {
    id: 'nav',
    pagina: 'overal',
    titel: 'Menu and language',
    anker: '',
    plek: 'The bar at the top of every page, and the language buttons in it.',
    wat: 'The names of the five menu items and the wording of the language switch.',
    sleutels: [
      'ui.navIjs',
      'ui.navGebak',
      'ui.navKoffie',
      'ui.navAanbieding',
      'ui.navBezoek',
      'ui.navAfhalen',
      'ui.navOverOns',
      'ui.menu',
      'ui.taalKiezen',
      'ui.hoofdmenu',
      'ui.mobielMenu',
      'ui.naarHoofdinhoud',
      'opmaak.logo',
    ],
  },
  {
    id: 'knoppen',
    pagina: 'overal',
    titel: 'Buttons',
    anker: '',
    plek: 'Every button on the site, wherever it appears.',
    wat: 'The wording on the buttons. Change one and it changes everywhere it is used.',
    sleutels: [
      'ui.route',
      'ui.routeEnAdres',
      'ui.belOns',
      'ui.ontdekGebak',
      'ui.bekijkSmaken',
      'ui.bestelUberEats',
      'ui.bestelThuisbezorgd',
      'ui.komLangs',
      'ui.naarHome',
      'ui.kaartOpenen',
      'ui.homeVolgInstagram',
      'ui.homeLeesReviews',
      'ui.homeBekijkPost',
    ],
  },
  {
    id: 'terugkerend',
    pagina: 'overal',
    titel: 'Recurring wording',
    anker: '',
    plek: 'Short labels that come back on several pages: opening hours, allergens, the address block.',
    wat: 'The small words around the content. They are short on purpose, so they fit in a badge or a line.',
    sleutels: [
      'ui.vitrineWisselt',
      'ui.nogBevestigen',
      'ui.letOp',
      'ui.allergenen*',
      'ui.gesloten',
      'ui.openingstijden',
      'ui.vandaagOpen',
      'ui.nuOpen',
      'ui.nuDicht',
      'ui.totTijd',
      'ui.vanaf*',
      'ui.adres',
      'ui.telefoon',
      'ui.open',
      'ui.maandag',
      'ui.dinsdagZondag',
      'ui.adresNogInvullen',
      'ui.buurt',
      'ui.kaartInteractief',
      'ui.draaiKaart',
      'ui.sfeer',
      'ui.pastBij',
      'ui.draaiVoorSmaken',
      'ui.familieSmaken',
      'ui.vraagInWinkel',
      'ui.smakenGekozen',
    ],
  },
  {
    id: 'footer',
    pagina: 'overal',
    titel: 'Footer',
    anker: '',
    plek: 'The dark block at the bottom of every page.',
    wat: 'The line under the wordmark and the headings above the two link columns.',
    sleutels: ['ui.footerTagline', 'ui.footerVolgen', 'ui.footerBestellen', 'opmaak.footerTagline'],
  },
  {
    id: 'zaakgegevens',
    pagina: 'overal',
    titel: 'Shop details',
    anker: '',
    plek: 'The address in the footer, on the visit section, and in the details search engines read.',
    wat: 'Name and address. These are the same in all three languages, so they appear once.',
    sleutels: ['contact'],
  },
  {
    id: 'delen',
    pagina: 'overal',
    titel: 'When someone shares the site',
    anker: '',
    plek: 'The picture and the words that appear when someone posts a link to the site in a chat or on social media.',
    wat: 'The photo that goes with a shared link. It is one photo for the whole site.',
    sleutels: ['opmaak.deelbeeld'],
  },
  {
    id: 'fouten',
    pagina: 'overal',
    titel: 'Errors and loading',
    anker: '',
    plek: 'The page someone lands on after a dead link, and the moment a page is still loading.',
    wat: 'What the site says when something is missing or goes wrong.',
    sleutels: ['ui.laden', 'ui.fout*', 'ui.nietGevonden*'],
  },

  // ------------------------------------------------------------------ home
  {
    id: 'home-hero',
    pagina: 'home',
    titel: 'Opening',
    anker: '',
    plek: 'The first screen of the home page, above the striped band.',
    wat: 'The headline that types itself out, the line under it, and the two chips.',
    sleutels: ['ui.hero*', 'ui.chipGelato', 'ui.chipDolci'],
  },
  {
    id: 'home-ticker',
    pagina: 'home',
    titel: 'Scrolling band',
    anker: '',
    plek: 'The yellow band that scrolls past just under the opening.',
    wat: 'The words in the band. They are Italian and the same in all three languages.',
    sleutels: ['tickerWords'],
  },
  {
    id: 'home-stemmingen',
    pagina: 'home',
    titel: 'The three rows of gelato',
    anker: 'stemmingen',
    plek: 'The stack of cards after the band, one per row of the cabinet.',
    wat: 'The heading above the stack, and the five cards: label, Italian subtitle, title and text.',
    sleutels: [
      'ui.homeStemmingen*',
      'ui.homeBesteSmaken',
      'ui.homeKomProeven',
      'moods',
      'opmaak.handgeschrevenRegel',
    ],
  },
  {
    id: 'home-thuis',
    pagina: 'home',
    titel: 'Famiglia Pack',
    anker: '',
    plek: 'The four coloured tubs on the swirling background, halfway down the home page.',
    wat: 'The heading above the tubs and the description of each size.',
    sleutels: ['ui.bakken*', 'ui.bakSmaken', 'ui.bakSamenstellen', 'ui.bekijkTwaalf', 'bakken'],
  },
  {
    id: 'home-glas',
    pagina: 'home',
    titel: 'Behind the glass',
    anker: 'vitrine-rij',
    plek: 'The pink block with the six panels that open when you hover. It also appears on the ice cream page.',
    wat: 'The heading above the panels, and the six flavour families: name, text, tags and the question to ask at the counter.',
    sleutels: ['ui.smakenGlas*', 'panels', 'families'],
  },
  {
    id: 'home-vitrine',
    pagina: 'home',
    titel: 'From our own oven',
    anker: 'vitrine',
    plek: 'The four numbered pastry cards that slide past, after the panels.',
    wat: 'The heading and the four cards from the cabinet.',
    sleutels: [
      'ui.homeVitrine*',
      'ui.homeKiesJeBol',
      'ui.homeHeleKaartGebak',
      'ui.ontdekGebak',
      'cabinet',
    ],
  },
  {
    id: 'home-ambacht',
    pagina: 'home',
    titel: 'The craft',
    anker: 'ambacht',
    plek: 'The block about how the gelato is made, with the photo of the cup and wafer.',
    wat: 'The long version and the short version of the craft text, and the three characteristics.',
    sleutels: ['ui.homeAmbacht*', 'ui.homeKenmerk*', 'ui.altWafel', 'opmaak.ambacht'],
  },
  {
    id: 'home-momenten',
    pagina: 'home',
    titel: 'Moments',
    anker: 'momenten',
    plek: 'The five photos with a caption, further down the home page.',
    wat: 'The heading and the five moments.',
    sleutels: ['ui.homeMomenten*', 'moments'],
  },
  {
    id: 'home-reviews',
    pagina: 'home',
    titel: 'What guests say',
    anker: 'reviews',
    plek: 'The dark block with the review columns scrolling upward.',
    wat: 'The heading, the guest quotes and what guests mention most. The quotes stay in the language the guest wrote them in.',
    sleutels: ['ui.homeReviews*', 'ui.reviews*', 'reviews', 'veelGenoemd'],
  },
  {
    id: 'home-feed',
    pagina: 'home',
    titel: 'On the feed',
    anker: 'feed',
    plek: 'The row of Instagram photos that slides past.',
    wat: 'The heading and the description of every photo in the row.',
    sleutels: ['ui.homeFeed*', 'feedBeelden'],
  },
  {
    id: 'home-bezoek',
    pagina: 'home',
    titel: 'Come by',
    anker: 'bezoek',
    plek: 'The visit block at the bottom, with the opening hours and the map.',
    wat: 'The heading above the visit block and the wording around the map.',
    sleutels: ['ui.homeBezoek*', 'ui.homeKaart*', 'ui.altGevel', 'ui.altGevelGasten'],
  },
  {
    id: 'home-slot',
    pagina: 'home',
    titel: 'Closing line',
    anker: '',
    plek: 'The last block before the footer, with the large wordmark.',
    wat: 'The closing heading and the line under it.',
    sleutels: ['ui.homeSlot*'],
  },

  // ---------------------------------------------------------------- smaken
  {
    id: 'smaken-kop',
    pagina: 'smaken',
    titel: 'Page opening',
    anker: '',
    plek: 'The top of the ice cream page.',
    wat: 'The heading, the line under it, and the description search engines show.',
    sleutels: [
      'ui.smakenEyebrow',
      'ui.smakenKop',
      'ui.smakenKopAccent',
      'ui.smakenLead',
      'ui.smakenBelKnop',
      'ui.smakenSeo',
    ],
  },
  {
    id: 'smaken-kaart',
    pagina: 'smaken',
    titel: 'The board',
    anker: 'kaart',
    plek: 'The heading above the twelve flavours, with the filter buttons.',
    wat: 'The wording around the board: filters, counts, and what it says when nothing matches.',
    sleutels: [
      'ui.smakenHeleKaart',
      'ui.smakenAltijdTwaalf',
      'ui.smakenAlles',
      'ui.smakenZichtbaar',
      'ui.filterCategorie',
      'ui.vandaagInVitrine',
      'ui.vandaagLijst',
      'ui.smakenLeeg',
      'categoryLabels',
      'tagLabels',
    ],
  },
  // De losse smaken krijgen hun eigen module; zie perItemModules hieronder.
  {
    id: 'smaken-serveren',
    pagina: 'smaken',
    titel: 'How it is served',
    anker: 'serveren',
    plek: 'The two cards under the board: the cone and the cup.',
    wat: 'The heading and the description of each way of serving.',
    sleutels: ['ui.serveerKop', 'ui.serveerLead', 'serveervormen'],
  },
  {
    id: 'smaken-families',
    pagina: 'smaken',
    titel: 'Choosing a flavour',
    anker: '',
    plek: 'The wording around the flavour families, lower down the ice cream page.',
    wat: 'The headings that introduce the families and the note about what changes.',
    sleutels: ['ui.smakenFamilies*', 'ui.smakenKiezen*', 'ui.smakenVoorbehoud*'],
  },
  {
    id: 'allergenen',
    pagina: 'smaken',
    titel: 'Allergens',
    anker: '',
    plek: 'The small list under every flavour and every pastry.',
    wat: 'The names of the five allergens. Keep these short: they sit in a badge.',
    sleutels: ['allergeen'],
  },

  // ----------------------------------------------------------------- dolci
  {
    id: 'dolci-kop',
    pagina: 'dolci',
    titel: 'Page opening',
    anker: '',
    plek: 'The top of the pastry page.',
    wat: 'The heading, the line under it, and the block about what comes out of the oven each morning.',
    sleutels: [
      'ui.dolciEyebrow',
      'ui.dolciKop',
      'ui.dolciKopAccent',
      'ui.dolciLead',
      'ui.dolciElkeOchtend',
      'ui.dolciKlein*',
      'ui.dolciBelVandaag',
      'ui.altTiramisu',
      'opmaak.dolciKop',
    ],
  },
  {
    id: 'dolci-kaart',
    pagina: 'dolci',
    titel: 'The pastry list',
    anker: 'dolci-kaart',
    plek: 'The heading above the nine pastry cards.',
    wat: 'The wording around the list, and the note about what is not confirmed yet.',
    sleutels: ['ui.dolciKaart*', 'ui.dolciLetOp*', 'ui.dolciSlot*'],
  },
  // De losse dolci krijgen hun eigen module; zie perItemModules hieronder.
  {
    id: 'koffie',
    pagina: 'dolci',
    titel: 'Coffee',
    anker: 'koffie',
    plek: 'The coffee list halfway down the pastry page.',
    wat: 'The heading, the drinks and the extras at the bar.',
    sleutels: ['ui.koffie*', 'ui.extra*', 'ui.altAffogato', 'opmaak.koffie', 'koffie', 'koffie.extras'],
  },
  {
    id: 'deals',
    pagina: 'dolci',
    titel: 'Set combinations',
    anker: 'deals',
    plek: 'The row of deals at the bottom of the pastry page.',
    wat: 'The heading, the deals and what you can choose within each one.',
    sleutels: ['ui.aanbieding*', 'ui.dealsMeer*', 'deals'],
  },

  // --------------------------------------------------------------- afhalen
  {
    id: 'afhalen-kop',
    pagina: 'afhalen',
    titel: 'Page opening',
    anker: '',
    plek: 'The top of the pickup page, above the form.',
    wat: 'The heading and the line that explains how ordering works.',
    sleutels: ['ui.afhalenEyebrow', 'ui.afhalenKop', 'ui.afhalenKopAccent', 'ui.afhalenLead'],
  },
  {
    id: 'afhalen-stappen',
    pagina: 'afhalen',
    titel: 'The steps in the form',
    anker: '',
    plek: 'The headings above each step of the order form.',
    wat: 'What each step is called, and the help text inside it.',
    sleutels: [
      'ui.stap*',
      'ui.kiesEerstFormaat',
      'ui.smakenVol',
      'ui.kiesDag',
      'ui.kiesTijd*',
      'ui.geenTijdvakken',
      'ui.naam',
      'ui.naamHint',
      'ui.telefoonHint',
      'ui.nogTeKiezen',
      'ui.tijdvakVol',
      'ui.totaal*',
      'ui.personen',
      'ui.meerVan',
      'ui.minderVan',
      'ui.gebakOptioneel',
      'ui.prijsAanToonbank',
      'ui.prijsVolgt',
      'ui.boodschapHint',
      'ui.bonHint',
      'ui.bonBereik',
      'ui.vrijBedrag',
      'ui.taartVooruit',
    ],
  },
  {
    id: 'afhalen-formaten',
    pagina: 'afhalen',
    titel: 'Sizes and extras',
    anker: '',
    plek: 'The size cards in step one, and the extras further down the form.',
    wat: 'The note under each size and the names of the extras.',
    sleutels: ['formaten', 'afhalen.extras'],
  },
  {
    id: 'afhalen-voorstel',
    pagina: 'afhalen',
    titel: 'Cakes and gift cards',
    anker: '',
    plek: 'The choice bar at the top of the form, and the steps that follow from it.',
    wat: 'The proposal for gelato cakes and gift cards. It is not on sale yet, so it carries no prices.',
    sleutels: ['ui.soort*', 'ui.voorstel*', 'taartmaten', 'bonbedragen'],
  },
  {
    id: 'afhalen-versturen',
    pagina: 'afhalen',
    titel: 'Sending the order',
    anker: '',
    plek: 'The last step of the form, and everything after the send button.',
    wat: 'The confirmation, the failure message, and the message the shop receives.',
    sleutels: [
      'ui.verstuur*',
      'ui.versturenBezig',
      'ui.bestelling*',
      'ui.opnieuwProberen',
      'ui.ofVia*',
      'ui.afhalen*',
      'ui.nogEenBestelling',
      'ui.bericht*',
      'ui.bevestiging*',
      'ui.telefoonOngeldig',
      'ui.naamOngeldig',
    ],
  },

  // -------------------------------------------------------------- over ons
  {
    id: 'over-kop',
    pagina: 'over-ons',
    titel: 'Page opening',
    anker: '',
    plek: 'The top of the about page.',
    wat: 'The heading, the line under it, and the three numbers.',
    sleutels: [
      'ui.overEyebrow',
      'ui.overKop',
      'ui.overKopAccent',
      'ui.overLead',
      'ui.overCijfer*',
      'ui.altPistache',
    ],
  },
  {
    id: 'over-verhaal',
    pagina: 'over-ons',
    titel: 'The story',
    anker: 'verhaal',
    plek: 'The three blocks under the opening: the story, the work and the neighbourhood.',
    wat: 'The headings and the text of each block.',
    sleutels: ['ui.overVerhaal*', 'ui.overWerk*', 'ui.overBuurt*', 'opmaak.overPistache'],
  },
  {
    id: 'over-twee',
    pagina: 'over-ons',
    titel: 'The two of them',
    anker: 'de-twee',
    plek: 'The block at the bottom of the about page, with the photo of the two of them.',
    wat: 'The heading above the block and the photo caption.',
    sleutels: ['ui.overTwee*', 'ui.altGiuliaSimone', 'opmaak.overDeTwee'],
  },
  // Giulia en Simone krijgen elk hun eigen module; zie perItemModules.
]

/**
 * Losse items die automatisch een eigen module krijgen.
 *
 * Een smaak of een gebakje is voor de salon een ding op zich: ze willen de
 * omschrijving van de pistache aanpassen, niet regel zeven van een lange
 * lijst. `naamUit` zegt welk veld de titel van de module levert, in de
 * basistaal.
 */
const perItemModules = [
  {
    bron: 'flavours',
    pagina: 'smaken',
    naModule: 'smaken-kaart',
    anker: 'kaart',
    plek: 'One of the twelve cards on the board, on the ice cream page.',
    wat: 'The name of this flavour and the description under it.',
    naamUit: ['naam', 'name'],
  },
  {
    bron: 'dolci',
    pagina: 'dolci',
    naModule: 'dolci-kaart',
    anker: 'dolci-kaart',
    plek: 'One of the nine cards on the pastry list.',
    wat: 'The name, the Italian subtitle, the description and the badges of this pastry.',
    naamUit: ['name'],
  },
  {
    bron: 'ui.overGiulia',
    pagina: 'over-ons',
    naModule: 'over-twee',
    anker: 'de-twee',
    plek: 'The left card under "the two of them", on the about page.',
    wat: 'The name, the role and the text of Giulia.',
    vasteTitel: 'Giulia',
  },
  {
    bron: 'ui.overSimone',
    pagina: 'over-ons',
    naModule: 'over-twee',
    anker: 'de-twee',
    plek: 'The right card under "the two of them", on the about page.',
    wat: 'The name, the role and the text of Simone.',
    vasteTitel: 'Simone',
  },
]

/**
 * Regels die in de opmaak staan in plaats van in de data.
 *
 * `zoek` is wat er in het bronbestand moet staan; klopt dat niet meer, dan
 * meldt het bouwverslag deze regel als versleten en staat hij niet in het
 * document. Dat is beter dan een klant die een tekst aanpast die daarna
 * nergens terechtkomt.
 */
const OVERGETYPT = [
  {
    soort: 'tekst',
    sleutel: 'opmaak.footerTagline',
    bestand: 'src/components/Footer.tsx',
    zoek: 'Gelato, dolci &amp; caff',
    waarde: 'Gelato, dolci & caffe',
  },
  {
    soort: 'tekst',
    sleutel: 'opmaak.handgeschrevenRegel',
    bestand: 'src/components/AchterHetGlas.tsx',
    zoek: 'Try before you buy',
    waarde: 'Try before you buy',
  },
  {
    soort: 'beeld',
    sleutel: 'opmaak.logo',
    bestand: 'src/components/Header.tsx',
    zoek: 'src="/media/logo.jpg"',
    pad: '/media/logo.jpg',
  },
  {
    soort: 'beeld',
    sleutel: 'opmaak.deelbeeld',
    bestand: 'src/lib/seo.tsx',
    zoek: '/media/gevel-bankjes.jpg',
    pad: '/media/gevel-bankjes.jpg',
  },
  {
    soort: 'beeld',
    sleutel: 'opmaak.overPistache',
    bestand: 'src/pages/OverOns.tsx',
    zoek: 'src="/media/bak-pistacchio.jpg"',
    pad: '/media/bak-pistacchio.jpg',
  },
  {
    soort: 'beeld',
    sleutel: 'opmaak.overDeTwee',
    bestand: 'src/pages/OverOns.tsx',
    zoek: 'src="/media/pair.png"',
    pad: '/media/pair.png',
  },
  {
    soort: 'beeld',
    sleutel: 'opmaak.ambacht',
    bestand: 'src/pages/home/Ambacht.tsx',
    zoek: 'src="/media/beker-wafel.jpg"',
    pad: '/media/beker-wafel.jpg',
  },
  {
    soort: 'beeld',
    sleutel: 'opmaak.koffie',
    bestand: 'src/components/KoffieKaart.tsx',
    zoek: 'src="/media/affogato.jpg"',
    pad: '/media/affogato.jpg',
  },
  {
    soort: 'beeld',
    sleutel: 'opmaak.dolciKop',
    bestand: 'src/pages/Dolci.tsx',
    zoek: 'src="/media/tiramisu.jpg"',
    pad: '/media/tiramisu.jpg',
  },
]

/** De module waar alles in valt wat nergens bij past. */
const RESTMODULE = {
  id: 'nog-niet-ingedeeld',
  pagina: 'overal',
  titel: 'Not yet placed',
  anker: '',
  plek: 'Somewhere on the site. This block is a signal that the site has changed.',
  wat: 'Text that has no place in this document yet. Let us know and it will get one.',
  sleutels: [],
}

/** Past deze sleutel bij dit voorvoegsel? Zie de uitleg bovenaan dit bestand. */
function pastBij(sleutel, voorvoegsel) {
  if (voorvoegsel.endsWith('*')) return sleutel.startsWith(voorvoegsel.slice(0, -1))
  return sleutel === voorvoegsel || sleutel.startsWith(`${voorvoegsel}.`)
}

module.exports = { paginas, modules, perItemModules, OVERGETYPT, RESTMODULE, pastBij }
