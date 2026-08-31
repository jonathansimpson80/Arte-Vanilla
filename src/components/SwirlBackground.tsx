/**
 * Zachte, langzaam draaiende swirl als ondergrond.
 *
 * Bedoeld voor secties waar het streeppatroon te druk wordt maar een egaal
 * vlak te leeg: de kleuren draaien als gelato in de machine, zo langzaam dat
 * je het eerder voelt dan ziet. Eén ronde duurt anderhalve minuut.
 *
 * Alle tonen liggen dicht bij elkaar, zodat tekst er gewoon op kan staan:
 * espresso haalt overal boven de 15:1. De beweging staat op een eigen laag op
 * de GPU en stopt bij `prefers-reduced-motion`.
 */
export function SwirlBackground({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-crema-100 ${className}`}
      aria-hidden="true"
    >
      <div
        className="swirl absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2"
        style={{
          backgroundImage: `conic-gradient(
            from 0deg,
            rgb(249 226 160 / 0.85) 0deg,
            rgb(252 243 226 / 0.5) 60deg,
            rgb(251 221 230 / 0.55) 130deg,
            rgb(252 243 226 / 0.5) 200deg,
            rgb(238 243 228 / 0.7) 260deg,
            rgb(252 243 226 / 0.5) 320deg,
            rgb(249 226 160 / 0.85) 360deg
          )`,
          filter: 'blur(70px)',
        }}
      />
    </div>
  )
}
