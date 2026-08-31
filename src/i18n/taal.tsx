import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'

export const talen = ['en', 'nl', 'it'] as const
export type Taal = (typeof talen)[number]

/**
 * Engels is de standaardtaal en staat daarom zonder voorvoegsel in de URL.
 * Nederlands en Italiaans krijgen `/nl` en `/it` ervoor, zodat elke taal een
 * eigen adres heeft dat een zoekmachine apart kan indexeren.
 */
export const STANDAARDTAAL: Taal = 'en'

/** Een tekst in alle drie de talen. */
export type Vertaald = Record<Taal, string>

/** Het voorvoegsel voor een taal: leeg voor de standaardtaal. */
export function taalVoorvoegsel(taal: Taal) {
  return taal === STANDAARDTAAL ? '' : `/${taal}`
}

/** Plakt het taalvoorvoegsel voor een intern pad. */
export function metTaal(taal: Taal, pad: string) {
  if (!pad.startsWith('/')) return pad
  const voorvoegsel = taalVoorvoegsel(taal)
  if (!voorvoegsel) return pad
  return pad === '/' ? voorvoegsel : `${voorvoegsel}${pad}`
}

/** Haalt de taal uit een pad; onbekend voorvoegsel betekent standaardtaal. */
export function taalUitPad(pad: string): Taal {
  const eerste = pad.split('/')[1]
  return (talen as readonly string[]).includes(eerste) ? (eerste as Taal) : STANDAARDTAAL
}

/** Hetzelfde pad, maar dan in een andere taal. */
export function padInTaal(pad: string, naar: Taal) {
  const huidige = taalUitPad(pad)
  const zonder = huidige === STANDAARDTAAL ? pad : pad.slice(`/${huidige}`.length) || '/'
  return metTaal(naar, zonder)
}

type Context = {
  taal: Taal
  /** Kiest de juiste tekst uit een vertaald veld. */
  t: (veld: Vertaald) => string
  /** Intern pad met het juiste taalvoorvoegsel. */
  pad: (pad: string) => string
}

const TaalContext = createContext<Context | null>(null)

/**
 * De taal komt uit de URL, niet uit een knop of uit localStorage. Zo hoort
 * bij elk adres precies één taal — dat is wat een zoekmachine nodig heeft, en
 * het maakt een gedeelde link voorspelbaar.
 */
export function TaalProvider({ taal, children }: { taal: Taal; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = taal
  }, [taal])

  const waarde = useMemo<Context>(
    () => ({
      taal,
      t: (veld) => veld[taal] ?? veld[STANDAARDTAAL],
      pad: (p) => metTaal(taal, p),
    }),
    [taal],
  )

  return <TaalContext.Provider value={waarde}>{children}</TaalContext.Provider>
}

export function useTaal() {
  const context = useContext(TaalContext)
  if (!context) throw new Error('useTaal moet binnen een TaalProvider staan')
  return context
}
