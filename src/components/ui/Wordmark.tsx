type Props = {
  /** Toont de "gelato, dolci & caffè"-regel onder de naam. */
  withTagline?: boolean
  className?: string
}

/**
 * Tekst-wordmark. Voor druk en gevel geldt het echte logobestand;
 * dit is de web-variant voor header, footer en fallback.
 */
export function Wordmark({ withTagline = false, className = '' }: Props) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span className="wordmark text-espresso-900">
        Arte <span className="italic">Vanilla</span>
      </span>
      {withTagline && (
        <span className="eyebrow mt-1 text-[0.7rem] sm:text-[0.6rem] text-cacao-700">Gelato, dolci &amp; caffè</span>
      )}
    </span>
  )
}

/**
 * Het logo van de zaak. Het bestand komt uit het Instagram-profiel en is
 * 150px — genoeg voor de header, te klein voor druk. Vraag het vectorbestand
 * op bij de klant.
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
