import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { StripesBackground } from '@/components/StripesBackground'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { Reveal } from '@/motion/Reveal'
import { Sprinkles } from '@/motion/Sprinkles'
import { Typewriter } from '@/motion/Typewriter'
import { Link } from 'react-router'

export function Hero() {
  const { t, pad } = useTaal()

  return (
    <>
      {/* ---------- hero ---------- */}
      {/* Loopt door tot de bovenrand van de pagina: de header zweeft eroverheen,
          dus het streeppatroon moet daarachter doorlopen. De 88px die we omhoog
          gaan (headerhoogte plus zijn marge) komen als padding terug. */}
      <section className="relative -mt-22 overflow-hidden pb-20 pt-32 sm:pt-36">
        <StripesBackground scrim />
        <Sprinkles columns={30} />

        {/* draaiend insigne */}
        <div className="pointer-events-none absolute right-20 top-24 hidden lg:block">
          <div className="badge-spin relative size-28 rounded-full border-2 border-dashed border-fragola-500/40" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full bg-fragola-500/12">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b4544c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 10a4 4 0 1 1 8 0" />
                <path d="M6.5 10h11l-4.6 10.2a1 1 0 0 1-1.8 0L6.5 10Z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="container-page relative text-center">
          <Reveal y={14}>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="chunk inline-flex items-center gap-2 rounded-full bg-crema-200 px-4 py-2 text-[0.7rem] text-espresso-900">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {t(ui.heroEyebrow)}
              </span>
              <span className="chunk rounded-full bg-fragola-500/15 px-4 py-2 text-[0.7rem] text-fragola-700">
                {t(ui.chipGelato)}
              </span>
            </div>
          </Reveal>

          <Reveal y={24} delay={80}>
            {/*
              Hoogte van drie regels vastgezet (3 × 0.95em regelafstand). Het
              Italiaans past op twee regels waar het Nederlands er drie nodig
              heeft; zonder deze reservering verspringt de hele pagina zodra je
              van taal wisselt. De kop staat binnen die ruimte gecentreerd.
            */}
            <h1 className="mx-auto mt-8 grid min-h-[2.85em] max-w-[14ch] place-items-center font-display text-display font-bold leading-[0.95] text-espresso-900">
              <span>
                {t(ui.heroKop1)} <span className="text-fragola-500">{t(ui.heroKopAccent)}</span>{' '}
                {t(ui.heroKop2)}{' '}
                <Typewriter
                  words={[t(ui.heroWoord1), t(ui.heroWoord2), t(ui.heroWoord3)]}
                  className="whitespace-nowrap"
                />
              </span>
            </h1>
          </Reveal>

          <Reveal y={16} delay={160}>
            <p className="mx-auto mt-8 max-w-xl text-lead text-cacao-700">
              {t(ui.heroLead)}
            </p>
          </Reveal>

          <Reveal y={16} delay={240}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button variant="accent" to="/#bezoek">
                {t(ui.routeEnAdres)}
                <Glyph name="pijl" size={15} />
              </Button>
              <Button variant="ghost" to="/smaken">
                {t(ui.bekijkSmaken)}
                <Glyph name="pijl" size={15} />
              </Button>
              <Button variant="ghost" to="/afhalen">
                {t(ui.navAfhalen)}
                <Glyph name="pijl" size={15} />
              </Button>
            </div>
          </Reveal>

          <Reveal y={14} delay={320}>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                { label: ui.chipGelato, glyph: 'hoorntje' as const, naar: '/smaken' },
                { label: ui.chipDolci, glyph: 'sprankel' as const, naar: '/dolci' },
              ].map((chip) => (
                <Link
                  key={chip.glyph}
                  to={pad(chip.naar)}
                  className="inline-flex items-center gap-2 rounded-full bg-crema-50 px-4 py-3 text-sm font-medium text-espresso-900 ring-[1.5px] ring-espresso-900/15 transition-colors duration-200 ease-soft hover:bg-crema-100 sm:py-2"
                >
                  <span className="text-caramello-500">
                    <Glyph name={chip.glyph} size={15} />
                  </span>
                  {t(chip.label)}
                </Link>
              ))}
            </div>
          </Reveal>

        </div>
      </section>
    </>
  )
}
