import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Drip } from '@/components/Drip'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { platforms } from '@/data/contact'
import { Reveal } from '@/motion/Reveal'
import { Sprinkles } from '@/motion/Sprinkles'

export function Slot() {
  const { t } = useTaal()

  return (
    <>
      {/* ---------- afsluitende band, direct boven de footer ---------- */}
      {/* De golf ligt óver de sectie erboven en heeft de kleur van de band zelf;
          tussen de bobbels schijnt daardoor die sectie door, geen paginakleur. */}
      <div className="relative z-10 -mb-px -mt-10 sm:-mt-14">
        <Drip className="text-fragola-400" waves={5} heightClass="h-10 sm:h-14" flip />
      </div>

      <section className="relative overflow-hidden bg-fragola-400 text-crema-50">
        <Sprinkles columns={16} />

        <div className="container-page relative py-20 text-center sm:py-24">
          <Reveal y={20}>
            <h2 className="mx-auto max-w-2xl font-display text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              {t(ui.homeSlotKop)}
            </h2>

            <p className="chunk mt-5 text-[0.7rem] text-crema-50/75">
              {t(ui.homeSlotRegel)}
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button variant="ghostLight" to="/smaken">
                {t(ui.bekijkSmaken)}
                <Glyph name="pijl" size={15} />
              </Button>
              <Button variant="ghostLight" href={platforms.instagram}>
                {t(ui.homeVolgInstagram)}
                <Glyph name="pijl" size={15} />
              </Button>
            </div>
          </Reveal>
        </div>

      </section>
    </>
  )
}
