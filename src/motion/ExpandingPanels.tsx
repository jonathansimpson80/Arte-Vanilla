import { useState } from 'react'
import { useTaal, type Vertaald } from '@/i18n/taal'
import { Foto } from '@/components/ui/Foto'

export type Panel = {
  label: Vertaald
  title: Vertaald
  body: Vertaald
  /** Regel die eronder staat, in cursief — bedoeld als tip voor in de winkel. */
  hint?: Vertaald
  /** De keuzehulp: "wil je iets fris? dan hierheen". */
  kiezer?: Vertaald
  image: string
}

type Props = {
  panels: Panel[]
  /** Wordt aangeroepen zodra er een ander paneel opengaat. */
  onChange?: (index: number) => void
  className?: string
}

/**
 * Rij panelen waarvan er één openstaat. Klikken of focussen opent een paneel;
 * de rest schuift samen tot een strook met de naam verticaal erin.
 *
 * De panelen zijn knoppen, geen divs met een klik-handler: zo werkt tabben en
 * bedienen met de spatiebalk vanzelf, en leest een schermlezer de open staat.
 */
export function ExpandingPanels({ panels, onChange, className = '' }: Props) {
  const { t } = useTaal()
  const [open, setOpen] = useState(0)

  function openen(index: number) {
    setOpen(index)
    onChange?.(index)
  }

  return (
    <div className={`flex gap-2 overflow-x-auto sm:overflow-visible ${className}`}>
      {panels.map((panel, i) => {
        const isOpen = i === open

        return (
          <button
            key={panel.image}
            type="button"
            // Muis opent bij het erlangs gaan; klik en focus blijven werken
            // voor touch en toetsenbord, waar hover niet bestaat.
            onMouseEnter={() => openen(i)}
            onClick={() => openen(i)}
            onFocus={() => openen(i)}
            aria-expanded={isOpen}
            className="group relative h-80 shrink-0 overflow-hidden rounded-scoop text-left transition-[flex-grow,width] duration-500 ease-soft sm:h-96 sm:shrink"
            style={{
              flexGrow: isOpen ? 5 : 1,
              flexBasis: 0,
              minWidth: isOpen ? '15rem' : '4.5rem',
            }}
          >
            <Foto
              src={panel.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Donkere sluier: zonder deze laag is witte tekst op een foto met
                lichte partijen niet te lezen. */}
            <span
              className={`absolute inset-0 transition-opacity duration-500 ${
                isOpen
                  ? 'bg-gradient-to-t from-espresso-900/90 via-espresso-900/45 to-espresso-900/10'
                  : 'bg-espresso-900/55 group-hover:bg-espresso-900/35'
              }`}
            />

            {isOpen ? (
              <span className="absolute inset-x-0 bottom-0 block p-6">
                <span className="chunk inline-block rounded-full bg-crema-50 px-3 py-1.5 text-[0.7rem] sm:text-[0.6rem] text-espresso-900">
                  {t(panel.label)}
                </span>
                <span className="mt-3 block font-display text-2xl font-bold text-crema-50">
                  {t(panel.title)}
                </span>
                <span className="mt-2 block max-w-xs text-sm leading-relaxed text-crema-50/85">
                  {t(panel.body)}
                </span>
                {panel.kiezer && (
                  <span className="mt-3 block max-w-xs border-t border-dashed border-crema-50/30 pt-3 text-sm leading-relaxed text-crema-50/85">
                    {t(panel.kiezer)}
                  </span>
                )}
                {panel.hint && (
                  <span className="mt-2 block text-sm italic text-crema-50/65">{t(panel.hint)}</span>
                )}
              </span>
            ) : (
              <span
                className="chunk absolute bottom-6 left-1/2 block -translate-x-1/2 text-[0.72rem] sm:text-[0.65rem] text-crema-50"
                style={{ writingMode: 'vertical-rl' }}
              >
                {t(panel.label)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
