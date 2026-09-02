/**
 * Zet de wijzigingen uit het beheerdocument terug in de code.
 *
 * Het document weet niets van de code behalve wat het eruit gelezen heeft: bij
 * elke wijziging staat de sleutel, de taal, het bronbestand en de oude tekst.
 * Dit script zoekt die oude tekst op en zet de nieuwe ervoor in de plaats.
 * Meer dan dat doet het niet, en dat is precies de bedoeling: terugzetten is
 * daardoor deterministisch, en je kunt in het verslag zien wat er gebeurt
 * voordat er iets gebeurt.
 *
 * Draaien:
 *   node scripts/beheer-toepassen.cjs bestand.json            proefronde
 *   node scripts/beheer-toepassen.cjs bestand.json --schrijf  echt doen
 *
 * Vier dingen die hier meer aandacht vroegen dan je zou denken:
 *
 * 1. De apostrof. In het Italiaans staat er in bijna elke zin een, en in de
 *    code kan die op twee manieren staan: gewoon binnen dubbele aanhalingstekens
 *    ("all'Amarena"), of ontsnapt binnen enkele ('all\'Amarena'). Dit script
 *    zoekt allebei de vormen, en schrijft de nieuwe tekst weg in dezelfde vorm
 *    als waarin hij hem gevonden heeft. Doe je dat niet, dan sluit de string
 *    halverwege de zin en compileert de site niet meer.
 * 2. Een tekst die twee keer in de bron staat wordt niet vervangen. Dan is niet
 *    te bepalen welke bedoeld is, en de verkeerde vervangen is erger dan niets
 *    doen. Het verslag noemt hem; dat doe je met de hand.
 * 3. JSON-bestanden met toelichtingen erin worden niet opnieuw weggeschreven
 *    met JSON.stringify. Dat gooit het commentaar en de indeling weg. Ze
 *    worden net als de rest als tekst doorzocht.
 * 4. Foto's worden niet zelf ingezet. Een foto vervangen is niet een bestand
 *    overschrijven: er liggen vijf uitgesneden breedtes naast, en die moeten
 *    opnieuw gemaakt worden met tools/beelden.mjs. De aangeleverde bestanden
 *    landen in aangeleverd/ en het verslag zegt welke breedtes er zijn.
 */

const fs = require('node:fs')
const path = require('node:path')

const WORTEL = path.resolve(__dirname, '..')
const BRONMAP = path.join(WORTEL, 'src')
const PUBLIEK = path.join(WORTEL, 'public')
const AANGELEVERD = path.join(WORTEL, 'aangeleverd')

/** Hetzelfde kenmerk als in scripts/beheer.cjs. Dit verandert nooit. */
const KENMERK = 'arte-vanilla-beheer-1'

const TAALNAMEN = { en: 'Engels', nl: 'Nederlands', it: 'Italiaans', alle: 'alle drie de talen' }

const argumenten = process.argv.slice(2)
const schrijven = argumenten.includes('--schrijf')
const bestandspad = argumenten.find((a) => !a.startsWith('--'))

if (!bestandspad) {
  console.error('Geef het JSON-bestand mee dat uit het beheerdocument komt.')
  console.error('  node scripts/beheer-toepassen.cjs arte-vanilla-changes-2026-09-01.json')
  process.exit(2)
}

// ---------------------------------------------------------------------------
// De bron doorzoeken
// ---------------------------------------------------------------------------

/** Alle bronbestanden waarin tekst van de site kan staan; een keer opgezocht. */
let bestandenlijst = null
function alleBronbestanden() {
  if (bestandenlijst) return bestandenlijst
  const gevonden = []
  const loop = (map) => {
    for (const item of fs.readdirSync(map, { withFileTypes: true })) {
      const vol = path.join(map, item.name)
      if (item.isDirectory()) loop(vol)
      else if (/\.(ts|tsx|json)$/.test(item.name)) gevonden.push(vol)
    }
  }
  loop(BRONMAP)
  // public/ mag ook: daar staan de JSON-bestanden die de zaak zelf bijwerkt.
  for (const item of fs.readdirSync(PUBLIEK, { withFileTypes: true })) {
    if (item.isFile() && item.name.endsWith('.json')) gevonden.push(path.join(PUBLIEK, item.name))
  }
  bestandenlijst = gevonden
  return gevonden
}

/**
 * Alle plekken waar deze tekst als volledige string in dit bestand staat.
 *
 * Twee vormen: de tekst zoals hij is, en de tekst met ontsnapte apostrofs. Per
 * vondst onthouden we welk aanhalingsteken de string omsluit, want daar hangt
 * van af hoe de nieuwe tekst weggeschreven moet worden.
 */
function vindPlekken(inhoud, oud) {
  const vormen = [oud]
  if (oud.includes("'")) vormen.push(oud.split("'").join("\\'"))
  if (oud.includes('"')) vormen.push(oud.split('"').join('\\"'))

  const plekken = []
  for (const vorm of vormen) {
    let vanaf = 0
    for (;;) {
      const index = inhoud.indexOf(vorm, vanaf)
      if (index < 0) break
      vanaf = index + 1

      const ervoor = inhoud[index - 1]
      const erna = inhoud[index + vorm.length]

      // Een hele string tussen aanhalingstekens. Een stuk van een langere zin
      // vervangen levert een halve zin op die nergens meer op slaat.
      if (ervoor === erna && (ervoor === "'" || ervoor === '"' || ervoor === '`')) {
        plekken.push({ index, lengte: vorm.length, soort: 'string', aanhaling: ervoor })
        continue
      }

      // Tekst die los tussen twee opmaaktags staat, zoals de handgeschreven
      // regel: <HandGeschreven>Try before you buy</HandGeschreven>. Daar staan
      // geen aanhalingstekens omheen, alleen witruimte en dan een punthaak.
      if (tussenTags(inhoud, index, vorm.length)) {
        plekken.push({ index, lengte: vorm.length, soort: 'opmaak' })
      }
    }
  }
  return plekken
}

/** Staat deze tekst als losse regel tussen twee tags? */
function tussenTags(inhoud, index, lengte) {
  let voor = index - 1
  while (voor >= 0 && /\s/.test(inhoud[voor])) voor--
  let na = index + lengte
  while (na < inhoud.length && /\s/.test(inhoud[na])) na++
  return inhoud[voor] === '>' && inhoud[na] === '<'
}

/**
 * De nieuwe tekst, klaar om tussen dit aanhalingsteken te staan.
 *
 * De backslash eerst, anders ontsnapt hij zijn eigen ontsnapping.
 */
function alsString(nieuw, aanhaling) {
  let uit = nieuw.split('\\').join('\\\\')
  uit = uit.split(aanhaling).join(`\\${aanhaling}`)
  return uit
}

// ---------------------------------------------------------------------------
// Waarschuwingen die geen fout zijn
// ---------------------------------------------------------------------------

/**
 * Een streepje als leesteken is een huisregel van dit project.
 *
 * In het Engels ligt een gedachtestreepje voor de hand, dus dit gaat vooral
 * daar mis. Een streepje binnen een woord (gluten-free) mag wel; het gaat om
 * het streepje dat een zin onderbreekt.
 */
function streepjes(tekst) {
  const gevonden = []
  if (/\s[-–—]\s/.test(tekst)) gevonden.push('een streepje tussen twee spaties')
  if (/--/.test(tekst)) gevonden.push('twee streepjes achter elkaar')
  if (/[–—]/.test(tekst)) gevonden.push('een half- of kastlijntje')
  return gevonden
}

// ---------------------------------------------------------------------------
// Prijzen
// ---------------------------------------------------------------------------

/**
 * Het bereik van het item met dit nummer binnen een geëxporteerde lijst.
 *
 * Waarom niet gewoon op de naam zoeken: "Espresso" staat drie keer in
 * koffie.ts. Tellen binnen de lijst is het enige wat altijd het juiste item
 * aanwijst. Strings worden overgeslagen bij het tellen, anders telt een
 * accolade in een omschrijving mee.
 */
function vindItem(inhoud, exportNaam, nummer) {
  const kop = new RegExp(`export const ${exportNaam}\\b`)
  const begin = inhoud.search(kop)
  if (begin < 0) return null

  /*
   * Zoeken vanaf het isgelijkteken, niet vanaf de naam.
   *
   * `export const dolci: Dolce[] = [` heeft twee vierkante haken, en de eerste
   * hoort bij de typeaanduiding. Begin je daar, dan sluit de lijst meteen weer
   * en vind je geen enkele rij.
   */
  const isgelijk = inhoud.indexOf('=', begin)
  if (isgelijk < 0) return null
  const haak = inhoud.indexOf('[', isgelijk)
  if (haak < 0) return null

  let diepte = 0
  let start = -1
  let gevonden = 0
  let inString = null

  for (let i = haak; i < inhoud.length; i++) {
    const teken = inhoud[i]

    if (inString) {
      if (teken === '\\') i++
      else if (teken === inString) inString = null
      continue
    }
    if (teken === "'" || teken === '"' || teken === '`') {
      inString = teken
      continue
    }

    if (teken === '{') {
      diepte++
      if (diepte === 1) start = i
    } else if (teken === '}') {
      diepte--
      if (diepte === 0) {
        if (gevonden === nummer) return { start, eind: i + 1 }
        gevonden++
      }
    } else if (teken === ']' && diepte === 0) {
      return null
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Toepassen
// ---------------------------------------------------------------------------

const inzending = JSON.parse(fs.readFileSync(path.resolve(bestandspad), 'utf8'))

if (inzending.kenmerk !== KENMERK) {
  console.error(
    `Dit bestand draagt niet het kenmerk van dit beheerdocument (${KENMERK}). ` +
      'Het komt dus ergens anders vandaan en wordt niet toegepast.',
  )
  process.exit(1)
}

/** Wat er per bestand veranderd moet worden; pas aan het eind wordt er geschreven. */
const werkbank = new Map()

function inhoudVan(volPad) {
  if (!werkbank.has(volPad)) werkbank.set(volPad, fs.readFileSync(volPad, 'utf8'))
  return werkbank.get(volPad)
}

const gelukt = []
const mislukt = []
const opmerkingen = []

// ------------------------------------------------------------------ teksten

for (const regel of inzending.teksten || []) {
  const taal = TAALNAMEN[regel.taal] || regel.taal

  if (regel.oud === regel.nieuw) {
    mislukt.push({ regel, reden: 'oude en nieuwe tekst zijn gelijk' })
    continue
  }
  if (regel.oudToen && regel.oudToen !== regel.oud) {
    opmerkingen.push(
      `${regel.sleutel} (${taal}): toen deze wijziging gemaakt werd stond er "${regel.oudToen}", ` +
        `en in het document dat je nu toepast staat "${regel.oud}". De site is ondertussen veranderd.`,
    )
  }

  /**
   * Waar staat deze tekst?
   *
   * Er wordt altijd de hele bron doorzocht, ook als het genoemde bestand hem
   * heeft. Anders zou een tekst die in de opmaak drie keer staat, zoals de
   * handgeschreven regel, in een bestand vervangen worden en in de andere twee
   * blijven staan zonder dat iemand het merkt.
   */
  const genoemd = path.join(WORTEL, regel.bestand)
  const treffers = []
  for (const bestand of alleBronbestanden()) {
    for (const plek of vindPlekken(inhoudVan(bestand), regel.oud)) treffers.push({ bestand, plek })
  }

  if (treffers.length === 0) {
    mislukt.push({ regel, reden: `"${regel.oud}" staat nergens meer in de bron` })
    continue
  }

  const inGenoemd = treffers.filter((t) => t.bestand === genoemd)
  const elders = treffers.filter((t) => t.bestand !== genoemd)

  // Staat hij precies een keer in het bestand dat het document noemt, dan is
  // dat de plek. Wat er verder nog staat wordt gemeld, niet aangeraakt.
  if (inGenoemd.length !== 1) {
    const bestanden = [...new Set(treffers.map((t) => path.relative(WORTEL, t.bestand)))]
    mislukt.push({
      regel,
      reden:
        `"${regel.oud}" staat ${treffers.length} keer in de bron ` +
        `(${bestanden.join(', ')}), en niet precies een keer in ${regel.bestand}. ` +
        `Welke bedoeld is, is niet te bepalen: doe deze met de hand.`,
    })
    continue
  }

  if (elders.length) {
    const bestanden = [...new Set(elders.map((t) => path.relative(WORTEL, t.bestand)))]
    opmerkingen.push(
      `${regel.sleutel} (${taal}): dezelfde tekst staat ook in ${bestanden.join(', ')}. ` +
        'Daar is hij niet aangepast; dat doe je met de hand als het ook daar moet.',
    )
  }

  const { bestand, plek } = inGenoemd[0]
  const inhoud = inhoudVan(bestand)

  // Tekst die los in de opmaak staat mag geen punthaak of accolade bevatten:
  // dat leest de opmaak als een nieuwe tag of als code.
  if (plek.soort === 'opmaak' && /[<>{}]/.test(regel.nieuw)) {
    mislukt.push({
      regel,
      reden: 'deze tekst staat los in de opmaak en mag geen < > { of } bevatten',
    })
    continue
  }

  const vervanging =
    plek.soort === 'string' ? alsString(regel.nieuw, plek.aanhaling) : regel.nieuw
  werkbank.set(
    bestand,
    inhoud.slice(0, plek.index) + vervanging + inhoud.slice(plek.index + plek.lengte),
  )

  gelukt.push({
    soort: 'tekst',
    sleutel: regel.sleutel,
    taal,
    bestand: path.relative(WORTEL, bestand),
    oud: regel.oud,
    nieuw: regel.nieuw,
  })

  for (const streep of streepjes(regel.nieuw)) {
    opmerkingen.push(`${regel.sleutel} (${taal}): ${streep}. Huisregel: geen streepje als leesteken.`)
  }
}

/**
 * Een veld dat in de ene taal wel is aangepast en in de andere twee niet.
 *
 * Soms is dat de bedoeling: een Engelse zin die scheef liep en verder niets.
 * Soms is het vergeten, en dan staat er straks een nieuwe Engelse kop boven
 * een oude Italiaanse tekst. Het houdt niets tegen; het staat er alleen.
 */
const perSleutel = new Map()
for (const regel of inzending.teksten || []) {
  if (regel.taal === 'alle') continue
  if (!perSleutel.has(regel.sleutel)) perSleutel.set(regel.sleutel, new Set())
  perSleutel.get(regel.sleutel).add(regel.taal)
}
for (const [sleutel, talen] of perSleutel) {
  if (talen.size === 3) continue
  const ontbreekt = ['en', 'nl', 'it'].filter((t) => !talen.has(t)).map((t) => TAALNAMEN[t])
  opmerkingen.push(
    `${sleutel}: aangepast in ${[...talen].map((t) => TAALNAMEN[t]).join(' en ')}, ` +
      `niet in ${ontbreekt.join(' en ')}.`,
  )
}

// ------------------------------------------------------------------ prijzen

for (const regel of inzending.prijzen || []) {
  const bestand = path.join(WORTEL, regel.bestand)
  if (!fs.existsSync(bestand)) {
    mislukt.push({ regel, reden: `${regel.bestand} bestaat niet meer` })
    continue
  }

  const stukken = regel.sleutel.split('.')
  const exportNaam = stukken[0]
  const nummer = Number(stukken[1])
  if (!Number.isInteger(nummer)) {
    mislukt.push({ regel, reden: `sleutel ${regel.sleutel} wijst niet naar een rij in een lijst` })
    continue
  }

  const inhoud = inhoudVan(bestand)
  const bereik = vindItem(inhoud, exportNaam, nummer)
  if (!bereik) {
    mislukt.push({ regel, reden: `rij ${nummer} van ${exportNaam} niet gevonden in ${regel.bestand}` })
    continue
  }

  const stuk = inhoud.slice(bereik.start, bereik.eind)
  const match = stuk.match(/\b(price|prijs)\s*:\s*(null|-?\d+(?:\.\d+)?)/)
  if (!match) {
    mislukt.push({ regel, reden: `geen prijs gevonden in rij ${nummer} van ${exportNaam}` })
    continue
  }

  const nieuweWaarde = regel.nieuw === '' ? 'null' : String(Number(String(regel.nieuw).replace(',', '.')))
  if (nieuweWaarde !== 'null' && !Number.isFinite(Number(nieuweWaarde))) {
    mislukt.push({ regel, reden: `"${regel.nieuw}" is geen bedrag` })
    continue
  }

  const nieuwStuk = stuk.replace(match[0], `${match[1]}: ${nieuweWaarde}`)
  werkbank.set(bestand, inhoud.slice(0, bereik.start) + nieuwStuk + inhoud.slice(bereik.eind))

  gelukt.push({
    soort: 'prijs',
    sleutel: regel.sleutel,
    taal: 'geen taal',
    bestand: regel.bestand,
    oud: match[2],
    nieuw: nieuweWaarde,
  })
}

// ------------------------------------------------------------------- foto's

const fotos = []

/** Welke uitgesneden breedtes er van deze foto bestaan. */
function breedtesVan(pad) {
  const naam = path.basename(pad).replace(/\.[^.]+$/, '')
  const map = path.join(PUBLIEK, path.dirname(pad).replace(/^\//, ''))
  if (!fs.existsSync(map)) return []
  return fs
    .readdirSync(map)
    .filter((bestand) => new RegExp(`^${naam}(-\\d{3,4})?\\.(jpg|jpeg|png|webp)$`).test(bestand))
    .sort()
}

function bewaarAangeleverd(naam, dataUri) {
  if (!dataUri) return null
  const komma = dataUri.indexOf(',')
  if (komma < 0) return null
  const bytes = Buffer.from(dataUri.slice(komma + 1), 'base64')
  const doel = path.join(AANGELEVERD, naam)
  if (schrijven) {
    fs.mkdirSync(AANGELEVERD, { recursive: true })
    fs.writeFileSync(doel, bytes)
  }
  return path.relative(WORTEL, doel)
}

for (const beeld of inzending.beelden || []) {
  const bewaard = beeld.losMeesturen ? null : bewaarAangeleverd(beeld.nieuweNaam, beeld.data)
  fotos.push({
    sleutel: beeld.sleutel,
    bestand: beeld.bestand,
    oudPad: beeld.pad,
    nieuweNaam: beeld.nieuweNaam,
    bewaard,
    losMeesturen: Boolean(beeld.losMeesturen),
    breedtes: breedtesVan(beeld.pad),
    // Waar deze foto overal staat. Een bestand vervangen verandert al die
    // plekken tegelijk, en dat hoort in het verslag te staan.
    plekken: (beeld.plekken || []).map((plek) => plek.blok),
  })
}

for (const bestand of inzending.bestanden || []) {
  const bewaard = bestand.losMeesturen ? null : bewaarAangeleverd(bestand.naam, bestand.data)
  fotos.push({
    sleutel: bestand.blok || 'losse bijlage',
    bestand: '-',
    oudPad: '-',
    nieuweNaam: bestand.naam,
    bewaard,
    losMeesturen: Boolean(bestand.losMeesturen),
    breedtes: [],
  })
}

// ----------------------------------------------------------------- toegang

if (inzending.toegang) {
  opmerkingen.push(
    'Dit bestand bevat een wijziging in wie er mag inloggen. Die is niet automatisch ' +
      'doorgevoerd: zet hem met de hand in lib/beheer-toegang.ts, of gebruik ' +
      'het beheerdocument terwijl de site bereikbaar is.',
  )
}

// ---------------------------------------------------------------------------
// Schrijven en verslag
// ---------------------------------------------------------------------------

if (schrijven) {
  for (const [bestand, inhoud] of werkbank) {
    const oorspronkelijk = fs.readFileSync(bestand, 'utf8')
    if (oorspronkelijk !== inhoud) fs.writeFileSync(bestand, inhoud, 'utf8')
  }
}

const regels = []
regels.push('')
regels.push(schrijven ? 'TOEGEPAST' : 'PROEFRONDE (nog niets geschreven; voeg --schrijf toe)')
regels.push(`  bestand      ${path.relative(WORTEL, path.resolve(bestandspad))}`)
regels.push(`  gemaakt door ${inzending.door || 'onbekend'} op ${inzending.wanneer || 'onbekend'}`)
regels.push(`  document van ${inzending.documentDatum || 'onbekend'}`)
regels.push('')

regels.push(`  gelukt: ${gelukt.length}`)
for (const item of gelukt) {
  regels.push(`    ${item.sleutel} (${item.taal}) in ${item.bestand}`)
  regels.push(`      oud:    ${item.oud}`)
  regels.push(`      nieuw:  ${item.nieuw}`)
}
regels.push('')

regels.push(`  niet gelukt: ${mislukt.length}`)
for (const item of mislukt) {
  regels.push(`    ${item.regel.sleutel || item.regel.label || '?'}: ${item.reden}`)
}
regels.push('')

regels.push(`  foto's en bestanden: ${fotos.length}`)
for (const foto of fotos) {
  regels.push(`    ${foto.sleutel}`)
  if (foto.oudPad !== '-') regels.push(`      vervangt        ${foto.oudPad}`)
  regels.push(
    `      aangeleverd     ${foto.nieuweNaam}${
      foto.losMeesturen ? ' (te groot voor het bestand; los meegestuurd)' : ` in ${foto.bewaard}`
    }`,
  )
  if (foto.plekken && foto.plekken.length > 1) {
    regels.push(`      staat op        ${foto.plekken.length} plekken: ${foto.plekken.join(', ')}`)
  }
  if (foto.breedtes.length) {
    regels.push(`      bestaande maten ${foto.breedtes.join(', ')}`)
    regels.push('      opnieuw maken   node tools/beelden.mjs')
  }
}
regels.push('')

regels.push(`  notities: ${(inzending.notities || []).length}`)
for (const notitie of inzending.notities || []) {
  regels.push(`    ${notitie.blok}: ${notitie.notitie}`)
}
regels.push('')

regels.push(`  let op: ${opmerkingen.length}`)
for (const opmerking of opmerkingen) regels.push(`    ${opmerking}`)
regels.push('')

if (!schrijven) {
  regels.push('  Niets geschreven. Klopt het hierboven, draai dan hetzelfde commando met --schrijf.')
  regels.push('')
}

console.log(regels.join('\n'))
process.exit(mislukt.length ? 1 : 0)
