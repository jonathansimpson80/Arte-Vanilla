import type { ElementType, ReactNode } from 'react'
import { useReveal, type RevealOptions } from '@/motion/useReveal'

type Props = RevealOptions & {
  as?: ElementType
  className?: string
  children: ReactNode
}

/** Wikkel om alles wat bij binnenkomst in beeld moet opkomen. */
export function Reveal({ as: Tag = 'div', className, children, ...options }: Props) {
  const { ref, style } = useReveal<HTMLDivElement>(options)
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}

/**
 * Stagger-groep: elk kind krijgt oplopend vertraging.
 * `step` is de vertraging per kind in ms.
 */
export function RevealGroup({
  children,
  step = 90,
  className,
  ...options
}: Props & { step?: number }) {
  const items = Array.isArray(children) ? children : [children]
  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal key={i} delay={i * step} {...options}>
          {child}
        </Reveal>
      ))}
    </div>
  )
}
