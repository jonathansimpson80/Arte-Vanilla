import { Seo } from '@/lib/seo'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { Foto } from '@/components/ui/Foto'
import { Drip } from '@/components/Drip'
import { StripesBackground } from '@/components/StripesBackground'
import { Reveal } from '@/motion/Reveal'
import { KopMetAccent } from '@/components/ui/KopMetAccent'
import { Carrousel } from '@/components/ui/Carrousel'
import { ImageReveal } from '@/motion/ImageReveal'
import { Sprinkles } from '@/motion/Sprinkles'
import { VerticalMarquee } from '@/motion/VerticalMarquee'
import { beoordeling, platforms } from '@/data/contact'
import { reviews } from '@/data/reviews'
import { flavours } from '@/data/flavours'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

/**
 * Over ons.
 *
 * Alles op deze pagina is na te trekken: het adres, de beoordeling, de smaken
 * en de werkwijze uit de eigen berichten van de zaak. Wat níet bekend is —
 * de namen van de eigenaren, het jaar van openen, de streek waar de recepten
 * vandaan komen — staat er niet, en het blok onderaan zegt precies dat.
 */
export function OverOns() {
  const { t } = useTaal()

  // Elk cijfer op zijn eigen merkvlak, net als de bakken en de smaakrijen.
  // Het cijfer haalt overal minstens 4,1:1 op zijn ondergrond, het label 16:1.
  const cijfers = [
    {
      getal: String(flavours.length),
      label: ui.overCijferSmaken,
      accent: '#b4544c',
      tint: '#fbe9ee',
    },
    {
      getal: beoordeling.score.toFixed(1).replace('.', ','),
      label: ui.overCijferReviews,
      accent: '#8f5720',
      tint: '#fdf1cf',
    },
    { getal: '1', label: ui.overCijferBatch, accent: '#5f6b3a', tint: '#eef4e4' },
  ]

  return (
    <>
      <Seo title={t(ui.navOverOns)} description={t(ui.overLead)} />

      {/* ---------- kop ---------- */}
      <section className="relative -mt-22 overflow-hidden pb-16 pt-34 sm:pt-38">
        <StripesBackground scrim />

        <div className="container-page relative text-center">
          <Reveal y={14}>
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-crema-50 px-4 py-2 text-[0.72rem] text-cacao-700 shadow-lift sm:text-[0.65rem]">
              <Glyph name="hart" size={14} />
              {t(ui.overEyebrow)}
            </span>
          </Reveal>

          <Reveal y={22} delay={80}>
            <KopMetAccent
              tekst={t(ui.overKop)}
              accent={t(ui.overKopAccent)}
              className="mx-auto mt-6 max-w-[16ch] font-display text-display font-bold text-espresso-900"
            />
          </Reveal>

          <Reveal y={16} delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-lead text-cacao-700">{t(ui.overLead)}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- het verhaal ---------- */}
      <section className="container-page pt-8" aria-labelledby="verhaal">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ImageReveal
            src="/media/gevel-bankjes.jpg"
            alt={t(ui.altGevel)}
            className="aspect-4/5 rounded-cone"
          />

          <Reveal y={20}>
            <h2
              id="verhaal"
              className="max-w-md font-display text-title font-bold text-espresso-900"
            >
              {t(ui.overVerhaalKop)}
            </h2>
            <p className="mt-4 max-w-md text-lead text-cacao-700">{t(ui.overVerhaalLead)}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- in cijfers ---------- */}
      <section className="container-page pt-24">
        <Carrousel as="ul" label={t(ui.navOverOns)} className="gap-5 sm:grid-cols-3">
          {cijfers.map((cijfer, i) => (
            <Reveal key={cijfer.getal + i} y={22} scale={0.96} delay={i * 90}>
              <li
                className="rounded-cone p-8 text-center ring-1 ring-espresso-900/5"
                style={{ backgroundColor: cijfer.tint }}
              >
                <p
                  className="font-chunk text-[clamp(3rem,7vw,4.5rem)] leading-none"
                  style={{ color: cijfer.accent }}
                >
                  {cijfer.getal}
                </p>
                <p className="mt-3 text-sm text-espresso-900/65">{t(cijfer.label)}</p>
              </li>
            </Reveal>
          ))}
        </Carrousel>
      </section>

      {/* ---------- hoe het gemaakt wordt ---------- */}
      <section className="container-page pt-24" aria-labelledby="werk">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal y={20}>
            <h2 id="werk" className="max-w-md font-display text-title font-bold text-espresso-900">
              {t(ui.overWerkKop)}
            </h2>
            <p className="mt-4 max-w-md text-lead text-cacao-700">{t(ui.overWerkLead)}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="accent" to="/smaken">
                {t(ui.bekijkSmaken)}
                <Glyph name="pijl" size={15} />
              </Button>
              <Button variant="ghost" href={platforms.instagram}>
                {t(ui.homeVolgInstagram)}
              </Button>
            </div>
          </Reveal>

          <Foto
            src="/media/bak-pistacchio.jpg"
            alt={t(ui.altPistache)}
            className="aspect-square w-full rounded-cone object-cover"
          />
        </div>
      </section>

      {/* ---------- de buurt ---------- */}
      <section className="relative mt-24 overflow-hidden bg-espresso-900 py-20">
        <Sprinkles columns={12} />

        <div className="container-page relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal y={20}>
            <h2 className="max-w-md font-display text-title font-bold text-crema-50">
              {t(ui.overBuurtKop)}
            </h2>
            <p className="mt-4 max-w-md text-lead text-crema-200/80">{t(ui.overBuurtLead)}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" href={beoordeling.link}>
                {t(ui.homeLeesReviews)}
              </Button>
              <Button variant="ghostLight" to="/#bezoek">
                {t(ui.navBezoek)}
                <Glyph name="pijl" size={15} />
              </Button>
            </div>
          </Reveal>

          {/* De reviews zelf in plaats van een foto: twee kolommen die langzaam
              langsschuiven, klein gezet zodat ze naast de tekst passen. */}
          <Reveal y={20} delay={120}>
            <div className="grid h-[22rem] grid-cols-2 gap-3 sm:h-[26rem] sm:gap-4">
              {[0, 1].map((kolom) => (
                <VerticalMarquee
                  key={kolom}
                  duration={46 + kolom * 13}
                  direction={kolom === 1 ? 'down' : 'up'}
                  
                >
                  {reviews
                    .filter((_, i) => i % 2 === kolom)
                    .map((review) => (
                      <article
                        key={review.tekst}
                        className="mb-3 flex overflow-hidden rounded-scoop bg-crema-50 text-espresso-900 shadow-float sm:mb-4"
                      >
                        <span
                          className="w-1.5 shrink-0"
                          style={{ backgroundColor: review.accentHex }}
                          aria-hidden="true"
                        />
                        <div className="flex-1 p-3 sm:p-4">
                          <span className="flex gap-1" aria-hidden="true">
                            {Array.from({ length: review.sterren }, (_, i) => (
                              <span key={i} className="size-1.5 rounded-full bg-vaniglia-400" />
                            ))}
                          </span>
                          <p className="mt-2 text-[0.72rem] leading-relaxed text-espresso-900/80 sm:mt-2.5 sm:text-[0.8rem]">
                            “{review.tekst}”
                          </p>
                          <p className="mt-2.5 font-display text-[0.68rem] font-bold text-espresso-900/70 sm:mt-3 sm:text-xs">
                            {review.auteur ?? `${beoordeling.bron}-review`}
                          </p>
                        </div>
                      </article>
                    ))}
                </VerticalMarquee>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- de twee achter de toonbank ---------- */}
      {/* Wat nog van de zaak zelf moet komen — de openingsdatum die ze willen
          aanhouden, de prijzen van koffie en bollen, en een volledige
          allergenenopgave — staat bewust niet op de pagina. Dat is een briefje
          aan de eigenaar, geen tekst voor een bezoeker. */}
      <section className="container-page pt-24" aria-labelledby="de-twee">
        <Reveal y={16}>
          <div className="text-center">
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-vaniglia-400 px-4 py-2 text-[0.7rem] text-espresso-900">
              <Glyph name="hart" size={14} />
              {t(ui.overTweeEyebrow)}
            </span>
            <h2
              id="de-twee"
              className="mx-auto mt-5 max-w-2xl font-display text-title font-bold text-espresso-900"
            >
              {t(ui.overTweeKop)}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lead text-cacao-700">
              {t(ui.overTweeLead)}
            </p>
          </div>
        </Reveal>

        {/* De twee zelf, achter hun eigen toonbank, over de volle breedte.
            Het bestand heet altijd `giulia-simone.jpg`: een nieuwe foto onder
            die naam neerzetten is genoeg, er hoeft niets aan de code te
            veranderen. De uitsnede houdt hun gezichten in beeld, ook als de
            band op een breed scherm laag wordt. */}
        <Reveal y={20} delay={80}>
          <figure className="mt-12">
            <Foto
              src="/media/giulia-simone.jpg"
              alt={t(ui.altGiuliaSimone)}
              sizes="(max-width: 640px) 100vw, (max-width: 1152px) 100vw, 1100px"
              className="aspect-[4/5] w-full rounded-cone object-cover object-[50%_32%] shadow-lift ring-1 ring-espresso-900/5 sm:aspect-[16/9] lg:aspect-[21/9]"
            />
          </figure>
        </Reveal>

        <Carrousel as="ul" label={t(ui.overTweeEyebrow)} className="mt-10 gap-6 sm:grid-cols-2">
          {[
            {
              naam: ui.overGiuliaNaam,
              rol: ui.overGiuliaRol,
              tekst: ui.overGiuliaTekst,
              tint: '#fbe9ee',
              accent: '#b4544c',
            },
            {
              naam: ui.overSimoneNaam,
              rol: ui.overSimoneRol,
              tekst: ui.overSimoneTekst,
              tint: '#eef4e4',
              accent: '#5f6b3a',
            },
          ].map((persoon, i) => (
            <Reveal key={persoon.naam.nl} y={24} scale={0.96} delay={i * 90}>
              <li
                className="flex h-full flex-col rounded-cone p-7 ring-1 ring-espresso-900/5 sm:p-8"
                style={{ backgroundColor: persoon.tint }}
              >
                <p className="chunk text-[0.72rem] sm:text-[0.65rem]" style={{ color: persoon.accent }}>
                  {t(persoon.rol)}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-espresso-900">
                  {t(persoon.naam)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-espresso-900/75">
                  {t(persoon.tekst)}
                </p>
              </li>
            </Reveal>
          ))}
        </Carrousel>
      </section>

      {/* ---------- afsluiter ---------- */}
      <div className="relative z-10 -mb-px mt-20">
        <Drip className="text-fragola-400" waves={5} heightClass="h-10 sm:h-14" flip />
      </div>

      <section className="relative overflow-hidden bg-fragola-400 py-20 text-crema-50">
        <Sprinkles columns={14} />

        <div className="container-page relative text-center">
          <Reveal y={18}>
            <h2 className="mx-auto max-w-2xl font-display text-title font-bold">
              {t(ui.homeBezoekKop)}
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" to="/afhalen">
                {t(ui.bakSamenstellen)}
                <Glyph name="pijl" size={15} />
              </Button>
              <Button variant="ghostLight" to="/#bezoek">
                {t(ui.routeEnAdres)}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
