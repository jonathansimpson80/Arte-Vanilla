import { Fragment, type ReactNode } from 'react'

type Props = {
  /** Hoe lang één ronde duurt, in seconden. Hoger is rustiger. */
  duration?: number
  direction?: 'up' | 'down'
  /** Hoe vaak de inhoud herhaald wordt binnen één set. */
  copies?: number
  className?: string
  children: ReactNode
}

/**
 * Kolom die zichzelf eindeloos naar boven schuift.
 *
 * Dezelfde truc als de horizontale marquee: de set staat er twee keer in en de
 * baan schuift precies 50% op, waardoor de naad wegvalt. `copies` bepaalt hoe
 * vaak de kaarten binnen één set herhaald worden — met twee of drie kaarten
 * per kolom is de set anders korter dan de kolom zelf en valt er een gat.
 */
export function VerticalMarquee({
  duration = 40,
  direction = 'up',
  copies = 3,
  className = '',
  children,
}: Props) {
  const set = Array.from({ length: copies }, (_, i) => <Fragment key={i}>{children}</Fragment>)

  return (
    <div className={`vmarquee ${className}`} data-direction={direction}>
      <div className="vmarquee__track" style={{ animationDuration: `${duration}s` }}>
        <div className="flex flex-col">{set}</div>
        <div className="flex flex-col" aria-hidden="true">
          {set}
        </div>
      </div>
    </div>
  )
}
