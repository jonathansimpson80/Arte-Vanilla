import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { beoordeling } from '@/data/contact'
import { reviews, veelGenoemd } from '@/data/reviews'
import { Reveal } from '@/motion/Reveal'
import { Sprinkles } from '@/motion/Sprinkles'
import { VerticalMarquee } from '@/motion/VerticalMarquee'

export function Reviews() {
  const { t } = useTaal()

  return (
    <>
      {/* ---------- reviews: drie kolommen die langzaam langsschuiven ---------- */}
      <section
        className="relative overflow-hidden bg-espresso-900 py-24 text-crema-50"
        style={{ borderRadius: '50% 50% 0 0 / 5rem 5rem 0 0' }}
        aria-labelledby="reviews"
      >
        <Sprinkles columns={10} />

        <div className="container-page relative">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal y={16}>
              <span className="chunk inline-flex items-center gap-2 rounded-full bg-crema-50/10 px-4 py-2 text-[0.7rem] text-crema-50">
                <Glyph name="aanhaling" size={14} />
                {t(ui.homeReviewsEyebrow)}
              </span>
            </Reveal>

            <Reveal y={20} delay={80}>
              <div className="mt-8 flex items-end justify-center gap-5">
                <p className="font-chunk text-[clamp(4rem,10vw,7rem)] leading-none text-crema-50">
                  {beoordeling.score.toFixed(1).replace('.', ',')}
                </p>
                <div className="pb-3 text-left">
                  <span className="flex gap-1.5" aria-hidden="true">
                    {['#f4cf64', '#f4cf64', '#f4cf64', '#f4cf64', '#f4cf64'].map((kleur, i) => (
                      <span
                        key={i}
                        className="size-3.5 rounded-full"
                        style={{ backgroundColor: kleur }}
                      />
                    ))}
                  </span>
                  <p className="mt-2.5 text-sm text-crema-200/75">
                    {beoordeling.aantal} {t(ui.reviewsAantal)} · {beoordeling.bron}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal y={16} delay={160}>
              <h2 id="reviews" className="mt-6 font-display text-title font-bold text-crema-50">
                {t(ui.homeReviewsKop)}
              </h2>
            </Reveal>

            {/* Waar gasten het uit zichzelf het vaakst over hebben. */}
            <Reveal y={14} delay={220}>
              <ul className="mt-7 flex flex-wrap justify-center gap-2">
                {veelGenoemd.map((item) => (
                  <li
                    key={item.woord}
                    className="inline-flex items-center gap-2 rounded-full bg-crema-50/10 px-4 py-2 text-sm text-crema-50/85"
                  >
                    {item.woord}
                    <span className="chunk text-[0.72rem] sm:text-[0.65rem] text-vaniglia-400">{item.aantal}×</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Drie kolommen, elk op een eigen tempo en richting. */}
          <div className="mt-14 grid h-[34rem] gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((kolom) => (
              <VerticalMarquee
                key={kolom}
                duration={52 + kolom * 11}
                direction={kolom === 1 ? 'down' : 'up'}
                className={kolom === 2 ? 'hidden lg:block' : kolom === 1 ? 'hidden sm:block' : ''}
              >
                {reviews
                  .filter((_, i) => i % 3 === kolom)
                  .map((review) => (
                    <article
                      key={review.tekst}
                      className="mb-5 flex overflow-hidden rounded-scoop bg-crema-50 text-espresso-900 shadow-float"
                    >
                      <span
                        className="w-2 shrink-0"
                        style={{ backgroundColor: review.accentHex }}
                        aria-hidden="true"
                      />

                      <div className="flex-1 p-6">
                        <span className="flex gap-1.5" aria-hidden="true">
                          {Array.from({ length: review.sterren }, (_, i) => (
                            <span
                              key={i}
                              className="size-2.5 rounded-full bg-vaniglia-400"
                            />
                          ))}
                        </span>

                        <p className="mt-4 text-[0.95rem] leading-relaxed text-espresso-900/80">
                          “{review.tekst}”
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-espresso-900/20 pt-3.5">
                          <p className="font-display text-sm font-bold text-espresso-900">
                            {review.auteur ?? `${beoordeling.bron}-review`}
                          </p>
                          {review.rol && (
                            <span className="chunk text-[0.7rem] sm:text-[0.6rem] text-espresso-900/45">
                              {review.rol}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
              </VerticalMarquee>
            ))}
          </div>

          <Reveal y={16} delay={200}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" href={beoordeling.link}>
                {t(ui.homeLeesReviews)}
              </Button>
              <Button size="lg" variant="ghostLight" to="/#bezoek">
                {t(ui.routeEnAdres)}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
