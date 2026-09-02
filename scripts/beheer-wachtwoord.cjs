/**
 * Zet iemand in scripts/beheer-toegang.json.
 *
 * Nodig omdat er nooit een wachtwoord in de repo mag staan: dit script vraagt
 * het wachtwoord, maakt er een afdruk van met een eigen zout, en schrijft
 * alleen die afdruk weg. Het wachtwoord zelf gaat nergens heen.
 *
 * De eerste persoon moet hiermee, want zonder iemand in de lijst kan er ook
 * niemand in het beheerdocument iemand toevoegen. Daarna kan het ook vanuit
 * het document zelf, onder "Who can sign in".
 *
 *   node scripts/beheer-wachtwoord.cjs "Giulia" --beheerder
 *   node scripts/beheer-wachtwoord.cjs "Simone"
 *   node scripts/beheer-wachtwoord.cjs "Simone" --weg
 *
 * Het wachtwoord wordt gevraagd en niet als argument meegegeven: een argument
 * belandt in de geschiedenis van de terminal en staat daar morgen nog.
 */

const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const readline = require('node:readline')

const LIJST = path.join(__dirname, 'beheer-toegang.json')

/** Hetzelfde aantal rondes als api/_beheer-mensen.ts gebruikt. */
const RONDES = 210000

const argumenten = process.argv.slice(2)
const naam = argumenten.find((a) => !a.startsWith('--'))
const isBeheerder = argumenten.includes('--beheerder')
const weghalen = argumenten.includes('--weg')

if (!naam) {
  console.error('Geef een naam mee: node scripts/beheer-wachtwoord.cjs "Giulia" --beheerder')
  process.exit(2)
}

function leesLijst() {
  if (!fs.existsSync(LIJST)) return { mensen: [] }
  return JSON.parse(fs.readFileSync(LIJST, 'utf8'))
}

function schrijfLijst(inhoud) {
  fs.writeFileSync(LIJST, `${JSON.stringify(inhoud, null, 2)}\n`, 'utf8')
}

/** Vraagt het wachtwoord zonder het op het scherm te zetten. */
function vraagWachtwoord(vraag) {
  return new Promise((klaar) => {
    const lezer = readline.createInterface({ input: process.stdin, output: process.stdout })
    const uitvoer = process.stdout
    // De prompt zelf mag je zien; wat je typt niet.
    lezer._writeToOutput = function (tekst) {
      if (tekst.startsWith(vraag)) uitvoer.write(tekst)
    }
    lezer.question(vraag, (antwoord) => {
      uitvoer.write('\n')
      lezer.close()
      klaar(antwoord)
    })
  })
}

async function main() {
  const inhoud = leesLijst()
  inhoud.mensen = inhoud.mensen || []

  if (weghalen) {
    const voor = inhoud.mensen.length
    inhoud.mensen = inhoud.mensen.filter((p) => p.naam !== naam)
    schrijfLijst(inhoud)
    console.log(
      voor === inhoud.mensen.length
        ? `${naam} stond niet in de lijst.`
        : `${naam} is uit de lijst gehaald.`,
    )
    return
  }

  const wachtwoord = await vraagWachtwoord(`Wachtwoord voor ${naam}: `)
  if (wachtwoord.length < 8) {
    console.error('Minstens acht tekens graag.')
    process.exit(1)
  }
  const nogmaals = await vraagWachtwoord('Nog een keer: ')
  if (wachtwoord !== nogmaals) {
    console.error('De twee zijn niet gelijk.')
    process.exit(1)
  }

  const zout = crypto.randomBytes(16).toString('hex')
  const afdruk = crypto
    .pbkdf2Sync(wachtwoord, Buffer.from(zout, 'hex'), RONDES, 32, 'sha256')
    .toString('hex')

  inhoud.mensen = inhoud.mensen.filter((p) => p.naam !== naam)
  inhoud.mensen.push({ naam, zout, afdruk, iteraties: RONDES, beheerder: isBeheerder })
  schrijfLijst(inhoud)

  console.log(`${naam} staat in de lijst${isBeheerder ? ' als beheerder' : ''}.`)
  console.log('Commit scripts/beheer-toegang.json en deploy; daarna geldt het.')
}

main()
