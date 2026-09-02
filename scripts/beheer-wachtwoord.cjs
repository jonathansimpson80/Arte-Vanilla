/**
 * Zet iemand in lib/beheer-toegang.ts.
 *
 * Nodig omdat er nooit een wachtwoord in de repo mag staan: dit script vraagt
 * het wachtwoord, maakt er een afdruk van met een eigen zout, en schrijft
 * alleen die afdruk weg. Het wachtwoord zelf gaat nergens heen.
 *
 * De eerste persoon moet hiermee, want zonder iemand in de lijst kan er ook
 * niemand in het beheerdocument iemand toevoegen. Daarna kan het ook vanuit
 * het document zelf, onder "Who can sign in".
 *
 * De lijst is een TypeScript-module en geen JSON, omdat de middleware hem
 * importeert; zie de uitleg boven lib/beheer-toegang.ts. Dit script leest hem
 * door hem uit te voeren en schrijft hem daarna in zijn geheel terug, met de
 * uitleg erboven intact.
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
const { laadModule } = require('./beheer-inhoud.cjs')

const LIJST = path.join(__dirname, '..', 'lib', 'beheer-toegang.ts')

/** Hetzelfde aantal rondes als lib/beheer-mensen.ts gebruikt. */
const RONDES = 210000

const argumenten = process.argv.slice(2)
const naam = argumenten.find((a) => !a.startsWith('--'))
const isBeheerder = argumenten.includes('--beheerder')
const weghalen = argumenten.includes('--weg')

if (!naam) {
  console.error('Geef een naam mee: node scripts/beheer-wachtwoord.cjs "Giulia" --beheerder')
  process.exit(2)
}

/*
 * Dit script vraagt om een wachtwoord en heeft dus een echte terminal nodig.
 *
 * Zonder terminal, bijvoorbeeld als de invoer wordt doorgesluisd, komt de vraag
 * wel op het scherm maar krijgt hij nooit antwoord: het script blijft dan stil
 * hangen en stopt daarna alsof er niets aan de hand was. Dat is precies het
 * soort stilte waarin je denkt dat iemand in de lijst staat terwijl dat niet zo
 * is.
 */
if (!weghalen && !process.stdin.isTTY) {
  console.error('Dit script vraagt om een wachtwoord en heeft een terminal nodig.')
  console.error('Draai het rechtstreeks, niet via een pijp of een script.')
  process.exit(2)
}

/** De huidige lijst, door de module uit te voeren. */
function leesLijst() {
  if (!fs.existsSync(LIJST)) return []
  const mensen = laadModule(LIJST).mensen
  return Array.isArray(mensen) ? mensen : []
}

/**
 * Schrijft de lijst terug.
 *
 * Alleen de regel met de lijst zelf wordt vervangen; de uitleg erboven blijft
 * staan. Het hele bestand opnieuw genereren zou die uitleg weggooien, en dan
 * weet de volgende die het openslaat niet meer waarom dit geen JSON is.
 */
function schrijfLijst(mensen) {
  const bron = fs.readFileSync(LIJST, 'utf8')
  const regels = mensen
    .map(
      (p) =>
        `  {\n` +
        `    naam: ${JSON.stringify(p.naam)},\n` +
        `    zout: '${p.zout}',\n` +
        `    afdruk: '${p.afdruk}',\n` +
        `    iteraties: ${p.iteraties},\n` +
        `    beheerder: ${p.beheerder ? 'true' : 'false'},\n` +
        `  },`,
    )
    .join('\n')

  const nieuw = mensen.length
    ? `export const mensen: Login[] = [\n${regels}\n]`
    : 'export const mensen: Login[] = []'

  const vervangen = bron.replace(/export const mensen: Login\[\] = \[[\s\S]*?\n?\]/, nieuw)
  if (vervangen === bron && mensen.length) {
    throw new Error('Kan de lijst in lib/beheer-toegang.ts niet vinden om te vervangen.')
  }
  fs.writeFileSync(LIJST, vervangen, 'utf8')
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
  let mensen = leesLijst()

  if (weghalen) {
    const voor = mensen.length
    mensen = mensen.filter((p) => p.naam !== naam)
    schrijfLijst(mensen)
    console.log(
      voor === mensen.length ? `${naam} stond niet in de lijst.` : `${naam} is uit de lijst gehaald.`,
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

  mensen = mensen.filter((p) => p.naam !== naam)
  mensen.push({ naam, zout, afdruk, iteraties: RONDES, beheerder: isBeheerder })
  schrijfLijst(mensen)

  console.log(`${naam} staat in de lijst${isBeheerder ? ' als beheerder' : ''}.`)
  console.log('Commit lib/beheer-toegang.ts en deploy; daarna geldt het.')
}

main()
