import { useState } from 'react'
import { Glyph } from '@/components/ui/Glyph'
import { Reveal } from '@/motion/Reveal'
import { Sprinkles } from '@/motion/Sprinkles'
import { ExpandingPanels } from '@/motion/ExpandingPanels'
import { HandGeschreven } from '@/motion/HandGeschreven'
import { panels } from '@/data/flavours'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

/**
 * De zes bakken van de vitrine, die openklappen als je erover gaat.
 *
 * Staat op de smakenpagina en op de homepage; daar zonder de handgeschreven
 * regel, want die staat er al een sectie hoger.
 */
export function AchterHetGlas({ handschrift = true }: { handschrift?: boolean }) {
  const { t } = useTaal()
  const [paneel, setPaneel] = useState(0)

  return (
    /* Licht vlak, zoals de secties op de homepage: het donkere blok brak de
       pagina hier middendoor. */
    <section
      className="relative mt-20 overflow-hidden py-20"
      style={{ backgroundColor: '#fbe9ee' }}
      aria-labelledby="vitrine-rij"
    >
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
              className="mx-auto mt-5 max-w-3xl font-display text-title font-bold text-espresso-900"
            >
              {t(ui.smakenGlasKop1)}{' '}
              <span className="text-fragola-700">{t(ui.smakenGlasKop2)}</span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-cacao-700">
              {t(ui.smakenGlasLead)}
            </p>

            {/* Het lepeltje proeven vóór je kiest, in het schrift van het logo.
                Op de homepage staat die regel al bij het ijs; twee keer vlak
                onder elkaar is één keer te veel. */}
            {handschrift && (
              <span className="mt-9 block text-fragola-500">
                <HandGeschreven className="text-[clamp(1.9rem,5.5vw,3.25rem)]">
                  Try before you buy
                </HandGeschreven>
              </span>
            )}
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

  )
}
