import { Children, type ReactNode } from 'react'

type Props = {
  /** Zichtbare rand van de kaart eronder, in px. */
  offset?: number
  /** Waar de stapel blijft plakken. */
  top?: number
  /** Hoeveel de kaart krimpt als de volgende eroverheen komt. */
  shrink?: number
  className?: string
  children: ReactNode
}

/**
 * Kaarten die op elkaar stapelen: elke kaart plakt iets lager dan de vorige
 * en krimpt een fractie zodra de volgende eroverheen schuift. Puur sticky +
 * CSS-transform, dus geen scroll-berekening per frame.
 */
export function StickyStack({
  offset = 18,
  top = 96,
  shrink = 0.04,
  className = '',
  children,
}: Props) {
  const cards = Children.toArray(children)

  return (
    <div className={`sticky-stack ${className}`}>
      {cards.map((card, i) => {
        const depth = cards.length - 1 - i
        return (
          <div
            key={i}
            className="sticky-stack__item"
            style={{
              position: 'sticky',
              top: top + i * offset,
              zIndex: i + 1,
              transform: `scale(${1 - depth * shrink})`,
              transformOrigin: 'top center',
            }}
          >
            {card}
          </div>
        )
      })}
    </div>
  )
}
