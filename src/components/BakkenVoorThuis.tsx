import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { Reveal } from '@/motion/Reveal'
import { Carrousel } from '@/components/ui/Carrousel'
import { bakken } from '@/data/thuis'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

/**
 * Blok met de drie bakformaten. Staat op meerdere pagina's, dus als los
 * component in plaats van twee keer dezelfde opmaak.
 */
export function BakkenVoorThuis({ compact = false }: { compact?: boolean }) {
  const { t } = useTaal()

  return (
    <div>
      <Reveal y={16}>
        <div className={compact ? '' : 'text-center'}>
          <span className="chunk inline-flex items-center gap-2 rounded-full bg-vaniglia-400 px-4 py-2 text-[0.7rem] text-espresso-900">
            <Glyph name="ster" size={14} />
            {t(ui.bakkenEyebrow)}
          </span>

          <h2
            className={`mt-5 font-display text-title font-bold text-espresso-900 ${
              compact ? 'max-w-lg' : 'mx-auto max-w-2xl'
            }`}
          >
            {t(ui.bakkenKop)}
          </h2>

          <p
            className={`mt-4 text-lead text-cacao-700 ${
              compact ? 'max-w-md' : 'mx-auto max-w-xl'
            }`}
          >
            {t(ui.bakkenLead)}
          </p>
        </div>
      </Reveal>

      <Carrousel as="ul" label={t(ui.bakkenEyebrow)} className="mt-12 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {bakken.map((bak, i) => (
          <Reveal key={bak.name} y={24} scale={0.96} delay={i * 90}>
            <li
              className="flex h-full flex-col rounded-cone p-7 ring-1 ring-espresso-900/5"
              style={{ backgroundColor: bak.tintHex }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-bold text-espresso-900">{bak.name}</h3>
                <span className="chunk tabular-nums text-espresso-900/45">
                  € {bak.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <p className="chunk mt-2 text-[0.72rem] sm:text-[0.65rem]" style={{ color: bak.accentHex }}>
                {bak.formaat}
              </p>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-espresso-900/70">
                {t(bak.description)}
              </p>

              <p className="mt-6 flex items-center gap-2 border-t border-dashed border-espresso-900/25 pt-4 text-sm text-espresso-900/60">
                <span
                  className="chunk grid size-6 shrink-0 place-items-center rounded-full text-[0.7rem] text-crema-50"
                  style={{ backgroundColor: bak.accentHex }}
                  aria-hidden="true"
                >
                  {bak.maxSmaken}
                </span>
                {t(ui.bakSmaken)}
              </p>
            </li>
          </Reveal>
        ))}
      </Carrousel>

      <Reveal y={14} delay={160}>
        <p
          className={`mt-7 text-sm italic text-espresso-900/55 ${compact ? '' : 'text-center'}`}
        >
          {t(ui.bakkenMeenemen)}
        </p>
      </Reveal>

      <Reveal y={16} delay={200}>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="accent" to="/afhalen">
            {t(ui.bakSamenstellen)}
            <Glyph name="pijl" size={15} />
          </Button>
          <Button variant="ghost" to="/smaken">
            {t(ui.bekijkTwaalf)}
          </Button>
        </div>
      </Reveal>
    </div>
  )
}
