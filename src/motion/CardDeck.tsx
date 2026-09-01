import { useRef, type ReactNode } from 'react'
import { useScrollScrub } from '@/motion/useScrollScrub'

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

/** Zachte in- en uitloop: een vlucht begint en eindigt langzaam. */
const soepel = (t: number) => t * t * (3 - 2 * t)

/** Hoe ver een kaart omhoog gaat, in schermhoogtes. Net genoeg om weg te zijn. */
const VLUCHT = 95

/**
 * Stapel kaarten die één voor één omhoog wegvliegen tijdens het scrollen.
 *
 * De sectie is `items.length × perCard` schermhoogtes hoog en het speelveld
 * plakt in beeld. Elke kaart heeft een eigen stukje van de voortgang: zolang
 * dat stukje loopt, schuift de kaart omhoog en kantelt hij weg. Kaarten die
 * nog wachten liggen iets gedraaid en verkleind onder de bovenste.
 *
 * Twee dingen houden dat soepel. De kaarten worden buiten React om getekend,
 * dus er is geen hertekening van de boom per beeld. En elke vlucht loopt via
 * een S-curve in plaats van rechtlijnig: op de overgang naar de volgende kaart
 * staat de snelheid op nul, waardoor er geen knik zit tussen twee kaarten.
 */
export function CardDeck<T>({
  items,
  perCard = 0.7,
  backdrop,
  renderCard,
  className = '',
}: Props<T>) {
  const kaarten = useRef<(HTMLDivElement | null)[]>([])

  const stand = (i: number, voortgang: number) => {
    // Voortgang van déze kaart: 0 = ligt nog op de stapel, 1 = weg.
    const t = soepel(klem(voortgang * items.length - i))
    const rust = items.length - 1 - i
    return {
      transform:
        `translate3d(0, calc(-50% + ${-t * VLUCHT}vh), 0) ` +
        `rotate(${(i % 2 === 0 ? 3.5 : -4) * (1 - t) + t * -14}deg) ` +
        `scale(${1 - rust * 0.025 + t * 0.04})`,
      opacity: t > 0.9 ? String(1 - (t - 0.9) * 10) : '1',
    }
  }

  const ref = useScrollScrub<HTMLDivElement>((voortgang) => {
    kaarten.current.forEach((el, i) => {
      if (!el) return
      const s = stand(i, voortgang)
      el.style.transform = s.transform
      el.style.opacity = s.opacity
    })
  })

  return (
    <div
      ref={ref}
      className={className}
      style={{ height: `${items.length * perCard * 100}vh` }}
    >
      {/* Het speelveld is een heel scherm hoog en plakt vanaf de bovenrand, met
          de hoogte van de zwevende menubalk als kussen erboven: daardoor komt
          de stapel in het midden van wat je écht ziet te staan in plaats van
          half achter de balk. De stapel laat ook precies los op het moment dat
          de laatste kaart weg is — met een korter speelveld bleef er daarna
          nog een leeg scherm plakken. */}
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden pt-[5.5rem]">
        {backdrop}

        {/* 384px speelveld minus 2×16px = kaarten van ~352px breed */}
        <div className="relative w-full max-w-[24rem] px-4">
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                kaarten.current[i] = el
              }}
              className="absolute inset-x-4 top-1/2"
              style={{ zIndex: items.length - i, willChange: 'transform', ...stand(i, 0) }}
            >
              {renderCard(item, i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
