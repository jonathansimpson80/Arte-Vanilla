import { useState } from 'react'
import { useTaal, type Vertaald } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { Drip } from '@/components/Drip'
import { Glyph } from '@/components/ui/Glyph'
import { Foto } from '@/components/ui/Foto'

export type Family = {
  id: string
  eyebrow: Vertaald
  name: Vertaald
  front: Vertaald
  tags: Vertaald[]
  mood: Vertaald
  bestFor: Vertaald
  ask: Vertaald
  /** De smaken uit deze familie, zoals ze op het bord staan. */
  smaken: string[]
  image: string
  tintHex: string
  backHex: string
  accentHex: string
}

/**
 * Kaart die omklapt naar een achterkant.
 *
 * Het is één knop met `aria-pressed`, zodat tabben en de spatiebalk werken en
 * een schermlezer de staat voorleest. De verborgen kant staat op
 * `aria-hidden`, anders leest die lezer beide kanten door elkaar.
 */
export function FlipCard({ family }: { family: Family }) {
  const { t } = useTaal()
  const [om, setOm] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setOm((v) => !v)}
      onMouseEnter={() => setOm(true)}
      onMouseLeave={() => setOm(false)}
      onFocus={() => setOm(true)}
      onBlur={() => setOm(false)}
      aria-pressed={om}
      aria-label={`${t(family.name)} — ${t(ui.draaiKaart)}`}
      className="flip group h-96 w-full text-left"
    >
      <span className={`flip__inner ${om ? 'flip__inner--om' : ''}`}>
        {/* voorkant */}
        <span
          className="flip__face overflow-hidden rounded-cone ring-1 ring-espresso-900/5"
          style={{ backgroundColor: family.tintHex }}
          aria-hidden={om}
        >
          <span className="relative block">
            <Foto
              src={family.image}
              alt=""
              className="h-40 w-full object-cover"
            />
            <span className="chunk absolute left-4 top-4 rounded-full bg-crema-50 px-3 py-1.5 text-[0.7rem] sm:text-[0.6rem] text-espresso-900">
              {t(family.eyebrow)}
            </span>
            <span className="absolute inset-x-0 bottom-0" style={{ color: family.tintHex }}>
              <Drip className="" flip waves={4} heightClass="h-5" />
            </span>
          </span>

          <span className="block px-6 pb-5 pt-2">
            <span className="block font-display text-xl font-bold text-espresso-900">
              {t(family.name)}
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-espresso-900/70">
              {t(family.front)}
            </span>

            <span className="mt-4 flex flex-wrap gap-2">
              {family.tags.map((tag) => (
                <span
                  key={tag.nl}
                  className="chunk rounded-full border border-dashed px-3 py-1 text-[0.7rem] sm:text-[0.6rem]"
                  style={{ borderColor: family.accentHex, color: family.accentHex }}
                >
                  {t(tag)}
                </span>
              ))}
            </span>
          </span>

          <span className="mt-auto flex items-center justify-between border-t border-dashed border-espresso-900/20 px-6 py-4">
            <span className="chunk text-[0.7rem] sm:text-[0.6rem] text-espresso-900/60">{t(ui.draaiKaart)}</span>
            <span
              className="grid size-6 place-items-center rounded-full text-crema-50"
              style={{ backgroundColor: family.accentHex }}
            >
              <Glyph name="pijl" size={12} />
            </span>
          </span>
        </span>

        {/* achterkant */}
        <span
          className="flip__face flip__face--back overflow-hidden rounded-cone p-6 text-crema-50"
          style={{ backgroundColor: family.backHex }}
          aria-hidden={!om}
        >
          <span className="flex items-center justify-between">
            <span className="font-display text-xl font-bold">{t(family.name)}</span>
            <span className="chunk text-[0.7rem] sm:text-[0.6rem] opacity-70">№</span>
          </span>

          <span className="mt-5 block">
            <span className="chunk block text-[0.7rem] sm:text-[0.6rem] opacity-70">{t(ui.sfeer)}</span>
            <span className="mt-1.5 block text-sm leading-relaxed">{t(family.mood)}</span>
          </span>

          <span className="mt-4 block">
            <span className="chunk block text-[0.7rem] sm:text-[0.6rem] opacity-70">{t(ui.pastBij)}</span>
            <span className="mt-1.5 block text-sm leading-relaxed">{t(family.bestFor)}</span>
          </span>

          <span className="mt-4 block">
            <span className="chunk block text-[0.7rem] opacity-70 sm:text-[0.6rem]">
              {t(ui.familieSmaken)}
            </span>
            <span className="mt-2 flex flex-wrap gap-1.5">
              {family.smaken.map((smaak) => (
                <span
                  key={smaak}
                  className="rounded-full bg-crema-50/15 px-2.5 py-1 text-xs"
                >
                  {smaak}
                </span>
              ))}
            </span>
          </span>

          <span className="mt-auto block border-t border-dashed border-crema-50/35 pt-4">
            <span className="chunk block text-[0.7rem] sm:text-[0.6rem] opacity-70">{t(ui.vraagInWinkel)}</span>
            <span className="mt-1.5 block text-sm">{t(family.ask)}</span>
          </span>
        </span>
      </span>
    </button>
  )
}
