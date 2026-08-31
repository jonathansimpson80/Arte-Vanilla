import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { feedBeelden } from './feedBeelden'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { platforms } from '@/data/contact'
import { Marquee } from '@/motion/Marquee'
import { Reveal } from '@/motion/Reveal'
import { Foto } from '@/components/ui/Foto'

export function Feed() {
  const { t } = useTaal()

  return (
    <>
      {/* ---------- feed ---------- */}
      {/* Zelfde vlak als de Large-bak, zodat de strook aansluit op de sectie
          eronder in plaats van er met een lichte rand tussenuit te vallen. */}
      <section
        className="overflow-hidden py-20"
        style={{ backgroundColor: '#f1dfd0' }}
        aria-labelledby="feed"
      >
        <div className="container-page flex flex-wrap items-end justify-between gap-6">
          <Reveal y={16}>
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-pistacchio-500/25 px-4 py-2 text-[0.7rem] text-pistacchio-700">
              <Glyph name="instagram" size={14} />
              {t(ui.homeFeedEyebrow)}
            </span>
            <h2
              id="feed"
              className="mt-5 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold text-espresso-900"
            >
              {t(ui.homeFeedKop)} @arte_vanilla
            </h2>
          </Reveal>

          <Reveal y={16} delay={120}>
            <Button variant="ghost" href="https://www.instagram.com/arte_vanilla/">
              {t(ui.homeVolgInstagram)}
            </Button>
          </Reveal>
        </div>

        <div className="mt-12">
          <Marquee speed={150} pauseOnHover>
            {feedBeelden.map((beeld, i) => (
              <a
                key={beeld.src + i}
                href={beeld.post ?? platforms.instagram}
                target="_blank"
                rel="noreferrer"
                className="group relative mx-3 block shrink-0 rounded-scoop focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cacao-700"
                style={{
                  ['--rust' as string]: `${i % 2 === 0 ? -1.5 : 1.5}deg`,
                  transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
                }}
              >
                <Foto
                  src={beeld.src}
                  alt={beeld.alt}
                  className="wiggle h-64 w-56 rounded-scoop object-cover shadow-lift transition-[filter] duration-300 ease-soft group-hover:brightness-[0.92] sm:h-80 sm:w-64"
                />
                <span className="chunk pointer-events-none absolute bottom-3 left-3 rounded-full bg-espresso-900/70 px-3 py-1.5 text-[0.7rem] sm:text-[0.6rem] text-crema-50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  {beeld.post ? t(ui.homeBekijkPost) : t(ui.homeVolgInstagram)}
                </span>
              </a>
            ))}
          </Marquee>
        </div>

        <div className="mt-10">
          <Marquee speed={55} direction="right">
            <span className="flex items-center gap-8 px-8 text-espresso-900/25">
              <span className="chunk text-sm">@arte_vanilla</span>
              <Glyph name="hoorntje" size={16} />
            </span>
          </Marquee>
        </div>
      </section>
    </>
  )
}
