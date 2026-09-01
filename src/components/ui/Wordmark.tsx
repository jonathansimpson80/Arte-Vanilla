type Props = {
  /** Toont de "GELATO, DOLCI & CAFFÈ"-regel onder de naam, zoals op de gevel. */
  withTagline?: boolean
  /** Cremekleurige afdruk, voor op de espressovlakken (footer). */
  licht?: boolean
  /** Header: dit staat boven de vouw en mag niet nakomen. */
  prioriteit?: boolean
  /** Zet de hoogte, bijvoorbeeld "h-9". De breedte volgt. */
  className?: string
}

/** Bijgesneden op de inkt van het originele bestand — zie tools/logo.mjs. */
const MAAT = {
  wordmark: { breed: 1910, hoog: 451 },
  'wordmark-vol': { breed: 1910, hoog: 581 },
}

/**
 * De echte wordmark van de zaak, uit het logobestand van de klant.
 *
 * Eerder stond hier de naam in Grand Hotel. Dat kwam in de buurt, maar de
 * kapitale A heeft in dat schrift geen uitloop naar de r, terwijl de A en de r
 * in het logo juist in elkaar doorlopen — en dat is precies wat het merk
 * herkenbaar maakt. Een plaatje van het echte ontwerp klopt altijd.
 *
 * Twee afdrukken: espresso voor lichte vlakken en crème voor de footer. Ze
 * komen uit hetzelfde bestand, dus de vormen blijven identiek.
 */
export function Wordmark({
  withTagline = false,
  licht = false,
  prioriteit = false,
  className = '',
}: Props) {
  const soort = withTagline ? 'wordmark-vol' : 'wordmark'
  const naam = licht ? `${soort}-creme` : soort
  const { breed, hoog } = MAAT[soort]

  return (
    <img
      src={`/media/${naam}-480.png`}
      srcSet={`/media/${naam}-480.png 480w, /media/${naam}-960.png 960w`}
      sizes="240px"
      width={breed}
      height={hoog}
      alt="Arte Vanilla"
      loading={prioriteit ? 'eager' : 'lazy'}
      fetchPriority={prioriteit ? 'high' : undefined}
      decoding="async"
      draggable={false}
      className={`w-auto max-w-full ${className}`}
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
