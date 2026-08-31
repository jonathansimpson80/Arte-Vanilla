import { Drip } from '@/components/Drip'
import { Glyph } from '@/components/ui/Glyph'
import { tickerWords } from '@/data/home'
import { Marquee } from '@/motion/Marquee'

export function Ticker() {
  return (
    <>
      {/* ---------- ticker met druipende onderrand ---------- */}
      <section className="relative z-10">
        <div className="relative bg-fragola-400 py-6">
        <Marquee speed={80}>
          {tickerWords.map((word) => (
            <span key={word} className="flex items-center gap-10 px-10">
              <span className="chunk text-xl text-crema-50 sm:text-3xl">{word}</span>
              <span className="text-crema-50/60">
                <Glyph name="sprankel" size={18} />
              </span>
            </span>
          ))}
        </Marquee>
          {/* De drip valt over de sectie eronder heen en overlapt de band
              met 1px, anders laat subpixel-afronding een lichte naad zien. */}
          <div
            className="pointer-events-none absolute inset-x-0"
            style={{ top: 'calc(100% - 1px)' }}
          >
            <Drip className="text-fragola-400" />
          </div>
        </div>
      </section>

    </>
  )
}
