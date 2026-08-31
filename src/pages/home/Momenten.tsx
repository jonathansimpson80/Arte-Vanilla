import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Glyph } from '@/components/ui/Glyph'
import { moments } from '@/data/home'
import { Reveal } from '@/motion/Reveal'
import { Carrousel } from '@/components/ui/Carrousel'
import { Foto } from '@/components/ui/Foto'

export function Momenten() {
  const { t } = useTaal()

  return (
    <>
      {/* ---------- momenten ---------- */}
      {/**
       * Rustig groen vlak. Het streeppatroon stond hier eerst, maar met een
       * roze sectie erboven en het donkere reviewblok eronder werd dat te veel
       * tegelijk. Het vlak loopt door tot onder de ronde bovenrand van de
       * sectie hierna, zodat daar geen lichte balk tussen valt.
       */}
      <section className="relative py-16 lg:py-20" aria-labelledby="momenten">
        {/* De strepen lopen door tot onder de ronde bovenrand van de sectie
            hierna; die is `relative` en staat later in de DOM, dus hij dekt
            het overschot netjes af. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{ bottom: '-9rem', backgroundColor: '#eef4e4' }}
        />

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

          <Carrousel as="div" label={t(ui.homeStemmingenEyebrow)} className="mt-14 gap-6 sm:grid-cols-3 lg:grid-cols-5">
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
          </Carrousel>
          </div>
        </div>
      </section>
    </>
  )
}
