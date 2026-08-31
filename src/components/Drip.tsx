type Props = {
  /** Kleur van de druipende rand; erft via currentColor. */
  className?: string
  /** Naar boven kantelen, voor een rand aan de bovenkant van een vlak. */
  flip?: boolean
  /** Aantal golven over de breedte — minder golven leest rustiger. */
  waves?: number
  /** Hoogte van de rand in Tailwind-klassen. */
  heightClass?: string
}

const BREEDTE = 120
const HOOGTE = 22
const MIDDEN = 11
const AMPLITUDE = 7

/**
 * Vloeiende golflijn.
 *
 * Elk segment loopt van top naar dal met controlepunten die recht naast het
 * begin- en eindpunt liggen. Daardoor is de raaklijn aan beide uiteinden
 * horizontaal en sluiten opeenvolgende segmenten zonder knik op elkaar aan —
 * dat is precies wat er misgaat zodra je de controlepunten schuin zet.
 */
function pad(golven: number): string {
  const segmenten = Math.max(2, Math.round(golven * 2))
  const stap = BREEDTE / segmenten

  let d = `M0 ${MIDDEN - AMPLITUDE}`

  for (let i = 0; i < segmenten; i++) {
    const x0 = i * stap
    const x1 = x0 + stap
    const yStart = MIDDEN + (i % 2 === 0 ? -AMPLITUDE : AMPLITUDE)
    const yEind = MIDDEN + (i % 2 === 0 ? AMPLITUDE : -AMPLITUDE)

    d += ` C${x0 + stap / 2} ${yStart} ${x1 - stap / 2} ${yEind} ${x1} ${yEind}`
  }

  // Sluit het vlak aan de bovenkant, zodat de vorm massief is boven de golf.
  return `${d} L${BREEDTE} 0 L0 0 Z`
}

/**
 * Druipende onderrand onder een gekleurde band. Zet de kleur van de band
 * op het element erboven en geef deze component dezelfde tekstkleur —
 * het vlak eronder blijft doorschijnen.
 */
export function Drip({
  className = 'text-fragola-400',
  flip = false,
  waves = 6,
  heightClass = 'h-8 sm:h-12',
}: Props) {
  return (
    <div
      className={`pointer-events-none w-full leading-[0] ${className}`}
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${BREEDTE} ${HOOGTE}`}
        preserveAspectRatio="none"
        className={`block w-full ${heightClass}`}
        fill="currentColor"
        shapeRendering="geometricPrecision"
      >
        <path d={pad(waves)} />
      </svg>
    </div>
  )
}
