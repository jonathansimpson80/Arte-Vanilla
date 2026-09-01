type Props = {
  /** Hoe lang één rit duurt, in seconden. Hoger is rustiger. */
  duur?: number
  /**
   * Op welke ondergrond hij rijdt. Op crème is de donkere uitvoering nodig,
   * op het espresso van de voettekst zou die verdwijnen — daar rijdt de
   * lichte, met het merkgeel als carrosserie.
   */
  kleur?: 'donker' | 'licht'
  /** Waar hij staat; positioneren doet de plek zelf. */
  className?: string
}

/**
 * Een Vespa die van links naar rechts over de strepen rijdt.
 *
 * Geen sier zonder reden: de zaak verkoopt Vespa-dozen aan de toonbank en het
 * scootertje staat op hun eigen verpakking. Hier rijdt hij één keer per ronde
 * langs, laag genoeg om achter de tekst door te gaan.
 *
 * Staat stil onder `prefers-reduced-motion` — dan is er niets te zien in
 * plaats van iets dat blijft hangen.
 */
export function Scooter({ duur = 22, kleur = 'donker', className = '' }: Props) {
  const licht = kleur === 'licht'
  const band = licht ? '#fffbf2' : '#1d0805'
  const naaf = licht ? '#1d0805' : '#fdfaf3'
  const carrosserie = licht ? '#f4cf64' : '#c9455a'
  const lijn = licht ? '#fffbf2' : '#1d0805'

  return (
    <span
      className={`scooter pointer-events-none absolute select-none ${className}`}
      style={{ animationDuration: `${duur}s` }}
      aria-hidden="true"
    >
      <svg width="86" height="52" viewBox="0 0 86 52" fill="none" className="scooter__beeld">
        {/* achterwiel */}
        <circle cx="18" cy="40" r="9" fill={band} />
        <circle cx="18" cy="40" r="3.4" fill={naaf} />
        {/* voorwiel */}
        <circle cx="68" cy="40" r="9" fill={band} />
        <circle cx="68" cy="40" r="3.4" fill={naaf} />

        {/* body: zadel, buik en het schild vooraan */}
        <path
          d="M12 40c-3-9 1-17 9-19l14-3 4-9h9l-3 9 9 1c7 1 11 6 12 13l1 8h-7c-1-6-5-10-11-10-6 0-10 4-11 10H27c-1-6-5-10-11-10-2 0-3 .3-4 1Z"
          fill={carrosserie}
        />
        {/* stuur */}
        <path d="M56 18l8-8h9" stroke={lijn} strokeWidth="3.4" strokeLinecap="round" />
        {/* spatbord voor */}
        <path d="M60 34a9 9 0 0 1 16 0" stroke={lijn} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  )
}
