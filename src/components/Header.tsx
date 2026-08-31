import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Foto } from '@/components/ui/Foto'
import { OpenNu } from '@/components/OpenNu'
import { padInTaal, talen, useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { kaartLink, routeLink } from '@/data/contact'

/** De vier delen van het aanbod, plus de weg naar de winkel. */
/**
 * Vier bestemmingen. Koffie en de aanbiedingen stonden eerst apart, maar een
 * navigatie-item dat naar een halfgevulde pagina leidt kost meer dan het
 * oplevert; ze staan nu op de gebakpagina.
 */
const links = [
  { href: '/smaken', tekst: ui.navIjs },
  { href: '/dolci', tekst: ui.navGebak },
  { href: '/afhalen', tekst: ui.navAfhalen },
  { href: '/over-ons', tekst: ui.navOverOns },
  { href: '/#bezoek', tekst: ui.navBezoek },
]

export function Header() {
  const { taal, t, pad } = useTaal()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  // De balk krijgt pas schaduw zodra je van de hero af scrollt.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        className={`container-page flex h-16 items-center justify-between rounded-full bg-crema-50/90 px-4 backdrop-blur-md transition-shadow duration-300 ease-soft sm:px-6 ${
          scrolled ? 'shadow-lift ring-1 ring-espresso-900/5' : ''
        }`}
      >
        <Link to={pad('/')} className="flex items-center gap-3">
          {/* Het echte logo van de zaak; de streepcirkel was een benadering. */}
          <Foto
            src="/media/logo.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            className="size-12 rounded-full object-cover ring-1 ring-espresso-900/15"
          />
          <span className="wordmark text-3xl leading-none text-espresso-900">Arte Vanilla</span>
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={pad(link.href)}
              className="font-display text-[0.95rem] font-bold text-cacao-700 transition-colors hover:text-fragola-700"
            >
              {t(link.tekst)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <OpenNu />

          {/* Taalwissel: drie knoppen in plaats van een uitklaplijst — bij drie
              opties is kiezen sneller dan openklappen. */}
          <div
            className="hidden items-center rounded-full bg-crema-100 p-1 sm:flex"
            role="group"
            aria-label={t(ui.taalKiezen)}
          >
            {talen.map((code) => (
              <Link
                key={code}
                to={padInTaal(pathname, code)}
                hrefLang={code}
                lang={code}
                aria-current={taal === code ? 'true' : undefined}
                className={`chunk rounded-full px-2.5 py-1.5 text-[0.72rem] sm:text-[0.65rem] transition-colors ${
                  taal === code
                    ? 'bg-espresso-900 text-crema-50'
                    : 'text-espresso-900/60 hover:text-espresso-900'
                }`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Zolang er geen telefoonnummer bekend is: de weg ernaartoe. */}
          <a
            href={kaartLink}
            target="_blank"
            rel="noreferrer"
            aria-label={t(ui.kaartOpenen)}
            className="hidden size-10 items-center justify-center rounded-full ring-1 ring-espresso-900/15 transition-colors hover:bg-crema-100 sm:flex"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </a>

          <div className="hidden sm:block">
            <Button size="sm" variant="secondary" href={routeLink}>
              {t(ui.route)}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobiel-menu"
            className="rounded-full p-3 text-espresso-900 lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobiel-menu"
          aria-label="Mobiel menu"
          className="container-page mt-2 rounded-scoop bg-crema-50 p-2 shadow-lift ring-1 ring-espresso-900/5 lg:hidden"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  to={pad(link.href)}
                  className="block rounded-soft px-4 py-3 font-display text-lg font-bold text-espresso-900 hover:bg-crema-100"
                >
                  {t(link.tekst)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 border-t border-espresso-900/10 p-3 sm:hidden">
            {talen.map((code) => (
              <Link
                key={code}
                to={padInTaal(pathname, code)}
                hrefLang={code}
                lang={code}
                aria-current={taal === code ? 'true' : undefined}
                className={`chunk flex-1 rounded-full px-3 py-2 text-center text-[0.72rem] sm:text-[0.65rem] ${
                  taal === code
                    ? 'bg-espresso-900 text-crema-50'
                    : 'bg-crema-100 text-espresso-900/60'
                }`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
