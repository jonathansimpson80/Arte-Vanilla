import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { useTaal } from '@/i18n/taal'

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'ghostLight'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 ease-soft disabled:cursor-not-allowed'

/**
 * De uit-staat zit per variant, niet als doorzichtigheid in `base`.
 * Een gele knop op een donker vlak wordt met opacity olijfgroen. Het vlak
 * houdt daarom altijd het merkgeel; alleen het opschrift verbleekt, zodat de
 * knop nog steeds leest als "nog niet klikbaar".
 */
const variants: Record<ButtonVariant, string> = {
  // Espresso op crème: het werkpaard. Hoogste contrast (18:1).
  primary: 'bg-espresso-900 text-crema-50 hover:bg-cacao-700 disabled:opacity-45',
  // Merkgeel als vlak, nooit als tekstkleur. Zelfde geel als in het streeppatroon.
  secondary:
    'bg-vaniglia-400 text-espresso-900 hover:bg-vaniglia-500 disabled:hover:bg-vaniglia-400 disabled:text-espresso-900/40',
  // Fel merkrood; crème erop haalt 4,54:1.
  accent: 'bg-fragola-400 text-crema-50 hover:bg-fragola-500 disabled:opacity-45',
  ghost: 'text-espresso-900 ring-[1.5px] ring-espresso-900/30 hover:bg-crema-100 disabled:opacity-45',
  // Ghost op een donker vlak. Als aparte variant, niet als losse override:
  // twee klassen die dezelfde ring-kleur zetten laten de volgorde in het
  // stylesheet beslissen, en dan wint soms de verkeerde.
  ghostLight:
    'text-crema-50 ring-[1.5px] ring-crema-50/45 hover:bg-crema-50/10 disabled:opacity-45',
}

/**
 * Op een telefoon is 44px de ondergrens voor iets waar je met een duim op
 * mikt; op een muisscherm mag het compacter.
 */
const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-3 text-sm sm:py-2',
  md: 'px-6 py-3.5 text-sm sm:py-3',
  lg: 'px-8 py-4 text-base',
}

type Props = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Rendert als <Link> in plaats van <button>. */
  to?: string
  /** Rendert als gewone <a> — voor links buiten de site. */
  href?: string
  /** Extra klassen, bijvoorbeeld om de ghost-variant op een kleurvlak te zetten. */
  className?: string
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  className: extra = '',
  children,
  ...rest
}: Props) {
  const { pad } = useTaal()
  const className = `${base} ${variants[variant]} ${sizes[size]} ${extra}`

  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  // Interne paden krijgen automatisch het taalvoorvoegsel, zodat een knop
  // niet stilletjes terugvalt naar de Engelse versie.
  if (to) {
    return (
      <Link to={pad(to)} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  )
}
