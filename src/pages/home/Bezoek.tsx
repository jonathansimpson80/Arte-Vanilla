import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { adresRegel, beoordeling, contact, kaartEmbed, kaartLink, routeLink } from '@/data/contact'
import { openingHours } from '@/data/home'
import { Reveal } from '@/motion/Reveal'
import { StripesBackground } from '@/components/StripesBackground'
import { Foto } from '@/components/ui/Foto'

export function Bezoek() {
  const { t } = useTaal()

  return (
    <>
      {/* ---------- bezoek ---------- */}
      {/* Geen bovenmarge: die liet de paginakleur als een lichte balk tussen
          deze sectie en de Famiglia Pack erboven doorschijnen. De lucht zit
          nu in de padding, binnen het gekleurde vlak zelf. */}
      {/* Streeppatroon als ondergrond. Mag hier zonder waas: de inhoud zit in
          twee gesloten kaarten, dus er staat geen lopende tekst op de naden. */}
      <section
        className="relative overflow-hidden py-20 lg:py-24"
        id="bezoek"
        aria-labelledby="bezoek-kop"
      >
        <StripesBackground />

        <div className="container-page relative grid items-stretch gap-5 lg:grid-cols-[1.05fr_1fr]">
          <Reveal y={20}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-cone bg-espresso-900 p-8 text-crema-50 sm:p-10">
              <div>
                <span className="chunk inline-flex w-fit items-center gap-2 rounded-full bg-crema-50/12 px-4 py-2 text-[0.7rem]">
                  <Glyph name="locatie" size={14} />
                  {t(ui.homeBezoekEyebrow)}
                </span>

                <h2
                  id="bezoek-kop"
                  className="mt-6 max-w-sm font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.02em]"
                >
                  {t(ui.homeBezoekKop)}
                </h2>
              </div>

              <div className="border-t border-dashed border-crema-50/25 pt-6">
                <dl className="space-y-3">
                  <div>
                    <dt className="chunk text-[0.7rem] sm:text-[0.6rem] text-crema-50/50">{t(ui.adres)}</dt>
                    <dd className="mt-1 text-crema-50/90">
                      {contact.straat}
                      <br />
                      {contact.postcode} {contact.stad}
                    </dd>
                  </div>
                  <div>
                    <dt className="chunk text-[0.7rem] sm:text-[0.6rem] text-crema-50/50">{t(ui.open)}</dt>
                    <dd className="mt-1 text-crema-50/90">
                      {openingHours.map((rij) => (
                        <span key={rij.time} className="block">
                          {t(rij.day)}: {rij.time}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="chunk text-[0.7rem] sm:text-[0.6rem] text-crema-50/50">{beoordeling.bron}</dt>
                    <dd className="mt-1 text-crema-50/90">
                      {beoordeling.score.toFixed(1).replace('.', ',')} ·{' '}
                      {beoordeling.aantal} {t(ui.reviewsAantal)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-dashed border-crema-50/25 pt-6">
                <Button size="lg" variant="secondary" href={routeLink}>
                  {t(ui.route)}
                  <Glyph name="pijl" size={15} />
                </Button>
                <Button size="lg" variant="ghostLight" to="/afhalen">
                  {t(ui.afhalenEyebrow)}
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal y={20} delay={100}>
            <div className="grid gap-5">
              <Foto
                src="/media/gevel-bankjes.jpg"
                alt="De gevel van Arte Vanilla met gasten op het bankje"
                className="wiggle aspect-4/3 w-full rounded-cone object-cover"
              />

              {/* Google geocodeert het adres zelf, dus er staat geen verzonnen
                  coördinaat in de bron. */}
              <div className="overflow-hidden rounded-cone bg-crema-50 ring-1 ring-espresso-900/5">
                <iframe
                  src={kaartEmbed}
                  title={t(ui.kaartInteractief)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full border-0"
                />

                <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-pistacchio-400/35 text-pistacchio-700">
                      <Glyph name="locatie" size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-espresso-900">{adresRegel}</p>
                      <p className="text-xs text-espresso-900/55">{t(ui.buurt)}</p>
                    </div>
                  </div>

                  <a
                    href={kaartLink}
                    target="_blank"
                    rel="noreferrer"
                    className="-my-2 py-3 text-sm font-medium text-fragola-700 underline underline-offset-4 transition-colors hover:text-fragola-500 sm:-my-0 sm:py-0"
                  >
                    {t(ui.kaartOpenen)}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
