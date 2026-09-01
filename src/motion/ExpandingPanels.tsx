import { useState } from 'react'
import { useTaal, type Vertaald } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Foto } from '@/components/ui/Foto'
import { Glyph } from '@/components/ui/Glyph'
import type { Family } from '@/motion/FlipCard'

export type Panel = {
  label: Vertaald
  title: Vertaald
  body: Vertaald
  /** Regel die eronder staat, in cursief — bedoeld als tip voor in de winkel. */
  hint?: Vertaald
  /** De keuzehulp: een label als "iets fris" met de zin die erbij hoort. */
  kiezer?: { label: Vertaald; zin: Vertaald }
  /** Welke smaakfamilie achter dit paneel zit; vult de achterkant. */
  familie?: string
  image: string
}

type Props = {
  panels: Panel[]
  /** De families waar de panelen naar verwijzen, voor de achterkant. */
  families?: Family[]
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
export function ExpandingPanels({ panels, families = [], onChange, className = '' }: Props) {
  const { t } = useTaal()
  const [open, setOpen] = useState(0)
  // Alleen het geopende paneel kan omklappen; een smalle strook is te krap
  // voor de achterkant.
  const [om, setOm] = useState(false)

  function openen(index: number) {
    if (index !== open) setOm(false)
    setOpen(index)
    onChange?.(index)
  }

  /**
   * Op een telefoon staat de rij in een zijwaartse schuifbalk. Klap je daar
   * een paneel open, dan groeit het deels buiten beeld. Daarom schuift het
   * geopende paneel netjes in het midden — één keer meteen, en nog een keer
   * als het uitklappen klaar is, want pas dan is de eindbreedte bekend.
   */
  /** De familie die bij dit paneel hoort, als die er is. */
  function familieVan(panel: Panel) {
    return panel.familie ? families.find((f) => f.id === panel.familie) : undefined
  }

  function inBeeld(el: HTMLElement) {
    const rij = el.parentElement
    if (!rij || rij.scrollWidth <= rij.clientWidth + 1) return

    const zacht = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const centreer = () =>
      el.scrollIntoView({
        behavior: zacht ? 'smooth' : 'auto',
        inline: 'center',
        block: 'nearest',
      })

    centreer()
    el.addEventListener('transitionend', centreer, { once: true })
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
            onClick={(e) => {
              // Al open? Dan is de klik bedoeld om de achterkant te zien.
              if (isOpen && familieVan(panel)) setOm((v) => !v)
              else openen(i)
              inBeeld(e.currentTarget)
            }}
            onFocus={(e) => {
              openen(i)
              inBeeld(e.currentTarget)
            }}
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
              <span className="flip absolute inset-0 block">
                <span className={`flip__inner ${om ? 'flip__inner--om' : ''}`}>
                  {/* `items-start` is nodig omdat een flip-kant een flexkolom
                      is: zonder dat rekken de pilletjes zich over de volle
                      breedte uit in plaats van om hun tekst heen te sluiten. */}
                  <span className="flip__face items-start justify-end gap-3 p-6 sm:p-7">
                    <span className="chunk rounded-full bg-crema-50 px-3.5 py-1.5 text-[0.7rem] text-espresso-900 sm:text-[0.6rem]">
                      {t(panel.label)}
                    </span>

                    <span className="block max-w-sm">
                      <span className="block font-display text-2xl font-bold leading-tight text-crema-50 sm:text-[1.7rem]">
                        {t(panel.title)}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-crema-50/85">
                        {t(panel.body)}
                      </span>
                    </span>

                    {panel.kiezer && (
                      <span className="block max-w-sm border-t border-dashed border-crema-50/30 pt-3">
                        <span className="chunk rounded-full bg-crema-50/15 px-3 py-1 text-[0.66rem] text-crema-50 sm:text-[0.6rem]">
                          {t(panel.kiezer.label)}
                        </span>
                        <span className="mt-2 block text-sm leading-relaxed text-crema-50/85">
                          {t(panel.kiezer.zin)}
                        </span>
                      </span>
                    )}

                    {panel.hint && (
                      <span className="block text-sm italic text-crema-50/65">{t(panel.hint)}</span>
                    )}

                    {familieVan(panel) && (
                      <span className="chunk mt-1 flex items-center gap-2 rounded-full bg-crema-50/12 px-3 py-1.5 text-[0.66rem] text-crema-50/80 transition-colors group-hover:bg-crema-50/20 sm:text-[0.58rem]">
                        {t(ui.draaiVoorSmaken)}
                        <Glyph name="pijl" size={11} />
                      </span>
                    )}
                  </span>

                  {/* Achterkant: dezelfde inhoud die eerst op de losse
                      flipkaarten stond. Zo hoeft die rij niet nog een keer
                      onder deze te staan. */}
                  {(() => {
                    const familie = familieVan(panel)
                    if (!familie) return null
                    return (
                      <span
                        className="flip__face flip__face--back items-start justify-start gap-4 overflow-hidden p-6 text-crema-50 sm:p-7"
                        style={{ backgroundColor: familie.backHex }}
                        aria-hidden={!om}
                      >
                        {/* Het streeppatroon uit het logo, heel zacht: geeft het
                            vlak textuur zonder de tekst in de weg te zitten. */}
                        <span
                          className="pointer-events-none absolute inset-0 opacity-[0.07]"
                          aria-hidden="true"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(90deg, #fffbf2 0 5.6%, transparent 5.6% 9.1%)',
                          }}
                        />

                        <span className="relative flex w-full items-baseline justify-between gap-4">
                          <span className="font-display text-[1.7rem] font-bold leading-none">
                            {t(familie.name)}
                          </span>
                          <span className="chunk text-[0.66rem] opacity-45 sm:text-[0.58rem]">
                            {t(ui.familieSmaken)} · {familie.smaken.length}
                          </span>
                        </span>

                        <span className="relative grid w-full gap-3">
                          {[
                            { label: ui.sfeer, waarde: familie.mood },
                            { label: ui.pastBij, waarde: familie.bestFor },
                          ].map((regel) => (
                            <span key={regel.label.nl} className="grid gap-0.5">
                              <span className="chunk text-[0.64rem] opacity-55 sm:text-[0.56rem]">
                                {t(regel.label)}
                              </span>
                              <span className="text-sm leading-snug">{t(regel.waarde)}</span>
                            </span>
                          ))}
                        </span>

                        <span className="relative flex w-full flex-wrap gap-1.5">
                          {familie.smaken.map((naam) => (
                            <span
                              key={naam}
                              className="rounded-full bg-crema-50/16 px-3 py-1 text-xs font-medium"
                            >
                              {naam}
                            </span>
                          ))}
                        </span>

                        <span className="relative mt-auto grid w-full gap-0.5 border-t border-dashed border-crema-50/25 pt-3">
                          <span className="chunk text-[0.64rem] opacity-55 sm:text-[0.56rem]">
                            {t(ui.vraagInWinkel)}
                          </span>
                          <span className="text-sm leading-snug">{t(familie.ask)}</span>
                        </span>
                      </span>
                    )
                  })()}
                </span>
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
