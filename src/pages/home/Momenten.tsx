import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { StripesBackground } from '@/components/StripesBackground'
import { Glyph } from '@/components/ui/Glyph'
import { moments } from '@/data/home'
import { Reveal } from '@/motion/Reveal'
import { Foto } from '@/components/ui/Foto'

export function Momenten() {
  const { t } = useTaal()

  return (
    <>
      {/* ---------- momenten ---------- */}
      {/**
       * Het streeppatroon uit het logo ligt eromheen, niet eronder.
       *
       * Een streep is een lijst, geen tafelblad: staat lopende tekst er direct
       * op, dan snijdt elke naad door een woord en gaat je oog daarover
       * struikelen. De inhoud krijgt daarom een eigen crèmevlak, en het
       * patroon blijft zichtbaar als rand — inclusief het stuk dat doorloopt
       * tot onder de ronde bovenrand van de sectie hierna.
       */}
      <section className="relative py-16 lg:py-20" aria-labelledby="momenten">
        {/* De strepen lopen door tot onder de ronde bovenrand van de sectie
            hierna; die is `relative` en staat later in de DOM, dus hij dekt
            het overschot netjes af. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
          style={{ bottom: '-9rem' }}
        >
          <StripesBackground />
        </div>

        <div className="container-page relative">
          <div className="rounded-cone bg-crema-50 px-6 py-14 shadow-lift ring-1 ring-espresso-900/5 sm:px-10 lg:px-14">
          <Reveal y={16}>
            <div className="text-center">
              <span className="chunk inline-flex items-center gap-2 rounded-full bg-fragola-400 px-4 py-2 text-[0.7rem] text-crema-50">
                <Glyph name="hart" size={14} />
                {t(ui.homeMomentenEyebrow)}
              </span>

              <h2
                id="momenten"
                className="mx-auto mt-6 max-w-xl font-display text-title font-bold leading-[1.05] text-espresso-900"
              >
                {t(ui.homeMomentenKop)}
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {moments.map((moment, i) => (
              <Reveal key={moment.image} y={26} scale={0.95} delay={i * 90}>
                <article className="group">
                  <div className="wiggle overflow-hidden rounded-scoop">
                    <Foto
                      src={moment.image}
                      alt={t(moment.title)}
                      className="aspect-4/5 w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-espresso-900">
                    {t(moment.title)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-espresso-900/60">
                    {t(moment.body)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          </div>
        </div>
      </section>
    </>
  )
}
