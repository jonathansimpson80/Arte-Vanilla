import { useEffect, useState } from 'react'

type Props = {
  /** Woorden die elkaar afwisselen. */
  words: string[]
  /** ms per aangeslagen letter. */
  typeSpeed?: number
  /** ms per gewiste letter. */
  deleteSpeed?: number
  /** Hoe lang een compleet woord blijft staan. */
  holdTime?: number
  /**
   * Typt alleen het eerste woord en laat het daarna staan.
   *
   * Voor een paginakop: daar hoort één zin te staan, niet een woord dat om de
   * twee tellen weer wordt uitgewist. Het gebaar blijft hetzelfde als op de
   * homepage — letters die binnenkomen met een knipperende cursor — maar het
   * eindigt in rust.
   */
  once?: boolean
  className?: string
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Typt woorden achter elkaar, met knipperende cursor.
 * Onder prefers-reduced-motion staat het eerste woord er gewoon,
 * zonder animatie en zonder cursor.
 */
export function Typewriter({
  words,
  typeSpeed = 85,
  deleteSpeed = 45,
  holdTime = 1800,
  once = false,
  className = '',
}: Props) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(words[0] ?? '')
  const [deleting, setDeleting] = useState(false)
  const [still, setStill] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStill(true)
      setText(words[0] ?? '')
    } else {
      setText('')
    }
  }, [words])

  useEffect(() => {
    if (still) return

    const woord = words[index % words.length]

    // Eén keer typen: klaar is klaar.
    if (once && text === woord) return

    // Woord compleet: even laten staan, daarna wissen.
    if (!deleting && text === woord) {
      const timer = window.setTimeout(() => setDeleting(true), holdTime)
      return () => window.clearTimeout(timer)
    }

    // Woord leeg: door naar het volgende.
    if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }

    const timer = window.setTimeout(
      () =>
        setText((huidig) =>
          deleting ? woord.slice(0, huidig.length - 1) : woord.slice(0, huidig.length + 1),
        ),
      deleting ? deleteSpeed : typeSpeed,
    )
    return () => window.clearTimeout(timer)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, holdTime, still, once])

  // Het langste woord reserveert de breedte, zodat de regel niet springt
  // terwijl er letters bij komen of af gaan.
  const langste = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  /**
   * Eén keer typen (een paginakop) werkt anders dan woorden die elkaar
   * afwisselen. Bij het wisselende geval houdt een onzichtbare kopie van het
   * langste woord de breedte vast, in een raster. Dat raster is een blok, en
   * in een kop van drie regels zet dat de tekst op een eigen regel — met een
   * losse punt eronder als de zin net anders afbreekt.
   *
   * Voor de kop zetten we daarom de nog niet getypte letters onzichtbaar
   * achter de zichtbare: de regelafbreking is meteen die van de eindtekst,
   * alles blijft gewone inline-tekst, en er springt niets.
   */
  if (once) {
    const woord = words[0] ?? ''
    const rest = woord.slice(text.length)

    return (
      <span className={className}>
        <span aria-hidden="true">{text}</span>
        {!still && text !== woord && (
          <span className="typewriter-caret" aria-hidden="true">
            |
          </span>
        )}
        <span aria-hidden="true" style={{ visibility: 'hidden' }}>
          {rest}
        </span>
        <span className="sr-only">{woord}</span>
      </span>
    )
  }

  return (
    <span className={`typewriter ${className}`}>
      <span className="typewriter__sizer" aria-hidden="true">
        {langste}
      </span>
      {/* De letters die verschijnen zijn beeld, geen tekst om voor te lezen:
          de volledige woorden staan hieronder in de sr-only regel. Zonder dit
          hoort een schermlezer de kop twee keer. */}
      <span className="typewriter__text" aria-hidden="true">
        {text}
        {!still && (
          <span className="typewriter-caret" aria-hidden="true">
            |
          </span>
        )}
      </span>
      <span className="sr-only">{words.join(', ')}</span>
    </span>
  )
}
