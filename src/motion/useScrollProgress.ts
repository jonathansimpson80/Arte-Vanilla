import { useEffect, useRef, useState } from 'react'

/**
 * Voortgang (0–1) van een element door het scherm, gemeten met één
 * gedeelde rAF-loop. Geen scroll-listener per component: dat is wat
 * scroll-gedreven secties duur maakt.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0
    let last = -1

    const measure = () => {
      const rect = node.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      const raw = distance > 0 ? -rect.top / distance : 0
      const clamped = Math.min(1, Math.max(0, raw))

      // Alleen renderen bij een zichtbare verandering (0.2% stappen).
      if (Math.abs(clamped - last) > 0.002) {
        last = clamped
        setProgress(clamped)
      }
      frame = requestAnimationFrame(measure)
    }

    frame = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(frame)
  }, [])

  return { ref, progress }
}
