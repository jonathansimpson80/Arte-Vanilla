import { useEffect, useState } from 'react'
import { nuOpen } from '@/data/contact'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

/**
 * Of de winkel nu open is.
 *
 * In de balk staat alleen een bolletje: groen en zachtjes kloppend als er
 * iemand achter de toonbank staat, rustig bruin als het dicht is. De hele zin
 * — "weer open vanaf 14:00" — verschijnt pas als je erover gaat of erop tikt.
 * Een statusregel hoort niet net zo hard te roepen als de navigatie ernaast.
 *
 * Rekent met de klok van de bezoeker en werkt zichzelf elke minuut bij; een
 * melding die om 22:01 nog "open" zegt is erger dan geen melding. De eerste
 * render blijft leeg, want op een server bestaat er geen klok.
 */
export function OpenNu() {
  const { t } = useTaal()
  const [status, setStatus] = useState<ReturnType<typeof nuOpen> | null>(null)
  const [toon, setToon] = useState(false)

  useEffect(() => {
    const bijwerken = () => setStatus(nuOpen())
    bijwerken()
    const timer = window.setInterval(bijwerken, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  if (!status) return null

  const open = status.open
  const regel = open
    ? `${t(ui.nuOpen)} · ${t(ui.totTijd)} ${status.tot}`
    : status.vanaf
      ? `${t(ui.nuDicht)} · ${t(status.dagVerschil === 0 ? ui.vanafVandaag : ui.vanafStraks)} ${status.vanaf}`
      : t(ui.nuDicht)

  return (
    <span
      className="relative hidden sm:inline-flex"
      onMouseEnter={() => setToon(true)}
      onMouseLeave={() => setToon(false)}
    >
      <button
        type="button"
        aria-label={regel}
        onFocus={() => setToon(true)}
        onBlur={() => setToon(false)}
        onClick={() => setToon((v) => !v)}
        className="grid size-9 place-items-center rounded-full transition-colors hover:bg-crema-100"
      >
        <span className="relative grid place-items-center">
          {/* Het kloppende ringetje alleen als er ook echt iemand is. */}
          {open && (
            <span
              className="absolute size-2.5 rounded-full bg-pistacchio-500 opacity-60"
              style={{ animation: 'klop 2.4s ease-in-out infinite' }}
              aria-hidden="true"
            />
          )}
          <span
            className={`relative size-2.5 rounded-full ${
              open ? 'bg-pistacchio-700' : 'bg-espresso-900/30'
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/*
        Zichtbaarheid via state, niet via `group-hover:`.
        Tailwind zet die variant achter `:where(.group)` — specificiteit nul —
        dus botst hij met `opacity-0` en beslist de volgorde in het stylesheet
        wie wint. Met een klasse die er wel of niet staat, is er niets om over
        te botsen. Werkt meteen ook op een telefoon: daar is het een tik.
      */}
      <span
        role="status"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 whitespace-nowrap rounded-full bg-espresso-900 px-3.5 py-2 text-[0.72rem] sm:text-[0.65rem] font-medium text-crema-50 shadow-lift transition-all duration-200 ease-soft"
        style={{
          // Inline, niet via utility-klassen: `opacity-0` en `opacity-100`
          // hebben in Tailwind dezelfde specificiteit, en dan beslist de
          // volgorde in het stylesheet in plaats van de staat.
          opacity: toon ? 1 : 0,
          transform: `translateX(-50%) translateY(${toon ? '0' : '0.25rem'})`,
        }}
      >
        {regel}
      </span>
    </span>
  )
}
