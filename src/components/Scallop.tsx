type Props = {
  /** Kleur van de rand zelf (Tailwind-kleurklasse via currentColor). */
  className?: string
  /** Bolletjes naar boven of naar beneden. */
  flip?: boolean
}

/**
 * Gegolfde sectierand — de bolletjesrand die je op ijssalons ziet.
 * Eén SVG die over de volle breedte herhaalt, zodat hij op elk formaat
 * even hoog blijft.
 */
export function Scallop({ className = 'text-fragola-500', flip = false }: Props) {
  return (
    <div
      className={`pointer-events-none w-full leading-[0] ${className}`}
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 12"
        preserveAspectRatio="none"
        className="block h-6 w-full sm:h-9"
        fill="currentColor"
      >
        <path d="M0 12V6a6 6 0 0 1 12 0 6 6 0 0 1 12 0 6 6 0 0 1 12 0 6 6 0 0 1 12 0 6 6 0 0 1 12 0 6 6 0 0 1 12 0 6 6 0 0 1 12 0 6 6 0 0 1 12 0 6 6 0 0 1 12 0 6 6 0 0 1 12 0v6z" />
      </svg>
    </div>
  )
}
