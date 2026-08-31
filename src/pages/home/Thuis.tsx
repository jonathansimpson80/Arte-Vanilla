import { BakkenVoorThuis } from '@/components/BakkenVoorThuis'
import { SwirlBackground } from '@/components/SwirlBackground'

export function Thuis() {
  return (
    <>
      {/* ---------- bakken voor thuis ---------- */}
      {/**
       * Geen strepen hier: vier gekleurde kaarten op een streeppatroon werd
       * een raster op een raster, en de waas die de tekst leesbaar moest
       * houden maakte er een vlekkerig verloop van.
       *
       * In plaats daarvan een trage swirl — wat er in de machine gebeurt —
       * zo laag van contrast dat de kaarten en de kop er rustig op liggen.
       */}
      <section className="relative overflow-hidden py-20" aria-labelledby="thuis">
        <SwirlBackground />

        <div className="container-page relative">
          <BakkenVoorThuis />
        </div>
      </section>
    </>
  )
}
