import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { TaalProvider, taalUitPad } from '@/i18n/taal'
import { SeoBasis } from '@/lib/seo'

/**
 * De taal komt uit het eerste stuk van het pad. Daardoor is de URL de enige
 * bron van waarheid: geen staat die uit de pas kan lopen met wat er in de
 * adresbalk staat, en een gedeelde link opent altijd in de juiste taal.
 */
export function RootLayout() {
  const { pathname } = useLocation()
  const taal = taalUitPad(pathname)

  return (
    <TaalProvider taal={taal}>
      <SeoBasis />

      <div className="flex min-h-dvh flex-col">
        <a
          href="#hoofdinhoud"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-espresso-900 focus:px-4 focus:py-2 focus:text-crema-50"
        >
          Naar hoofdinhoud
        </a>
        <Header />
        <main id="hoofdinhoud" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
    </TaalProvider>
  )
}
