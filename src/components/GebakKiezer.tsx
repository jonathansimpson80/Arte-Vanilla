import { dolci } from '@/data/dolci'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

export type Gebakregel = { naam: string; aantal: number; prijs: number | null }

type Props = {
  gekozen: Record<string, number>
  onChange: (gekozen: Record<string, number>) => void
}

/**
 * Gebak erbij kiezen, met een teller per stuk.
 *
 * Alleen wat er echt is: de kaarten die als `concept` gemarkeerd staan doen
 * niet mee, want daarvan weet de zaak zelf nog niet of ze blijven. Items
 * zonder prijs mogen wel besteld worden — er staat dan een streepje, en het
 * totaal zegt erbij dat de toonbank de rest optelt.
 */
export function GebakKiezer({ gekozen, onChange }: Props) {
  const { t } = useTaal()
  const kiesbaar = dolci.filter((d) => !d.concept)

  function zet(sleutel: string, aantal: number) {
    const volgende = { ...gekozen }
    if (aantal <= 0) delete volgende[sleutel]
    else volgende[sleutel] = Math.min(aantal, 12)
    onChange(volgende)
  }

  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {kiesbaar.map((item) => {
        const sleutel = item.name.nl
        const aantal = gekozen[sleutel] ?? 0

        return (
          <li
            key={sleutel}
            className={`flex items-center gap-3 rounded-scoop px-4 py-3 ring-1 transition-colors ${
              aantal > 0
                ? 'bg-espresso-900 text-crema-50 ring-espresso-900'
                : 'bg-crema-50 text-espresso-900 ring-espresso-900/10'
            }`}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{t(item.name)}</span>
              <span className="chunk block text-[0.66rem] tabular-nums opacity-60 sm:text-[0.6rem]">
                {item.price === null
                  ? t(ui.prijsAanToonbank)
                  : `€ ${item.price.toFixed(2).replace('.', ',')}`}
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => zet(sleutel, aantal - 1)}
                disabled={aantal === 0}
                aria-label={`${t(ui.minderVan)} ${t(item.name)}`}
                className={`grid size-9 place-items-center rounded-full text-lg leading-none transition-colors disabled:opacity-30 ${
                  aantal > 0 ? 'bg-crema-50/15 hover:bg-crema-50/25' : 'bg-espresso-900/6'
                }`}
              >
                −
              </button>
              <span className="w-6 text-center text-sm tabular-nums">{aantal}</span>
              <button
                type="button"
                onClick={() => zet(sleutel, aantal + 1)}
                aria-label={`${t(ui.meerVan)} ${t(item.name)}`}
                className={`grid size-9 place-items-center rounded-full text-lg leading-none transition-colors ${
                  aantal > 0 ? 'bg-crema-50/15 hover:bg-crema-50/25' : 'bg-espresso-900/6 hover:bg-espresso-900/12'
                }`}
              >
                +
              </button>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/** De gekozen stuks als leesbare regels, voor het overzicht en het bericht. */
export function gebakRegels(gekozen: Record<string, number>, t: (v: never) => string) {
  return Object.entries(gekozen)
    .map(([sleutel, aantal]) => {
      const item = dolci.find((d) => d.name.nl === sleutel)
      if (!item) return null
      return { naam: t(item.name as never), aantal, prijs: item.price }
    })
    .filter((r): r is Gebakregel => r !== null)
}
