export type GlyphName =
  | 'hoorntje'
  | 'druppel'
  | 'kers'
  | 'citrus'
  | 'boon'
  | 'hart'
  | 'blad'
  | 'ster'
  | 'sprankel'
  | 'locatie'
  | 'aanhaling'
  | 'instagram'
  | 'pijl'
  | 'telefoon'

const paden: Record<GlyphName, React.ReactNode> = {
  hoorntje: (
    <>
      <path d="M8 9a4 4 0 0 1 8 0" />
      <path d="M6.8 9h10.4l-4.4 10.4a1 1 0 0 1-1.6 0L6.8 9Z" />
    </>
  ),
  druppel: <path d="M12 3.5c3.2 3.6 5 6.2 5 8.6a5 5 0 0 1-10 0c0-2.4 1.8-5 5-8.6Z" />,
  kers: (
    <>
      <circle cx="8.5" cy="17" r="3.2" />
      <circle cx="16" cy="18" r="2.6" />
      <path d="M8.8 13.8C10 9 13 5.5 17.5 4" />
    </>
  ),
  citrus: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
    </>
  ),
  boon: <path d="M15.5 4c3 1.6 4 5.4 2.4 8.7-1.7 3.4-5.4 5.6-8.6 5.2-3-.4-4.7-3-3.8-6.3C6.7 7.4 12 2.2 15.5 4Z" />,
  hart: <path d="M12 20s-7-4.4-7-9.2A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />,
  blad: (
    <>
      <path d="M19 4c1 7.5-3.2 13-9.5 13A4.5 4.5 0 0 1 5 12.5C5 7 11 3.8 19 4Z" />
      <path d="M13 9c-3 2-4.6 5-5.4 9" />
    </>
  ),
  ster: <path d="M12 3.5 14 9l5.5 2-5.5 2-2 5.5-2-5.5L4.5 11 10 9l2-5.5Z" />,
  sprankel: (
    <path d="M12 3c.6 4.4 1.6 5.4 6 6-4.4.6-5.4 1.6-6 6-.6-4.4-1.6-5.4-6-6 4.4-.6 5.4-1.6 6-6Z" />
  ),
  pijl: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </>
  ),
  telefoon: (
    <path d="M21 16.9v2.6a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6A2 2 0 0 1 3.3 2H6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.7a2 2 0 0 1-.5 2.1L7.1 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  locatie: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  aanhaling: (
    <>
      <path d="M9 7C6.5 8 5 10 5 13v4h5v-5H7.5c0-2 .6-3.4 2-4.2L9 7Z" />
      <path d="M18 7c-2.5 1-4 3-4 6v4h5v-5h-2.5c0-2 .6-3.4 2-4.2L18 7Z" />
    </>
  ),
}

/** Klein lijnicoontje bij een smaakrij. Erft de kleur van de tekst. */
export function Glyph({ name, size = 18 }: { name: GlyphName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paden[name]}
    </svg>
  )
}
