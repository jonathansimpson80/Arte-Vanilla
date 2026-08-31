import type { ElementType, ReactNode } from 'react'
import { Typewriter } from '@/motion/Typewriter'

type Props = {
  /** De hele kop, in de taal van de pagina. */
  tekst: string
  /** Het stuk dat gekleurd wordt; moet letterlijk in `tekst` voorkomen. */
  accent: string
  as?: ElementType
  id?: string
  className?: string
}

/**
 * Paginakop met één gekleurd woord dat net iets later binnenkomt dan de rest.
 *
 * Dezelfde greep als op de homepage, zodat elke pagina met hetzelfde gebaar
 * opent. Staat het accent niet letterlijk in de kop — bijvoorbeeld doordat een
 * vertaling is bijgewerkt — dan verschijnt gewoon de hele kop: liever geen
 * kleur dan een halve zin.
 */
export function KopMetAccent({ tekst, accent, as: Tag = 'h1', id, className }: Props) {
  const i = accent ? tekst.indexOf(accent) : -1

  let inhoud: ReactNode = tekst
  if (i >= 0) {
    inhoud = (
      <>
        {tekst.slice(0, i)}
        <Typewriter words={[accent]} once className="text-fragola-500" />
        {tekst.slice(i + accent.length)}
      </>
    )
  }

  return (
    <Tag id={id} className={className}>
      {inhoud}
    </Tag>
  )
}
