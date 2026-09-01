import { Drip } from '@/components/Drip'
import { Reveal } from '@/motion/Reveal'
import { Carrousel } from '@/components/ui/Carrousel'
import { deals } from '@/data/deals'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Foto } from '@/components/ui/Foto'

/**
 * De vaste combinatiedeals van de kaart. Stonden eerst op een eigen pagina;
 * vijf deals dragen geen navigatie-item, maar onder het gebak staan ze precies
 * waar iemand ze zoekt.
 */
export function DealsRij() {
  const { t } = useTaal()

  return (
    <div>
      <Reveal y={16}>
        <div className="text-center">
          <span className="chunk inline-flex items-center gap-2 rounded-full bg-fragola-400 px-4 py-2 text-[0.7rem] text-crema-50">
            {t(ui.aanbiedingEyebrow)}
          </span>
          <h2
            id="deals"
            className="mx-auto mt-5 max-w-2xl font-display text-title font-bold text-espresso-900"
          >
            {t(ui.aanbiedingKop)}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-cacao-700">{t(ui.aanbiedingLead)}</p>
        </div>
      </Reveal>

      <Carrousel as="ul" label={t(ui.aanbiedingEyebrow)} className="mt-12 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal, i) => (
          <Reveal key={deal.name.nl} y={24} scale={0.96} delay={(i % 3) * 90}>
            <li
              className="flex h-full flex-col overflow-hidden rounded-cone ring-1 ring-espresso-900/5"
              style={{ backgroundColor: deal.tintHex }}
            >
              <div className="relative">
                {deal.image ? (
                  <Foto
                    src={deal.image}
                    alt={t(deal.name)}
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  /* Geen eigen foto: het streeppatroon met de naam erin, net
                     als bij de smaken. Zo houdt elke kaart in de rij dezelfde
                     opbouw en valt er geen gat waar het beeld hoort. */
                  <div className="stripes-soft flex aspect-[16/10] items-center justify-center px-6">
                    <span
                      className="wordmark text-center text-4xl opacity-60"
                      style={{ color: deal.accentHex }}
                    >
                      {t(deal.name)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0" style={{ color: deal.tintHex }}>
                  <Drip className="" flip waves={4} heightClass="h-5" />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="chunk text-[0.72rem] sm:text-[0.65rem]" style={{ color: deal.accentHex }}>
                      {deal.aantal} {t(ui.aanbiedingStuks)}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-espresso-900">
                      {deal.aantal} × {t(deal.name)}
                    </h3>
                  </div>

                  <span
                    className="chunk shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.7rem] tabular-nums text-crema-50"
                    style={{ backgroundColor: deal.accentHex }}
                  >
                    € {deal.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-espresso-900/70">
                  {t(deal.description)}
                </p>

                {deal.keuzes && (
                  <div className="mt-5">
                    <p className="chunk text-[0.7rem] sm:text-[0.6rem] text-espresso-900/45">
                      {t(ui.aanbiedingKeuze)}
                    </p>
                    <ul className="mt-2.5 flex flex-wrap gap-2">
                      {deal.keuzes.map((keuze) => (
                        <li
                          key={keuze}
                          className="rounded-full bg-crema-50/80 px-3 py-1.5 text-xs font-medium text-espresso-900/75"
                        >
                          {keuze}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-6 border-t border-dashed border-espresso-900/25 pt-4 text-xs tabular-nums text-espresso-900/50">
                  € {(deal.price / deal.aantal).toFixed(2).replace('.', ',')}{' '}
                  {t(ui.aanbiedingPerStuk)}
                </p>
              </div>
            </li>
          </Reveal>
        ))}

        {/* Zesde plek in het raster. Er zijn vijf echte deals en een verzonnen
            zesde is geen optie, dus staat hier de uitnodiging die de zaak aan
            de toonbank ook doet. */}
        <Reveal y={24} scale={0.96} delay={180}>
          {/* Het streeppatroon uit het logo op volle sterkte, zonder waas
              eroverheen. Espresso haalt 12,8:1 op het geel en 18,7:1 op de
              crème ertussen, dus de tekst blijft leesbaar; de strepen lopen
              alleen wel dwars achter de regels door. */}
          <li className="relative flex h-full flex-col justify-center overflow-hidden rounded-cone p-7 ring-1 ring-espresso-900/5">
            <span className="stripes absolute inset-0" aria-hidden="true" />
            <span className="relative block">
            <span className="chunk text-[0.72rem] sm:text-[0.65rem]" style={{ color: '#8f5720' }}>
              {t(ui.dealsMeerEyebrow)}
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold text-espresso-900">
              {t(ui.dealsMeerKop)}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-espresso-900/70">
              {t(ui.dealsMeerLead)}
            </p>

            <span className="mt-6 flex items-center gap-2 border-t border-dashed border-espresso-900/25 pt-4 text-xs text-espresso-900/50">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: '#8f5720' }}
                aria-hidden="true"
              />
              {t(ui.vraagInWinkel)}
            </span>
            </span>
          </li>
        </Reveal>
      </Carrousel>

      <Reveal y={14} delay={120}>
        <p className="mt-8 text-center text-sm text-espresso-900/55">{t(ui.aanbiedingPrijsNoot)}</p>
      </Reveal>
    </div>
  )
}
