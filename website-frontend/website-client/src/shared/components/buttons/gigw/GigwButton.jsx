import { Loader2 } from 'lucide-react'
import {
  GIGW_BTN_BASE,
  GIGW_BTN_SIZE_CLASS,
  GIGW_BTN_VARIANT_CLASS,
} from './gigwButtonStyles'

/**
 * GIGW text button (.seepz-btn) — primary / secondary / outline variants.
 */
export default function GigwButton({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  loading = false,
  disabled = false,
  icon: Icon,
  iconSize = 16,
  hideIcon = false,
  form,
  ...rest
}) {
  const resolvedVariant = variant === 'outline' ? 'outlinePrimary' : variant
  const variantClass = GIGW_BTN_VARIANT_CLASS[resolvedVariant] ?? GIGW_BTN_VARIANT_CLASS.primary
  const sizeClass = GIGW_BTN_SIZE_CLASS[size] ?? GIGW_BTN_SIZE_CLASS.md
  const label = children
  const showLeadingIcon = !loading && !hideIcon && Icon

  return (
    <button
      type={type}
      form={form}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${GIGW_BTN_BASE} ${sizeClass} ${variantClass} ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <Loader2 size={iconSize} className="shrink-0 animate-spin" aria-hidden />
      ) : showLeadingIcon ? (
        <Icon size={iconSize} className="shrink-0" aria-hidden strokeWidth={2} />
      ) : null}
      {label != null && label !== '' ? (
        <span className="min-w-0 whitespace-nowrap">{label}</span>
      ) : null}
    </button>
  )
}
