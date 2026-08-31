/**
 * Een pad naar een bestand in `public/`, met het basispad ervoor.
 *
 * Vite herschrijft alleen wat het zelf verwerkt: imports en de HTML. Paden die
 * als tekst in de data staan — `/media/logo.jpg` — blijven zoals ze zijn, en
 * die vallen op een subpad (GitHub Pages: /Arte-Vanilla/) naast de deur.
 *
 * Alles wat uit `public/` komt hoort hier doorheen.
 */
export function bestand(pad: string) {
  if (!pad.startsWith('/')) return pad
  const basis = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${basis}${pad}`
}
