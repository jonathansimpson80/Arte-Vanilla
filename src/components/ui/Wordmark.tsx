type Tint = 'espresso' | 'creme' | 'zacht'

type Props = {
  /** Toont de "GELATO, DOLCI & CAFFÈ"-regel onder de naam, zoals op de gevel. */
  withTagline?: boolean
  /** espresso op lichte vlakken, creme en zacht op de espressovlakken. */
  tint?: Tint
  /** Vult de volle breedte in plaats van mee te schalen met een hoogteklasse. */
  vol?: boolean
  /** Header: dit staat boven de vouw en mag niet nakomen. */
  prioriteit?: boolean
  /** Decoratief herhaald logo: dan hoeft een schermlezer het niet te noemen. */
  stil?: boolean
  /** Hoe breed hij op het scherm komt, voor de juiste variant uit de srcset. */
  sizes?: string
  className?: string
}

/** Bijgesneden op de inkt van het originele bestand — zie tools/logo.mjs. */
const MAAT = {
  wordmark: { breed: 1910, hoog: 451, breedtes: [480, 960, 1440, 1920] },
  'wordmark-vol': { breed: 1910, hoog: 581, breedtes: [480, 960] },
}

const ACHTERVOEGSEL: Record<Tint, string> = {
  espresso: '',
  creme: '-creme',
  zacht: '-zacht',
}

/**
 * De echte wordmark van de zaak, uit het logobestand van de klant.
 *
 * Eerder stond hier de naam in Grand Hotel. Dat kwam in de buurt, maar de
 * kapitale A heeft in dat schrift geen uitloop naar de r, terwijl de A en de r
 * in het logo juist in elkaar doorlopen — en dat is precies wat het merk
 * herkenbaar maakt. Een afdruk van het echte ontwerp klopt altijd.
 *
 * Drie tinten uit hetzelfde bestand, dus de vormen zijn overal identiek: de
 * espressokleur van het origineel, crème voor de naam in de footer en het
 * zachtere crema-100 voor de grote afsluiter onderaan.
 */
export function Wordmark({
  withTagline = false,
  tint = 'espresso',
  vol = false,
  prioriteit = false,
  stil = false,
  sizes = '240px',
  className = '',
}: Props) {
  const soort = withTagline ? 'wordmark-vol' : 'wordmark'
  const { breed, hoog, breedtes } = MAAT[soort]
  const naam = `${soort}${ACHTERVOEGSEL[tint]}`
  // De grote maten bestaan alleen in de tint van de afsluiter.
  const beschikbaar = breedtes.filter((b) => b <= 960 || tint === 'zacht')

  return (
    <img
      src={`/media/${naam}-${beschikbaar[0]}.png`}
      srcSet={beschikbaar.map((b) => `/media/${naam}-${b}.png ${b}w`).join(', ')}
      sizes={sizes}
      width={breed}
      height={hoog}
      alt={stil ? '' : 'Arte Vanilla'}
      aria-hidden={stil || undefined}
      loading={prioriteit ? 'eager' : 'lazy'}
      fetchPriority={prioriteit ? 'high' : undefined}
      decoding="async"
      draggable={false}
      className={`${vol ? 'w-full' : 'w-auto max-w-full'} ${className}`}
    />
  )
}

/**
 * Het logo van de zaak: de gestreepte cirkel met de naam erin.
 */
export function LogoMark({ size = 96 }: { size?: number }) {
  return (
    <img
      src="/media/logo.jpg"
      alt="Arte Vanilla"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover ring-1 ring-espresso-900/15"
    />
  )
}
