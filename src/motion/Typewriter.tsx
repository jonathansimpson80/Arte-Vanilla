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
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, holdTime, still])

  // Het langste woord reserveert de breedte, zodat de regel niet springt
  // terwijl er letters bij komen of af gaan.
  const langste = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className={`typewriter ${className}`}>
      <span className="typewriter__sizer" aria-hidden="true">
        {langste}
      </span>
      <span className="typewriter__text">
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
