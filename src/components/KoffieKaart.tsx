import { Reveal } from '@/motion/Reveal'
import { ImageReveal } from '@/motion/ImageReveal'
import { extras, koffie } from '@/data/koffie'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

/**
 * De koffiekaart. Stond eerst op een eigen pagina, maar zes dranken zonder
 * prijs droegen geen navigatie-item. Hij hoort naast de dolci — dat is ook
 * hoe de zaak zichzelf noemt: gelato, dolci & caffè.
 */
export function KoffieKaart() {
  const { t } = useTaal()

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
      <ImageReveal
        src="/media/affogato.jpg"
        alt="Espresso wordt over een bol gelato geschonken"
        // Op breed scherm rekt het beeld mee met de kolom ernaast: het raster staat
        // op `items-stretch`, dus `h-full` levert precies de hoogte van de tekst.
        className="aspect-[4/5] rounded-cone sm:aspect-[16/11] lg:aspect-auto lg:h-full"
      />

      <div>
        <Reveal y={16}>
          <span className="chunk inline-flex items-center gap-2 rounded-full bg-cacao-700/12 px-4 py-2 text-[0.7rem] text-cacao-700">
            {t(ui.koffieEyebrow)}
          </span>
          <h2 id="koffie" className="mt-5 font-display text-title font-bold text-espresso-900">
            {t(ui.koffieKop)}
          </h2>
          <p className="mt-4 max-w-md text-lead text-cacao-700">{t(ui.koffieLead)}</p>
        </Reveal>

        <ul className="mt-8 grid gap-3">
          {koffie.map((drank, i) => (
            <Reveal key={drank.name.nl} y={18} delay={i * 60}>
              <li className="flex items-baseline justify-between gap-6 rounded-scoop bg-crema-100 px-6 py-5 ring-1 ring-espresso-900/5">
                <span className="min-w-0">
                  <span className="block font-display text-xl font-bold text-espresso-900">
                    {t(drank.name)}
                  </span>
                  <span className="mt-1 block text-sm text-espresso-900/65">
                    {t(drank.description)}
                  </span>
                </span>

                <span className="chunk shrink-0 tabular-nums text-espresso-900/45">
                  {drank.price === null ? '—' : `€ ${drank.price.toFixed(2).replace('.', ',')}`}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal y={16} delay={200}>
          <div className="mt-6 rounded-scoop border border-dashed border-espresso-900/25 p-6">
            <p className="chunk text-[0.72rem] sm:text-[0.65rem] text-cacao-700">{t(ui.koffieVerder)}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {extras.map((extra) => (
                <li
                  key={extra.nl}
                  className="rounded-full bg-crema-100 px-4 py-2 text-sm text-espresso-900/75"
                >
                  {t(extra)}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
