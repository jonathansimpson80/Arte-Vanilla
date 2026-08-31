import type { ReactNode } from 'react'
import { useScrollProgress } from '@/motion/useScrollProgress'

type Props = {
  /** Totale verplaatsing over de hele doorloop, in px. Negatief = omhoog. */
  distance?: number
  className?: string
  children: ReactNode
}

/** Element dat trager (of sneller) meebeweegt dan de pagina. */
export function Parallax({ distance = -80, className, children }: Props) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          transform: `translate3d(0, ${(progress - 0.5) * distance}px, 0)`,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
