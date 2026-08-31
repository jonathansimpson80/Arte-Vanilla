import { useEffect, useRef, useState } from 'react'

export type RevealOptions = {
  /** Startafstand in px onder de eindpositie. */
  y?: number
  /** Startschaal (1 = geen schaal). */
  scale?: number
  /** Vertraging in ms — gebruik voor stagger binnen een groep. */
  delay?: number
  /** Deel van het element dat in beeld moet zijn voordat het triggert. */
  amount?: number
  /** Speel maar één keer af (standaard), of opnieuw bij terugscrollen. */
  once?: boolean
}

type Phase = 'hidden' | 'animate' | 'instant'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll-trigger op basis van IntersectionObserver — dezelfde aanpak als
 * Framer's appear-animaties: geen scroll-listener, geen animatiebibliotheek.
 *
 * Belangrijk detail: de eindstand wordt nooit via een transitie afgedwongen
 * als die transitie misschien niet loopt. In een achtergrondtab bevriest de
 * browser transities, waardoor inhoud met `opacity: 0` zichtbaar zou blijven
 * hangen. Daarom is er een 'instant'-fase die zonder animatie naar de
 * eindstand springt.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  y = 16,
  scale = 1,
  delay = 0,
  amount = 0.15,
  once = true,
}: RevealOptions = {}) {
  const ref = useRef<T>(null)
  const [phase, setPhase] = useState<Phase>('hidden')

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (prefersReducedMotion()) {
      setPhase('instant')
      return
    }

    // Pagina geladen in een achtergrondtab: animeren heeft daar geen zin.
    if (document.visibilityState === 'hidden') {
      setPhase('instant')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('animate')
          if (once) observer.disconnect()
        } else if (!once) {
          setPhase('hidden')
        }
      },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)

    /**
     * Vangnet: inhoud die in beeld staat mag nooit onzichtbaar blijven hangen
     * als de observer niet vuurt.
     *
     * Belangrijk: alléén voor wat op dat moment ook echt in beeld is. Zonder
     * die controle springt ook alles onder de vouw naar de eindstand, en dan
     * is er niets meer te animeren tegen de tijd dat je erheen scrollt — dat
     * maakt elke scroll-animatie op de pagina stil onzichtbaar.
     */
    const failsafe = window.setTimeout(() => {
      const rect = node.getBoundingClientRect()
      const inBeeld = rect.top < window.innerHeight && rect.bottom > 0
      if (inBeeld) setPhase((p) => (p === 'hidden' ? 'instant' : p))
    }, 1500)
    // Zelfde regel bij het wegklikken van de tab: alleen wat in beeld staat.
    const onHide = () => {
      if (document.visibilityState !== 'hidden') return
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setPhase((p) => (p === 'hidden' ? 'instant' : p))
      }
    }
    document.addEventListener('visibilitychange', onHide)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [amount, once])

  const shown = phase !== 'hidden'

  const style: React.CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'none' : `translateY(${y}px) scale(${scale})`,
    transition:
      phase === 'animate'
        ? `opacity 700ms var(--reveal-ease) ${delay}ms, transform 700ms var(--reveal-ease) ${delay}ms`
        : undefined,
    willChange: phase === 'hidden' ? 'opacity, transform' : undefined,
  }

  return { ref, shown, animating: phase === 'animate', style }
}
