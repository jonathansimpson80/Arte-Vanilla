/**
 * Maakt van elke foto in public/media een set kleinere varianten.
 *
 * Een telefoon van 375 punten breed haalde tot nu toe hetzelfde bestand op als
 * een breedbeeldscherm: 300 tot 500 kB per foto, tientallen keren per pagina.
 * Met varianten op 480, 960 en 1440 pixels kiest de browser zelf de kleinste
 * die scherp genoeg is — dat scheelt op een telefoon ruwweg tien keer zoveel
 * data als alle andere optimalisaties bij elkaar.
 *
 * Draaien: `node tools/beelden.mjs`. Het schrijft naast elk origineel de
 * varianten met een breedte-achtervoegsel, en slaat over wat al bestaat.
 */
import { readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const MAP = 'public/media'
const BREEDTES = [320, 480, 720, 960, 1440]

// Alleen originelen: een variant eindigt op een breedte, en daar nog eens
// varianten van maken levert bestanden als `bak-mango-960-480.jpg` op.
const isVariant = (naam) => /-\d{3,4}\.(jpg|png|webp)$/.test(naam)
const bestanden = (await readdir(MAP)).filter((n) => /\.(jpg|png)$/i.test(n) && !isVariant(n))
let gemaakt = 0
let overgeslagen = 0

for (const naam of bestanden) {
  const { name } = parse(naam)
  const bron = join(MAP, naam)
  const origineel = sharp(bron)
  const { width } = await origineel.metadata()

  // Naast elk origineel hoort een webp van dezelfde maat: `Foto` biedt die
  // altijd als eerste aan, en zonder dat bestand laadt het beeld niet.
  const tweeling = join(MAP, `${name}.webp`)
  if (!existsSync(tweeling)) {
    await sharp(bron).webp({ quality: 78 }).toFile(tweeling)
    gemaakt++
  }

  for (const breedte of BREEDTES) {
    // Geen variant die groter is dan het origineel: dan schaal je op en
    // verlies je scherpte zonder een byte te winnen.
    if (!width || breedte >= width) continue

    // Naast webp altijd het oorspronkelijke formaat als terugval.
    const eigen = name.endsWith('.png') || naam.toLowerCase().endsWith('.png') ? 'png' : 'jpg'
    for (const [ext, opties] of [
      ['webp', { quality: 74 }],
      [eigen, eigen === 'png' ? { compressionLevel: 9 } : { quality: 76, mozjpeg: true }],
    ]) {
      const doel = join(MAP, `${name}-${breedte}.${ext}`)
      if (existsSync(doel)) {
        overgeslagen++
        continue
      }
      const pijp = sharp(bron).resize({ width: breedte, withoutEnlargement: true })
      await (ext === 'webp' ? pijp.webp(opties) : ext === 'png' ? pijp.png(opties) : pijp.jpeg(opties)).toFile(doel)
      gemaakt++
    }
  }
}

const totaal = (await readdir(MAP)).reduce(async (som, n) => (await som) + (await stat(join(MAP, n))).size, Promise.resolve(0))
console.log(`${gemaakt} varianten gemaakt, ${overgeslagen} bestonden al.`)
console.log(`public/media is nu ${(await totaal / 1024 / 1024).toFixed(1)} MB.`)
