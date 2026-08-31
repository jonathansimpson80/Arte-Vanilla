import type { ReactNode } from 'react'
import { useScrollProgress } from '@/motion/useScrollProgress'

type Props<T> = {
  items: T[]
  /** Hoeveel schermhoogtes één stap mag duren. */
  stepHeight?: number
  /** Afstand tot de bovenkant waar het panel blijft plakken. */
  stickyTop?: string
  renderPanel: (item: T, index: number, progress: number) => ReactNode
  className?: string
}

/**
 * Vastgezet panel dat door een lijst stapt terwijl je scrollt.
 * De sectie is `items.length × stepHeight` hoog; het panel plakt bovenin
 * en de actieve index volgt uit de scrollvoortgang.
 */
export function PinnedSteps<T>({
  items,
  stepHeight = 0.9,
  stickyTop = '110px',
  renderPanel,
  className = '',
}: Props<T>) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const index = Math.min(items.length - 1, Math.floor(progress * items.length))
  const item = items[index]

  return (
    <div
      ref={ref}
      className={className}
      style={{ height: `${items.length * stepHeight * 100}vh` }}
    >
      <div style={{ position: 'sticky', top: stickyTop }}>
        {renderPanel(item, index, progress)}
      </div>
    </div>
  )
}
