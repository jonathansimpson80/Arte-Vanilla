type Props = {
  /** Aantal gele stroken; het patroon begint en eindigt met geel. */
  bands?: number
  /** Kleur van de stroken; de ruimte ertussen laat de paginakleur zien. */
  color?: string
  /** Aandeel geel binnen één streep-plus-tussenruimte (0–1). */
  ratio?: number
  /**
   * Legt een zachte crème-waas over het midden.
   *
   * Staat er lopende tekst op het patroon, dan snijdt elke streepnaad door de
   * woorden heen en gaat je oog daarover struikelen. Met de waas leest de
   * tekst op één rustig vlak terwijl het patroon aan de randen zichtbaar
   * blijft. Aanzetten overal waar er meer dan een kop op de strepen staat.
   */
  scrim?: boolean
  className?: string
}

/**
 * Het streeppatroon uit het logo als stilstaande achtergrond.
 *
 * Geen herhalend patroon maar uitgerekende stops: bij herhaling eindigt de
 * rechterrand op de tussenruimte, en dan sluit het vlak aan één kant met
 * crème af. Met n stroken en n−1 tussenruimtes staat er aan beide randen geel.
 */
export function StripesBackground({
  bands = 11,
  color = '#f4cf64',
  ratio = 0.56,
  scrim = false,
  className = '',
}: Props) {
  // n·geel + (n−1)·tussenruimte = 100%, met geel/(geel+tussenruimte) = ratio.
  const geel = 100 / (bands + ((bands - 1) * (1 - ratio)) / ratio)
  const tussen = (geel * (1 - ratio)) / ratio

  const stops = Array.from({ length: bands }, (_, i) => {
    const start = i * (geel + tussen)
    const eind = start + geel
    return `transparent ${start}%, ${color} ${start}%, ${color} ${eind}%, transparent ${eind}%`
  }).join(', ')

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(90deg, ${stops})` }}
      aria-hidden="true"
    >
      {scrim && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(62% 58% at 50% 48%, var(--color-crema-50) 0%, ' +
              'rgb(255 251 242 / 0.92) 42%, rgb(255 251 242 / 0.55) 68%, transparent 88%)',
          }}
        />
      )}
    </div>
  )
}
