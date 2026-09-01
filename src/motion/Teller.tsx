import { useEffect, useRef, useState } from 'react'

type Props = {
  /** Het eindgetal, zoals het op de kaart hoort te staan: 12, 4,9 of 1. */
  waarde: string
  /** Hoe lang het tellen duurt, in ms. */
  duur?: number
  className?: string
  style?: React.CSSProperties
}

const minderBeweging = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Getal dat omhoog telt zodra het in beeld komt.
 *
 * Het leest het eindgetal uit de tekst zelf, inclusief de komma: "4,9" telt
 * met één decimaal, "12" met hele stappen. Zo blijft de bron van het getal op
 * één plek staan en hoeft hier niets apart ingesteld te worden.
 *
 * Telt één keer. Bij `prefers-reduced-motion` staat het eindgetal er meteen —
 * een teller die je niet mag animeren hoort geen 0 te tonen.
 */
export function Teller({ waarde, duur = 1100, className = '', style }: Props) {
  const decimalen = waarde.includes(',') ? waarde.split(',')[1].length : 0
  const doel = Number(waarde.replace(',', '.'))
  const ref = useRef<HTMLSpanElement>(null)
  const [nu, setNu] = useState(() => (minderBeweging() ? doel : 0))

  useEffect(() => {
    const el = ref.current
    if (!el || minderBeweging() || !Number.isFinite(doel)) return

    let frame = 0
    let gestart = false

    const waarnemer = new IntersectionObserver(
      (entries) => {
        if (gestart || !entries.some((e) => e.isIntersecting)) return
        gestart = true
        waarnemer.disconnect()

        const begin = performance.now()
        const stap = (tijd: number) => {
          const deel = Math.min(1, (tijd - begin) / duur)
          // Snel op gang, zacht uitlopend: een teller die op het eind nog
          // even doorloopt leest als een teller, niet als een sprong.
          const soepel = 1 - Math.pow(1 - deel, 3)
          setNu(doel * soepel)
          if (deel < 1) frame = requestAnimationFrame(stap)
        }
        frame = requestAnimationFrame(stap)
      },
      { threshold: 0.4 },
    )

    waarnemer.observe(el)

    /**
     * Vangnet. Slaat de waarnemer nooit aan — een achtergrondtab, een lijst
     * die nog geen hoogte heeft, een browser die 'm mist — dan blijft er een 0
     * staan waar een echt getal hoort. Een verkeerd getal is erger dan geen
     * animatie, dus na twee seconden springt hij naar de eindwaarde.
     */
    const vangnet = window.setTimeout(() => {
      if (!gestart) {
        gestart = true
        waarnemer.disconnect()
        setNu(doel)
      }
    }, 2000)

    return () => {
      waarnemer.disconnect()
      cancelAnimationFrame(frame)
      window.clearTimeout(vangnet)
    }
  }, [doel, duur])

  return (
    <span ref={ref} className={className} style={style}>
      {/* De cijfers zelf zijn beeld terwijl ze lopen; een schermlezer krijgt
          het eindgetal in één keer. */}
      <span aria-hidden="true">{nu.toFixed(decimalen).replace('.', ',')}</span>
      <span className="sr-only">{waarde}</span>
    </span>
  )
}
