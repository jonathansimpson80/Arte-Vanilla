/**
 * Snijdt de wordmark uit het originele logobestand en zet hem klaar in de
 * kleuren die de site gebruikt.
 *
 * Het bronbestand staat in brand/ en heeft ruime marges; de uitsnede hieronder
 * is gemeten op de dekking van de alfakanaal-pixels. De scheiding tussen het
 * schrift en de regel "GELATO, DOLCI & CAFFÈ" ligt op y=547: daarboven eindigt
 * de uithaal van de A, daaronder begint het accent van de È.
 *
 *   node tools/logo.mjs
 */
import sharp from 'sharp'

const BRON = 'brand/logo-wordmark.png'
const UIT = 'public/media'

/** Uitsnede op de inkt, gemeten in het bronbestand van 2048×768. */
const L = 69
const T = 96
const BREED = 1910
const HOOG_SCRIPT = 451 // alleen "ArteVanilla"
const HOOG_VOL = 581 // inclusief de taglineregel

/** De kleuren komen uit src/styles/tokens.css. */
const TINTEN = {
  '': null, // de espressokleur van het origineel
  '-creme': '#fffbf2', // crema-50, voor de footer
  '-zacht': '#fcf3e2', // crema-100, voor de grote afsluiter
}

const SOORTEN = [
  { naam: 'wordmark', hoogte: HOOG_SCRIPT, tinten: ['', '-creme', '-zacht'], breedtes: [480, 960, 1440, 1920] },
  { naam: 'wordmark-vol', hoogte: HOOG_VOL, tinten: ['', '-creme'], breedtes: [480, 960] },
]

for (const { naam, hoogte, tinten, breedtes } of SOORTEN) {
  for (const tint of tinten) {
    const kleur = TINTEN[tint]
    let s = sharp(BRON).extract({ left: L, top: T, width: BREED, height: hoogte })
    if (kleur) {
      // 'in' houdt de alfa van het origineel en vult die met één kleur.
      s = s.composite([
        { input: { create: { width: BREED, height: hoogte, channels: 4, background: kleur } }, blend: 'in' },
      ])
    }
    const basis = await s.png().toBuffer()

    for (const breed of breedtes) {
      // De grote afsluiter is het enige gebruik boven 960px.
      if (breed > 960 && tint !== '-zacht') continue
      await sharp(basis)
        .resize({ width: breed })
        .png({ compressionLevel: 9, palette: true })
        .toFile(`${UIT}/${naam}${tint}-${breed}.png`)
      console.log(`${naam}${tint}-${breed}.png`)
    }
  }
}
