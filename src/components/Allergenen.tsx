import { allergeen, type AllergeenSleutel } from '@/data/allergenen'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

/**
 * De allergenenregel onder een kaart.
 *
 * Staat er niets in de lijst, dan zegt de regel dat ook — zwijgen zou lezen
 * als "geen allergenen", en dat is precies de verkeerde boodschap.
 */
export function Allergenen({
  lijst,
  kleur,
}: {
  lijst?: AllergeenSleutel[]
  kleur?: string
}) {
  const { t } = useTaal()

  return (
    <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs text-espresso-900/60">
      <span className="chunk text-[0.66rem] sm:text-[0.6rem]" style={{ color: kleur }}>
        {t(ui.allergenen)}
      </span>
      {lijst && lijst.length > 0 ? (
        <span>{lijst.map((sleutel) => t(allergeen[sleutel])).join(' · ')}</span>
      ) : (
        <span className="italic">{t(ui.allergenenOnbekend)}</span>
      )}
    </p>
  )
}
