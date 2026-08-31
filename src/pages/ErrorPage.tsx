import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { metTaal, taalUitPad } from '@/i18n/taal'
import { ui } from '@/i18n/teksten'

export function ErrorPage() {
  const error = useRouteError()

  // Deze pagina vervangt de layout, dus de TaalProvider draait hier niet.
  // Het pad weet nog wel in welke taal iemand bezig was.
  const taal = taalUitPad(typeof window === 'undefined' ? '/' : window.location.pathname)

  const title = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : ui.foutKop[taal]
  const detail = error instanceof Error ? error.message : ui.foutDetail[taal]

  return (
    <div className="container-page flex min-h-dvh flex-col justify-center py-24">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-cacao-700">
        {ui.foutEyebrow[taal]}
      </p>
      <h1 className="mt-4 font-display text-4xl text-espresso-900">{title}</h1>
      <p className="mt-3 max-w-lg text-neutral-600">{detail}</p>
      <Link
        to={metTaal(taal, '/')}
        className="mt-8 w-fit rounded-full bg-espresso-900 px-6 py-3 text-sm text-crema-50 hover:bg-cacao-700"
      >
        {ui.naarHome[taal]}
      </Link>
    </div>
  )
}
