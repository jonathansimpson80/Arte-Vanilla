import { Seo } from '@/lib/seo'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

import { Hero } from './home/Hero'
import { Ticker } from './home/Ticker'
import { MoodsSection } from './home/Stemmingen'
import { Vitrine } from './home/Vitrine'
import { Ambacht } from './home/Ambacht'
import { Momenten } from './home/Momenten'
import { Reviews } from './home/Reviews'
import { Feed } from './home/Feed'
import { Thuis } from './home/Thuis'
import { Bezoek } from './home/Bezoek'
import { Slot } from './home/Slot'

/**
 * De homepage is één lange verticale route langs de zaak: binnenkomen, de
 * vitrine, het ijs, het gebak, het ambacht, de gasten, en de weg ernaartoe.
 * Elke sectie staat in `pages/home/` als los bestand — één bestand van
 * duizend regels is het eerste dat stukgaat zodra iemand er iets in wijzigt.
 */
export function Home() {
  const { t } = useTaal()

  return (
    <>
      <Seo title={t(ui.heroEyebrow)} description={t(ui.heroLead)} />

      <Hero />
      <Ticker />
      <MoodsSection />
      <Thuis />
      <Vitrine />
      <Ambacht />
      <Momenten />
      <Reviews />
      <Feed />
      <Bezoek />
      <Slot />
    </>
  )
}
