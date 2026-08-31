import type { ReactNode } from 'react'

/** Basisvlak: crème op papier, zachte rand, geen harde schaduw in rust. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-scoop bg-crema-100 p-6 ring-1 ring-espresso-900/5 ${className}`}
    >
      {children}
    </div>
  )
}

/** Smaakkaart: kleurvlak + naam + omschrijving. */
export function FlavourCard({
  name,
  italian,
  description,
  swatch,
  badge,
}: {
  name: string
  italian: string
  description: string
  /** Tailwind-klasse voor het kleurvlak, bv. "bg-pistacchio-500". */
  swatch: string
  badge?: ReactNode
}) {
  return (
    <article className="group overflow-hidden rounded-scoop bg-crema-100 ring-1 ring-espresso-900/5 transition-shadow duration-500 ease-soft hover:shadow-lift">
      <div className={`flex h-32 items-end p-4 ${swatch}`}>{badge}</div>
      <div className="p-6">
        <p className="eyebrow">{italian}</p>
        <h3 className="mt-2 font-display text-xl text-espresso-900">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
      </div>
    </article>
  )
}
