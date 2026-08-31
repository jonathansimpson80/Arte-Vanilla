import { Seo } from '@/lib/seo'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { Drip } from '@/components/Drip'
import { StripesBackground } from '@/components/StripesBackground'
import { Reveal } from '@/motion/Reveal'
import { Marquee } from '@/motion/Marquee'
import { ImageReveal } from '@/motion/ImageReveal'
import { Sprinkles } from '@/motion/Sprinkles'
import { dolci } from '@/data/dolci'
import { Allergenen } from '@/components/Allergenen'
import { KoffieKaart } from '@/components/KoffieKaart'
import { DealsRij } from '@/components/DealsRij'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Foto } from '@/components/ui/Foto'

export function Dolci() {
  const { t } = useTaal()

  return (
    <>
      <Seo
        title={t(ui.navGebak)}
        description={t(ui.dolciLead)}
      />

      {/* ---------- kop ---------- */}
      <section className="relative -mt-22 overflow-hidden pb-16 pt-34 sm:pt-38">
        <StripesBackground scrim />

        <div className="container-page relative text-center">
          <Reveal y={14}>
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-crema-50 px-4 py-2 text-[0.7rem] text-cacao-700 shadow-lift">
              <Glyph name="ster" size={14} />
              {t(ui.dolciEyebrow)}
            </span>
          </Reveal>

          <Reveal y={22} delay={80}>
            <h1 className="mx-auto mt-6 max-w-[15ch] font-display text-display font-bold text-espresso-900">
              {t(ui.dolciKop)}
            </h1>
          </Reveal>

          <Reveal y={16} delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-lead text-cacao-700">
              {t(ui.dolciLead)}
            </p>
          </Reveal>

          <Reveal y={16} delay={240}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="accent" to="/afhalen">
                {t(ui.bakSamenstellen)}
                <Glyph name="pijl" size={15} />
              </Button>
              <Button variant="ghost" to="/smaken">
                {t(ui.bekijkSmaken)}
                <Glyph name="pijl" size={15} />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- ticker ---------- */}
      <section className="relative z-10">
        <div className="relative bg-fragola-400 py-5">
          <Marquee speed={70}>
            {['Tiramisù', 'Cannoli', 'Affogato', 'Torta', 'Caffè', 'Cialda'].map((woord) => (
              <span key={woord} className="flex items-center gap-10 px-10">
                <span className="chunk text-xl text-crema-50 sm:text-3xl">{woord}</span>
                <span className="text-crema-50/60">
                  <Glyph name="sprankel" size={18} />
                </span>
              </span>
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-x-0" style={{ top: 'calc(100% - 1px)' }}>
            <Drip className="text-fragola-400" />
          </div>
        </div>
      </section>

      {/* ---------- uitgelicht ---------- */}
      <section className="container-page pt-20" aria-labelledby="uitgelicht">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ImageReveal
            src="/media/tiramisu.jpg"
            alt={t(ui.altTiramisu)}
            className="aspect-4/5 rounded-cone"
          />

          <Reveal y={20}>
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-cacao-700/12 px-4 py-2 text-[0.7rem] text-cacao-700">
              <Glyph name="boon" size={14} />
              {t(ui.dolciElkeOchtend)}
            </span>
            <h2
              id="uitgelicht"
              className="mt-5 max-w-md font-display text-title font-bold text-espresso-900"
            >
              {t(ui.dolciKleinKop)}
            </h2>
            <p className="mt-4 max-w-md text-lead text-cacao-700">
              {t(ui.dolciKleinLead)}
            </p>
            <div className="mt-8">
              <Button variant="ghost">
                {t(ui.dolciBelVandaag)}
                <Glyph name="telefoon" size={15} />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- de kaart ---------- */}
      <section className="container-page pt-24" aria-labelledby="dolci-kaart">
        <Reveal y={16}>
          <div className="text-center">
            <h2
              id="dolci-kaart"
              className="mx-auto max-w-2xl font-display text-title font-bold text-espresso-900"
            >
              {t(ui.dolciKaartKop)}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-cacao-700">
              {t(ui.dolciKaartLead)}
            </p>
          </div>
        </Reveal>

        {/*
          Negen kaarten. Bij drie kolommen komt dat precies uit; bij twee blijft
          er één alleen achter. Drie kolommen forceren op een tablet maakt de
          kaarten 219px breed en 528 hoog — dan liever de laatste de rij laten
          afmaken, alleen in de tweekolomsstand.
        */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 sm:[&>*:last-child]:col-span-2 lg:grid-cols-3 lg:[&>*:last-child]:col-span-1">
          {dolci.map((dolce, i) => (
            <Reveal key={dolce.name.nl} y={24} scale={0.96} delay={(i % 3) * 90}>
              <li
                className={`flex h-full flex-col overflow-hidden rounded-cone ${
                  dolce.concept
                    ? 'border border-dashed border-espresso-900/25'
                    : 'ring-1 ring-espresso-900/5'
                }`}
                style={{ backgroundColor: dolce.tintHex }}
              >
                <div className="relative">
                  {dolce.image ? (
                    <Foto
                      src={dolce.image}
                      alt={t(dolce.name)}
                      className="aspect-[16/11] w-full object-cover"
                    />
                  ) : (
                    /* Geen eigen foto: een merkvlak in plaats van een beeld van
                       ander gebak. Een verkeerde foto bij een gerecht wekt de
                       indruk dat het klopt. */
                    <div className="stripes-soft flex aspect-[16/11] w-full items-center justify-center">
                      <span
                        className="wordmark text-4xl opacity-60"
                        style={{ color: dolce.accentHex }}
                      >
                        {t(dolce.name)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0" style={{ color: dolce.tintHex }}>
                    <Drip className="" flip waves={4} heightClass="h-5" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="chunk text-[0.72rem] sm:text-[0.65rem]" style={{ color: dolce.accentHex }}>
                    {dolce.italian}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-espresso-900">
                    {t(dolce.name)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-espresso-900/70">
                    {t(dolce.description)}
                  </p>

                  {dolce.price !== null && (
                    <p className="chunk mt-4 tabular-nums text-espresso-900/55">
                      € {dolce.price.toFixed(2).replace('.', ',')}
                    </p>
                  )}

                  <Allergenen lijst={dolce.allergenen} kleur={dolce.accentHex} />

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {dolce.tags.map((tag) => (
                      <li
                        key={tag.nl}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          dolce.concept
                            ? 'border border-dashed border-espresso-900/30 text-espresso-900/60'
                            : 'bg-crema-50 text-espresso-900/70'
                        }`}
                      >
                        {t(tag)}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- koffie ---------- */}
      <section className="container-page pt-24" aria-labelledby="koffie">
        <KoffieKaart />
      </section>

      {/* ---------- vaste combinaties ---------- */}
      <section className="container-page pt-24" aria-labelledby="deals">
        <DealsRij />
      </section>

      {/* ---------- koffie ---------- */}
      <section className="container-page pt-24" aria-labelledby="koffie">
        <KoffieKaart />
      </section>

      {/* ---------- vaste combinaties ---------- */}
      <section className="container-page pt-24" aria-labelledby="deals">
        <DealsRij />
      </section>

      {/* ---------- afsluiter ---------- */}
      <section className="relative mt-20 overflow-hidden bg-espresso-900 py-20">
        <Sprinkles columns={14} />

        <div className="container-page relative text-center">
          <Reveal y={18}>
            <h2 className="mx-auto max-w-2xl font-display text-title font-bold text-crema-50">
              {t(ui.dolciSlotKop)}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-crema-200/75">
              {t(ui.dolciSlotLead)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" to="/#bezoek">
                {t(ui.routeEnAdres)}
              </Button>
              <Button variant="ghostLight" to="/afhalen">
                {t(ui.afhalenEyebrow)}
                <Glyph name="pijl" size={15} />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
