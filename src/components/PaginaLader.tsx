import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

/**
 * Wat er staat terwijl een pagina wordt opgehaald. Bewust rustig: een
 * spinner die een halve seconde flitst is onrustiger dan een leeg vlak
 * met de juiste hoogte.
 */
export function PaginaLader() {
  const { t } = useTaal()

  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="flex gap-2" aria-hidden="true">
        {['bg-vaniglia-400', 'bg-fragola-400', 'bg-pistacchio-400'].map((kleur, i) => (
          <span
            key={kleur}
            className={`size-3 rounded-full ${kleur}`}
            style={{ animation: `bolletje 1.1s ${i * 0.15}s infinite ease-in-out` }}
          />
        ))}
      </span>
      <span className="sr-only">{t(ui.laden)}</span>
    </div>
  )
}
