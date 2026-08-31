import { useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { Seo } from '@/lib/seo'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { Drip } from '@/components/Drip'
import { Reveal } from '@/motion/Reveal'
import { Marquee } from '@/motion/Marquee'
import { StripesBackground } from '@/components/StripesBackground'
import { Sprinkles } from '@/motion/Sprinkles'
import { ExpandingPanels } from '@/motion/ExpandingPanels'
import { FlipCard } from '@/motion/FlipCard'
import { HandGeschreven } from '@/motion/HandGeschreven'
import { BakkenVoorThuis } from '@/components/BakkenVoorThuis'
import { useVandaag } from '@/data/vandaag'
import { Foto } from '@/components/ui/Foto'
import {
  categoryLabels,
  tagLabels,
  categories,
  families,
  flavours,
  guides,
  panels,
  type Category,
} from '@/data/flavours'

export function Flavours() {
  const { t } = useTaal()
  const vandaag = useVandaag()
  const [paneel, setPaneel] = useState(0)
  const [params, setParams] = useSearchParams()
  const actief = params.get('categorie') as Category | null
  const zichtbaar = actief ? flavours.filter((f) => f.category === actief) : flavours

  function kies(categorie: Category | null) {
    setParams(categorie ? { categorie } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <Seo
        title="Smaken"
        description="Het gelato, sorbet, dolci en caffè van Arte Vanilla. De vitrine wisselt dagelijks."
      />

      {/* ---------- kop ---------- */}
      <section className="relative -mt-22 overflow-hidden pb-16 pt-34 sm:pt-38">
        <StripesBackground scrim />

        <div className="container-page relative text-center">
          <Reveal y={14}>
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-crema-50 px-4 py-2 text-[0.7rem] text-cacao-700 shadow-lift">
              <Glyph name="hoorntje" size={14} />
              De kaart
            </span>
          </Reveal>

          <Reveal y={22} delay={80}>
            <h1 className="mx-auto mt-6 max-w-[16ch] font-display text-display font-bold text-espresso-900">
              {t(ui.smakenKop)}
            </h1>
          </Reveal>

          <Reveal y={16} delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-lead text-cacao-700">
              Twaalf smaken op het bord, in drie rijen: fruit bovenaan, crème in het
              midden, en onderin de zwaardere met noten of chocolade.
            </p>
          </Reveal>

          <Reveal y={16} delay={240}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="accent" to="/afhalen">
                {t(ui.bakSamenstellen)}
                <Glyph name="pijl" size={15} />
              </Button>
              <Button variant="ghost" to="/#bezoek">
                {t(ui.routeEnAdres)}
                <Glyph name="telefoon" size={15} />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- ticker ---------- */}
      <section className="relative z-10">
        <div className="relative bg-fragola-400 py-5">
          <Marquee speed={70}>
            {['Gelato', 'Sorbet', 'Dolci', 'Caffè', 'Affogato', 'Cannoli'].map((woord) => (
              <span key={woord} className="flex items-center gap-10 px-10">
                <span className="chunk text-xl text-crema-50 sm:text-3xl">{woord}</span>
                <span className="text-crema-50/60">
                  <Glyph name="sprankel" size={18} />
                </span>
              </span>
            ))}
          </Marquee>

          <div
            className="pointer-events-none absolute inset-x-0"
            style={{ top: 'calc(100% - 1px)' }}
          >
            <Drip className="text-fragola-400" />
          </div>
        </div>
      </section>

      {/* ---------- filters en kaarten ---------- */}
      <section className="container-page pt-20" aria-labelledby="kaart">
        <Reveal y={16}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 id="kaart" className="font-display text-title font-bold text-espresso-900">
                {t(ui.smakenHeleKaart)}
              </h2>
              <p className="mt-2 text-cacao-700">
                {zichtbaar.length}/{flavours.length} · {t(ui.smakenAltijdTwaalf)}
              </p>

              {/* Als een notitie in de kantlijn bij het bord. */}
              <span className="mt-5 block text-fragola-500">
                <HandGeschreven className="text-[clamp(1.5rem,4vw,2.25rem)]" tilt={-1.5}>
                  Try before you buy
                </HandGeschreven>
              </span>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter op categorie">
              <FilterKnop actief={actief === null} onClick={() => kies(null)}>
                {t(ui.smakenAlles)}
              </FilterKnop>
              {categories.map((categorie) => (
                <FilterKnop
                  key={categorie}
                  actief={actief === categorie}
                  onClick={() => kies(categorie)}
                >
                  {t(categoryLabels[categorie])}
                </FilterKnop>
              ))}
            </div>
          </div>
        </Reveal>

        <p aria-live="polite" className="sr-only">
          {zichtbaar.length} {t(ui.smakenZichtbaar)}
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {zichtbaar.map((smaak, i) => (
            <Reveal key={smaak.name} y={24} scale={0.96} delay={(i % 3) * 90}>
              <li
                className="flex h-full flex-col overflow-hidden rounded-cone ring-1 ring-espresso-900/5"
                style={{ backgroundColor: smaak.tintHex }}
              >
                {smaak.image ? (
                  <Foto
                    src={smaak.image}
                    alt={smaak.name}
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  /* Geen eigen foto: het streeppatroon uit het logo, met de naam
                     erin. Zelfde oplossing als op de gebakpagina, en beter dan
                     een foto van een andere smaak. */
                  <div className="stripes-soft flex aspect-[16/10] items-center justify-center px-6">
                    <span
                      className="wordmark text-center text-4xl opacity-60"
                      style={{ color: smaak.accentHex }}
                    >
                      {smaak.naam ? t(smaak.naam) : smaak.name}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="chunk text-[0.72rem] sm:text-[0.65rem]" style={{ color: smaak.accentHex }}>
                      {t(categoryLabels[smaak.category])}
                    </p>
                    {vandaag?.smaken.includes(smaak.name) && (
                      <span className="chunk rounded-full bg-pistacchio-400/35 px-2.5 py-1 text-[0.66rem] sm:text-[0.55rem] text-pistacchio-700">
                        {t(ui.vandaagInVitrine)}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-espresso-900">
                    {smaak.naam ? t(smaak.naam) : smaak.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-espresso-900/70">
                    {t(smaak.description)}
                  </p>

                  {smaak.tags.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {smaak.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-crema-50 px-3 py-1.5 text-xs font-medium text-espresso-900/70"
                        >
                          {t(tagLabels[tag])}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        {zichtbaar.length === 0 && (
          <p className="py-16 text-center text-cacao-700">{t(ui.smakenLeeg)}</p>
        )}
      </section>

      {/* ---------- achter het glas ---------- */}
      <section className="relative mt-20 overflow-hidden bg-espresso-900 py-20" aria-labelledby="vitrine-rij">
        <Sprinkles columns={12} />

        <div className="container-page relative">
          <Reveal y={16}>
            <div className="text-center">
              <span className="chunk inline-flex items-center gap-2 rounded-full bg-fragola-400 px-4 py-2 text-[0.7rem] text-crema-50">
                <Glyph name="hoorntje" size={14} />
                {t(ui.smakenGlasEyebrow)}
              </span>

              <h2
                id="vitrine-rij"
                className="mx-auto mt-5 max-w-3xl font-display text-title font-bold text-crema-50"
              >
                {t(ui.smakenGlasKop1)}{' '}
                <span className="text-fragola-400">{t(ui.smakenGlasKop2)}</span>
              </h2>

              <p className="mx-auto mt-4 max-w-md text-crema-200/75">
                {t(ui.smakenGlasLead)}
              </p>

              {/* Het lepeltje proeven vóór je kiest, in het schrift van het
                  logo. Blijft in alle talen hetzelfde: het is een uitdrukking,
                  geen zin — net als de wordmark zelf. */}
              <span className="mt-9 block text-vaniglia-400">
                <HandGeschreven className="text-[clamp(1.9rem,5.5vw,3.25rem)]">
                  Try before you buy
                </HandGeschreven>
              </span>
            </div>
          </Reveal>

          <Reveal y={22} delay={120}>
            <div className="mt-12 rounded-cone bg-crema-50 p-3 sm:p-4">
              <ExpandingPanels panels={panels} onChange={setPaneel} />

              {/* Voortgang: laat zien hoeveel van de rij je hebt gehad. */}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-espresso-900/10">
                <div
                  className="h-full rounded-full bg-fragola-400 transition-[width] duration-500 ease-soft"
                  style={{ width: `${((paneel + 1) / panels.length) * 100}%` }}
                />
              </div>
            </div>
          </Reveal>

          <Reveal y={14} delay={200}>
            <p className="mx-auto mt-8 w-fit rounded-full bg-crema-50 px-5 py-2.5 text-center text-sm text-espresso-900">
              {t(ui.vitrineWisselt)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- smaakfamilies: flip-kaarten ---------- */}
      <section className="container-page pt-24" aria-labelledby="families">
        <Reveal y={16}>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <span className="chunk inline-flex items-center gap-2 rounded-full bg-pistacchio-500/25 px-4 py-2 text-[0.7rem] text-pistacchio-700">
                <Glyph name="blad" size={14} />
                {t(ui.smakenFamiliesEyebrow)}
              </span>
              <h2
                id="families"
                className="mt-5 max-w-xl font-display text-title font-bold text-espresso-900"
              >
                {t(ui.smakenFamiliesKop)}
              </h2>
            </div>

            <p className="text-cacao-700 lg:text-right">
              {t(ui.smakenFamiliesLead)}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((familie, i) => (
            <Reveal key={familie.id} y={24} scale={0.96} delay={(i % 3) * 90}>
              <FlipCard family={familie} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- keuzehulp ---------- */}
      <section className="container-page pt-24" aria-labelledby="kiezen">
        <Reveal y={16}>
          <div className="text-center">
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-fragola-400 px-4 py-2 text-[0.7rem] text-crema-50">
              <Glyph name="sprankel" size={14} />
              Hoe kies je
            </span>
            <h2
              id="kiezen"
              className="mx-auto mt-5 max-w-2xl font-display text-title font-bold text-espresso-900"
            >
              Zeg wat je zoekt. Wij wijzen.
            </h2>
          </div>
        </Reveal>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-3">
          {guides.map((gids, i) => (
            <Reveal key={gids.id} y={18} delay={i * 70}>
              <li className="flex flex-wrap items-center gap-4 rounded-full border border-dashed border-espresso-900/20 bg-crema-100 px-4 py-3">
                <span
                  className="rounded-full px-4 py-2 text-sm font-medium text-crema-50"
                  style={{ backgroundColor: gids.color }}
                >
                  {t(gids.label)}
                </span>
                <span className="text-sm text-espresso-900/75">{t(gids.line)}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- voorbehoud ---------- */}
      <section className="container-page pt-16">
        <Reveal y={18}>
          <div className="rounded-cone bg-crema-100 p-8 ring-1 ring-espresso-900/5 sm:p-10">
            <p className="chunk text-[0.7rem] text-fragola-700">{t(ui.letOp)}</p>
            <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold text-espresso-900">
              {t(ui.smakenVoorbehoudKop)}
            </h2>
            <p className="mt-3 max-w-2xl text-cacao-700">
              {t(ui.smakenVoorbehoudLead)}
            </p>
          </div>
        </Reveal>
      </section>


      {/* ---------- bakken voor thuis ---------- */}
      <section className="container-page pt-24">
        <BakkenVoorThuis />
      </section>

      {/* ---------- marquee boven de footer ---------- */}
      {/* Tekst hoog in de band, en daaronder groen dat leeg blijft: daar valt
          de schulprand van de footer overheen zonder de woorden te raken. */}
      <section className="mt-20 bg-pistacchio-400 pb-16 pt-4">
        <Marquee speed={95}>
          {families.map((familie) => (
            <span key={familie.id} className="flex items-center gap-7 px-7">
              {/* Woorden in het script uit het logo. Espresso haalt 8,22:1 op dit groen. */}
              <span className="wordmark pb-1 text-3xl text-espresso-900 sm:text-4xl">
                {t(familie.name)}
              </span>
              <span className="size-1.5 rounded-full bg-espresso-900/35" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </section>
    </>
  )
}

function FilterKnop({
  actief,
  onClick,
  children,
}: {
  actief: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actief}
      className={`chunk rounded-full px-4 py-3.5 text-[0.7rem] transition-colors duration-200 sm:py-2.5 ${
        actief
          ? 'bg-espresso-900 text-crema-50'
          : 'text-espresso-900 ring-[1.5px] ring-espresso-900/20 hover:bg-crema-100'
      }`}
    >
      {children}
    </button>
  )
}