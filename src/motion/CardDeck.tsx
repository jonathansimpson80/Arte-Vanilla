import type { ReactNode } from 'react'
import { useScrollProgress } from '@/motion/useScrollProgress'

type Props<T> = {
  items: T[]
  /** Schermhoogtes die één kaart nodig heeft om weg te vliegen. */
  perCard?: number
  /** Woord dat achter de stapel doorloopt. */
  backdrop?: ReactNode
  renderCard: (item: T, index: number) => ReactNode
  className?: string
}

const klem = (n: number) => Math.min(1, Math.max(0, n))

/**
 * Stapel kaarten die één voor één omhoog wegvliegen tijdens het scrollen.
 *
 * De sectie is `items.length × perCard` schermhoogtes hoog en het speelveld
 * plakt in beeld. Elke kaart heeft een eigen stukje van de voortgang: zolang
 * dat stukje loopt, schuift de kaart omhoog en kantelt hij weg. Kaarten die
 * nog wachten liggen iets gedraaid en verkleind onder de bovenste.
 */
export function CardDeck<T>({
  items,
  perCard = 0.85,
  backdrop,
  renderCard,
  className = '',
}: Props<T>) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={className}
      style={{ height: `${items.length * perCard * 100}vh` }}
    >
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
        {backdrop}

        {/* 384px speelveld minus 2×16px = kaarten van ~352px breed */}
        <div className="relative w-full max-w-[24rem] px-4">
          {items.map((item, i) => {
            // Voortgang van déze kaart: 0 = ligt nog op de stapel, 1 = weg.
            const t = klem(progress * items.length - i)
            const rust = items.length - 1 - i

            const y = -t * 125
            const kanteling = (i % 2 === 0 ? 3.5 : -4) * (1 - t) + t * -14
            const schaal = 1 - rust * 0.025 + t * 0.04

            return (
              <div
                key={i}
                className="absolute inset-x-4 top-1/2"
                style={{
                  zIndex: items.length - i,
                  transform: `translate3d(0, calc(-50% + ${y}vh), 0) rotate(${kanteling}deg) scale(${schaal})`,
                  opacity: t > 0.9 ? 1 - (t - 0.9) * 10 : 1,
                  willChange: 'transform',
                }}
              >
                {renderCard(item, i)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
