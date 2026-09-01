import { useReveal } from '@/motion/useReveal'

type Props = {
  /** Het getal zoals het op de kaart staat, bijvoorbeeld "03". */
  waarde: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Cijfers die één voor één omhoog binnenrollen zodra de kaart in beeld komt.
 *
 * Elk teken zit in een venster van één regel hoog en begint eronder; bij het
 * binnenkomen schuift het naar zijn plek, met een klein verschil per teken
 * zodat "03" leest als twee cijfers en niet als één blok.
 *
 * `useReveal` levert de fase, inclusief de sprong-zonder-animatie voor een
 * achtergrondtab en voor wie minder beweging wil.
 */
export function RolCijfer({ waarde, className = '', style }: Props) {
  const { ref, phase } = useReveal<HTMLSpanElement>({ y: 0, amount: 0.5 })
  const zichtbaar = phase !== 'hidden'

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
              transform: zichtbaar ? 'translateY(0)' : 'translateY(100%)',
              transition:
                phase === 'instant'
                  ? 'none'
                  : `transform 620ms var(--reveal-ease) ${i * 110}ms`,
            }}
          >
            {teken}
          </span>
        </span>
      ))}
    </span>
  )
}
