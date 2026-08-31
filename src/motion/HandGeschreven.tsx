import { useReveal } from '@/motion/useReveal'

type Props = {
  children: string
  /** Draaiing in graden — een handgeschreven regel staat zelden waterpas. */
  tilt?: number
  /** Milliseconden per teken. */
  tempo?: number
  className?: string
}

/**
 * Een regel die zichzelf schrijft, en er daarna een streep onder zet.
 *
 * Het schrift komt uit het logo (Grand Hotel), dus dit hoeft geen nagetekend
 * pad te zijn. De letters komen tevoorschijn onder een masker dat in stapjes
 * opschuift: `steps()` op de klok, één stap per teken, waardoor het ritme van
 * een pen ontstaat in plaats van een gladde veeg. De tekst blijft daarbij één
 * tekstknoop — bij losse spans per letter breken de verbindingen tussen de
 * lussen van een schrijfletter.
 *
 * De streep eronder is wél een echt pad, met `stroke-dasharray` getrokken
 * zodra het laatste woord staat.
 *
 * Bij `prefers-reduced-motion` zet useReveal de fase op 'instant': dan staat
 * alles er meteen, zonder animatie.
 */
export function HandGeschreven({ children, tilt = -2.5, tempo = 55, className = '' }: Props) {
  const { ref, shown, animating } = useReveal<HTMLSpanElement>({ y: 0, amount: 0.4 })

  const tekens = children.length
  const schrijftijd = tekens * tempo

  return (
    <span
      ref={ref}
      className={`relative inline-block ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span
        className="wordmark block pb-2 leading-[1.1]"
        style={
          animating
            ? {
                // Eén stap per teken: de pen zet letter voor letter neer.
                animation: `schrijven ${schrijftijd}ms steps(${tekens}, end) forwards`,
              }
            : { clipPath: shown ? 'inset(-15% -8% -15% -2%)' : 'inset(-15% 100% -15% -2%)' }
        }
      >
        {children}
      </span>

      <svg
        viewBox="0 0 300 14"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-3 w-full overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 9.4C50 3.6 100 2.2 152 4.6c48 2.2 96 4.6 145 0.8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: shown ? 0 : 1,
            // Begint pas als de zin er staat.
            transition: animating
              ? `stroke-dashoffset 700ms ease-out ${schrijftijd + 120}ms`
              : undefined,
          }}
        />
      </svg>
    </span>
  )
}
