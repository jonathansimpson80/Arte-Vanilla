import { useEffect, useState } from 'react'
import { bestand } from '@/lib/pad'

export type Vandaag = {
  /** Datum waarop de winkel dit heeft bijgewerkt, als JJJJ-MM-DD. */
  bijgewerkt: string | null
  /** Namen zoals in data/flavours.ts. */
  smaken: string[]
}

/**
 * Wat er vandaag écht in de vitrine ligt.
 *
 * De vitrine draait per week, maar de smakenlijst in de code staat vast. Dit
 * bestand staat los in `public/vandaag.json`, zodat de zaak het zelf kan
 * bijwerken zonder dat er iemand aan de site hoeft te bouwen. Ontbreekt het,
 * is het leeg, of is het van gisteren, dan toont de site gewoon de vaste
 * kaart — dat is beter dan een lege vitrine beloven.
 */
export function useVandaag(): Vandaag | null {
  const [vandaag, setVandaag] = useState<Vandaag | null>(null)

  useEffect(() => {
    let afgebroken = false

    fetch(bestand('/vandaag.json'), { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (afgebroken || !data || !Array.isArray(data.smaken) || data.smaken.length === 0) return

        // Alleen tonen als het van vandaag is; een lijst van vorige week is
        // schadelijker dan geen lijst.
        const nu = new Date()
        const vandaagSleutel = [
          nu.getFullYear(),
          String(nu.getMonth() + 1).padStart(2, '0'),
          String(nu.getDate()).padStart(2, '0'),
        ].join('-')

        if (data.bijgewerkt !== vandaagSleutel) return
        setVandaag({ bijgewerkt: data.bijgewerkt, smaken: data.smaken })
      })
      .catch(() => {
        // Geen bestand, geen probleem.
      })

    return () => {
      afgebroken = true
    }
  }, [])

  return vandaag
}
