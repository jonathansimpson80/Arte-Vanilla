import { beeldmaten } from '@/data/beeldmaten'
import { bestand } from '@/lib/pad'

/** Breedtes die `tools/beelden.mjs` aanmaakt. */
const VARIANTEN = [480, 960, 1440]

type Props = {
  src: string
  alt: string
  className?: string
  /** Standaard lui geladen; zet op 'eager' voor beeld dat direct in beeld staat. */
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  sizes?: string
  style?: React.CSSProperties
}

/**
 * Eén beeld, in WebP met de JPEG als terugval.
 *
 * De afmetingen komen uit `beeldmaten.ts`, zodat de browser de ruimte al
 * reserveert voordat het beeld binnen is. Zonder die twee getallen schuift
 * alles eronder omlaag zodra de foto laadt — precies op het moment dat iemand
 * ergens op wil tikken.
 */
export function Foto({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  sizes,
  style,
}: Props) {
  // De maten staan onder het pad zoals het in de data staat; de URL krijgt het
  // basispad er pas bij het uitserveren voor.
  const maat = beeldmaten[src]
  const webp = bestand(src.replace(/\.jpg$/, '.webp'))
  const bron = bestand(src)

  /**
   * De varianten die `tools/beelden.mjs` naast het origineel heeft gezet.
   * Alleen breedtes kleiner dan het origineel bestaan als bestand — groter
   * opschalen levert geen scherpte op, dus die maakt het script niet.
   */
  const kaal = src.replace(/\.jpg$/, '')
  const breedtes = VARIANTEN.filter((b) => !maat || b < maat[0])

  function setVoor(ext: 'webp' | 'jpg') {
    const regels = breedtes.map((b) => `${bestand(`${kaal}-${b}.${ext}`)} ${b}w`)
    // Het origineel sluit de rij, met zijn echte breedte.
    const groot = ext === 'webp' ? webp : bron
    if (maat) regels.push(`${groot} ${maat[0]}w`)
    return regels.join(', ')
  }

  // Zonder `sizes` weet de browser niet hoe breed het beeld op de pagina komt
  // en pakt hij de grootste. Standaard: op een telefoon vult het beeld het
  // scherm, daarboven hooguit de halve pagina.
  const maten = sizes ?? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px'

  return (
    <picture>
      <source srcSet={setVoor('webp')} type="image/webp" sizes={maten} />
      <source srcSet={setVoor('jpg')} type="image/jpeg" sizes={maten} />
      <img
        src={bron}
        alt={alt}
        width={maat?.[0]}
        height={maat?.[1]}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        sizes={maten}
        className={className}
        style={style}
      />
    </picture>
  )
}
