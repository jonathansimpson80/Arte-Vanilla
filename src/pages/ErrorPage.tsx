import { Link, isRouteErrorResponse, useRouteError } from 'react-router'

export function ErrorPage() {
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : 'Er ging iets mis'
  const detail =
    error instanceof Error ? error.message : 'Probeer de pagina opnieuw te laden.'

  return (
    <div className="container-page flex min-h-dvh flex-col justify-center py-24">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-cacao-700">Foutmelding</p>
      <h1 className="mt-4 font-display text-4xl text-espresso-900">{title}</h1>
      <p className="mt-3 max-w-lg text-neutral-600">{detail}</p>
      <Link
        to="/"
        className="mt-8 w-fit rounded-full bg-espresso-900 px-6 py-3 text-sm text-crema-50 hover:bg-cacao-700"
      >
        Naar home
      </Link>
    </div>
  )
}
