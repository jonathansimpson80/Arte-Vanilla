import type { ReactNode } from 'react'

export type BadgeTone = 'vaniglia' | 'pistacchio' | 'fragola' | 'cacao' | 'neutral'

const tones: Record<BadgeTone, string> = {
  vaniglia: 'bg-vaniglia-400 text-espresso-900',
  pistacchio: 'bg-pistacchio-500/20 text-pistacchio-700',
  fragola: 'bg-fragola-500/18 text-fragola-700',
  cacao: 'bg-cacao-700 text-crema-50',
  neutral: 'bg-crema-200 text-cacao-700',
}

/** Kleine label-pil: smaak van de week, "vegan", "nieuw", openingsstatus. */
export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
