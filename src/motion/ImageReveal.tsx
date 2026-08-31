import { useReveal } from '@/motion/useReveal'
import { Foto } from '@/components/ui/Foto'

type Props = {
  src: string
  alt: string
  /** Startschaal van het beeld; loopt terug naar 1 zodra het in beeld komt. */
  zoom?: number
  delay?: number
  className?: string
  imgClassName?: string
}

/**
 * Beeld dat van onderaf openvouwt terwijl het inzoomt naar 1.
 * De clip zit op de wrapper, de schaal op het beeld zelf — zo blijft
 * de rand strak en beweegt alleen de textuur.
 */
export function ImageReveal({
  src,
  alt,
  zoom = 1.18,
  delay = 0,
  className = '',
  imgClassName = '',
}: Props) {
  const { ref, shown, animating } = useReveal<HTMLDivElement>({ amount: 0.2 })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className="h-full"
        style={{
          clipPath: shown ? 'inset(0% 0 0% 0)' : 'inset(0% 0 100% 0)',
          transition: animating ? `clip-path 900ms var(--reveal-ease) ${delay}ms` : undefined,
        }}
      >
        <Foto
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${imgClassName}`}
          style={{
            transform: shown ? 'scale(1)' : `scale(${zoom})`,
            transition: animating ? `transform 1200ms var(--reveal-ease) ${delay}ms` : undefined,
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  )
}
