import type { InputHTMLAttributes } from 'react'

export function Field({
  label,
  name,
  hint,
  ...rest
}: { label: string; name: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-espresso-900">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-describedby={hint ? `${name}-hint` : undefined}
        className="mt-2 w-full rounded-soft border-0 bg-crema-50 px-4 py-3 text-espresso-900 ring-1 ring-espresso-900/10 placeholder:text-neutral-400 focus:ring-2 focus:ring-cacao-700"
        {...rest}
      />
      {hint && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-neutral-600">
          {hint}
        </p>
      )}
    </div>
  )
}
