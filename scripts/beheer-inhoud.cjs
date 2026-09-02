/**
 * Leest de hele site uit: elke zichtbare tekst, elk fotopad en elke prijs,
 * met het bronbestand erbij.
 *
 * Niets hiervan is overgetypt. De contentbestanden worden ter plekke met de
 * TypeScript-compiler uit node_modules naar JavaScript vertaald en uitgevoerd,
 * en daarna lopen we door de waarden heen die eruit komen. Daardoor verandert
 * het beheerdocument mee met de site: een smaak erbij is een regel erbij, en
 * niemand hoeft eraan te denken.
 *
 * Waarom niet de bestanden als tekst afzoeken met een reguliere expressie:
 * dat werkt tot het eerste veld dat over meerdere regels staat, of tot de
 * eerste apostrof in het Italiaans. Uitvoeren geeft de echte waarden, precies
 * zoals de site ze toont.
 *
 * Vier valkuilen die hier al eens zijn ingelopen, en hoe ze dichtgezet zijn:
 *
 * 1. Imports tussen contentbestanden moeten echt opgelost worden, relatief
 *    vanaf de map van het bestand dat de import doet. `data/home.ts` haalt de
 *    openingstijden uit `data/contact.ts`. Geef je elke import een leeg
 *    object, dan komen daar afgeleide teksten uit als "vandaag van undefined
 *    tot undefined", en die staan dan in het document dat naar de klant gaat.
 * 2. Een tekst die twee keer voorkomt hoort maar een keer in het document.
 *    `data/home.ts` citeert de omschrijvingen uit `data/dolci.ts` woordelijk.
 *    Zet je ze allebei in het document, dan lukt de eerste vervanging en
 *    mislukt de tweede, want dan staat de oude tekst er niet meer.
 * 3. Sleutels die techniek zijn en niet op het scherm staan (kleurcodes,
 *    beeldpaden, id's, maten) horen er niet in. Zie TECHNISCH hieronder.
 * 4. Afgeleide exports (`adresRegel`, `openingHours`) staan niet als tekst in
 *    de code. Ze zijn samengesteld uit andere waarden, en het toepasscript kan
 *    ze dus niet terugvinden. Ze worden niet uitgelezen; de onderdelen waar ze
 *    uit bestaan wel.
 *
 * Draaien kan los, om te zien wat eruit komt:
 *   node scripts/beheer-inhoud.cjs
 */

const fs = require('node:fs')
const path = require('node:path')

const WORTEL = path.resolve(__dirname, '..')
const BRON = path.join(WORTEL, 'src')

/** De drie talen, met de bron voorop. Zie src/i18n/taal.tsx. */
const TALEN = ['en', 'nl', 'it']
const BASISTAAL = 'en'

/**
 * Welke exports uit welk bestand tekst bevatten.
 *
 * Bewust een lijst en geen "alles wat geexporteerd wordt": een afgeleide
 * export als `adresRegel` staat nergens letterlijk in de code, en een
 * hulpfunctie als `nuOpen` is geen tekst. Staat een export hier maar bestaat
 * hij niet meer, dan zegt het bouwverslag dat: dan is de site verbouwd en moet
 * deze lijst mee.
 */
const CONTENTBESTANDEN = [
  { bestand: 'src/i18n/teksten.ts', exports: ['ui'] },
  { bestand: 'src/data/home.ts', exports: ['moods', 'cabinet', 'moments', 'tickerWords'] },
  {
    bestand: 'src/data/flavours.ts',
    exports: ['categoryLabels', 'tagLabels', 'flavours', 'panels', 'families'],
  },
  { bestand: 'src/data/dolci.ts', exports: ['dolci'] },
  { bestand: 'src/data/deals.ts', exports: ['deals'] },
  { bestand: 'src/data/koffie.ts', exports: ['koffie', 'extras'] },
  { bestand: 'src/data/thuis.ts', exports: ['bakken'] },
  { bestand: 'src/data/afhalen.ts', exports: ['formaten', 'extras'] },
  { bestand: 'src/data/bestelsoorten.ts', exports: ['taartmaten', 'bonbedragen'] },
  { bestand: 'src/data/serveervormen.ts', exports: ['serveervormen'] },
  { bestand: 'src/data/allergenen.ts', exports: ['allergeen'] },
  { bestand: 'src/data/reviews.ts', exports: ['reviews', 'veelGenoemd'] },
  { bestand: 'src/data/contact.ts', exports: ['contact'] },
  { bestand: 'src/pages/home/feedBeelden.ts', exports: ['feedBeelden'] },
]

/**
 * Sleutels waarvan de waarde techniek is en niet op het scherm staat.
 *
 * Een kleurcode in het document zetten levert een klant op die er een woord in
 * typt, en een pagina die daarna niet meer laadt.
 */
const TECHNISCH = new Set([
  'id',
  'slug',
  'href',
  'src',
  'url',
  'link',
  'post',
  'image',
  'beeld',
  'poster',
  'className',
  'tint',
  'dot',
  'swatch',
  'tone',
  'wash',
  'glyphs',
  'tintHex',
  'accentHex',
  'backHex',
  'numberHex',
  'category',
  'categorie',
  'familie',
  'allergenen',
  'sterren',
  'maxSmaken',
  'aantal',
  'price',
  'prijs',
  'bron',
  'rol',
  'tags',
  'time',
  'number',
  'smaken',
  'telefoon',
  'whatsapp',
  'email',
  'website',
  'pluscode',
])

/** Sleutels waaronder een fotopad staat. */
const BEELDSLEUTELS = new Set(['image', 'src', 'beeld', 'poster'])

// ---------------------------------------------------------------------------
// TypeScript inlezen en uitvoeren
// ---------------------------------------------------------------------------

let ts
try {
  ts = require(path.join(WORTEL, 'node_modules', 'typescript'))
} catch {
  throw new Error(
    'TypeScript staat niet in node_modules. Draai eerst `npm install`; het ' +
      'beheerdocument leest de contentbestanden met de compiler die de site zelf gebruikt.',
  )
}

/** Bestanden die er niet meer zijn; het bouwverslag noemt ze. */
const ontbrekend = []

/** Al geladen modules, zodat een bestand dat twee keer wordt geimporteerd een keer draait. */
const geladen = new Map()

/** Zoekt het echte bestand bij een importpad: met of zonder extensie, of een map met index. */
function vindBestand(kaal) {
  const kandidaten = [
    kaal,
    `${kaal}.ts`,
    `${kaal}.tsx`,
    path.join(kaal, 'index.ts'),
    path.join(kaal, 'index.tsx'),
  ]
  for (const kandidaat of kandidaten) {
    if (fs.existsSync(kandidaat) && fs.statSync(kandidaat).isFile()) return kandidaat
  }
  return null
}

/**
 * Laadt een contentbestand: TypeScript erin, waarden eruit.
 *
 * De `require` die het bestand krijgt is een eigen versie. Die kent drie
 * gevallen: `@/...` wijst naar src/, een pad dat met een punt begint is
 * relatief ten opzichte van dit bestand, en al het andere is een pakket uit
 * node_modules waar geen tekst van de site in staat.
 */
function laadModule(absoluutPad) {
  if (geladen.has(absoluutPad)) return geladen.get(absoluutPad)

  const echt = vindBestand(absoluutPad)
  if (!echt) {
    ontbrekend.push(path.relative(WORTEL, absoluutPad))
    geladen.set(absoluutPad, {})
    return {}
  }

  const bronTekst = fs.readFileSync(echt, 'utf8')
  const vertaald = ts.transpileModule(bronTekst, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.Preserve,
      esModuleInterop: true,
    },
    fileName: echt,
  }).outputText

  const moduleObject = { exports: {} }
  // Vast neerzetten voor het uitvoeren: twee bestanden die naar elkaar
  // verwijzen draaien elkaar anders eindeloos rond.
  geladen.set(absoluutPad, moduleObject.exports)

  const eigenRequire = (verzoek) => {
    if (verzoek.startsWith('@/')) return laadModule(path.join(BRON, verzoek.slice(2)))
    if (verzoek.startsWith('.')) return laadModule(path.resolve(path.dirname(echt), verzoek))
    // Een pakket uit node_modules. Daar staat geen tekst van de site in, en
    // react binnenhalen in een script dat alleen waarden wil lezen levert
    // alleen maar gedoe op.
    return {}
  }

  const draai = new Function('exports', 'require', 'module', '__filename', '__dirname', vertaald)
  draai(moduleObject.exports, eigenRequire, moduleObject, echt, path.dirname(echt))

  geladen.set(absoluutPad, moduleObject.exports)
  return moduleObject.exports
}

// ---------------------------------------------------------------------------
// Door de waarden heen lopen
// ---------------------------------------------------------------------------

/** Is dit een `{ en, nl, it }`-veld? Een taal mag ontbreken; dat is juist het punt. */
function isVertaald(waarde) {
  if (!waarde || typeof waarde !== 'object' || Array.isArray(waarde)) return false
  const sleutels = Object.keys(waarde)
  if (sleutels.length === 0) return false
  if (!sleutels.every((s) => TALEN.includes(s))) return false
  return sleutels.some((s) => typeof waarde[s] === 'string' && waarde[s].trim() !== '')
}

/**
 * Het laatste stuk van een sleutelpad dat geen rijnummer is.
 *
 * `dolci.2.name` levert `name`, en `moods.3.glyphs.0` levert `glyphs` en niet
 * `0`. Dat verschil is niet cosmetisch: zonder deze stap heet de sleutel van
 * elk item in een lijst gewoon `0`, staat die nergens in TECHNISCH, en komen
 * de kleurnamen van de sierletters en de allergeensleutels alsnog als tekst in
 * het document terecht.
 */
function laatsteStuk(sleutel) {
  const stukken = sleutel.split('.')
  for (let i = stukken.length - 1; i >= 0; i--) {
    if (!/^\d+$/.test(stukken[i])) return stukken[i]
  }
  return stukken[stukken.length - 1]
}

/**
 * Loopt door een waarde heen en verzamelt teksten, beelden en prijzen.
 *
 * `verzamel.gezien` houdt bij welke tekst al langskwam. Komt dezelfde tekst
 * nog een keer voorbij, dan is het een echo: hij komt niet in het document,
 * want er is er in de code maar een die de oude waarde nog draagt.
 */
function loop(waarde, sleutel, bestand, verzamel) {
  if (waarde === null || waarde === undefined) return

  const stuk = laatsteStuk(sleutel)

  if (isVertaald(waarde)) {
    const waarden = {}
    for (const taal of TALEN) {
      waarden[taal] = typeof waarde[taal] === 'string' ? waarde[taal] : ''
    }
    const afdruk = TALEN.map((t) => waarden[t]).join(' ')
    if (verzamel.gezien.has(afdruk)) {
      // De waarde reist mee: een module die naar een item is vernoemd heeft de
      // naam nodig, ook als die naam ergens anders al is opgeschreven.
      verzamel.echos.push({
        sleutel,
        bestand,
        eersteKeer: verzamel.gezien.get(afdruk),
        waarde: waarden[BASISTAAL],
      })
      return
    }
    verzamel.gezien.set(afdruk, sleutel)
    verzamel.teksten.push({ sleutel, bestand, meertalig: true, waarden })
    return
  }

  if (typeof waarde === 'string') {
    if (BEELDSLEUTELS.has(stuk) && waarde.startsWith('/media/')) {
      /*
       * Elke verwijzing telt, ook als hetzelfde bestand ergens anders al is
       * langsgekomen.
       *
       * Hier stond eerst een filter dat een fotopad maar een keer doorliet. Dat
       * leek netjes, maar het haalde de foto weg uit elke sectie behalve de
       * eerste: de vitrinefoto stond alleen nog bij de homepage en niet meer
       * bij het blok waar hij op de smakenpagina staat. Wie daar een foto wil
       * vervangen zag geen enkele foto staan.
       *
       * Het vervangen zelf gaat per bestand en niet per verwijzing: er ligt op
       * schijf maar een bestand. Het document zegt daarom bij een gedeelde foto
       * waar hij nog meer staat.
       */
      verzamel.beeldpaden.set(waarde, (verzamel.beeldpaden.get(waarde) ?? 0) + 1)
      verzamel.beelden.push({ sleutel, bestand, pad: waarde })
      return
    }
    if (TECHNISCH.has(stuk)) return
    if (waarde.trim() === '') return
    const afdruk = waarde
    if (verzamel.gezien.has(afdruk)) {
      verzamel.echos.push({ sleutel, bestand, eersteKeer: verzamel.gezien.get(afdruk), waarde })
      return
    }
    verzamel.gezien.set(afdruk, sleutel)
    verzamel.teksten.push({ sleutel, bestand, meertalig: false, waarde })
    return
  }

  if (typeof waarde === 'number' || typeof waarde === 'boolean') return
  if (typeof waarde === 'function') return
  if (waarde instanceof Date) return

  if (Array.isArray(waarde)) {
    waarde.forEach((item, i) => loop(item, `${sleutel}.${i}`, bestand, verzamel))
    return
  }

  if (typeof waarde === 'object') {
    // Een rij met een prijs erin is een prijsregel. De naam en de toelichting
    // staan ernaast, en die wil je in de prijstabel naast het bedrag zien.
    const heeftPrijs = 'price' in waarde || 'prijs' in waarde
    if (heeftPrijs) {
      const prijs = 'price' in waarde ? waarde.price : waarde.prijs
      if (prijs === null || typeof prijs === 'number') {
        verzamel.prijzen.push({
          sleutel,
          bestand,
          prijs,
          naam: naamVan(waarde),
          toelichting: toelichtingVan(waarde),
        })
      }
    }
    for (const [naam, kind] of Object.entries(waarde)) {
      loop(kind, `${sleutel}.${naam}`, bestand, verzamel)
    }
  }
}

/** De naam van een rij, in de drie talen als die er zijn. */
function naamVan(rij) {
  for (const sleutel of ['name', 'naam', 'label', 'titel', 'title']) {
    const waarde = rij[sleutel]
    if (isVertaald(waarde)) {
      const uit = {}
      for (const taal of TALEN) uit[taal] = typeof waarde[taal] === 'string' ? waarde[taal] : ''
      return uit
    }
    if (typeof waarde === 'string' && waarde.trim() !== '') {
      // Een eigennaam als Piccolo: in alle drie de talen hetzelfde.
      const uit = {}
      for (const taal of TALEN) uit[taal] = waarde
      return uit
    }
  }
  const leeg = {}
  for (const taal of TALEN) leeg[taal] = ''
  return leeg
}

/** De toelichting bij een prijsregel, in de drie talen. */
function toelichtingVan(rij) {
  for (const sleutel of ['description', 'omschrijving', 'toelichting', 'body']) {
    const waarde = rij[sleutel]
    if (isVertaald(waarde)) {
      const uit = {}
      for (const taal of TALEN) uit[taal] = typeof waarde[taal] === 'string' ? waarde[taal] : ''
      return uit
    }
  }
  const leeg = {}
  for (const taal of TALEN) leeg[taal] = ''
  return leeg
}

// ---------------------------------------------------------------------------
// Naar buiten
// ---------------------------------------------------------------------------

/**
 * Leest alles uit en levert drie lijsten plus drie wachtposten.
 *
 * `overgetypt` is de korte lijst met regels die met de hand in
 * `scripts/beheer-modules.cjs` staat omdat ze in de opmaak staan en niet in de
 * data. Elke regel wordt hier tegen de bron gecontroleerd: staat hij er niet
 * meer, dan is de opmaak veranderd en klopt het document niet meer.
 */
function leesInhoud({ overgetypt = [] } = {}) {
  const verzamel = {
    teksten: [],
    beelden: [],
    prijzen: [],
    echos: [],
    gezien: new Map(),
    beeldpaden: new Map(),
  }

  const missendeExports = []

  /**
   * Twee bestanden mogen dezelfde exportnaam hebben: `data/koffie.ts` en
   * `data/afhalen.ts` hebben allebei een `extras`. Zonder onderscheid krijgen
   * die twee lijsten dezelfde sleutels, belanden ze in dezelfde module, en
   * overschrijft de een de ander. Alleen bij zo'n botsing komt de
   * bestandsnaam ervoor, zodat de sleutels van alle andere exports kort
   * blijven.
   */
  const hoeVaak = new Map()
  for (const { exports } of CONTENTBESTANDEN) {
    for (const naam of exports) hoeVaak.set(naam, (hoeVaak.get(naam) ?? 0) + 1)
  }

  for (const { bestand, exports } of CONTENTBESTANDEN) {
    const moduleWaarden = laadModule(path.join(WORTEL, bestand))
    const basisnaam = path.basename(bestand).replace(/\.tsx?$/, '')
    for (const naam of exports) {
      if (!(naam in moduleWaarden)) {
        missendeExports.push(`${bestand} kent geen export ${naam}`)
        continue
      }
      const sleutel = hoeVaak.get(naam) > 1 ? `${basisnaam}.${naam}` : naam
      loop(moduleWaarden[naam], sleutel, bestand, verzamel)
    }
  }

  // De regels die in de opmaak staan in plaats van in de data.
  const versleten = []
  for (const regel of overgetypt) {
    const absoluut = path.join(WORTEL, regel.bestand)
    if (!fs.existsSync(absoluut)) {
      versleten.push(`${regel.bestand} bestaat niet meer`)
      continue
    }
    const inhoud = fs.readFileSync(absoluut, 'utf8')
    if (!inhoud.includes(regel.zoek)) {
      versleten.push(`${regel.bestand}: "${regel.zoek}" staat er niet meer in`)
      continue
    }
    if (regel.soort === 'beeld') {
      verzamel.beeldpaden.set(regel.pad, (verzamel.beeldpaden.get(regel.pad) ?? 0) + 1)
      verzamel.beelden.push({ sleutel: regel.sleutel, bestand: regel.bestand, pad: regel.pad })
    } else {
      if (verzamel.gezien.has(regel.waarde)) continue
      verzamel.gezien.set(regel.waarde, regel.sleutel)
      verzamel.teksten.push({
        sleutel: regel.sleutel,
        bestand: regel.bestand,
        meertalig: false,
        waarde: regel.waarde,
      })
    }
  }

  return {
    talen: TALEN,
    basistaal: BASISTAAL,
    teksten: verzamel.teksten,
    beelden: verzamel.beelden,
    prijzen: verzamel.prijzen,
    echos: verzamel.echos,
    ontbrekendeBestanden: [...new Set(ontbrekend)],
    missendeExports,
    versletenRegels: versleten,
  }
}

module.exports = { leesInhoud, laadModule, TALEN, BASISTAAL, isVertaald, CONTENTBESTANDEN, WORTEL }

if (require.main === module) {
  const uit = leesInhoud()
  console.log(
    `teksten ${uit.teksten.length} - beelden ${uit.beelden.length} - ` +
      `prijzen ${uit.prijzen.length} - echos ${uit.echos.length}`,
  )
  if (uit.ontbrekendeBestanden.length) console.log('ontbreekt:', uit.ontbrekendeBestanden)
  if (uit.missendeExports.length) console.log('missende exports:', uit.missendeExports)
}
