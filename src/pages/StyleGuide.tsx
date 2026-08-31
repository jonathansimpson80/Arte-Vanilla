import type { ReactNode } from 'react'
import { Seo } from '@/lib/seo'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, FlavourCard } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { LogoMark, Wordmark } from '@/components/ui/Wordmark'
import {
  coreColors,
  flavourColors,
  flavours,
  neutralColors,
  typeScale,
  type Swatch,
} from '@/data/designSystem'

export function StyleGuide() {
  return (
    <div className="min-h-dvh bg-crema-50 pb-32">
      <Seo
        title="Designsysteem"
        description="Levende styleguide voor Arte Vanilla, afgeleid van het Instagram-account."
      />

      <header className="stripes-soft border-b border-espresso-900/10">
        <div className="container-page flex flex-col items-start gap-8 py-16 sm:flex-row sm:items-center">
          <LogoMark size={110} />
          <div>
            <p className="eyebrow">Designsysteem v1</p>
            <h1 className="mt-3 font-display text-title text-espresso-900">
              Arte Vanilla — gelato, dolci &amp; caffè
            </h1>
            <p className="mt-3 max-w-xl text-lead text-cacao-700">
              Kleur, typografie en componenten afgeleid van het logo, de gevel en de
              feed van <span className="font-medium">@arte_vanilla</span>.
            </p>
          </div>
        </div>
      </header>

      <Section
        title="Kern-kleuren"
        intro="Crème en merkgeel komen rechtstreeks uit het logo; espresso, cacao en caramel zijn gemeten uit de productfotografie. Het getal is het contrast ten opzichte van crema-100."
      >
        <SwatchGrid swatches={coreColors} />
      </Section>

      <Section
        title="Neutralen"
        intro="Warm getint richting crème — nooit een koel grijs, dat valt uit de toon bij de fotografie."
      >
        <SwatchGrid swatches={neutralColors} />
      </Section>

      <Section
        title="Smaak-accenten"
        intro="Uitbreiding op het merk, niet uit het logo. Per smaak een vlakversie en een tekstveilige versie."
      >
        <SwatchGrid swatches={flavourColors} />
      </Section>

      <Section
        title="Contrastregels"
        intro="Het merkgeel is licht (1.37:1 op crème). Dat bepaalt hoe het ingezet mag worden."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="ring-pistacchio-700/20">
            <p className="eyebrow text-pistacchio-700">Wel doen</p>
            <ul className="mt-4 space-y-3 text-sm text-espresso-900">
              <li className="rounded-soft bg-vaniglia-400 px-4 py-3">
                Espresso-tekst op een geel vlak — 11.25:1
              </li>
              <li className="rounded-soft bg-espresso-900 px-4 py-3 text-crema-50">
                Crème-tekst op espresso — 18.67:1
              </li>
              <li className="rounded-soft bg-crema-100 px-4 py-3">
                <span className="text-neutral-600">Gedempte tekst in neutral-600 — 5.9:1</span>
              </li>
            </ul>
          </Card>
          <Card className="ring-fragola-700/20">
            <p className="eyebrow text-fragola-700">Niet doen</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="rounded-soft bg-crema-100 px-4 py-3 text-vaniglia-400">
                Geel als tekstkleur op crème — 1.37:1
              </li>
              <li className="rounded-soft bg-crema-100 px-4 py-3 text-caramello-500">
                Caramel voor lopende tekst — 3.74:1 (alleen ≥ 24px)
              </li>
              <li className="rounded-soft bg-vaniglia-400 px-4 py-3 text-crema-50">
                Crème op geel — 1.3:1
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section
        title="Typografie"
        intro="Grand Hotel alleen voor de wordmark, Bricolage Grotesque voor koppen, Baloo 2 voor labels en cijfers, Hanken Grotesk voor lopende tekst."
      >
        <div className="space-y-8">
          <div className="rounded-scoop bg-crema-100 p-8 ring-1 ring-espresso-900/5">
            <p className="text-xs text-neutral-600">font-script — uitsluitend wordmark</p>
            <p className="wordmark mt-3 text-5xl text-espresso-900">Arte Vanilla</p>
          </div>
          {typeScale.map((item) => (
            <div key={item.token} className="border-b border-espresso-900/10 pb-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <code className="text-xs text-cacao-700">{item.token}</code>
                <span className="text-xs text-neutral-600">{item.note}</span>
              </div>
              <p className={`mt-3 ${item.className}`}>{item.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Streeppatroon"
        intro="Het herkenbaarste merkelement: verticale strepen in het logo én op de gevel en de muur in de winkel. Gebruik het als vlak, nooit direct achter lopende tekst."
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <PatternTile className="stripes" label=".stripes" note="12px — logo en accenten" />
          <PatternTile className="stripes-soft" label=".stripes-soft" note="14px, zachter — grote vlakken" />
          <PatternTile className="stripes-diagonal" label=".stripes-diagonal" note="-45° — banners" />
        </div>
      </Section>

      <Section title="Knoppen" intro="Drie varianten, drie maten. Altijd pill-vormig — dat rijmt met de ronde logovorm.">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Bestel via Uber Eats</Button>
            <Button variant="secondary">Bekijk de smaken</Button>
            <Button variant="ghost">Openingstijden</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Uitgeschakeld</Button>
          </div>
        </div>
      </Section>

      <Section title="Labels" intro="Korte statuslabels: smaak van de week, dieet-informatie, openingsstatus.">
        <div className="flex flex-wrap gap-3">
          <Badge tone="vaniglia">Nieuw</Badge>
          <Badge tone="pistacchio">Vegan</Badge>
          <Badge tone="fragola">Seizoen</Badge>
          <Badge tone="cacao">Nu open</Badge>
          <Badge tone="neutral">Glutenvrij</Badge>
        </div>
      </Section>

      <Section title="Smaakkaarten" intro="Het standaardpatroon voor de smakenlijst: kleurvlak, Italiaanse naam als eyebrow, Nederlandse naam als kop.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {flavours.map((flavour) => (
            <FlavourCard
              key={flavour.name}
              name={flavour.name}
              italian={flavour.italian}
              description={flavour.description}
              swatch={flavour.swatch}
              badge={flavour.name === 'Aardbei' ? <Badge tone="vaniglia">Seizoen</Badge> : undefined}
            />
          ))}
        </div>
      </Section>

      <Section title="Formulier" intro="Velden staan op crema-50 binnen een crème kaart, met een cacao-focusring.">
        <Card className="max-w-md">
          <div className="space-y-5">
            <Field label="Naam" name="sg-naam" placeholder="Giulia" autoComplete="off" />
            <Field
              label="E-mail"
              name="sg-email"
              type="email"
              placeholder="ciao@voorbeeld.nl"
              hint="We gebruiken dit alleen om te antwoorden."
              autoComplete="off"
            />
            <Button>Versturen</Button>
          </div>
        </Card>
      </Section>

      <Section title="Vorm en diepte" intro="Ronde hoeken lopen op met het formaat van het vlak; schaduwen zijn warm getint, nooit neutraal grijs.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ShapeTile className="rounded-soft" label="radius-soft · 12px" />
          <ShapeTile className="rounded-scoop" label="radius-scoop · 24px" />
          <ShapeTile className="rounded-cone" label="radius-cone · 40px" />
          <ShapeTile className="rounded-scoop shadow-float" label="shadow-float" />
        </div>
      </Section>

      <Section title="Voorbeeld in context" intro="Dezelfde tokens in een hero — zo hoort het samen te komen.">
        <div className="overflow-hidden rounded-cone bg-crema-100 ring-1 ring-espresso-900/5">
          <div className="stripes h-3" />
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Gelato, dolci &amp; caffè · Amsterdam</p>
              <h2 className="mt-4 font-display text-display text-espresso-900">
                De recepten van Nonna, elke ochtend vers gedraaid.
              </h2>
              <p className="mt-5 max-w-lg text-lead text-neutral-600">
                Handgemaakt Italiaans gelato en gebak. Kom langs voor een bolletje,
                of bestel thuis.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg">Kom langs</Button>
                <Button size="lg" variant="ghost">
                  Ma 15:30–22:00 · Di–zo 12:00–22:00
                </Button>
              </div>
            </div>
            <div className="stripes flex aspect-square items-center justify-center rounded-scoop">
              <span className="rounded-full bg-crema-50/90 px-8 py-6 text-center">
                <Wordmark withTagline className="text-4xl" />
              </span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <section className="container-page pt-16">
      <h2 className="font-display text-title text-espresso-900">{title}</h2>
      <p className="mt-3 max-w-2xl text-neutral-600">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {swatches.map((swatch) => (
        <div
          key={swatch.token}
          className="overflow-hidden rounded-scoop bg-crema-100 ring-1 ring-espresso-900/5"
        >
          <div className="h-20" style={{ backgroundColor: swatch.hex }} />
          <div className="p-4">
            <div className="flex items-baseline justify-between gap-2">
              <code className="text-sm text-espresso-900">{swatch.token}</code>
              <span className="text-xs text-neutral-600 tabular-nums">{swatch.hex}</span>
            </div>
            <p className="mt-2 text-xs text-neutral-600">{swatch.source}</p>
            <p className="mt-1 text-xs text-cacao-700">{swatch.usage}</p>
            <p className="mt-2 text-xs text-neutral-600 tabular-nums">
              {swatch.onCrema.toFixed(2)}:1 op crema-100
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function PatternTile({ className, label, note }: { className: string; label: string; note: string }) {
  return (
    <div className="overflow-hidden rounded-scoop ring-1 ring-espresso-900/5">
      <div className={`h-32 ${className}`} />
      <div className="bg-crema-100 p-4">
        <code className="text-sm text-espresso-900">{label}</code>
        <p className="mt-1 text-xs text-neutral-600">{note}</p>
      </div>
    </div>
  )
}

function ShapeTile({ className, label }: { className: string; label: string }) {
  return (
    <div className="text-center">
      <div className={`h-28 bg-vaniglia-400 ${className}`} />
      <p className="mt-3 text-xs text-neutral-600">{label}</p>
    </div>
  )
}
