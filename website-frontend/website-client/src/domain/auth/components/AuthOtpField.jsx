import { FieldError } from '@/shared/components/forms/FormFields'

export default function AuthOtpField({
  id,
  label,
  value,
  onChange,
  error,
  required = true,
  autoComplete = 'one-time-code',
}) {
  return (
    <div className="mb-4 max-w-xs">
      <label htmlFor={id} className="mb-2 block font-noto text-base font-bold text-probity-ink-strong">
        {label}
        {required ? (
          <span className="text-rose-600" aria-hidden>
            {' '}
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        inputMode="numeric"
        autoComplete={autoComplete}
        maxLength={6}
        value={value}
        onChange={onChange}
        aria-required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-[58px] w-full rounded-md border bg-white px-4 text-base tracking-[0.35em] text-probity-ink focus:outline-none focus:ring-0 ${
          error
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-300 focus:border-probity-brand'
        }`}
      />
      <FieldError message={error} />
    </div>
  )
}
