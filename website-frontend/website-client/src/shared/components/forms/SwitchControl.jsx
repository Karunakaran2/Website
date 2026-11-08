import { FORM_FIELD_HINTS_ENABLED } from './FormFields'

/**
 * Accessible toggle switch (WAI-ARIA switch pattern) for workbench and domain forms.
 */
export default function SwitchControl({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  description,
  size = 'md',
}) {
  const handleKeyDown = (event) => {
    if (disabled) {
      return
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      onChange(!checked)
    }
  }

  const dims =
    {
      sm: { track: 'w-8 h-4', thumb: 'h-3 w-3 translate-x-4', untranslated: 'translate-x-0.5' },
      md: { track: 'w-11 h-6', thumb: 'h-5 w-5 translate-x-5', untranslated: 'translate-x-0.5' },
      lg: { track: 'w-14 h-7', thumb: 'h-6 w-6 translate-x-7', untranslated: 'translate-x-0.5' },
    }[size] || {
      track: 'w-11 h-6',
      thumb: 'h-5 w-5 translate-x-5',
      untranslated: 'translate-x-0.5',
    }

  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex flex-col">
        {label ? (
          <label
            htmlFor={id}
            className={`text-[13px] font-semibold ${
              disabled ? 'cursor-not-allowed text-slate-400' : 'cursor-pointer text-slate-800'
            }`}
          >
            {label}
          </label>
        ) : null}
        {FORM_FIELD_HINTS_ENABLED && description ? (
          <span className="text-[11px] leading-normal text-slate-500">{description}</span>
        ) : null}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#01458e] focus:ring-offset-2 ${
          dims.track
        } ${
          disabled
            ? 'cursor-not-allowed bg-slate-200 opacity-60'
            : checked
              ? 'bg-[#01458e]'
              : 'bg-slate-300 hover:bg-slate-400'
        }`}
      >
        <span className="sr-only">{label || 'Toggle switch'}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block transform self-center rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            dims.thumb
          } ${checked ? dims.thumb.split(' ')[1] : dims.untranslated}`}
        />
      </button>
    </div>
  )
}
