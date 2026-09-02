/**
 * Bakt de vier lettertypes van de site in als data-URI.
 *
 * Het beheerdocument moet werken zonder internet: op de trein, in een keuken
 * met slecht bereik, of gewoon vanaf een bestand in de mail. Een verwijzing
 * naar fonts.googleapis.com haalt het dan niet, en dan staat het hele document
 * in de systeemletter. Dat is niet alleen lelijk: de wordmark en de mega-cijfers
 * vallen dan uit hun kader, en het document ziet er ineens niet meer uit als
 * deze site.
 *
 * Daarom staat het resultaat als los CSS-bestand in de repo:
 * `scripts/beheer-fonts.css`. Dat bestand is groot en saai en hoeft nooit met
 * de hand aangeraakt te worden. Wisselt er een font in `src/styles/tokens.css`,
 * dan pas je FAMILIES hieronder aan en draai je dit script opnieuw:
 *
 *   node scripts/beheer-fonts.cjs
 *
 * Alleen de latijnse subsets gaan mee. Google levert per taalgebied een eigen
 * bestand; Cyrillisch en Grieks meenemen zou het document verdubbelen zonder
 * dat er ooit een letter uit gebruikt wordt.
 *
 * De aanvraag gaat met een browser-kenmerk mee. Zonder dat kenmerk stuurt
 * Google de oude ttf-vorm terug, en die is drie keer zo groot als woff2.
 */

const fs = require('node:fs')
const path = require('node:path')

const UIT = path.join(__dirname, 'beheer-fonts.css')

/**
 * De vier families uit src/styles/tokens.css, met de gewichten die de site
 * gebruikt. Het beheerdocument gebruikt dezelfde vier, in dezelfde rollen.
 */
const FAMILIES = [
  'Grand+Hotel',
  'Bricolage+Grotesque:opsz,wght@12..96,600..800',
  'Baloo+2:wght@400..800',
  'Hanken+Grotesk:ital,wght@0,400..700;1,400',
]

/** Alleen deze subsets; de rest is voor dit document dode last. */
const SUBSETS = new Set(['latin', 'latin-ext'])

const BROWSER =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/126.0.0.0 Safari/537.36'

async function haal(adres, alsTekst) {
  const antwoord = await fetch(adres, { headers: { 'User-Agent': BROWSER } })
  if (!antwoord.ok) throw new Error(`${adres} gaf ${antwoord.status}`)
  return alsTekst ? antwoord.text() : Buffer.from(await antwoord.arrayBuffer())
}

/**
 * Knipt de css van Google in blokken en houdt alleen de latijnse over.
 *
 * Google zet boven elk blok een commentaarregel met de naam van de subset.
 * Die is het enige betrouwbare onderscheid: de unicode-ranges van latin en
 * latin-ext lopen deels in elkaar over.
 */
function latijnseBlokken(css) {
  const blokken = []
  const regels = css.split('/*')
  for (const stuk of regels) {
    const naam = stuk.split('*/')[0].trim()
    if (!SUBSETS.has(naam)) continue
    const rest = stuk.slice(stuk.indexOf('*/') + 2)
    for (const match of rest.matchAll(/@font-face\s*{[^}]*}/g)) blokken.push(match[0])
  }
  return blokken
}

async function main() {
  const stukken = [
    '/* Gemaakt door scripts/beheer-fonts.cjs. Niet met de hand aanpassen: */',
    '/* draai het script opnieuw als er een lettertype wisselt.            */',
    '',
  ]

  let totaal = 0

  for (const familie of FAMILIES) {
    const adres = `https://fonts.googleapis.com/css2?family=${familie}&display=swap`
    const css = await haal(adres, true)
    const blokken = latijnseBlokken(css)
    if (!blokken.length) throw new Error(`Geen latijnse subset gevonden voor ${familie}`)

    for (const blok of blokken) {
      const urlMatch = blok.match(/url\((https:\/\/[^)]+\.woff2)\)/)
      if (!urlMatch) continue
      const bytes = await haal(urlMatch[1], false)
      totaal += bytes.length
      const dataUri = `data:font/woff2;base64,${bytes.toString('base64')}`
      stukken.push(blok.replace(urlMatch[1], dataUri))
    }
  }

  fs.writeFileSync(UIT, `${stukken.join('\n')}\n`, 'utf8')
  const kb = Math.round(fs.statSync(UIT).size / 1024)
  console.log(
    `beheer-fonts.css geschreven: ${FAMILIES.length} families, ` +
      `${Math.round(totaal / 1024)} kB aan letters, ${kb} kB als tekst.`,
  )
}

main().catch((fout) => {
  console.error(`Lettertypes ophalen mislukt: ${fout.message}`)
  process.exit(1)
})
