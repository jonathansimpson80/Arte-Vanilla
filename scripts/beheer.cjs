/**
 * Bouwt het beheerdocument: een HTML-bestand waarin de salon elke tekst en
 * elke foto van de site kan aanpassen.
 *
 * Sjabloon, gegevens, lettertypes, woordmerk, tabbladicoon en de voorbeeldjes
 * van de foto's gaan hier samen tot een bestand. Alles zit erin als data-URI,
 * want het document moet werken zonder internet en zonder map ernaast: op de
 * trein, vanuit een mailbijlage, of op een laptop in een keuken.
 *
 * Draaien:
 *   node scripts/beheer.cjs                 schrijft public/beheer.html
 *   node scripts/beheer.cjs --ververs       maakt alle voorbeeldjes opnieuw
 *   node scripts/beheer.cjs --uit pad.html  schrijft ergens anders heen
 *
 * Het verslag onderaan is voor Jonathan en staat dus in het Nederlands. Het
 * noemt de aantallen, wie het document mag openen, en de drie waarschuwingen
 * die ertoe doen: ontbrekende bronbestanden, overgetypte regels die niet meer
 * kloppen, en wat er in "Not yet placed" viel.
 */

const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

const { bouwGegevens } = require('./beheer-bouw.cjs')
const { laadModule, WORTEL } = require('./beheer-inhoud.cjs')

const SJABLOON = path.join(__dirname, 'beheer-sjabloon.html')
const FONTS = path.join(__dirname, 'beheer-fonts.css')
const DUIMEN = path.join(__dirname, 'beheer-duimen.json')
const DUIMSCRIPT = path.join(__dirname, 'beheer-duimen.py')
const TOEGANG = path.join(WORTEL, 'lib', 'beheer-toegang.ts')
const TOKENS = path.join(WORTEL, 'src', 'styles', 'tokens.css')
const PUBLIEK = path.join(WORTEL, 'public')

/**
 * Het kenmerk waaraan het toepasscript herkent dat een bestand uit dit
 * document komt. Dit verandert nooit: een oud bestand moet over een jaar nog
 * te openen zijn.
 */
const KENMERK = 'arte-vanilla-beheer-1'

/** Voorvoegsel van het bestand dat de salon opslaat. Engels, met de datum erin. */
const BESTANDSVOORVOEGSEL = 'arte-vanilla'

/** Waar de site draait. `VITE_SITE_URL` gaat hier nog voor; zie leesSiteAdres. */
const SITEADRES = 'https://arte-vanilla.vercel.app'

const argumenten = process.argv.slice(2)
const ververs = argumenten.includes('--ververs')
const uitIndex = argumenten.indexOf('--uit')
const UITVOER =
  uitIndex >= 0 && argumenten[uitIndex + 1]
    ? path.resolve(argumenten[uitIndex + 1])
    : path.join(PUBLIEK, 'beheer.html')

/**
 * De dag zoals hij in Amsterdam is.
 *
 * `toISOString` geeft UTC, en tussen middernacht en twee uur 's nachts staat
 * er dan de dag van gisteren in het document. Dat is precies het moment waarop
 * er aan een site gewerkt wordt.
 */
function vandaagInAmsterdam() {
  const opmaak = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return opmaak.format(new Date())
}

/** Een bestand als data-URI, of null als het er niet is. */
function alsDataUri(bestandspad, soort) {
  if (!fs.existsSync(bestandspad)) return null
  const bytes = fs.readFileSync(bestandspad)
  return `data:${soort};base64,${bytes.toString('base64')}`
}

/**
 * Haalt de variabelen uit het @theme-blok van de site.
 *
 * Niet overtypen: staat hier een kleur in die op de site iets anders is, dan
 * ziet het beheerdocument er net naast uit, en dat is precies het soort
 * verschil waar niemand de vinger op kan leggen.
 */
function leesTokens() {
  const css = fs.readFileSync(TOKENS, 'utf8')
  const begin = css.indexOf('@theme')
  if (begin < 0) throw new Error('Geen @theme-blok gevonden in src/styles/tokens.css')

  // Van de eerste accolade na @theme tot de accolade die hem sluit.
  let diepte = 0
  let start = -1
  let eind = -1
  for (let i = begin; i < css.length; i++) {
    if (css[i] === '{') {
      diepte++
      if (diepte === 1) start = i + 1
    } else if (css[i] === '}') {
      diepte--
      if (diepte === 0) {
        eind = i
        break
      }
    }
  }
  if (start < 0 || eind < 0) throw new Error('Het @theme-blok in tokens.css sluit niet')

  const binnen = css.slice(start, eind)
  const regels = []
  for (const match of binnen.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    regels.push(`  ${match[1]}: ${match[2].trim()};`)
  }
  if (!regels.length) throw new Error('Geen variabelen gevonden in het @theme-blok')

  return [
    '/* Overgenomen uit src/styles/tokens.css bij het bouwen van dit document. */',
    '/* Verandert daar een kleur, dan verandert dit mee.                       */',
    ':root {',
    ...regels,
    '}',
  ].join('\n')
}

/**
 * Zorgt dat er van elke gebruikte foto een voorbeeldje is.
 *
 * Ontbreekt er een, dan wordt hij lokaal bijgemaakt met Pillow. Draait dit op
 * een machine zonder Pillow, dan blijft het voorbeeldje weg en zegt het
 * verslag dat: het document werkt dan nog steeds, alleen zonder plaatje bij
 * die ene foto.
 */
function zorgVoorDuimen(paden) {
  let duimen = {}
  if (fs.existsSync(DUIMEN)) {
    duimen = JSON.parse(fs.readFileSync(DUIMEN, 'utf8'))
  }

  const gebruikt = new Set(paden)
  const verwijderd = []
  for (const pad of Object.keys(duimen)) {
    if (!gebruikt.has(pad)) {
      delete duimen[pad]
      verwijderd.push(pad)
    }
  }

  const nodig = ververs ? [...gebruikt] : [...gebruikt].filter((pad) => !duimen[pad])

  let gemaakt = 0
  let melding = null
  if (nodig.length) {
    if (verwijderd.length) fs.writeFileSync(DUIMEN, `${JSON.stringify(duimen, null, 0)}\n`, 'utf8')
    try {
      execFileSync('python3', [DUIMSCRIPT, PUBLIEK, DUIMEN, ...nodig], { stdio: 'pipe' })
      duimen = JSON.parse(fs.readFileSync(DUIMEN, 'utf8'))
      gemaakt = nodig.length
    } catch (fout) {
      melding =
        `${nodig.length} voorbeeldjes ontbreken en konden hier niet gemaakt worden ` +
        `(python3 met Pillow nodig). Draai het bouwcommando een keer op een machine ` +
        `waar dat wel kan, en commit scripts/beheer-duimen.json.`
    }
  } else if (verwijderd.length) {
    fs.writeFileSync(DUIMEN, `${JSON.stringify(duimen, null, 0)}\n`, 'utf8')
  }

  return { duimen, gemaakt, verwijderd, melding }
}

/**
 * `</script>` mag niet letterlijk in een JSON-blok staan.
 *
 * De browser leest dat als het einde van het script, en de rest van het
 * document belandt dan als tekst op het scherm. Het komt zelden voor, maar als
 * het gebeurt is het hele document stuk en zie je niet waarom.
 */
function veiligeJson(waarde) {
  return JSON.stringify(waarde).replace(/<\/script/gi, '<\\/script')
}

/**
 * Het adres waar de echte site staat, voor het voorbeeldvenster in het document.
 *
 * Hier stond eerst `artevanilla.nl` als terugval. Dat leek de voor de hand
 * liggende gok, maar dat domein wijst naar het Instagram-profiel van de zaak,
 * en dat stuurt `x-frame-options: DENY`. Het voorbeeldvenster bleef daardoor
 * leeg zonder te zeggen waarom, en dat is erger dan geen adres: dan lijkt het
 * document stuk.
 *
 * Nu staat het echte adres van de deploy hier, en `VITE_SITE_URL` gaat daar
 * nog voor. Het document kan het bovendien zelf overschrijven, en gebruikt op
 * de site zijn eigen adres.
 */
function leesSiteAdres() {
  const uitOmgeving = process.env.VITE_SITE_URL
  if (uitOmgeving) return uitOmgeving.replace(/\/$/, '')
  return SITEADRES
}

/**
 * Wie het document mag openen; alleen de namen, nooit de afdrukken.
 *
 * De lijst wordt uitgevoerd en niet gelezen als tekst: het is een
 * TypeScript-module, en dezelfde lader die de contentbestanden inleest kan hem
 * gewoon draaien.
 */
function leesToegang() {
  if (!fs.existsSync(TOEGANG)) return []
  try {
    const mensen = laadModule(TOEGANG).mensen || []
    return mensen.map((p) => `${p.naam}${p.beheerder ? ' (beheerder)' : ''}`)
  } catch (fout) {
    return []
  }
}

function main() {
  const gegevens = bouwGegevens()
  const datum = vandaagInAmsterdam()

  const contact = laadModule(path.join(WORTEL, 'src/data/contact.ts')).contact || {}
  const sitenaam = contact.naam || 'Site'

  const paden = []
  for (const module of gegevens.modules) {
    for (const beeld of module.beelden) paden.push(beeld.pad)
  }
  const duimwerk = zorgVoorDuimen(paden)

  if (!fs.existsSync(FONTS)) {
    throw new Error(
      'scripts/beheer-fonts.css ontbreekt. Draai eerst `node scripts/beheer-fonts.cjs`; ' +
        'zonder dat bestand staat het hele document in de systeemletter.',
    )
  }

  const woordmerk = alsDataUri(path.join(PUBLIEK, 'media', 'wordmark-480.png'), 'image/png')
  const favicon = alsDataUri(path.join(PUBLIEK, 'favicon.svg'), 'image/svg+xml')

  const siteAdres = leesSiteAdres()

  const vullingen = {
    TITEL: `${sitenaam} content`,
    SITENAAM: sitenaam,
    DATUM: datum,
    FONTS: fs.readFileSync(FONTS, 'utf8'),
    TOKENS: leesTokens(),
    // Ontbreekt de wordmark, dan valt de bouw niet om: dan staat er alleen de
    // naam in de balk. Een document zonder logo is bruikbaar; geen document is dat niet.
    WOORDMERK: woordmerk || '',
    FAVICON: favicon || '',
    GEGEVENS: veiligeJson(gegevens),
    DUIMEN: veiligeJson(duimwerk.duimen),
    SITEURL: siteAdres,
    KENMERK,
    BESTANDSNAAM: BESTANDSVOORVOEGSEL,
  }

  let html = fs.readFileSync(SJABLOON, 'utf8')
  for (const [naam, waarde] of Object.entries(vullingen)) {
    html = html.split(`{{${naam}}}`).join(waarde)
  }

  // Elk gat moet gevuld zijn. Een sjabloon met een gat erin ziet er op het
  // eerste gezicht goed uit en gaat pas stuk op de plek waar niemand kijkt.
  const overgebleven = html.match(/\{\{[A-Z_]+\}\}/g)
  if (overgebleven) {
    throw new Error(`Niet ingevulde gaten in het sjabloon: ${[...new Set(overgebleven)].join(', ')}`)
  }

  fs.mkdirSync(path.dirname(UITVOER), { recursive: true })
  fs.writeFileSync(UITVOER, html, 'utf8')

  verslag(gegevens, {
    datum,
    uitvoer: UITVOER,
    maat: fs.statSync(UITVOER).size,
    duimwerk,
    woordmerk: Boolean(woordmerk),
    favicon: Boolean(favicon),
    siteAdres,
    toegang: leesToegang(),
  })
}

/** Het bouwverslag. Voor Jonathan, dus Nederlands. */
function verslag(gegevens, extra) {
  const t = gegevens.tellingen
  const w = gegevens.waarschuwingen
  const regels = []

  regels.push('')
  regels.push(`Beheerdocument gebouwd: ${path.relative(WORTEL, extra.uitvoer)}`)
  regels.push(`  datum in het document   ${extra.datum} (Amsterdam)`)
  regels.push(`  bestandsgrootte         ${Math.round(extra.maat / 1024)} kB`)
  regels.push('')
  regels.push(`  modules                 ${t.modules}`)
  regels.push(`  teksten                 ${t.teksten} (${t.meertaligeVelden} in drie talen)`)
  regels.push(`  foto's                  ${t.beelden} bestanden, op ${t.beeldplekken} plekken getoond`)
  regels.push(`  prijsregels             ${t.prijzen}`)
  regels.push('')
  regels.push('  nog te vertalen per taal')
  for (const taal of gegevens.talen) {
    const naam = gegevens.taalnamen[taal]
    const merk = taal === gegevens.basistaal ? ' (basistaal)' : ''
    regels.push(`    ${taal}  ${String(t.gaten[taal]).padStart(4)}  ${naam}${merk}`)
  }
  regels.push('')

  regels.push('  merk')
  regels.push(`    woordmerk             ${extra.woordmerk ? 'ingebakken' : 'ONTBREEKT (document zonder woordmerk)'}`)
  regels.push(`    tabbladicoon          ${extra.favicon ? 'ingebakken' : 'ONTBREEKT'}`)
  regels.push(`    voorbeeldjes          ${Object.keys(extra.duimwerk.duimen).length} in beheer-duimen.json`)
  regels.push(`    voorbeeldvenster      ${extra.siteAdres || 'geen adres; het document vraagt erom'}`)
  if (extra.duimwerk.gemaakt) regels.push(`      nieuw gemaakt       ${extra.duimwerk.gemaakt}`)
  if (extra.duimwerk.verwijderd.length) {
    regels.push(`      opgeruimd           ${extra.duimwerk.verwijderd.length} (niet meer in gebruik)`)
  }
  if (extra.duimwerk.melding) regels.push(`      LET OP              ${extra.duimwerk.melding}`)
  regels.push('')

  regels.push('  wie het document mag openen')
  if (extra.toegang.length) {
    for (const wie of extra.toegang) regels.push(`    ${wie}`)
  } else {
    regels.push('    niemand in lib/beheer-toegang.ts')
    regels.push('    terugval: BEHEER_LOGINS of BEHEER_WACHTWOORD in de omgeving')
    regels.push('    staat daar ook niets, dan gaat /beheer op slot en niet open')
  }
  regels.push('')

  regels.push('  waarschuwingen')
  const noem = (kop, lijst, hoe) => {
    if (!lijst.length) {
      regels.push(`    ${kop}: geen`)
      return
    }
    regels.push(`    ${kop}: ${lijst.length}`)
    for (const regel of lijst.slice(0, 12)) regels.push(`      ${hoe(regel)}`)
    if (lijst.length > 12) regels.push(`      ... en nog ${lijst.length - 12}`)
  }

  noem('ontbrekende bronbestanden', w.ontbrekendeBestanden, (r) => r)
  noem('exports die niet meer bestaan', w.missendeExports, (r) => r)
  noem('overgetypte regels die niet meer kloppen', w.versletenRegels, (r) => r)
  noem('in "Not yet placed" beland', w.nietIngedeeld, (r) => r)
  noem(
    'Nederlandse woorden in de labels op het scherm',
    w.onvertaaldeWoorden,
    (r) => `${r} staat niet in het woordenboek in beheer-bouw.cjs`,
  )

  const overBestanden = w.echos.filter((e) => e.bestand !== bestandVan(gegevens, e.eersteKeer))
  regels.push(
    `    echo's (tekst die twee keer voorkomt): ${w.echos.length}, waarvan ${overBestanden.length} over twee bestanden`,
  )
  for (const echo of overBestanden.slice(0, 12)) {
    regels.push(`      ${echo.sleutel} is dezelfde tekst als ${echo.eersteKeer}`)
  }
  if (overBestanden.length > 12) regels.push(`      ... en nog ${overBestanden.length - 12}`)
  regels.push('')

  console.log(regels.join('\n'))
}

/** In welk bestand staat de eerste keer dat deze tekst voorkwam? */
function bestandVan(gegevens, sleutel) {
  for (const module of gegevens.modules) {
    for (const veld of module.velden) if (veld.sleutel === sleutel) return veld.bestand
  }
  return null
}

main()
