import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  /** Snelheid in pixels per seconde. */
  speed?: number
  direction?: 'left' | 'right'
  /** Pauzeer bij hover — handig als er links of foto's in de rij staan. */
  pauseOnHover?: boolean
  className?: string
  children: ReactNode
}

/**
 * Oneindige ticker die de volle breedte vult.
 *
 * De rij staat er twee keer in en schuift precies 50% op, waardoor de naad
 * onzichtbaar blijft. Is de inhoud smaller dan het scherm, dan wordt die
 * eerst zo vaak herhaald tot de rij breder is dan het venster — anders valt
 * er een gat aan het eind van de lus.
 */
export function Marquee({
  speed = 60,
  direction = 'left',
  pauseOnHover = false,
  className = '',
  children,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const [copies, setCopies] = useState(1)
  const [duration, setDuration] = useState(20)

  useEffect(() => {
    const wrap = wrapRef.current
    const row = rowRef.current
    if (!wrap || !row) return

    const measure = () => {
      const rowBreedte = row.offsetWidth
      if (!rowBreedte) return

      const setBreedte = rowBreedte / copies
      // Eén set extra, zodat er ook tijdens de lus altijd inhoud in beeld is.
      const nodig = Math.min(40, Math.max(1, Math.ceil(wrap.offsetWidth / setBreedte) + 1))

      if (nodig !== copies) setCopies(nodig)
      setDuration(Math.max(4, rowBreedte / speed))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    observer.observe(row)
    return () => observer.disconnect()
  }, [speed, copies])

  const sets = Array.from({ length: copies }, (_, i) => (
    <Fragment key={i}>{children}</Fragment>
  ))

  return (
    <div
      ref={wrapRef}
      className={`marquee ${pauseOnHover ? 'marquee--pausable' : ''} ${className}`}
      data-direction={direction}
    >
      <div className="marquee__track" style={{ animationDuration: `${duration}s` }}>
        <div className="marquee__row" ref={rowRef}>
          {sets}
        </div>
        <div className="marquee__row" aria-hidden="true">
          {sets}
        </div>
      </div>
    </div>
  )
}
