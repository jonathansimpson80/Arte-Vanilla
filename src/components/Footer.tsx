import { Link } from 'react-router'
import { Wordmark } from '@/components/ui/Wordmark'
import { Scallop } from '@/components/Scallop'
import { openingHours } from '@/data/home'
import { adresRegel, kaartLink, platforms } from '@/data/contact'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

const kolommen = [
  {
    titel: ui.menu,
    items: [
      { label: ui.navIjs, href: '/smaken' },
      { label: ui.navGebak, href: '/dolci' },
      { label: ui.navKoffie, href: '/dolci#koffie' },
      { label: ui.navAanbieding, href: '/dolci#deals' },
      { label: ui.navAfhalen, href: '/afhalen' },
      { label: ui.navOverOns, href: '/over-ons' },
      { label: ui.navBezoek, href: '/#bezoek' },
    ],
  },
  {
    titel: ui.footerBestellen,
    items: [
      { label: ui.bestelThuisbezorgd, href: platforms.thuisbezorgd },
      { label: ui.bestelUberEats, href: platforms.ubereats },
      { label: ui.homeVolgInstagram, href: platforms.instagram },
      { label: ui.routeEnAdres, href: kaartLink },
    ],
  },
]

export function Footer() {
  const { t, pad } = useTaal()

  return (
    /**
     * Geen bovenmarge: de schulprand sluit direct aan op de sectie erboven.
     * De footer valt één pixel over de sectie erboven en moet daar bovenop
     * geschilderd worden. Dat vraagt om `relative z-10`: de sectie erboven is
     * zelf gepositioneerd, en een gepositioneerd element tekent standaard over
     * een statisch element heen — ongeacht de volgorde in de DOM. Zonder deze
     * regel schildert het rood over de overlap heen, en blijft er een streep
     * staan hoeveel marge je ook geeft.
     */
    <footer className="relative z-10 -mt-px bg-espresso-900">
      {/* De rand ligt óver de sectie erboven: tussen de bobbels schijnt dan
          die kleur door in plaats van de paginakleur. */}
      <div className="relative z-10 -mt-6 sm:-mt-9">
        <Scallop className="text-espresso-900" />
      </div>

      <div className="-mt-0.5 bg-espresso-900 pt-12 text-crema-50 sm:pt-16">
        <div className="container-page grid auto-rows-min grid-cols-2 gap-x-6 gap-y-9 pb-10 sm:auto-rows-auto sm:gap-12 sm:pb-14 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <Wordmark licht className="h-9" />
            <p className="chunk mt-2 text-[0.7rem] text-vaniglia-400">Gelato, dolci &amp; caffè</p>
            <p className="mt-4 max-w-xs text-sm text-crema-200/70">
              {t(ui.footerTagline)}
            </p>
            <address className="mt-5 text-sm not-italic text-crema-200/70">
              {adresRegel}
            </address>
          </div>

          <div>
            <h2 className="chunk text-[0.7rem] text-vaniglia-400">{t(ui.openingstijden)}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              {/* Dag boven, tijd eronder. Naast elkaar brak "14:00 – 22:00" in
                  een smalle kolom middenin af, en dan staat er 14:00 op de ene
                  regel en 22:00 op de volgende. */}
              {openingHours.map((row) => (
                <div key={row.day.nl} className="grid gap-0.5">
                  <dt className="text-crema-200/60">{t(row.day)}</dt>
                  <dd className="whitespace-nowrap tabular-nums text-crema-50">
                    {row.time ?? t(ui.gesloten)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {kolommen.map((kolom, i) => (
            /* De langste linkkolom pakt twee rijen, zodat de korte blokken
               eronder aansluiten in plaats van na een gat te beginnen. */
            <div key={kolom.titel.nl} className={i === 0 ? 'row-span-2 sm:row-span-1' : ''}>
              <h2 className="chunk text-[0.7rem] text-vaniglia-400">{t(kolom.titel)}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {kolom.items.map((item) => {
                  const intern = item.href.startsWith('/')
                  const klasse =
                    'block py-2.5 text-crema-200/70 transition-colors hover:text-crema-50 sm:py-1'

                  return (
                    <li key={item.href}>
                      {intern ? (
                        <Link className={klasse} to={pad(item.href)}>
                          {t(item.label)}
                        </Link>
                      ) : (
                        <a className={klasse} href={item.href} target="_blank" rel="noreferrer">
                          {t(item.label)}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="container-page border-t border-crema-50/10 py-6 text-xs text-crema-200/60">
          <span>© {new Date().getFullYear()} Arte Vanilla</span>
        </div>

        {/* Wordmark als afsluiter, in het script van het logo en gevuld in crème. */}
        <div className="overflow-hidden">
          <p
            className="wordmark translate-y-[0.08em] whitespace-nowrap text-center text-[clamp(3.5rem,15vw,13rem)] leading-none text-crema-100"
            aria-hidden="true"
          >
            Arte Vanilla
          </p>
        </div>
      </div>
    </footer>
  )
}
