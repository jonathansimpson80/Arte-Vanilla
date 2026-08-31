import { useMemo } from 'react'

type Props = {
  /** Aantal kolommen met vallende stukjes. */
  columns?: number
  className?: string
}

/** Volledige merkpalet, zodat de confetti niet in twee tinten blijft hangen. */
const COLORS = [
  '#f4cf64', // vaniglia
  '#c9455a', // fragola fel
  '#8a9a5b', // pistacchio
  '#af6e2c', // caramello
  '#b4544c', // fragola
  '#5d321c', // cacao
  '#a5864d', // oro
  '#e5b845', // vaniglia diep
  '#5f6b3a', // pistacchio donker
]

/**
 * Decoratieve vallende sprinkles. Puur CSS-keyframes (vallen + draaien),
 * met per kolom een eigen duur zodat het patroon niet gaat pulseren.
 * Staat uit onder prefers-reduced-motion — zie index.css.
 */
export function Sprinkles({ columns = 22, className = '' }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: columns }, (_, i) => ({
        left: `${(i + 0.5) * (100 / columns)}%`,
        fall: 8 + ((i * 1.7) % 5.5),
        spin: 4 + ((i * 0.9) % 2.7),
        delay: -((i * 1.3) % 9),
        color: COLORS[(i * 4) % COLORS.length],
        round: i % 3 === 0,
        // Wisselende maat; gelijke stukjes lezen als een raster in plaats van confetti.
        breedte: 6 + ((i * 3) % 5),
        hoogte: 10 + ((i * 5) % 9),
        kanteling: (i * 37) % 180,
      })),
    [columns],
  )

  return (
    <div className={`sprinkles ${className}`} aria-hidden="true">
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="sprinkles__col"
          style={{
            left: piece.left,
            animationDuration: `${piece.fall}s`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          <span
            className="sprinkles__piece"
            style={{
              background: piece.color,
              width: piece.breedte,
              height: piece.hoogte,
              rotate: `${piece.kanteling}deg`,
              animationDuration: `${piece.spin}s`,
              borderRadius: piece.round ? '999px' : '2px',
            }}
          />
        </span>
      ))}
    </div>
  )
}
