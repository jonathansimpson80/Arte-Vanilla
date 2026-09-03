import { useEffect, useRef, useState } from 'react'
import { useReveal } from '@/motion/useReveal'

type Props = {
  /** Het getal zoals het op de kaart staat, bijvoorbeeld "03". */
  waarde: string
  /**
   * Rolt opnieuw zodra dit van onwaar naar waar gaat: de kaart wordt de
   * actieve en de achtergrond kleurt mee, en het cijfer rolt daarin mee.
   */
  actief?: boolean
  className?: string
  style?: React.CSSProperties
}

const DUUR = 620
const STAP = 110

/** rust: op zijn plek · rollend: onderweg naar de tweede afdruk · terug: stil
 *  teruggezet naar de eerste, zonder animatie en dus onzichtbaar. */
type Stand = 'rust' | 'rollend' | 'terug'

/**
 * Cijfers die omhoog rollen: één keer als de kaart in beeld komt, en daarna
 * telkens als de kaart de actieve wordt.
 *
 * Elk teken staat twee keer onder elkaar in een venster van één regel hoog.
 * Rollen is dan één regel opschuiven — de tweede afdruk komt op de plek van
 * de eerste, waarna de baan zonder animatie terugspringt. Omdat beide
 * afdrukken hetzelfde teken zijn, is die sprong niet te zien.
 *
 * `useReveal` levert de fase, inclusief de sprong-zonder-animatie voor een
 * achtergrondtab en voor wie minder beweging wil.
 */
export function RolCijfer({ waarde, actief, className = '', style }: Props) {
  const { ref, phase } = useReveal<HTMLSpanElement>({ y: 0, amount: 0.5 })
  const [stand, setStand] = useState<Stand>('rust')
  const vorigActief = useRef(actief)
  const vorigeWaarde = useRef(waarde)

  useEffect(() => {
    // Twee aanleidingen: deze kaart wordt de actieve, of er komt een ander
    // getal in dezelfde plek te staan — dat laatste gebeurt in de vitrine op
    // laptop, waar één kaart de hele rij bedient.
    const werdActief = actief === true && vorigActief.current === false
    const nieuweWaarde = waarde !== vorigeWaarde.current
    vorigActief.current = actief
    vorigeWaarde.current = waarde
    // Nog niet in beeld of geen animatie gewenst: de opkomst doet het werk.
    if ((!werdActief && !nieuweWaarde) || phase !== 'animate') return

    setStand('rollend')
    const id = window.setTimeout(() => setStand('terug'), DUUR + (waarde.length - 1) * STAP)
    return () => window.clearTimeout(id)
  }, [actief, phase, waarde])

  useEffect(() => {
    if (stand !== 'terug') return
    const id = requestAnimationFrame(() => setStand('rust'))
    return () => cancelAnimationFrame(id)
  }, [stand])

  // Onder de rand tot de kaart in beeld komt, daarna op zijn plek.
  const offset = phase === 'hidden' ? '1em' : stand === 'rollend' ? '-1em' : '0em'
  const beweegt = phase === 'animate' && stand !== 'terug'

  return (
    <span ref={ref} className={`flex ${className}`} style={style} aria-label={waarde}>
      {[...waarde].map((teken, i) => (
        <span
          key={`${teken}-${i}`}
          className="block overflow-hidden"
          style={{ height: '1em', lineHeight: 1 }}
          aria-hidden="true"
        >
          <span
            className="block"
            style={{
              transform: `translateY(${offset})`,
              transition: beweegt
                ? `transform ${DUUR}ms var(--reveal-ease) ${i * STAP}ms`
                : 'none',
            }}
          >
            {teken}
            <span className="block">{teken}</span>
          </span>
        </span>
      ))}
    </span>
  )
}
