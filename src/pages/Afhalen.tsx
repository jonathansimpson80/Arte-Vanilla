import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Seo } from '@/lib/seo'
import { Button } from '@/components/ui/Button'
import { Glyph } from '@/components/ui/Glyph'
import { StripesBackground } from '@/components/StripesBackground'
import { Reveal } from '@/motion/Reveal'
import { KopMetAccent } from '@/components/ui/KopMetAccent'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'
import { afhaaldagen, extras, formaten, tijdvakken, type Formaat } from '@/data/afhalen'
import { flavours } from '@/data/flavours'
import { GebakKiezer, gebakRegels } from '@/components/GebakKiezer'
import {
  bonbedragen,
  MAX_BOODSCHAP,
  TAART_DAGEN_VOORUIT,
  taartmaten,
  TOON_VOORSTEL,
  type Bestelsoort,
  type Taartmaat,
} from '@/data/bestelsoorten'
import { adresRegel, contact, whatsappNummer } from '@/data/contact'

/**
 * Waar de bestelling heen gaat.
 *
 * Staat er een adres in `VITE_BESTEL_ENDPOINT`, dan gaat de bestelling daar
 * als JSON heen en stuurt die server hem door als e-mail en sms.
 *
 * Staat er niets — zoals op een statische host, waar geen server draait — dan
 * heeft een POST geen zin. De knop opent dan WhatsApp met de bestelling erin.
 * Dat werkt wél, en het is beter dan een knop die altijd op een foutmelding
 * uitkomt.
 */
/**
 * Waar de bestelling heen gaat. Op Vercel draait `api/bestelling.ts` op
 * `/api`, dus daar hoeft niets voor ingesteld te worden. Op een host zonder
 * serverfuncties — GitHub Pages bijvoorbeeld — bestaat dat adres niet; dan
 * mislukt de aanroep en laat het formulier de knoppen zien waarmee de klant
 * de bon alsnog zelf verstuurt.
 */
const ENDPOINT = import.meta.env.VITE_BESTEL_ENDPOINT ?? '/api'

type Verzendstatus = 'klaar' | 'bezig' | 'gelukt' | 'mislukt'

/**
 * Kort kenmerk dat de klant en de toonbank allebei kunnen noemen: datum plus
 * vier tekens. Niet uniek genoeg voor een administratie — de server hoort er
 * zijn eigen nummer aan te hangen — maar wel om aan de balie te noemen.
 */
function bestelnummer() {
  const nu = new Date()
  const datum = [nu.getMonth() + 1, nu.getDate()].map((n) => String(n).padStart(2, '0')).join('')
  const staart = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `AV-${datum}-${staart}`
}

export function Afhalen() {
  const { t, taal } = useTaal()

  const [soort, setSoort] = useState<Bestelsoort>('bak')
  const [formaat, setFormaat] = useState<Formaat | null>(null)
  const [taartmaat, setTaartmaat] = useState<Taartmaat | null>(null)
  const [boodschap, setBoodschap] = useState('')
  const [bonId, setBonId] = useState<string | null>(null)
  /** Aantal per gebak, met de Nederlandse naam als sleutel. */
  const [gebak, setGebak] = useState<Record<string, number>>({})
  const [vrijBedrag, setVrijBedrag] = useState('')
  const [smaken, setSmaken] = useState<string[]>([])
  const [gekozenExtras, setGekozenExtras] = useState<string[]>([])
  const [dagIndex, setDagIndex] = useState(0)
  const [tijd, setTijd] = useState('')
  const [naam, setNaam] = useState('')
  const [telefoon, setTelefoon] = useState('')
  const [status, setStatus] = useState<Verzendstatus>('klaar')
  const [nummer, setNummer] = useState<string | null>(null)
  const [bezet, setBezet] = useState<string[]>([])
  /** Honeypot: onzichtbaar voor mensen, aantrekkelijk voor bots. */
  const [bedrijf, setBedrijf] = useState('')

  // Een ijstaart moet opgebouwd worden en hard worden, dus die begint later
  // in de kalender dan een bak die zo geschept is.
  const dagen = useMemo(() => {
    if (soort !== 'taart') return afhaaldagen()
    const vanaf = new Date()
    vanaf.setDate(vanaf.getDate() + TAART_DAGEN_VOORUIT)
    return afhaaldagen(vanaf)
  }, [soort])
  const vakken = useMemo(() => tijdvakken(dagen[dagIndex]), [dagen, dagIndex])
  const dagSleutel = dagen[dagIndex].toISOString().slice(0, 10)

  /**
   * Welke tijdvakken al vol zitten. De winkel kan niet tien bakken tegelijk
   * scheppen, dus dat moet de server bijhouden. Antwoordt die niet — omdat hij
   * er nog niet is, of even plat ligt — dan blijft alles gewoon kiesbaar; een
   * formulier dat niets meer aanbiedt is erger dan één telefoontje te veel.
   */
  useEffect(() => {
    if (!ENDPOINT) return
    let afgebroken = false

    fetch(`${ENDPOINT}/bezet?dag=${dagSleutel}`)
      .then((r) => (r.ok ? r.json() : { vol: [] }))
      .then((data) => {
        if (!afgebroken) setBezet(Array.isArray(data?.vol) ? data.vol : [])
      })
      .catch(() => {
        if (!afgebroken) setBezet([])
      })

    return () => {
      afgebroken = true
    }
  }, [dagSleutel])

  useEffect(() => {
    setDagIndex(0)
    setTijd('')
  }, [soort])

  /** Hoeveel smaken er in de gekozen bak of taart passen. */
  const maxSmaken = soort === 'taart' ? (taartmaat?.maxSmaken ?? 0) : (formaat?.maxSmaken ?? 0)
  const kiestSmaken = soort === 'bak' || soort === 'taart'
  const vol = maxSmaken > 0 && smaken.length >= maxSmaken

  /**
   * De bon heeft geen smakenstap, dus die telling zou een gat krijgen: 1, 3, 4.
   * Een genummerde lijst met een ontbrekend nummer leest als een fout.
   */
  const stapNr =
    soort === 'bon'
      ? { boodschap: 2, gebak: 0, moment: 3, gegevens: 4 }
      : soort === 'gebak'
        ? { boodschap: 0, gebak: 1, moment: 2, gegevens: 3 }
        : soort === 'taart'
          ? { boodschap: 3, gebak: 0, moment: 4, gegevens: 5 }
          : { boodschap: 0, gebak: 4, moment: 5, gegevens: 6 }

  const gebakLijst = gebakRegels(gebak, t as never)
  const gebakStuks = gebakLijst.reduce((n, r) => n + r.aantal, 0)
  const gebakTotaal = gebakLijst.reduce((n, r) => n + (r.prijs ?? 0) * r.aantal, 0)
  /** Staat er iets bij zonder prijs, dan is het totaal niet compleet. */
  const gebakDeelsOnbekend = gebakLijst.some((r) => r.prijs === null)

  const bon = bonbedragen.find((b) => b.id === bonId) ?? null
  const bonWaarde = bon?.vrij ? Number(vrijBedrag.replace(',', '.')) : (bon?.bedrag ?? null)
  const bonOk = bon !== null && (!bon.vrij || (Number.isFinite(bonWaarde) && (bonWaarde ?? 0) >= 5))

  function wisselSmaak(naamVanSmaak: string) {
    setSmaken((huidig) => {
      if (huidig.includes(naamVanSmaak)) return huidig.filter((s) => s !== naamVanSmaak)
      if (maxSmaken > 0 && huidig.length >= maxSmaken) return huidig
      return [...huidig, naamVanSmaak]
    })
  }

  // Minstens negen cijfers, met ruimte voor +31, spaties en streepjes.
  const telefoonOk = telefoon.replace(/\D/g, '').length >= 9
  const naamOk = naam.trim().length >= 2

  const ontbreekt: string[] = []
  if (soort === 'bak' && !formaat) ontbreekt.push(t(ui.stapFormaat))
  if (soort === 'taart' && !taartmaat) ontbreekt.push(t(ui.stapTaartmaat))
  if (soort === 'bon' && !bonOk) ontbreekt.push(t(ui.stapBedrag))
  if (soort === 'gebak' && gebakStuks === 0) ontbreekt.push(t(ui.stapGebakAlleen))
  if (kiestSmaken && smaken.length === 0) ontbreekt.push(t(ui.stapSmaken))
  if (!tijd) ontbreekt.push(t(ui.stapMoment))
  if (!naamOk) ontbreekt.push(t(ui.naam))
  if (!telefoonOk) ontbreekt.push(t(ui.telefoon))
  const compleet = ontbreekt.length === 0

  const datum = dagen[dagIndex].toLocaleDateString(
    taal === 'nl' ? 'nl-NL' : taal === 'it' ? 'it-IT' : 'en-GB',
    { weekday: 'long', day: 'numeric', month: 'long' },
  )

  /**
   * Kant-en-klare regels voor de e-mail en de sms. De server hoeft dit alleen
   * nog door te sturen; zo staat de bestelling in beide kanalen hetzelfde.
   */
  const gekozenExtrasTekst =
    gekozenExtras
      .map((id) => {
        const extra = extras.find((e) => e.id === id)
        return extra ? t(extra.naam) : id
      })
      .join(', ') || '—'

  /** Het bedrag zoals het in het overzicht én in het bericht staat. */
  const basisPrijs =
    soort === 'bak' && formaat
      ? formaat.prijs
      : soort === 'bon' && bonOk && bonWaarde
        ? bonWaarde
        : null
  const totaalBedrag = (basisPrijs ?? 0) + gebakTotaal
  const totaalTekst =
    basisPrijs === null && gebakTotaal === 0
      ? null
      : `€ ${totaalBedrag.toFixed(2).replace('.', ',')}${gebakDeelsOnbekend ? ' +' : ''}`

  const soortLabel =
    soort === 'bak'
      ? t(ui.soortBak)
      : soort === 'gebak'
        ? t(ui.soortGebak)
        : soort === 'taart'
          ? t(ui.soortTaart)
          : t(ui.soortBon)

  /**
   * De bestelbon zoals de winkel hem binnenkrijgt.
   *
   * WhatsApp kent opmaak: *vet* voor de koppen, _cursief_ voor het kenmerk.
   * Daardoor leest het als een bon in plaats van als één lange zin — iemand
   * achter de toonbank moet dit in twee tellen kunnen overzien.
   *
   * Dezelfde tekst gaat als e-mail en als JSON naar de server; die kan er de
   * bevestiging naar de klant op baseren.
   */
  const regels: (string | null)[] = [
    `*Arte Vanilla — ${t(ui.berichtKop)}*`,
    '',
    `*${t(ui.berichtBestelling)}*`,
    soort === 'bak'
      ? `• ${soortLabel} — ${formaat ? `${formaat.naam} (${formaat.inhoud})` : '—'}`
      : soort === 'taart'
        ? `• ${soortLabel} — ${
            taartmaat ? `${taartmaat.naam} (${taartmaat.personen} ${t(ui.personen)})` : '—'
          }`
        : soort === 'bon'
          ? `• ${soortLabel} — ${bonWaarde ? `€ ${bonWaarde.toFixed(2).replace('.', ',')}` : '—'}`
          : `• ${soortLabel}`,
    kiestSmaken && smaken.length > 0 ? `• ${t(ui.berichtSmaken)}: ${smaken.join(', ')}` : null,
    soort === 'bak' && gekozenExtras.length > 0
      ? `• ${t(ui.stapExtras)}: ${gekozenExtrasTekst}`
      : null,
    (soort === 'taart' || soort === 'bon') && boodschap.trim()
      ? `• ${t(ui.stapBoodschap)}: “${boodschap.trim()}”`
      : null,
    ...gebakLijst.map((r) => `• ${r.aantal} × ${r.naam}`),
    '',
    `*${t(ui.berichtOphalen)}*`,
    `${datum}${tijd ? ` — ${tijd}` : ''}`,
    adresRegel,
    '',
    `*${t(ui.berichtKlant)}*`,
    `${naam.trim() || '—'} · ${telefoon.trim() || '—'}`,
    '',
    totaalTekst ? `*${t(ui.totaal)}* ${totaalTekst}` : null,
    `_${t(ui.berichtSlot)}_`,
  ]

  const bericht = regels.filter((regel) => regel !== null).join('\n')

  async function verstuur() {
    if (!compleet || status === 'bezig') return

    // Een bot vult elk veld in, ook het veld dat niemand ziet. Dan doen we
    // alsof het gelukt is en versturen we niets.
    if (bedrijf) {
      setStatus('gelukt')
      return
    }

    const kenmerk = bestelnummer()
    setStatus('bezig')

    try {
      const antwoord = await fetch(`${ENDPOINT}/bestelling`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nummer: kenmerk,
          soort,
          formaat: formaat && { id: formaat.id, naam: formaat.naam, inhoud: formaat.inhoud },
          taart: taartmaat && {
            id: taartmaat.id,
            naam: taartmaat.naam,
            personen: taartmaat.personen,
          },
          bon: bonOk ? { bedrag: bonWaarde } : null,
          boodschap: boodschap.trim() || null,
          gebak: gebakLijst,
          smaken,
          extras: gekozenExtras.map((id) => {
            const extra = extras.find((e) => e.id === id)
            return extra ? t(extra.naam) : id
          }),
          ophalen: { datum: dagen[dagIndex].toISOString().slice(0, 10), tijd, weergave: datum },
          klant: { naam: naam.trim(), telefoon: telefoon.trim() },
          taal,
          bericht,
        }),
      })

      if (!antwoord.ok) throw new Error(`status ${antwoord.status}`)
      setNummer(kenmerk)
      setStatus('gelukt')
    } catch {
      setStatus('mislukt')
    }
  }

  const onderwerp = `Arte Vanilla — ${t(ui.navAfhalen)}`
  const whatsappLink = `https://wa.me/${whatsappNummer}?text=${encodeURIComponent(bericht)}`

  // E-mail kent de opmaak van WhatsApp niet: daar blijven de sterretjes en
  // liggende streepjes gewoon staan. In de mail gaan ze eruit, en de koppen
  // krijgen hoofdletters zodat de bon net zo leesbaar blijft.
  const mailBericht = bericht
    .replace(/^\*(.+)\*$/gm, (_, kop: string) => kop.toUpperCase())
    .replace(/^_(.+)_$/gm, '$1')
    .replace(/\*(.+?)\*/g, '$1')

  const mailLink = `mailto:${contact.email}?subject=${encodeURIComponent(
    onderwerp,
  )}&body=${encodeURIComponent(mailBericht)}`

  function opnieuw() {
    setSoort('bak')
    setFormaat(null)
    setTaartmaat(null)
    setBoodschap('')
    setBonId(null)
    setGebak({})
    setVrijBedrag('')
    setSmaken([])
    setGekozenExtras([])
    setTijd('')
    setNaam('')
    setTelefoon('')
    setNummer(null)
    setStatus('klaar')
  }

  return (
    <>
      <Seo
        title={t(ui.navAfhalen)}
        description={t(ui.afhalenLead)}
      />

      {/* ---------- kop ---------- */}
      <section className="relative -mt-22 overflow-hidden pb-14 pt-34 sm:pt-38">
        <StripesBackground scrim />

        <div className="container-page relative text-center">
          <Reveal y={14}>
            <span className="chunk inline-flex items-center gap-2 rounded-full bg-crema-50 px-4 py-2 text-[0.7rem] text-cacao-700 shadow-lift">
              <Glyph name="hoorntje" size={14} />
              {t(ui.afhalenEyebrow)}
            </span>
          </Reveal>

          <Reveal y={22} delay={80}>
            <h1 className="mx-auto mt-6 grid min-h-[2.85em] max-w-[16ch] place-items-center font-display text-display font-bold leading-[0.95] text-espresso-900">
              <KopMetAccent
                as="span"
                tekst={t(ui.afhalenKop)}
                accent={t(ui.afhalenKopAccent)}
              />
            </h1>
          </Reveal>

          <Reveal y={16} delay={160}>
            <p className="mx-auto mt-4 max-w-xl text-lead text-cacao-700">{t(ui.afhalenLead)}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-24 pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          {/* ---------- keuzes ---------- */}
          <div className="grid gap-6">
            {TOON_VOORSTEL && (
              <div className="rounded-cone bg-crema-100 p-6 ring-1 ring-espresso-900/5 sm:p-8">
                <p className="chunk text-[0.7rem] text-cacao-700">{t(ui.stapSoort)}</p>

                {/* Twee bij twee, nooit vier naast elkaar: in de linkerkolom is een
                    vierde tegel maar 160px breed en valt de zin uiteen in
                    losse woorden. */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { id: 'bak', titel: ui.soortBak, uitleg: ui.soortBakUitleg, glyph: 'hoorntje' },
                      { id: 'taart', titel: ui.soortTaart, uitleg: ui.soortTaartUitleg, glyph: 'ster' },
                      { id: 'gebak', titel: ui.soortGebak, uitleg: ui.soortGebakUitleg, glyph: 'sprankel' },
                      { id: 'bon', titel: ui.soortBon, uitleg: ui.soortBonUitleg, glyph: 'hart' },
                    ] as const
                  ).map((optie) => (
                    <button
                      key={optie.id}
                      type="button"
                      onClick={() => setSoort(optie.id)}
                      aria-pressed={soort === optie.id}
                      className={`rounded-scoop p-5 text-left ring-1 transition-colors ${
                        soort === optie.id
                          ? 'bg-espresso-900 text-crema-50 ring-espresso-900'
                          : 'bg-crema-50 text-espresso-900 ring-espresso-900/10 hover:brightness-[0.97]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Glyph name={optie.glyph} size={16} />
                        <span className="font-display text-lg font-bold">{t(optie.titel)}</span>
                      </span>
                      <span className="mt-2 block text-sm opacity-70">{t(optie.uitleg)}</span>
                    </button>
                  ))}
                </div>

              </div>
            )}

            {soort === 'bak' && (
            <Stap nummer={1} titel={t(ui.stapFormaat)} tint="#fdf7ea" accent="#8f5720">
              <div className="grid gap-3 sm:grid-cols-3">
                {formaten.map((optie) => (
                  <button
                    key={optie.id}
                    type="button"
                    onClick={() => {
                      setFormaat(optie)
                      setSmaken((huidig) => huidig.slice(0, optie.maxSmaken))
                    }}
                    aria-pressed={formaat?.id === optie.id}
                    className={`rounded-scoop p-5 text-left ring-1 transition-colors ${
                      formaat?.id === optie.id
                        ? 'bg-espresso-900 text-crema-50 ring-espresso-900'
                        : 'text-espresso-900 ring-espresso-900/10 hover:brightness-[0.97]'
                    }`}
                    style={
                      formaat?.id === optie.id
                        ? undefined
                        : { backgroundColor: optie.tintHex }
                    }
                  >
                    <span className="font-display text-xl font-bold">{optie.naam}</span>
                    <span className="mt-1 flex items-baseline justify-between gap-3">
                      <span className="text-sm opacity-70">{optie.inhoud}</span>
                      <span
                        className="chunk whitespace-nowrap text-[0.7rem] tabular-nums"
                        style={
                          formaat?.id === optie.id ? undefined : { color: optie.accentHex }
                        }
                      >
                        € {optie.prijs.toFixed(2).replace('.', ',')}
                      </span>
                    </span>
                    <span className="mt-3 block text-xs opacity-70">{t(optie.toelichting)}</span>
                  </button>
                ))}
              </div>
            </Stap>

            )}

            {soort === 'taart' && (
              <Stap nummer={1} titel={t(ui.stapTaartmaat)} tint="#fdf7ea" accent="#8f5720">
                <div className="grid gap-3 sm:grid-cols-3">
                  {taartmaten.map((maat) => (
                    <button
                      key={maat.id}
                      type="button"
                      onClick={() => {
                        setTaartmaat(maat)
                        setSmaken((huidig) => huidig.slice(0, maat.maxSmaken))
                      }}
                      aria-pressed={taartmaat?.id === maat.id}
                      className={`rounded-scoop p-5 text-left ring-1 transition-colors ${
                        taartmaat?.id === maat.id
                          ? 'bg-espresso-900 text-crema-50 ring-espresso-900'
                          : 'text-espresso-900 ring-espresso-900/10 hover:brightness-[0.97]'
                      }`}
                      style={
                        taartmaat?.id === maat.id ? undefined : { backgroundColor: maat.tintHex }
                      }
                    >
                      <span className="font-display text-xl font-bold">{maat.naam}</span>
                      <span className="mt-1 flex items-baseline justify-between gap-3">
                        <span className="text-sm opacity-70">
                          {maat.personen} {t(ui.personen)}
                        </span>
                        <span className="chunk whitespace-nowrap text-[0.7rem] tabular-nums opacity-70">
                          {maat.price === null
                            ? '—'
                            : `€ ${maat.price.toFixed(2).replace('.', ',')}`}
                        </span>
                      </span>
                      <span className="mt-3 block text-xs opacity-70">{t(maat.omschrijving)}</span>
                    </button>
                  ))}
                </div>

                <p className="mt-5 text-sm text-cacao-700">{t(ui.taartVooruit)}</p>
              </Stap>
            )}

            {soort === 'gebak' && (
              <Stap nummer={1} titel={t(ui.stapGebakAlleen)} tint="#fdf7ea" accent="#8f5720">
                <GebakKiezer gekozen={gebak} onChange={setGebak} />
              </Stap>
            )}

            {soort === 'bon' && (
              <Stap nummer={1} titel={t(ui.stapBedrag)} tint="#fdf7ea" accent="#8f5720">
                <ul className="flex flex-wrap gap-2">
                  {bonbedragen.map((optie) => (
                    <li key={optie.id}>
                      <button
                        type="button"
                        onClick={() => setBonId(optie.id)}
                        aria-pressed={bonId === optie.id}
                        className={`rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                          bonId === optie.id
                            ? 'bg-espresso-900 text-crema-50'
                            : 'bg-crema-50 text-espresso-900 ring-1 ring-espresso-900/10 hover:brightness-[0.97]'
                        }`}
                      >
                        {optie.vrij
                          ? t(ui.vrijBedrag)
                          : `€ ${optie.bedrag?.toFixed(2).replace('.', ',')}`}
                      </button>
                    </li>
                  ))}
                </ul>

                {bon?.vrij && (
                  <div className="mt-5 max-w-xs">
                    <label className="block text-sm font-medium text-espresso-900" htmlFor="bedrag">
                      {t(ui.vrijBedrag)}
                    </label>
                    <input
                      id="bedrag"
                      inputMode="decimal"
                      value={vrijBedrag}
                      onChange={(e) => setVrijBedrag(e.target.value)}
                      placeholder="15,00"
                      className="mt-2 w-full rounded-soft border-0 bg-crema-50 px-4 py-3 text-espresso-900 ring-1 ring-espresso-900/10 focus:ring-2 focus:ring-cacao-700"
                    />
                  </div>
                )}
              </Stap>
            )}

            {kiestSmaken && (
            <Stap
              nummer={2}
              titel={t(ui.stapSmaken)}
              tint="#fbe9ee"
              accent="#b4544c"
              bijschrift={
                maxSmaken > 0 ? `${smaken.length}/${maxSmaken} ${t(ui.smakenGekozen)}` : undefined
              }
            >
              <ul className="flex flex-wrap gap-2">
                {flavours.map((smaak) => {
                  const gekozen = smaken.includes(smaak.name)
                  // Bij een taart bepaalt de taartmaat hoeveel smaken er passen, bij
                  // een bak het bakformaat: allebei komen ze uit `maxSmaken`.
                  const geblokkeerd = !gekozen && (vol || maxSmaken === 0)

                  return (
                    <li key={smaak.name}>
                      <button
                        type="button"
                        onClick={() => wisselSmaak(smaak.name)}
                        aria-pressed={gekozen}
                        disabled={geblokkeerd}
                        className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm transition-colors sm:py-2.5 ${
                          gekozen
                            ? 'bg-espresso-900 text-crema-50'
                            : 'bg-crema-50 text-espresso-900 ring-1 ring-espresso-900/10 hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-40'
                        }`}
                      >
                        {/* Stip in de kleur van de rij waar de smaak in ligt. */}
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: smaak.accentHex }}
                          aria-hidden="true"
                        />
                        {smaak.naam ? t(smaak.naam) : smaak.name}
                      </button>
                    </li>
                  )
                })}
              </ul>

              {/* Uitgeschakelde knoppen zonder uitleg zijn een doodlopende weg;
                  zeg waaróm er nog niets te kiezen valt. */}
              {maxSmaken === 0 && (
                <p className="mt-4 text-sm text-fragola-700">{t(ui.kiesEerstFormaat)}</p>
              )}
              {vol && <p className="mt-4 text-sm text-fragola-700">{t(ui.smakenVol)}</p>}
            </Stap>

            )}

            {soort === 'bak' && (
            <Stap nummer={3} titel={t(ui.stapExtras)} tint="#eef4e4" accent="#5f6b3a">
              <ul className="flex flex-wrap gap-2">
                {extras.map((extra) => {
                  const gekozen = gekozenExtras.includes(extra.id)
                  return (
                    <li key={extra.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setGekozenExtras((huidig) =>
                            gekozen ? huidig.filter((id) => id !== extra.id) : [...huidig, extra.id],
                          )
                        }
                        aria-pressed={gekozen}
                        className={`rounded-full px-4 py-3 text-sm transition-colors sm:py-2.5 ${
                          gekozen
                            ? 'bg-espresso-900 text-crema-50'
                            : 'bg-crema-50 text-espresso-900 ring-1 ring-espresso-900/10 hover:brightness-[0.97]'
                        }`}
                      >
                        {t(extra.naam)}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Stap>

            )}

            {(soort === 'taart' || soort === 'bon') && (
              <Stap nummer={stapNr.boodschap} titel={t(ui.stapBoodschap)} tint="#eef4e4" accent="#5f6b3a">
                <label className="sr-only" htmlFor="boodschap">
                  {t(ui.stapBoodschap)}
                </label>
                <input
                  id="boodschap"
                  value={boodschap}
                  maxLength={MAX_BOODSCHAP}
                  onChange={(e) => setBoodschap(e.target.value)}
                  placeholder={soort === 'taart' ? 'Tanti auguri, Sofia!' : 'Buon appetito!'}
                  className="w-full rounded-soft border-0 bg-crema-50 px-4 py-3 text-espresso-900 ring-1 ring-espresso-900/10 focus:ring-2 focus:ring-cacao-700"
                />
                <p className="mt-1.5 flex justify-between gap-4 text-xs text-espresso-900/60">
                  <span>{t(soort === 'taart' ? ui.boodschapHint : ui.bonHint)}</span>
                  <span className="tabular-nums">
                    {boodschap.length}/{MAX_BOODSCHAP}
                  </span>
                </p>
              </Stap>
            )}

            {/* Bij een bak mag je er gebak bij leggen; dat scheelt een tweede
                bestelling en is precies wat er aan de toonbank ook gebeurt. */}
            {soort === 'bak' && (
              <Stap
                nummer={stapNr.gebak}
                titel={t(ui.stapGebak)}
                bijschrift={gebakStuks > 0 ? `${gebakStuks} ×` : undefined}
                tint="#f4ece2"
                accent="#5d321c"
              >
                <p className="mb-4 text-sm text-espresso-900/60">{t(ui.gebakOptioneel)}</p>
                <GebakKiezer gekozen={gebak} onChange={setGebak} />
              </Stap>
            )}

            <Stap nummer={stapNr.moment} titel={t(ui.stapMoment)} tint="#fcefdc" accent="#8f5720">
              <label className="block text-sm font-medium text-espresso-900" htmlFor="dag">
                {t(ui.kiesDag)}
              </label>
              <select
                id="dag"
                value={dagIndex}
                onChange={(e) => {
                  setDagIndex(Number(e.target.value))
                  setTijd('')
                }}
                className="mt-2 w-full rounded-soft border-0 bg-crema-50 px-4 py-3 text-espresso-900 ring-1 ring-espresso-900/10 focus:ring-2 focus:ring-cacao-700"
              >
                {dagen.map((dag, i) => (
                  <option key={dag.toDateString()} value={i}>
                    {dag.toLocaleDateString(
                      taal === 'nl' ? 'nl-NL' : taal === 'it' ? 'it-IT' : 'en-GB',
                      { weekday: 'long', day: 'numeric', month: 'long' },
                    )}
                  </option>
                ))}
              </select>

              <p className="mt-5 text-sm font-medium text-espresso-900">{t(ui.kiesTijd)}</p>
              {vakken.length === 0 ? (
                <p className="mt-2 text-sm text-fragola-700">{t(ui.geenTijdvakken)}</p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {vakken.map((vak) => (
                    <li key={vak}>
                      <button
                        type="button"
                        onClick={() => setTijd(vak)}
                        aria-pressed={tijd === vak}
                        disabled={bezet.includes(vak)}
                        title={bezet.includes(vak) ? t(ui.tijdvakVol) : undefined}
                        className={`chunk rounded-full px-4 py-3 text-[0.7rem] tabular-nums transition-colors sm:px-3.5 sm:py-2 ${
                          tijd === vak
                            ? 'bg-espresso-900 text-crema-50'
                            : 'bg-crema-50 text-espresso-900 ring-1 ring-espresso-900/10 hover:brightness-[0.97] disabled:cursor-not-allowed disabled:line-through disabled:opacity-40'
                        }`}
                      >
                        {vak}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Stap>

            <Stap nummer={stapNr.gegevens} titel={t(ui.stapGegevens)} tint="#f1dfd0" accent="#5d321c">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-espresso-900" htmlFor="naam">
                    {t(ui.naam)}
                  </label>
                  <input
                    id="naam"
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                    name="naam"
                    autoComplete="name"
                    className="mt-2 w-full rounded-soft border-0 bg-crema-50 px-4 py-3 text-espresso-900 ring-1 ring-espresso-900/10 focus:ring-2 focus:ring-cacao-700"
                  />
                  <p className="mt-1.5 text-xs text-espresso-900/60">
                    {naam.trim() && !naamOk ? (
                      <span className="text-fragola-700">{t(ui.naamOngeldig)}</span>
                    ) : (
                      t(ui.naamHint)
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-espresso-900" htmlFor="telefoon">
                    {t(ui.telefoon)}
                  </label>
                  <input
                    id="telefoon"
                    value={telefoon}
                    onChange={(e) => setTelefoon(e.target.value)}
                    name="telefoon"
                    type="tel"
                    autoComplete="tel"
                    className="mt-2 w-full rounded-soft border-0 bg-crema-50 px-4 py-3 text-espresso-900 ring-1 ring-espresso-900/10 focus:ring-2 focus:ring-cacao-700"
                  />
                  <p className="mt-1.5 text-xs text-espresso-900/60">
                    {telefoon.trim() && !telefoonOk ? (
                      <span className="text-fragola-700">{t(ui.telefoonOngeldig)}</span>
                    ) : (
                      t(ui.telefoonHint)
                    )}
                  </p>
                </div>
              </div>

              {/* Honeypot. Buiten beeld en buiten de tabvolgorde, dus een mens
                  komt er niet bij; een bot vult hem wel in. */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 overflow-hidden">
                <label htmlFor="voorkeur-ref">Ref</label>
                <input
                  id="voorkeur-ref"
                  name="voorkeur-ref"
                  tabIndex={-1}
                  autoComplete="off"
                  value={bedrijf}
                  onChange={(e) => setBedrijf(e.target.value)}
                />
              </div>
            </Stap>
          </div>

          {/* ---------- overzicht ---------- */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-cone bg-espresso-900 p-7 text-crema-50 sm:p-8">
              <p className="chunk text-[0.7rem] text-vaniglia-400">{t(ui.stapOverzicht)}</p>

              <dl className="mt-5 space-y-3 text-sm">
                {TOON_VOORSTEL && <Regel label={t(ui.stapSoort)}>{soortLabel}</Regel>}

                {soort === 'bak' && (
                  <Regel label={t(ui.stapFormaat)}>
                    {formaat ? `${formaat.naam} · ${formaat.inhoud}` : '—'}
                  </Regel>
                )}
                {soort === 'taart' && (
                  <Regel label={t(ui.stapTaartmaat)}>
                    {taartmaat
                      ? `${taartmaat.naam} · ${taartmaat.personen} ${t(ui.personen)}`
                      : '—'}
                  </Regel>
                )}
                {soort === 'bon' && (
                  <Regel label={t(ui.stapBedrag)}>
                    {bonOk && bonWaarde ? `€ ${bonWaarde.toFixed(2).replace('.', ',')}` : '—'}
                  </Regel>
                )}

                {kiestSmaken && (
                  <Regel label={t(ui.stapSmaken)}>{smaken.join(', ') || '—'}</Regel>
                )}
                {soort === 'bak' && (
                  <Regel label={t(ui.stapExtras)}>{gekozenExtrasTekst}</Regel>
                )}
                {(soort === 'taart' || soort === 'bon') && (
                  <Regel label={t(ui.stapBoodschap)}>{boodschap.trim() || '—'}</Regel>
                )}
                {(soort === 'bak' || soort === 'gebak') && (
                  <Regel label={soort === 'gebak' ? t(ui.stapGebakAlleen) : t(ui.stapGebak)}>
                    {gebakLijst.length > 0
                      ? gebakLijst.map((r) => `${r.aantal} × ${r.naam}`).join(', ')
                      : '—'}
                  </Regel>
                )}

                <Regel label={t(ui.stapMoment)}>{tijd ? `${datum} — ${tijd}` : '—'}</Regel>
                <Regel label={t(ui.naam)}>{naam || '—'}</Regel>
                <Regel label={t(ui.telefoon)}>{telefoon || '—'}</Regel>
              </dl>

              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-dashed border-crema-50/25 pt-4">
                <span className="chunk text-[0.7rem] text-crema-50/60">{t(ui.totaal)}</span>
                <span className="font-display text-2xl font-bold tabular-nums text-vaniglia-400">
                  {totaalTekst ?? '—'}
                </span>
              </div>

              {/* Staat er gebak zonder prijs bij, dan klopt het bedrag niet
                  helemaal — dat hoort de klant te weten vóór de balie. */}
              {gebakDeelsOnbekend && (
                <p className="mt-2 text-xs text-crema-200/60">{t(ui.totaalDeels)}</p>
              )}

              {/* Bij een taart staat er geen bedrag; dan zegt het overzicht
                  waaróm er een streepje staat. */}
              {soort === 'taart' && (
                <p className="mt-2 text-xs text-crema-200/60">{t(ui.prijsVolgt)}</p>
              )}

              {!compleet && (
                <p className="mt-5 border-t border-dashed border-crema-50/25 pt-4 text-sm text-crema-200/80">
                  {t(ui.nogTeKiezen)}: {ontbreekt.join(', ')}
                </p>
              )}

              {status === 'gelukt' ? (
                <div className="mt-6 rounded-scoop bg-pistacchio-400 p-6 text-espresso-900">
                  <p className="font-display text-xl font-bold">{t(ui.bevestigingKop)}</p>

                  {/* Het ophaalmoment groot: dat is het enige dat iemand later
                      nog wil terugvinden. */}
                  <p className="mt-4 text-sm text-espresso-900/70">{t(ui.bevestigingKlaar)}</p>
                  <p className="font-display text-2xl font-bold leading-tight">
                    {datum}
                    {tijd ? ` · ${tijd}` : ''}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-espresso-900/80">
                    {t(ui.bestellingGeluktUitleg)}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {nummer && (
                      <span className="chunk inline-flex items-center rounded-full bg-espresso-900 px-4 py-2 text-[0.7rem] text-crema-50">
                        {t(ui.bestellingNummer)} · {nummer}
                      </span>
                    )}
                    <Button variant="ghost" size="sm" onClick={opnieuw}>
                      {t(ui.nogEenBestelling)}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={verstuur}
                      disabled={!compleet || status === 'bezig'}
                    >
                      {status === 'bezig'
                        ? t(ui.versturenBezig)
                        : ENDPOINT
                          ? t(ui.verstuurBestelling)
                          : t(ui.verstuurWhatsapp)}
                      <Glyph name="pijl" size={15} />
                    </Button>
                  </div>

                  {status === 'mislukt' && (
                    <div className="mt-5 rounded-scoop bg-fragola-400 p-5 text-crema-50">
                      <p className="font-display text-lg font-bold">{t(ui.bestellingMislukt)}</p>
                      <p className="mt-2 text-sm leading-relaxed text-crema-50/90">
                        {t(ui.bestellingMisluktUitleg)}
                      </p>
                    </div>
                  )}

                  {/* Dezelfde bestelling, maar dan verstuurd door de klant zelf.
                      Blijft werken als de server er even uit ligt. */}
                  <div className="mt-6 border-t border-dashed border-crema-50/25 pt-5">
                    <p className="text-xs leading-relaxed text-crema-200/70">
                      {t(ui.afhalenKanalen)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={compleet ? whatsappLink : undefined}
                        target="_blank"
                        rel="noreferrer"
                        aria-disabled={!compleet}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm ring-[1.5px] transition-colors sm:py-2 ${
                          compleet
                            ? 'text-crema-50 ring-crema-50/45 hover:bg-crema-50/10'
                            : 'pointer-events-none text-crema-50/35 ring-crema-50/15'
                        }`}
                      >
                        {t(ui.ofViaWhatsapp)}
                        <Glyph name="pijl" size={14} />
                      </a>
                      <a
                        href={compleet ? mailLink : undefined}
                        aria-disabled={!compleet}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm ring-[1.5px] transition-colors sm:py-2 ${
                          compleet
                            ? 'text-crema-50 ring-crema-50/45 hover:bg-crema-50/10'
                            : 'pointer-events-none text-crema-50/35 ring-crema-50/15'
                        }`}
                      >
                        {t(ui.ofViaMail)}
                        <Glyph name="pijl" size={14} />
                      </a>
                    </div>
                  </div>
                </>
              )}

              <p className="mt-6 text-xs leading-relaxed text-crema-200/70">
                {t(ui.afhalenBetalen)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Stap({
  nummer,
  titel,
  bijschrift,
  tint,
  accent,
  children,
}: {
  nummer: number
  titel: string
  bijschrift?: string
  /** Vlak van deze stap; elke stap heeft een eigen kleur uit het merk. */
  tint: string
  accent: string
  children: ReactNode
}) {
  return (
    <section
      className="relative overflow-hidden rounded-cone p-6 ring-1 ring-espresso-900/5 sm:p-8"
      style={{ backgroundColor: tint }}
    >
      {/* Spookcijfer, net als op de vitrinekaarten van de homepage. */}
      <span
        className="pointer-events-none absolute -right-2 -top-6 select-none font-chunk text-[7rem] leading-none opacity-[0.13]"
        style={{ color: accent }}
        aria-hidden="true"
      >
        {nummer}
      </span>

      <div className="relative flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="flex items-baseline gap-3 font-display text-xl font-bold text-espresso-900">
          <span
            className="grid size-8 place-items-center rounded-full font-chunk text-base text-crema-50"
            style={{ backgroundColor: accent }}
          >
            {nummer}
          </span>
          {titel}
        </h2>
        {bijschrift && (
          <span
            className="chunk rounded-full bg-crema-50/80 px-3 py-1.5 text-[0.72rem] sm:text-[0.65rem]"
            style={{ color: accent }}
          >
            {bijschrift}
          </span>
        )}
      </div>

      <div className="relative mt-5">{children}</div>
    </section>
  )
}

function Regel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-crema-50/10 pb-3 last:border-0">
      <dt className="shrink-0 text-crema-200/60">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}
