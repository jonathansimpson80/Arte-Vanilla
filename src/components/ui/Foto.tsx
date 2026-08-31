import { beeldmaten } from '@/data/beeldmaten'

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
  const maat = beeldmaten[src]
  const webp = src.replace(/\.jpg$/, '.webp')

  return (
    <picture>
      <source srcSet={webp} type="image/webp" sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={maat?.[0]}
        height={maat?.[1]}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        sizes={sizes}
        className={className}
        style={style}
      />
    </picture>
  )
}
