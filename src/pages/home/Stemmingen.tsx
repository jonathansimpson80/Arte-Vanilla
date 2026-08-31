import { useRef, useState, useEffect } from 'react'
import { useTaal, type Vertaald } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { Reveal } from '@/motion/Reveal'
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
export function MoodsSection() {
  const { t } = useTaal()
  const [active, setActive] = useState(0)
  const kaartenRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const rij = kaartenRef.current
    if (!rij) return

    // Onder sm is de rij een carrousel: dan schuiven de kaarten zijwaarts en
    // moet de vitrine meelopen met wat er horizontaal in beeld staat, niet met
    // hoe ver de pagina naar beneden is.
    const breed = window.matchMedia('(min-width: 40rem)')

    let observer: IntersectionObserver | null = null

    function koppel() {
      observer?.disconnect()
      const kaarten = rij?.querySelectorAll('li')
      if (!rij || !kaarten?.length) return

      const horizontaal = !breed.matches

      observer = new IntersectionObserver(
        (entries) => {
          // De kaart die het dichtst bij het midden staat, wint.
          const kader = horizontaal ? rij!.getBoundingClientRect() : null
          const midden = kader
            ? kader.left + kader.width / 2
            : window.innerHeight / 2
          let beste = { index: -1, afstand: Infinity }

          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const index = Number((entry.target as HTMLElement).dataset.index)
            const rect = entry.boundingClientRect
            const hart = horizontaal
              ? rect.left + rect.width / 2
              : rect.top + rect.height / 2
            const afstand = Math.abs(hart - midden)
            if (afstand < beste.afstand) beste = { index, afstand }
          })

          if (beste.index >= 0) setActive(beste.index)
        },
        horizontaal
          ? { root: rij, threshold: 0.6 }
          : { threshold: 0.4, rootMargin: '-15% 0px -15% 0px' },
      )

      kaarten.forEach((kaart) => observer!.observe(kaart))
    }

    koppel()
    breed.addEventListener('change', koppel)
    return () => {
      breed.removeEventListener('change', koppel)
      observer?.disconnect()
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
          {/* vaste kaart die meeloopt met de rij in beeld */}
          <div className="lg:sticky lg:top-28">
            <div
              className="rounded-cone p-4 shadow-lift ring-1 ring-espresso-900/5 transition-colors duration-500 ease-soft"
              style={{ backgroundColor: mood.tintHex }}
            >
              <div className="relative overflow-hidden rounded-scoop">
                <Foto
                  src={mood.image}
                  alt={t(mood.title)}
                  className="aspect-4/3 w-full object-cover"
                />
                <span className="chunk absolute left-4 top-4 rounded-full bg-crema-50 px-4 py-2 text-[0.7rem] tabular-nums text-espresso-900">
                  {mood.number} / 0{moods.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-2 pt-5">
                <p className="chunk text-[0.7rem] text-espresso-900/60">{t(mood.label)}</p>
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: mood.numberHex }}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-2 px-2 font-display text-2xl font-bold text-espresso-900">
                {t(mood.title)}
              </h3>
              <p className="mt-2 px-2 text-sm text-espresso-900/70">{t(mood.body)}</p>

              <ul className="flex gap-2 px-2 pb-2 pt-6">
                {moods.map((item, i) => (
                  <li
                    key={item.number}
                    className="size-2 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: i === active ? item.numberHex : 'rgb(29 8 5 / 0.2)',
                    }}
                  >
                    <span className="sr-only">{t(item.label)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 px-2">
              <Button size="sm" variant="ghost" to="/smaken">
                {t(ui.homeKomProeven)}
              </Button>
            </div>
          </div>

          {/* de zes stemmingen: cijfer en iconen boven, beeld onder de tekst */}
          <ul className="carrousel gap-6" ref={kaartenRef}>
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
                  <span
                    className="font-chunk text-5xl leading-none"
                    style={{ color: item.numberHex }}
                  >
                    {item.number}
                  </span>

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

                <h3 className="mt-4 max-w-lg font-display text-xl font-bold text-espresso-900 sm:text-2xl">
                  {t(item.title)}
                </h3>
                <p className="mt-3 max-w-lg text-espresso-900/65">{t(item.body)}</p>

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
