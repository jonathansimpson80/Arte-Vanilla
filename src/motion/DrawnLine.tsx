import { useReveal } from '@/motion/useReveal'

type Props = {
  /** Kleur van de lijn. */
  stroke?: string
  /** Kleur van de stip die de lijn volgt. */
  dot?: string
  /** Duur van het tekenen in ms. */
  duration?: number
  /** Waar op het pad de stip tot stilstand komt (0 = begin, 1 = eind). */
  dotStop?: number
  className?: string
}

/**
 * Slinger met twee lussen: opkomen vanaf links, een lus draaien, doorlopen,
 * nog een lus, en dan in een lange afvlakkende haal naar rechts.
 * Met de hand uitgezet in een viewBox van 1200 × 220.
 */
const PAD = [
  'M20 160',
  'C 90 96, 168 62, 236 68',           // aanloop naar de eerste lus
  'C 310 74, 336 158, 262 172',        // eerste lus: rechtsom naar beneden
  'C 196 184, 190 96, 280 74',         // en terug omhoog, kruist zichzelf
  'C 380 50, 470 44, 548 54',          // tussenstuk naar de tweede lus
  'C 626 64, 650 142, 584 156',        // tweede lus
  'C 524 168, 520 92, 600 72',
  'C 760 34, 920 148, 1080 104',       // lange haal naar rechts
  'C 1130 90, 1160 78, 1186 72',
].join(' ')

/**
 * Slinger die zichzelf tekent zodra hij in beeld komt, met een stip die
 * de lijn volgt.
 *
 * De lijn gebruikt `pathLength="1"`, zodat de streeplengte niet van de
 * werkelijke padlengte afhangt. De stip is een tweede pad met streeplengte
 * nul en een ronde uiteinde — dat rendert als punt die je met de
 * streepverschuiving over het pad laat lopen.
 */
export function DrawnLine({
  stroke = 'rgb(180 84 76 / 0.35)',
  dot = '#f4cf64',
  duration = 2200,
  dotStop = 0.78,
  className = '',
}: Props) {
  /**
   * Pas starten als een derde van de baan in beeld staat, en opnieuw tekenen
   * bij elke binnenkomst (`once: false`). Eenmalig is hier ongelukkig: wie er
   * langs scrollt terwijl de tab nog laadt, ziet het nooit meer gebeuren.
   */
  const { ref, shown, animating } = useReveal<HTMLDivElement>({
    amount: 0.35,
    y: 0,
    once: false,
  })

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <svg viewBox="0 0 1200 220" fill="none" className="h-auto w-full overflow-visible">
        <path
          d={PAD}
          pathLength={1}
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={1}
          style={{
            strokeDashoffset: shown ? 0 : 1,
            transition: animating ? `stroke-dashoffset ${duration}ms var(--reveal-ease)` : undefined,
          }}
        />
        {/*
          Streeplengte nul met een ronde punt rendert als stip. De verschuiving
          bepaalt waar op het pad die stip staat: 0 is het begin, -1 het eind.
          Van 0 naar -1 laat de stip dus met de lijn mee naar rechts lopen —
          andersom eindigt hij aan het begin, waar hij niets aanwijst.
        */}
        <path
          d={PAD}
          pathLength={1}
          stroke={dot}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray="0 1"
          style={{
            strokeDashoffset: shown ? -dotStop : 0,
            transition: animating ? `stroke-dashoffset ${duration}ms var(--reveal-ease)` : undefined,
          }}
        />
      </svg>
    </div>
  )
}
