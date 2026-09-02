/**
 * Zet de uitgelezen inhoud en de indeling om in de gegevens waar het
 * beheerdocument mee werkt.
 *
 * Dit is de laag tussen "wat staat er in de code" en "wat ziet de salon". Hier
 * gebeurt drie dingen:
 *
 * 1. Elke tekst, elke foto en elke prijs krijgt de module waar hij bij hoort.
 *    De eerste module waarvan een voorvoegsel past wint, dus de volgorde in
 *    beheer-modules.cjs is de volgorde van de site.
 * 2. Losse items krijgen hun eigen module: elke smaak, elk gebakje, en de twee
 *    achter de toonbank. Een salon die de omschrijving van de pistache wil
 *    aanpassen zoekt naar "Pistacchio", niet naar regel zeven van een lijst.
 * 3. Elke sleutel krijgt een leesbaar label. `dolci.2.name` wordt
 *    "row 3 > name". Het scherm is Engels, dus de labels ook.
 *
 * Wat hier niet gebeurt: nadenken over hoe het eruitziet. Dat staat in
 * beheer-sjabloon.html.
 */

const { leesInhoud, TALEN, BASISTAAL } = require('./beheer-inhoud.cjs')
const {
  paginas,
  modules,
  perItemModules,
  OVERGETYPT,
  RESTMODULE,
  pastBij,
} = require('./beheer-modules.cjs')

/** Hoe de drie talen op het scherm heten. De salon leest Engels. */
const TAALNAMEN = { en: 'English', nl: 'Dutch', it: 'Italian' }

/**
 * De woorden waaruit de sleutels van de site bestaan, in het Engels.
 *
 * De sleutels in de code zijn Nederlands: `homeStemmingenEyebrow`,
 * `dolciKaartKop`. Het scherm van dit document is Engels, dus die woorden
 * mogen daar niet doorheen schemeren. Ze uit elkaar trekken en vertalen is de
 * enige manier om dat te garanderen zonder elk label met de hand te schrijven.
 *
 * Staat er een woord in een sleutel dat hier niet in staat, dan komt het
 * ongewijzigd op het scherm en meldt het bouwverslag het. Dat is met opzet
 * geen harde fout: een nieuwe sleutel mag de bouw van de site niet stoppen.
 * Wel is het een regel die je meteen wilt zien en oplossen.
 */
const WOORDENBOEK = {
  aan: 'on', aanbieding: 'offers', aantal: 'count', accent: 'accent', adres: 'address',
  affogato: 'affogato', afhalen: 'pickup', alleen: 'only', allergenen: 'allergens',
  alles: 'all', alt: 'photo description', altijd: 'always', ambacht: 'craft',
  ask: 'question to ask', auteur: 'author', bak: 'tub', bakken: 'tubs', band: 'band',
  bedrag: 'amount', bekijk: 'view', bel: 'call', bereik: 'range', bericht: 'message',
  best: 'best', beste: 'best', bestel: 'order', bestellen: 'order', bestelling: 'order',
  betalen: 'payment', bevestigen: 'confirm', bevestiging: 'confirmation', bezig: 'in progress',
  bezoek: 'visit', bezorgen: 'delivery', bij: 'at', body: 'text', bol: 'scoop',
  bon: 'gift card', boodschap: 'message on top', bron: 'source', buurt: 'neighbourhood',
  categorie: 'category', checken: 'to check', chip: 'chip', chocolademelk: 'hot chocolate',
  cijfer: 'number', dag: 'day', de: 'the', deals: 'deals', deelbeeld: 'sharing photo',
  deels: 'partial',
  description: 'description', detail: 'detail', dicht: 'closed', dinsdag: 'Tuesday',
  dolci: 'dolci', draai: 'flip', eats: 'Eats', een: 'one', eerst: 'first', ei: 'egg', elke: 'every',
  en: 'and', extra: 'extra', extras: 'extras', eyebrow: 'label above', familie: 'family',
  families: 'families', feed: 'feed', filter: 'filter', footer: 'footer', for: 'for',
  formaat: 'size', fout: 'error', frisdrank: 'soft drinks', front: 'front of the card',
  gasten: 'guests', gebak: 'pastry', geen: 'no', gegevens: 'details', gekozen: 'chosen',
  gelato: 'gelato', gelukt: 'succeeded', gesloten: 'closed', gevel: 'shopfront',
  gevonden: 'found', giulia: 'Giulia', glas: 'glass', gluten: 'gluten',
  glutenvrij: 'gluten free', handgeschreven: 'handwritten', hele: 'full', hero: 'opening',
  hint: 'hint', home: 'home', hoofdinhoud: 'main content', hoofdmenu: 'main menu',
  ijs: 'ice cream', image: 'photo', in: 'in', instagram: 'Instagram',
  interactief: 'interactive', invullen: 'to fill in', italian: 'Italian subtitle',
  je: 'your', kaart: 'board', kanalen: 'channels', kenmerk: 'feature',
  kenmerk1: 'feature 1', kenmerk2: 'feature 2', kenmerk3: 'feature 3', keuze: 'choice',
  keuzes: 'choice', kies: 'choose', kiezen: 'choosing', kiezer: 'helper', klaar: 'ready',
  klant: 'customer', klassieker: 'classic', klein: 'small', knop: 'button',
  koffie: 'coffee', kom: 'come', kop: 'heading', kop1: 'heading 1', kop2: 'heading 2',
  kort: 'short', kort3: 'short 3', label: 'label', laden: 'loading', land: 'country',
  langs: 'by', lead: 'intro', leeg: 'empty', lees: 'read', let: 'note', lijst: 'list',
  logo: 'logo', maandag: 'Monday', mail: 'e-mail', meenemen: 'to take away',
  meer: 'more', melk: 'milk', menu: 'menu', minder: 'fewer', mislukt: 'failed',
  mobiel: 'mobile', moment: 'moment', momenten: 'moments', mood: 'mood',
  muntthee: 'mint tea', naam: 'name', naar: 'to', name: 'name', nav: 'menu',
  niet: 'not', nog: 'still', noot: 'note', noten: 'nuts', nu: 'now', nummer: 'number',
  ochtend: 'morning', of: 'or', omschrijving: 'description', onbekend: 'unknown',
  ongeldig: 'invalid', ons: 'us', ontdek: 'discover', ook: 'also', op: 'on',
  open: 'open', openen: 'open', openingstijden: 'opening hours', ophalen: 'collection',
  opnieuw: 'again', optioneel: 'optional', over: 'about', overzicht: 'summary',
  past: 'suits', per: 'per', personen: 'people', pistache: 'pistachio',
  plaatshouder: 'placeholder', post: 'post', postcode: 'postcode', prijs: 'price',
  prijzen: 'prices', proberen: 'try', proeven: 'taste', regel: 'line',
  reviews: 'reviews', rol: 'role', route: 'directions', samenstellen: 'build',
  seizoen: 'seasonal', seo: 'search engines', serveer: 'serving', sfeer: 'mood',
  simone: 'Simone', slot: 'closing', smaken: 'flavours', soja: 'soy', soort: 'kind',
  src: 'photo', stad: 'city', stap: 'step', stemmingen: 'gelato rows', straat: 'street',
  straks: 'later', stuk: 'piece', stuks: 'pieces', taal: 'language', taart: 'cake',
  taartmaat: 'cake size', tagline: 'tagline', tags: 'badge', te: 'to', tekst: 'quote',
  telefoon: 'phone', thee: 'tea', thuis: 'home', thuisbezorgd: 'Thuisbezorgd',
  tijd: 'time', tijdvak: 'time slot', tijdvakken: 'time slots', tiramisu: 'tiramisu',
  title: 'title', titel: 'title', toelichting: 'note', toonbank: 'counter',
  tot: 'until', totaal: 'total', twaalf: 'twelve', twee: 'two', uber: 'Uber',
  uitleg: 'explanation', van: 'from', vanaf: 'from', vandaag: 'today', vegan: 'vegan',
  verder: 'more', verhaal: 'story', versturen: 'sending', verstuur: 'send', via: 'via',
  vitrine: 'cabinet', vol: 'full', volg: 'follow', volgen: 'follow', volgt: 'follows',
  voor: 'for', voorbehoud: 'caveat', voorstel: 'proposal', vooruit: 'in advance',
  vraag: 'ask', vrij: 'free', wafel: 'wafer', werk: 'work', whatsapp: 'WhatsApp',
  winkel: 'shop', wisselt: 'changes', woord: 'word', woord1: 'word 1',
  woord2: 'word 2', woord3: 'word 3', zichtbaar: 'shown', zin: 'sentence',
  zondag: 'Sunday',
}

/** Woorden die niet in het woordenboek stonden; het bouwverslag noemt ze. */
const onvertaald = new Set()

/**
 * Een stuk van een sleutel omzetten naar Engels.
 *
 * `homeAmbachtKop` valt uiteen in home, ambacht en kop, en die drie worden
 * los opgezocht. Zo hoeft niet elke samenstelling in het woordenboek te
 * staan, alleen de woorden waaruit ze bestaan.
 */
function vertaalStuk(stuk) {
  const woorden = stuk.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').split(' ')
  return woorden
    .map((woord) => {
      const klein = woord.toLowerCase()
      if (WOORDENBOEK[klein]) return WOORDENBOEK[klein]
      onvertaald.add(klein)
      return klein
    })
    .join(' ')
}

/**
 * Een sleutel omzetten naar een label dat een mens kan lezen.
 *
 * Het eerste stuk (de naam van de export) valt weg: dat staat al in de titel
 * van de module. Een rijnummer wordt "row 3" en telt vanaf een, want niemand
 * buiten de programmeurs telt vanaf nul.
 */
function labelVoor(sleutel) {
  const stukken = sleutel.split('.')
  const rest = stukken.length > 1 ? stukken.slice(1) : stukken
  const delen = rest.map((stuk) => {
    if (/^\d+$/.test(stuk)) return `row ${Number(stuk) + 1}`
    return vertaalStuk(stuk)
  })
  const label = delen.join(' > ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** De naam van de prijsgroep waar deze regel bij hoort. */
const PRIJSGROEPEN = {
  dolci: 'Pastry',
  deals: 'Set combinations',
  koffie: 'Coffee',
  bakken: 'Famiglia Pack',
  formaten: 'Pickup sizes',
  serveervormen: 'How it is served',
  taartmaten: 'Gelato cakes',
  bonbedragen: 'Gift cards',
}

/** Zoekt de module waar een sleutel bij hoort. Eerste die past wint. */
function moduleVoor(sleutel, lijst) {
  for (const module of lijst) {
    for (const voorvoegsel of module.sleutels) {
      if (pastBij(sleutel, voorvoegsel)) return module
    }
  }
  return null
}

/**
 * Bouwt de modules op, inclusief de modules per los item.
 *
 * De items komen direct achter de module waar ze bij horen te staan, zodat de
 * lijst links de volgorde van de pagina houdt.
 */
function bouwModulelijst(teksten, echos) {
  const uitgebreid = []

  for (const module of modules) {
    uitgebreid.push({ ...module, sleutels: [...module.sleutels], automatisch: false })

    for (const regel of perItemModules) {
      if (regel.naModule !== module.id) continue

      if (regel.vasteTitel) {
        // Een vast persoon: alles wat met deze sleutel begint hoort erbij.
        uitgebreid.push({
          id: `${module.id}-${regel.vasteTitel.toLowerCase()}`,
          pagina: regel.pagina,
          titel: regel.vasteTitel,
          anker: regel.anker,
          plek: regel.plek,
          wat: regel.wat,
          sleutels: [`${regel.bron}*`],
          automatisch: true,
        })
        continue
      }

      // Een lijst: hoeveel rijen zijn er, en hoe heet elke rij?
      //
      // De echo's tellen mee voor de naam. `dolci.0.name` staat woordelijk ook
      // in `cabinet.0.name` en verhuist daardoor naar het blok van de
      // homepage; zonder de echo's zou dit gebakje "Row 1" gaan heten.
      const rijen = new Map()
      const naamBronnen = teksten.concat(
        echos.map((echo) => ({
          sleutel: echo.sleutel,
          meertalig: false,
          waarde: echo.waarde,
        })),
      )
      for (const tekst of naamBronnen) {
        const match = tekst.sleutel.match(new RegExp(`^${regel.bron}\\.(\\d+)\\.`))
        if (!match) continue
        const index = Number(match[1])
        if (!rijen.has(index)) rijen.set(index, null)

        const staart = tekst.sleutel.slice(`${regel.bron}.${index}.`.length)
        if (regel.naamUit.includes(staart) && rijen.get(index) === null) {
          rijen.set(index, tekst.meertalig ? tekst.waarden[BASISTAAL] : tekst.waarde)
        }
      }

      for (const index of [...rijen.keys()].sort((a, b) => a - b)) {
        const naam = rijen.get(index) || `Row ${index + 1}`
        uitgebreid.push({
          id: `${regel.bron}-${index}`,
          pagina: regel.pagina,
          titel: naam,
          anker: regel.anker,
          plek: regel.plek,
          wat: regel.wat,
          sleutels: [`${regel.bron}.${index}`],
          automatisch: true,
        })
      }
    }
  }

  return uitgebreid
}

/**
 * Alles bij elkaar: modules met hun velden, foto's en prijzen, plus de
 * tellingen en de waarschuwingen voor het bouwverslag.
 */
function bouwGegevens() {
  const inhoud = leesInhoud({ overgetypt: OVERGETYPT })
  const lijst = bouwModulelijst(inhoud.teksten, inhoud.echos)
  const rest = { ...RESTMODULE, sleutels: [], automatisch: false }

  const perModule = new Map()
  for (const module of [...lijst, rest]) {
    perModule.set(module.id, {
      id: module.id,
      pagina: module.pagina,
      titel: module.titel,
      anker: module.anker,
      plek: module.plek,
      wat: module.wat,
      automatisch: module.automatisch,
      velden: [],
      beelden: [],
      prijzen: [],
    })
  }

  const nietIngedeeld = []

  for (const tekst of inhoud.teksten) {
    const module = moduleVoor(tekst.sleutel, lijst) ?? rest
    if (module === rest) nietIngedeeld.push(tekst.sleutel)
    perModule.get(module.id).velden.push({
      sleutel: tekst.sleutel,
      bestand: tekst.bestand,
      label: labelVoor(tekst.sleutel),
      meertalig: tekst.meertalig,
      waarden: tekst.meertalig ? tekst.waarden : null,
      waarde: tekst.meertalig ? null : tekst.waarde,
    })
  }

  /*
   * Foto's per blok.
   *
   * Elke verwijzing krijgt zijn eigen blok, zodat elke sectie de foto's toont
   * die daar staan. Binnen een blok wordt hetzelfde bestand wel maar een keer
   * getoond: `panels.0.image` en `families.0.image` wijzen naar dezelfde bak
   * vanille en staan allebei in "Behind the glass", en die twee keer naast
   * elkaar zetten leest als een fout.
   */
  const perPad = new Map()
  for (const beeld of inhoud.beelden) {
    const module = moduleVoor(beeld.sleutel, lijst) ?? rest
    if (module === rest) nietIngedeeld.push(beeld.sleutel)

    const blok = perModule.get(module.id)
    if (blok.beelden.some((b) => b.pad === beeld.pad)) continue

    blok.beelden.push({
      sleutel: beeld.sleutel,
      bestand: beeld.bestand,
      label: labelVoor(beeld.sleutel),
      pad: beeld.pad,
      gedeeldMet: [],
    })

    if (!perPad.has(beeld.pad)) perPad.set(beeld.pad, [])
    perPad.get(beeld.pad).push({ moduleId: module.id, titel: module.titel })
  }

  /*
   * Een foto die op meer plekken staat is een bestand, geen kopie. Vervang je
   * hem, dan verandert hij overal. Het document moet dat zeggen, anders denkt
   * iemand dat hij alleen deze ene kaart aanpast.
   */
  for (const blok of perModule.values()) {
    for (const beeld of blok.beelden) {
      const plekken = perPad.get(beeld.pad) || []
      beeld.gedeeldMet = plekken.filter((p) => p.moduleId !== blok.id).map((p) => p.titel)
    }
  }

  const prijzen = []
  for (const prijs of inhoud.prijzen) {
    const module = moduleVoor(prijs.sleutel, lijst) ?? rest
    const groep = PRIJSGROEPEN[prijs.sleutel.split('.')[0]] ?? 'Other'
    const regel = {
      sleutel: prijs.sleutel,
      bestand: prijs.bestand,
      groep,
      naam: prijs.naam,
      prijs: prijs.prijs,
      toelichting: prijs.toelichting,
      module: module.id,
    }
    prijzen.push(regel)
    perModule.get(module.id).prijzen.push(regel)
  }

  // Modules zonder inhoud horen niet in het document: die tonen een leeg blok
  // en laten iemand zoeken naar iets wat er niet is.
  const gevuld = [...perModule.values()].filter(
    (m) => m.velden.length || m.beelden.length || m.prijzen.length,
  )

  // Hoeveel er per taal nog te vertalen is.
  const gaten = {}
  for (const taal of TALEN) gaten[taal] = 0
  let velden = 0
  for (const module of gevuld) {
    for (const veld of module.velden) {
      if (!veld.meertalig) continue
      velden++
      for (const taal of TALEN) {
        if (!veld.waarden[taal] || !veld.waarden[taal].trim()) gaten[taal]++
      }
    }
  }

  return {
    talen: TALEN,
    basistaal: BASISTAAL,
    taalnamen: TAALNAMEN,
    paginas,
    modules: gevuld,
    prijzen,
    tellingen: {
      modules: gevuld.length,
      teksten: inhoud.teksten.length,
      meertaligeVelden: velden,
      beelden: new Set(inhoud.beelden.map((b) => b.pad)).size,
      beeldplekken: gevuld.reduce((totaal, m) => totaal + m.beelden.length, 0),
      prijzen: prijzen.length,
      gaten,
    },
    waarschuwingen: {
      ontbrekendeBestanden: inhoud.ontbrekendeBestanden,
      missendeExports: inhoud.missendeExports,
      versletenRegels: inhoud.versletenRegels,
      nietIngedeeld,
      echos: inhoud.echos,
      onvertaaldeWoorden: [...onvertaald].sort(),
    },
  }
}

module.exports = { bouwGegevens, labelVoor, TAALNAMEN }

if (require.main === module) {
  const g = bouwGegevens()
  console.log(JSON.stringify(g.tellingen, null, 2))
  console.log('niet ingedeeld:', g.waarschuwingen.nietIngedeeld.length)
  if (g.waarschuwingen.nietIngedeeld.length) {
    console.log(g.waarschuwingen.nietIngedeeld.join('\n'))
  }
}
