/**
 * Bakt het woordmerk in als data-URI voor het inlogscherm.
 *
 * Dat scherm wordt uitgeserveerd voordat er iemand is ingelogd en draait op de
 * rand van het netwerk. Er kan daar niets van schijf gelezen worden en niets
 * van buiten gehaald: geen beeld, geen lettertype. Het merk moet dus in het
 * bestand zelf zitten.
 *
 * Het resultaat staat als module in lib/ en hoort in de repo, net als de
 * lettertypes en de voorbeeldjes van de foto's. Wisselt het logo, draai dan:
 *
 *   node scripts/beheer-wordmerk.cjs
 */
const fs = require('node:fs')
const path = require('node:path')

const WORTEL = path.resolve(__dirname, '..')
// De versie met de regel "GELATO, DOLCI & CAFFE" eronder, zoals op de gevel.
const BRON = path.join(WORTEL, 'public', 'media', 'wordmark-vol-480.png')
const UIT = path.join(WORTEL, 'lib', 'beheer-wordmerk.ts')

if (!fs.existsSync(BRON)) {
  console.error(`${path.relative(WORTEL, BRON)} ontbreekt. Draai eerst node tools/logo.mjs.`)
  process.exit(1)
}

const bytes = fs.readFileSync(BRON)
const uri = `data:image/png;base64,${bytes.toString('base64')}`

fs.writeFileSync(
  UIT,
  `/**
 * Het woordmerk als data-URI, voor het inlogscherm op /beheer.
 *
 * Gemaakt door scripts/beheer-wordmerk.cjs uit ${path.relative(WORTEL, BRON)}.
 * Niet met de hand aanpassen; draai dat script opnieuw als het logo wisselt.
 */

export const WOORDMERK =
  '${uri}'
`,
  'utf8',
)

console.log(
  `lib/beheer-wordmerk.ts geschreven: ${Math.round(bytes.length / 1024)} kB beeld, ` +
    `${Math.round(uri.length / 1024)} kB als tekst.`,
)
