import { useRef, useState, useEffect } from 'react'
import { useTaal, type Vertaald } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { Reveal } from '@/motion/Reveal'
import { RolCijfer } from '@/motion/RolCijfer'
import { Carrousel } from '@/components/ui/Carrousel'
import { HandGeschreven } from '@/motion/HandGeschreven'
import { moods, type Mood } from '@/data/home'
import { flavours } from '@/data/flavours'
import { Foto } from '@/components/ui/Foto'

/**
 * Welke smaaknamen er op een kaart horen: een hele rij uit de vitrine, of de
 * ene smaak die de kaart uitlicht.
 */
function smakenVan(item: Mood, t: (tekst: Vertaald) => string) {
  if (item.smaken) return item.smaken
  return flavours
    .filter((smaak) => smaak.category === item.categorie)
    .map((smaak) => (smaak.naam ? t(smaak.naam) : smaak.name))
}

/**
 * De vitrine: een vaste kaart links die meeloopt met de rij die in beeld
 * staat, en rechts de rijen en uitgelichte smaken.
 */
/**
 * De vitrinekaart: beeld, nummer en de smaken van één stemming. Staat op
 * telefoon vijf keer naast elkaar in een carrousel, en daarboven één keer
 * naast de genummerde rij.
 */
function Vitrine({
  item,
  actief,
  eigen,
  t,
}: {
  item: Mood
  /** Welke stemming nu de toon zet — stuurt de bolletjes onderaan. */
  actief: number
  /** Plek van deze kaart in de rij; ontbreekt bij de ene kaart op laptop. */
  eigen?: number
  t: (tekst: Vertaald) => string
}) {
  return (
    <div
      className="flex h-full flex-col rounded-cone p-4 shadow-lift ring-1 ring-espresso-900/5 transition-colors duration-500 ease-soft"
      style={{ backgroundColor: item.tintHex }}
    >
      <div className="relative overflow-hidden rounded-scoop">
        <Foto src={item.image} alt={t(item.title)} className="aspect-4/3 w-full object-cover" />
        {/* Het nummer rolt mee zodra deze kaart de toon zet en de achtergrond
            van kleur wisselt. Op laptop staat er één kaart en wisselt het
            getal zelf; ook dan rolt hij. */}
        <span className="chunk absolute left-4 top-4 flex items-center gap-1 rounded-full bg-crema-50 px-4 py-1.5 text-[0.7rem] tabular-nums text-espresso-900">
          <RolCijfer waarde={item.number} actief={eigen === undefined ? undefined : eigen === actief} />
          <span aria-hidden="true">/ 0{moods.length}</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 px-2 pt-5">
        <p className="chunk text-[0.7rem] text-espresso-900/60">{t(item.label)}</p>
        <span
          className="size-3 rounded-full"
          style={{ backgroundColor: item.numberHex }}
          aria-hidden="true"
        />
      </div>

      {/* Vaste ruimte voor kop en tekst: een kaart met één regel minder hield
          anders een gat over voor de bolletjes, waardoor hij korter oogde dan
          zijn buren. `text-balance` en `text-pretty` houden bovendien het
          laatste woord van een alinea van zijn eentje af. */}
      <h3 className="mt-2 min-h-[3.75rem] px-2 font-display text-2xl leading-tight font-bold text-balance text-espresso-900">
        {t(item.title)}
      </h3>
      <p className="mt-2 min-h-[3.75rem] px-2 text-sm text-pretty text-espresso-900/70">
        {t(item.body)}
      </p>

      <ul className="mt-auto flex gap-2 px-2 pb-2 pt-6">
        {moods.map((stemming, i) => (
          <li
            key={stemming.number}
            className="size-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i === actief ? stemming.numberHex : 'rgb(29 8 5 / 0.2)' }}
          >
            <span className="sr-only">{t(stemming.label)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MoodsSection() {
  const { t } = useTaal()
  const [active, setActive] = useState(0)
  const kaartenRef = useRef<HTMLUListElement>(null)
  const vegenRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    // Twee rijen, één tegelijk in beeld: op telefoon veeg je door de
    // vitrinekaarten zelf, vanaf sm scrol je langs de genummerde rij.
    const breed = window.matchMedia('(min-width: 40rem)')

    let opruimen: (() => void) | null = null

    function koppel() {
      opruimen?.()
      opruimen = null

      const horizontaal = !breed.matches
      const rij = horizontaal ? vegenRef.current : kaartenRef.current
      const kaarten = rij?.querySelectorAll<HTMLElement>('li[data-index]')
      if (!rij || !kaarten?.length) return

      /**
       * Welke kaart je leest, rekenen we zelf uit in plaats van het aan een
       * waarnemer te vragen. Een waarnemer meldt alleen kaarten die net over
       * een drempel gingen; wat er tussenin gebeurt mist hij, en dan blijft de
       * vitrine op de eerste kaart staan terwijl je al lang verder bent.
       *
       * Zijwaarts telt de linkerrand van de rij, verticaal het midden van het
       * scherm — in beide gevallen wint de kaart die daar het dichtst bij ligt.
       */
      const meet = () => {
        const doel = horizontaal
          ? rij.getBoundingClientRect().left +
            (parseFloat(getComputedStyle(rij).scrollPaddingLeft) || 0)
          : window.innerHeight / 2

        if (horizontaal && rij.scrollLeft >= rij.scrollWidth - rij.clientWidth - 2) {
          setActive(kaarten.length - 1)
          return
        }

        let beste = { index: 0, afstand: Infinity }
        kaarten.forEach((kaart) => {
          const r = kaart.getBoundingClientRect()
          const hart = horizontaal ? r.left : r.top + r.height / 2
          const afstand = Math.abs(hart - doel)
          if (afstand < beste.afstand) {
            beste = { index: Number(kaart.dataset.index), afstand }
          }
        })
        setActive(beste.index)
      }

      meet()
      const bron: EventTarget = horizontaal ? rij : window
      bron.addEventListener('scroll', meet, { passive: true })
      opruimen = () => bron.removeEventListener('scroll', meet)
    }

    koppel()
    breed.addEventListener('change', koppel)
    return () => {
      breed.removeEventListener('change', koppel)
      opruimen?.()
    }
  }, [])

  const mood = moods[active]

  return (
    <section
      // Geen negatieve marges: deze sectie staat direct in <main> en niet in een
      // gevulde container, dus die trokken hem 48px breder dan het scherm — op
      // een telefoon kon je de pagina zijwaarts wegschuiven.
      className="pb-20 pt-16 transition-colors duration-700 ease-soft"
      style={{ backgroundColor: mood.wash }}
      aria-labelledby="stemmingen"
    >
      <div className="container-page">
        <Reveal y={16}>
          <div className="text-center">
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-crema-50 px-4 py-2 text-[0.7rem] text-pistacchio-700 shadow-lift">
              <Glyph name="blad" size={14} />
              {t(ui.homeStemmingenEyebrow)}
            </span>

            <h2
              id="stemmingen"
              className="mx-auto mt-5 max-w-2xl font-display text-title font-bold text-espresso-900"
            >
              {t(ui.homeStemmingenKop1)}{' '}
              <span className="text-espresso-900/45">{t(ui.homeStemmingenKop2)}</span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-espresso-900/70">
              {t(ui.homeStemmingenLead)}
            </p>

            {/* Het lepeltje proeven vóór je kiest, in het schrift van het logo.
                Blijft in alle talen hetzelfde: het is een uitdrukking, geen
                zin — net als de wordmark zelf. */}
            <span className="mt-8 block text-fragola-500">
              <HandGeschreven className="text-[clamp(1.8rem,5vw,3rem)]" tilt={-2}>
                Try before you buy
              </HandGeschreven>
            </span>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
          {/* De vitrinekaart. Op een telefoon is dit de hele sectie: je veegt
              er zelf doorheen en de achtergrond kleurt mee. Vanaf sm loopt de
              kaart mee met de rij ernaast, en blijft hij op laptop staan. */}
          <div className="min-w-0 lg:sticky lg:top-28">
            <Carrousel
              as="ul"
              label={t(ui.homeStemmingenEyebrow)}
              className="gap-4 sm:hidden"
              innerRef={(el) => {
                vegenRef.current = el as HTMLUListElement | null
              }}
            >
              {moods.map((item, i) => (
                <li key={item.number} data-index={i}>
                  <Vitrine item={item} actief={active} eigen={i} t={t} />
                </li>
              ))}
            </Carrousel>

            <div className="hidden sm:block">
              <Vitrine item={mood} actief={active} t={t} />
            </div>

            <div className="mt-4 px-2">
              <Button size="sm" variant="ghost" to="/smaken">
                {t(ui.homeKomProeven)}
              </Button>
            </div>
          </div>

          {/* de zes stemmingen: cijfer en iconen boven, beeld onder de tekst */}
          <ul className="hidden gap-6 sm:grid sm:auto-rows-fr" ref={kaartenRef}>
            {moods.map((item, i) => (
              <li
                key={item.number}
                data-index={i}
                style={{ backgroundColor: item.tintHex }}
                className={`rounded-cone p-6 ring-1 ring-espresso-900/5 transition-all duration-500 ease-soft sm:p-8 ${
                  i === active ? 'opacity-100' : 'opacity-90'
                }`}
              >
                <div className="flex items-center justify-between gap-6">
                  <RolCijfer
                    waarde={item.number}
                    actief={i === active}
                    className="font-chunk text-5xl leading-none"
                    style={{ color: item.numberHex }}
                  />

                  {/* Elk teken in een even groot vakje: de tekeningen vullen hun
                      viewBox verschillend, dus zonder vast vak hangen ze scheef. */}
                  <span className="flex items-center gap-2" style={{ color: item.numberHex }}>
                    {item.glyphs.map((glyph) => (
                      <span key={glyph} className="grid size-6 place-items-center">
                        <Glyph name={glyph} size={20} />
                      </span>
                    ))}
                  </span>
                </div>

                <h3 className="mt-4 max-w-lg font-display text-xl font-bold text-balance text-espresso-900 sm:text-2xl">
                  {t(item.title)}
                </h3>
                <p className="mt-3 max-w-lg text-pretty text-espresso-900/65">{t(item.body)}</p>

                <div className="mt-6 flex flex-wrap items-end gap-6">
                  <Foto
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    className="size-24 shrink-0 rounded-full object-cover ring-4 ring-crema-50 sm:size-28"
                  />

                  <div className="min-w-[12rem] flex-1">
                    <p className="chunk text-[0.7rem] sm:text-[0.6rem]" style={{ color: item.numberHex }}>
                      {t(item.chipLabel ?? ui.homeBesteSmaken)}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {smakenVan(item, t).map((naam) => (
                        <li
                          key={naam}
                          className="rounded-full bg-crema-50/75 px-3 py-1.5 text-sm font-medium text-espresso-900"
                        >
                          {naam}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
