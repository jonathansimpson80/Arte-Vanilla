import { useCallback, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { Glyph } from '@/components/ui/Glyph'

type Props = {
  /** 'ul' voor een lijst met kaarten, 'div' voor los blokwerk. */
  as?: ElementType
  /** Rasterklassen voor sm en hoger, plus de gap. */
  className?: string
  /** Naam voor de knoppen, bijvoorbeeld "smaken". */
  label: string
  /** Wordt doorgegeven aan de schuifbalk zelf. */
  innerRef?: (el: HTMLElement | null) => void
  /** Meldt welke kaart vooraan staat, zodat de omgeving mee kan kleuren. */
  onActief?: (index: number) => void
  children: ReactNode
}

/**
 * Rij kaarten die op een telefoon zijwaarts schuift en vanaf sm een gewoon
 * raster is. De opmaak zit in de klasse `.carrousel`; dit onderdeel voegt de
 * twee pijlen toe voor wie liever tikt dan veegt.
 *
 * De pijlen verschijnen alleen als er echt iets te schuiven valt, en de knop
 * aan een uiteinde gaat uit zodra je daar bent — een knop die niets doet is
 * vervelender dan geen knop.
 */
export function Carrousel({
  as: Tag = 'div',
  className = '',
  label,
  innerRef,
  onActief,
  children,
}: Props) {
  const rijRef = useRef<HTMLElement | null>(null)
  const laatsteRef = useRef(-1)
  const [staat, setStaat] = useState({ schuift: false, begin: true, eind: false })

  const meet = useCallback(() => {
    const rij = rijRef.current
    if (!rij) return
    const speling = rij.scrollWidth - rij.clientWidth
    const nu = {
      schuift: speling > 4,
      begin: rij.scrollLeft <= 2,
      eind: rij.scrollLeft >= speling - 2,
    }

    // Alleen bijwerken als er echt iets verandert. Een nieuw object bij elke
    // meting geeft een nieuwe tekenbeurt, die de waarnemer weer laat meten:
    // dat is de lus waarin de pagina vastloopt.
    setStaat((vorig) =>
      vorig.schuift === nu.schuift && vorig.begin === nu.begin && vorig.eind === nu.eind
        ? vorig
        : nu,
    )

    if (!onActief) return

    // Welke kaart tegen de linkerrand klikt, is de kaart die je leest.
    let index: number
    if (rij.scrollLeft >= speling - 2) {
      index = rij.children.length - 1
    } else {
      const stap = (rij.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1
      const gat = parseFloat(getComputedStyle(rij).columnGap) || 0
      index = Math.round(rij.scrollLeft / (stap + gat))
    }

    if (index !== laatsteRef.current) {
      laatsteRef.current = index
      onActief(index)
    }
  }, [onActief])

  useEffect(() => {
    const rij = rijRef.current
    if (!rij) return

    meet()
    rij.addEventListener('scroll', meet, { passive: true })

    // Beelden die later binnenkomen veranderen de breedte van de rij.
    const waarnemer = new ResizeObserver(meet)
    waarnemer.observe(rij)

    return () => {
      rij.removeEventListener('scroll', meet)
      waarnemer.disconnect()
    }
  }, [meet])

  function schuif(richting: 1 | -1) {
    const rij = rijRef.current
    if (!rij) return
    const kaart = rij.firstElementChild as HTMLElement | null
    const gat = parseFloat(getComputedStyle(rij).columnGap) || 16
    const stap = (kaart?.offsetWidth ?? rij.clientWidth * 0.8) + gat
    rij.scrollBy({
      left: richting * stap,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="relative">
      <Tag
        ref={(el: HTMLElement | null) => {
          rijRef.current = el
          innerRef?.(el)
        }}
        className={`carrousel ${className}`}
      >
        {children}
      </Tag>

      {staat.schuift && (
        <>
          <Pijl kant="links" label={label} uit={staat.begin} onClick={() => schuif(-1)} />
          <Pijl kant="rechts" label={label} uit={staat.eind} onClick={() => schuif(1)} />
        </>
      )}
    </div>
  )
}

function Pijl({
  kant,
  label,
  uit,
  onClick,
}: {
  kant: 'links' | 'rechts'
  label: string
  uit: boolean
  onClick: () => void
}) {
  const links = kant === 'links'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={uit}
      aria-label={`${label}: ${links ? 'vorige' : 'volgende'}`}
      // Geel uit de strepen met espresso erop: 11,25:1, en het is dezelfde
      // gele knop als de rest van de site. Uitgeschakeld zakt hij weg in
      // plaats van te verdwijnen, zodat de rij niet verspringt.
      className={`carrousel-pijl absolute top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-vaniglia-400 text-espresso-900 shadow-lift ring-1 ring-espresso-900/10 transition-opacity duration-300 sm:hidden ${
        links ? 'left-1' : 'right-1'
      } ${uit ? 'pointer-events-none opacity-0' : 'opacity-95'}`}
    >
      <span className={links ? 'rotate-180' : ''}>
        <Glyph name="pijl" size={16} />
      </span>
    </button>
  )
}
