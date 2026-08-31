export type Swatch = {
  token: string
  hex: string
  /** Waar de kleur vandaan komt. */
  source: string
  usage: string
  /** Contrast t.o.v. crema-100 (#fcf3e2), afgerond op 2 decimalen. */
  onCrema: number
}

export const coreColors: Swatch[] = [
  { token: 'crema-50', hex: '#fffbf2', source: 'Logo-achtergrond, licht opgehaald', usage: 'Pagina-achtergrond', onCrema: 1.05 },
  { token: 'crema-100', hex: '#fcf3e2', source: 'Achtergrond logo', usage: 'Standaard vlak, kaarten', onCrema: 1 },
  { token: 'crema-200', hex: '#f6e7cb', source: 'Afgeleid', usage: 'Rustig vlak, randen', onCrema: 1.09 },
  { token: 'crema-300', hex: '#eed9b3', source: 'Afgeleid', usage: 'Scheidingslijn, uitgeschakeld', onCrema: 1.2 },
  { token: 'vaniglia-300', hex: '#f9e2a0', source: 'Lichte streep gevelpatroon', usage: 'Zachte streepvariant', onCrema: 1.14 },
  { token: 'vaniglia-400', hex: '#f4cf64', source: 'Logostrepen (#f4cf64 gemeten)', usage: 'MERKGEEL — vlakken, nooit tekst', onCrema: 1.37 },
  { token: 'vaniglia-500', hex: '#e5b845', source: 'Afgeleid', usage: 'Hover op geel vlak', onCrema: 1.62 },
  { token: 'oro-600', hex: '#a5864d', source: 'Schaduw in logo (#a5864d gemeten)', usage: 'Fijne randen, iconen', onCrema: 3.12 },
  { token: 'espresso-900', hex: '#1d0805', source: 'Wordmark in logo', usage: 'Primaire tekst, knoppen', onCrema: 17.5 },
  { token: 'espresso-800', hex: '#2f160c', source: 'Donkerste tint in foto’s', usage: 'Tekst op geel (11.25:1)', onCrema: 14.55 },
  { token: 'cacao-700', hex: '#5d321c', source: 'Chocolade in productfoto’s', usage: 'Secundaire tekst, focusring', onCrema: 9.83 },
  { token: 'caramello-500', hex: '#af6e2c', source: 'Caramel/gebak in foto’s', usage: 'Grafisch en grote tekst (3.74:1)', onCrema: 3.74 },
]

export const neutralColors: Swatch[] = [
  { token: 'neutral-600', hex: '#6b5b4e', source: 'Warm getint neutraal', usage: 'Gedempte tekst (AA)', onCrema: 5.9 },
  { token: 'neutral-400', hex: '#a2938a', source: 'Warm getint neutraal', usage: 'Iconen, placeholders', onCrema: 3.09 },
  { token: 'neutral-200', hex: '#d9cec2', source: 'Warm getint neutraal', usage: 'Randen, scheidingen', onCrema: 1.42 },
]

export const flavourColors: Swatch[] = [
  { token: 'pistacchio-500', hex: '#8a9a5b', source: 'Uitbreiding — pistache', usage: 'Kleurvlak, smaakkaart', onCrema: 2.78 },
  { token: 'pistacchio-700', hex: '#5f6b3a', source: 'Uitbreiding — pistache', usage: 'Tekst op crème (5.22:1)', onCrema: 5.22 },
  { token: 'fragola-500', hex: '#b4544c', source: 'Uitbreiding — aardbei', usage: 'Kleurvlak, smaakkaart', onCrema: 4.42 },
  { token: 'fragola-700', hex: '#8c3b36', source: 'Uitbreiding — aardbei', usage: 'Tekst op crème (6.82:1)', onCrema: 6.82 },
]

export const typeScale = [
  { token: 'text-display', sample: 'Gelato zoals bij Nonna', className: 'font-display text-display', note: 'Bricolage Grotesque · clamp(3rem → 6rem) · één per pagina' },
  { token: 'text-title', sample: 'Smaken van deze week', className: 'font-display text-title', note: 'Bricolage Grotesque · sectiekoppen' },
  { token: 'text-xl', sample: 'Pistacchio di Bronte', className: 'font-display text-xl', note: 'Bricolage Grotesque · kaart- en itemkoppen' },
  { token: 'text-lead', sample: 'Elke ochtend vers gedraaid in de winkel aan de gracht.', className: 'text-lead text-neutral-600', note: 'Hanken Grotesk · introtekst' },
  { token: 'text-base', sample: 'Handgemaakt gelato, dolci en caffè uit Amsterdam.', className: 'text-base text-espresso-900', note: 'Hanken Grotesk · lopende tekst' },
  { token: 'text-sm', sample: 'Ma 15:30–22:00 · Di t/m zo 12:00–22:00', className: 'text-sm text-neutral-600', note: 'Hanken Grotesk · bijschrift, metadata' },
  { token: 'text-eyebrow', sample: 'Gelato, dolci & caffè', className: 'eyebrow', note: 'Baloo 2 700 · 0.12em tracking · boven een kop' },
]

export const flavours = [
  { name: 'Pistache', italian: 'Pistacchio', description: 'Siciliaanse pistache, zonder kleurstof — daarom eerder kaki dan groen.', swatch: 'bg-pistacchio-500' },
  { name: 'Aardbei', italian: 'Fragola', description: 'Alleen in het seizoen, met hele stukken fruit door het gelato.', swatch: 'bg-fragola-500' },
  { name: 'Chocolade', italian: 'Cioccolato fondente', description: '70% pure chocolade, water in plaats van melk — intens en veganistisch.', swatch: 'bg-cacao-700' },
  { name: 'Vanille', italian: 'Fiordilatte alla vaniglia', description: 'Bourbon-vanille met echte peulen, het huisrecept van Nonna.', swatch: 'bg-vaniglia-400' },
]
