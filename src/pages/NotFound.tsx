import { Link } from 'react-router'
import { Seo } from '@/lib/seo'
import { StripesBackground } from '@/components/StripesBackground'
import { useTaal } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

export function NotFound() {
  const { t, pad } = useTaal()

  return (
    <>
      <Seo title="404" description="Deze pagina bestaat niet (meer)." />
      {/* Korte tekst, veel lucht: precies het soort plek waar het patroon
          wél werkt. Een 404 zonder merk is een 404 van niemand. */}
      <section className="relative -mt-22 overflow-hidden pt-22">
        <StripesBackground scrim />

        <div className="container-page relative flex min-h-[60vh] flex-col justify-center py-24">
          {/* Geel is in dit systeem een vlak, nooit een tekstkleur: op crème
              haalt het net 2:1. Caramello wel. */}
          <p className="font-chunk text-mega leading-none text-caramello-500/70">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold text-espresso-900">
            {t(ui.nietGevondenKop)}
          </h1>
          <p className="mt-3 max-w-md text-lead text-cacao-700">{t(ui.nietGevondenLead)}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={pad('/')}
              className="rounded-full bg-espresso-900 px-6 py-3 text-sm text-crema-50 transition-colors hover:bg-cacao-700"
            >
              {t(ui.naarHome)}
            </Link>
            <Link
              to={pad('/smaken')}
              className="rounded-full px-6 py-3 text-sm text-espresso-900 ring-1 ring-espresso-900/15 transition-colors hover:bg-crema-100"
            >
              {t(ui.bekijkSmaken)}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
