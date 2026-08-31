import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Drip } from '@/components/Drip'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { cabinet } from '@/data/home'
import { CardDeck } from '@/motion/CardDeck'
import { Carrousel } from '@/components/ui/Carrousel'
import { Reveal } from '@/motion/Reveal'
import { Foto } from '@/components/ui/Foto'

export function Vitrine() {
  const { t } = useTaal()

  /** Eén vitrinekaart; zowel in de stapel als in de carrousel dezelfde. */
  const kaart = (item: (typeof cabinet)[number]) => (
          <article
            className="overflow-hidden rounded-cone shadow-float ring-1 ring-espresso-900/5"
            style={{ backgroundColor: item.tintHex }}
          >
            <div className="relative">
              <Foto
                src={item.image}
                alt={t(item.name)}
                className="aspect-[16/10] w-full object-cover"
              />
              <span className="chunk absolute left-4 top-4 rounded-full bg-espresso-900/55 px-4 py-2 text-[0.7rem] sm:text-[0.6rem] text-crema-50 backdrop-blur-sm">
                {t(ui.homeVitrineLabel)} · № {item.number}
              </span>
              {/* golvende rand die het beeld in het kaartvlak laat overlopen */}
              <div
                className="absolute inset-x-0 bottom-0"
                style={{ color: item.tintHex }}
              >
                <Drip className="" flip waves={4} heightClass="h-7" />
              </div>
            </div>

            <div className="relative px-6 pb-5 pt-1">
              <span
                className="pointer-events-none absolute bottom-4 right-4 font-chunk text-[4rem] leading-none opacity-20"
                style={{ color: item.accentHex }}
                aria-hidden="true"
              >
                {item.number}
              </span>

              <p className="chunk text-[0.72rem] sm:text-[0.65rem] text-espresso-900/50">{item.italian}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-espresso-900">
                {t(item.name)}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-snug text-espresso-900/65">
                {t(item.body)}
              </p>

              <div className="relative z-10 mt-7 flex items-center gap-3 border-t border-dashed border-espresso-900/30 pt-3.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.accentHex }}
                  aria-hidden="true"
                />
                <span className="chunk text-[0.72rem] sm:text-[0.65rem] text-espresso-900/55">
                  Arte Vanilla · № {item.number}
                </span>
              </div>
            </div>
          </article>
  )

  return (
    <>
      {/* ---------- de vitrine: kaarten die één voor één wegvliegen ---------- */}
      {/* Warmer dan de swirl van de Famiglia Pack erboven: die twee scheelden
          maar 1,01:1 en liepen daardoor in elkaar over. Nu 1,19:1 — genoeg om
          de rand te zien, weinig genoeg om rustig te blijven. */}
      <section
        className="pt-24"
        style={{
          backgroundColor: '#eddfce',
          backgroundImage:
            'radial-gradient(70% 50% at 50% 45%, rgb(252 243 226 / 0.75) 0%, transparent 70%)',
        }}
        aria-labelledby="vitrine"
      >
        <div className="container-page text-center">
          <Reveal y={16}>
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-caramello-500/15 px-4 py-2 text-[0.7rem] text-caramello-500">
              <Glyph name="hoorntje" size={14} />
              {t(ui.homeVitrineEyebrow)}
            </span>
            <h2
              id="vitrine"
              className="mx-auto mt-5 max-w-2xl font-display text-title font-bold text-espresso-900"
            >
              {t(ui.homeVitrineKop)}
            </h2>
          </Reveal>
        </div>

        {/* Op een telefoon kost de wegvliegende stapel vier schermhoogtes aan
            scrollen voor vier kaarten — daar veeg je ze liever langs. Vanaf sm
            blijft het effect staan, want daar is de ruimte ervoor. */}
        <div className="container-page mt-10 sm:hidden">
          <Carrousel as="ul" label={t(ui.homeVitrineEyebrow)} className="gap-5">
            {cabinet.map((item) => (
              <li key={item.number}>{kaart(item)}</li>
            ))}
          </Carrousel>
        </div>

        <div className="hidden sm:block">
          <CardDeck
            items={cabinet}
            // Korter: vier kaarten × 0,45 schermhoogte in plaats van 0,7. Je hebt
            // nog steeds een scroll per kaart, maar zonder de lege lucht eromheen.
            perCard={0.45}
            backdrop={
              <p className="pointer-events-none absolute inset-x-0 select-none text-center font-chunk text-mega leading-none text-espresso-900">
                {t(ui.homeKiesJeBol)}
              </p>
            }
            renderCard={kaart}
          />
        </div>

        <div className="container-page pb-4 text-center">
          <Reveal y={14}>
            <Button variant="ghost" to="/dolci">
              {t(ui.homeHeleKaartGebak)}
              <Glyph name="pijl" size={15} />
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
