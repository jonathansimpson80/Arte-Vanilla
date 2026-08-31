type Props = {
  /** Twee kleuren uit het werk-item. */
  palette: [string, string]
  /** Bepaalt de vormvariant; dezelfde seed geeft altijd hetzelfde beeld. */
  seed: string
  className?: string
}

function hash(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 9973
  return h
}

/**
 * Generatief placeholder-beeld. Vervang dit door <img> zodra er
 * echte fotografie in /public/work/ staat.
 */
export function ArtPlaceholder({ palette, seed, className }: Props) {
  const h = hash(seed)
  const [base, accent] = palette
  const cx = 30 + (h % 40)
  const cy = 35 + ((h >> 3) % 30)
  const r = 18 + (h % 14)
  const rotate = (h % 60) - 30

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      className={className}
    >
      <rect width="100" height="100" fill={base} />
      <g transform={`rotate(${rotate} 50 50)`}>
        <rect x="8" y={cy} width="84" height="0.6" fill={accent} opacity="0.5" />
        <rect x="8" y={cy + 8} width="84" height="0.6" fill={accent} opacity="0.35" />
        <circle cx={cx} cy={cy} r={r} fill={accent} opacity="0.85" />
        <circle cx={100 - cx} cy={cy + 14} r={r / 2.4} fill={accent} opacity="0.45" />
      </g>
    </svg>
  )
}
