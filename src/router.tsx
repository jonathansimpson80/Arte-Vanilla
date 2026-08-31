import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { RootLayout } from '@/components/RootLayout'
import { Home } from '@/pages/Home'
import { ErrorPage } from '@/pages/ErrorPage'
import { PaginaLader } from '@/components/PaginaLader'
import { STANDAARDTAAL, talen } from '@/i18n/taal'

/**
 * De homepage zit in de eerste bundel: die wil je meteen zien. De rest wordt
 * pas opgehaald als iemand er heen klikt — het bestelformulier hoeft niet mee
 * te reizen met een bezoeker die alleen de smaken bekijkt.
 */
const Flavours = lazy(() => import('@/pages/Flavours').then((m) => ({ default: m.Flavours })))
const Dolci = lazy(() => import('@/pages/Dolci').then((m) => ({ default: m.Dolci })))
const Afhalen = lazy(() => import('@/pages/Afhalen').then((m) => ({ default: m.Afhalen })))
const OverOns = lazy(() => import('@/pages/OverOns').then((m) => ({ default: m.OverOns })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))
const StyleGuide = lazy(() => import('@/pages/StyleGuide').then((m) => ({ default: m.StyleGuide })))

function Laat({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PaginaLader />}>{children}</Suspense>
}

/**
 * Dezelfde paginaset onder elk taalvoorvoegsel. Engels staat op de wortel,
 * Nederlands en Italiaans onder `/nl` en `/it`.
 */
function paginas(): RouteObject[] {
  return [
    { index: true, element: <Home /> },
    { path: 'smaken', element: <Laat><Flavours /></Laat> },
    { path: 'dolci', element: <Laat><Dolci /></Laat> },
    { path: 'afhalen', element: <Laat><Afhalen /></Laat> },
    { path: 'over-ons', element: <Laat><OverOns /></Laat> },

    // De koffiekaart en de deals staan nu op de gebakpagina. De oude adressen
    // blijven werken, zodat gedeelde links en zoekresultaten niet doodlopen.
    { path: 'koffie', element: <Navigate to="../dolci#koffie" replace relative="path" /> },
    { path: 'aanbieding', element: <Navigate to="../dolci#deals" replace relative="path" /> },

    { path: '*', element: <Laat><NotFound /></Laat> },
  ]
}

const taalRoutes: RouteObject[] = talen
  .filter((taal) => taal !== STANDAARDTAAL)
  .map((taal) => ({
    path: `/${taal}`,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: paginas(),
  }))

export const router = createBrowserRouter(
  [
    ...taalRoutes,
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: paginas(),
    },
    // Staat bewust buiten de site-layout: de styleguide is een intern document.
    { path: '/styleguide', element: <Laat><StyleGuide /></Laat>, errorElement: <ErrorPage /> },
  ],
  {
    /**
     * Op GitHub Pages staat de site onder /<repo>/. Vite zet dat pad in
     * BASE_URL, en de router moet het weten: anders wijst elke link naar de
     * wortel van het domein en loop je meteen tegen een 404 aan.
     */
    basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined,
  },
)
