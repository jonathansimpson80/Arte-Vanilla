import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Glyph } from '@/components/ui/Glyph'
import { DrawnLine } from '@/motion/DrawnLine'
import { ImageReveal } from '@/motion/ImageReveal'
import { Reveal } from '@/motion/Reveal'

export function Ambacht() {
  const { t } = useTaal()

  return (
    <>
      {/* ---------- de textuur van de zaak ---------- */}
      <section
        className="relative overflow-hidden pt-28 lg:pt-32"
        style={{ backgroundColor: '#fbe6e8' }}
        aria-labelledby="ambacht"
      >
        <DrawnLine
          className="pointer-events-none absolute left-[26%] right-[6%] top-0 hidden md:block"
          stroke="rgb(140 59 54 / 0.38)"
          dot="#f4cf64"
        />

        <div className="container-page relative grid items-end gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className="pb-24">
            <Reveal y={16}>
              <span className="chunk inline-flex items-center gap-2 rounded-full bg-fragola-400 px-4 py-2 text-[0.7rem] text-crema-50">
                <Glyph name="druppel" size={14} />
                {t(ui.homeAmbachtEyebrow)}
              </span>
            </Reveal>

            <Reveal y={20} delay={80}>
              <h2
                id="ambacht"
                className="mt-6 max-w-lg font-display text-title font-bold text-espresso-900"
              >
                {t(ui.homeAmbachtKop)}
              </h2>
            </Reveal>

            <Reveal y={16} delay={160}>
              <p className="mt-5 max-w-md text-lead text-espresso-900/70">
                {t(ui.homeAmbachtLead)}
              </p>
            </Reveal>

            <Reveal y={16} delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  ui.homeKenmerk1,
                  ui.homeKenmerk2,
                  ui.homeKenmerk3,
                ].map((kenmerk) => (
                  <span
                    key={kenmerk.nl}
                    className="whitespace-nowrap rounded-full bg-crema-50 px-3.5 py-1.5 text-[0.75rem] font-medium text-espresso-900 shadow-lift"
                  >
                    {t(kenmerk)}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Loopt met de onderkant tegen de sectierand aan, dus daar geen
              ronding; bovenaan zacht gebogen hoeken in plaats van een halve cirkel. */}
          <ImageReveal
            src="/media/beker-wafel.jpg"
            alt="Bakje gelato met een wafel erop"
            className="mx-auto aspect-[7/6] w-full max-w-[26rem] self-end rounded-[4rem_4rem_0_0]"
          />
        </div>
      </section>
    </>
  )
}
