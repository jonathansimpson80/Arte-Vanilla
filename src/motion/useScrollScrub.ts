import { useEffect, useRef } from 'react'

type Opties = {
  /** Deel van het verschil dat per beeld wordt ingelopen. 1 = geen demping. */
  demping?: number
}

/**
 * Voortgang (0–1) van een element door het scherm, doorgegeven aan een
 * tekenfunctie in plaats van aan de React-state.
 *
 * Verschil met useScrollProgress: die zet elke stap in state, en dan hertekent
 * React de hele boom per beeld. Voor één parallaxlaag valt dat mee; voor een
 * stapel kaarten die per beeld vier transforms krijgt niet — dan worden er
 * beelden gemist en verspringt de beweging. Hier schrijft de tekenfunctie
 * rechtstreeks naar de stijl van de elementen, buiten React om.
 *
 * De voortgang loopt bovendien achter het doel aan in plaats van eraan vast te
 * zitten. Een muiswiel klikt in stappen en een trackpad geeft schokjes; door
 * per beeld maar een deel van het verschil in te lopen wordt dat uitgesmeerd.
 * Wie minder beweging wil, krijgt de sprong zonder demping.
 */
export function useScrollScrub<T extends HTMLElement = HTMLDivElement>(
  teken: (voortgang: number) => void,
  { demping = 0.16 }: Opties = {},
) {
  const ref = useRef<T>(null)
  const tekenRef = useRef(teken)
  tekenRef.current = teken

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const stil = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stap = stil ? 1 : demping

    let frame = 0
    let getoond = -1

    const lus = () => {
      const rect = node.getBoundingClientRect()
      const afstand = rect.height - window.innerHeight
      const doel = afstand > 0 ? Math.min(1, Math.max(0, -rect.top / afstand)) : 0

      // Eerste beeld: meteen op zijn plek, anders zie je hem inlopen.
      if (getoond < 0) getoond = doel
      getoond += (doel - getoond) * stap
      if (Math.abs(doel - getoond) < 0.0002) getoond = doel

      tekenRef.current(getoond)
      frame = requestAnimationFrame(lus)
    }

    frame = requestAnimationFrame(lus)
    return () => cancelAnimationFrame(frame)
  }, [demping])

  return ref
}
