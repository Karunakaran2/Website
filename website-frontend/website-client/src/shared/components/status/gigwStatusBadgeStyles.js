/**
 * GIGW / SEEPZ status badges (.seepz-btn-status*) — design tokens from portal CSS.
 */

/** Matches `.seepz-btn-status` (non-interactive pill). */
export const GIGW_STATUS_BADGE_BASE =
  'inline-flex h-auto cursor-default items-center justify-center rounded-2xl border-none px-3 py-1.5 text-sm font-medium'

/** Matches `.seepz-btn-status-*` background / text tokens. */
export const GIGW_STATUS_VARIANT_CLASS = {
  success: 'bg-[#e8f5e9] text-[#1b5e20]',
  warning: 'bg-[#fff4e5] text-[#8a4b00]',
  danger: 'bg-[#fdecec] text-[#b42318]',
  error: 'bg-[#fdecec] text-[#b42318]',
  neutral: 'bg-[#f2f4f7] text-[#344054]',
  info: 'bg-[#e0f2fe] text-[#005a9c]',
  primary: 'bg-[#e6f0f7] text-[#005a9c]',
  secondary: 'bg-[#f2f4f7] text-[#344054]',
}

/** Map free-text / enum labels to GIGW status badge variant. */
export function gigwStatusBadgeVariant(status) {
  const key = String(status ?? '')
    .trim()
    .toLowerCase()

  if (!key || key === '—' || key === '-') {
    return 'neutral'
  }

  if (
    key === 'yes'
    || key === 'y'
    || key === 'active'
    || key.includes('approv')
    || key === 'approved'
    || key === 'verified'
    || key === 'verify'
    || key === 'success'
    || key === 'paid'
    || key === 'finalized'
    || key === 'complete'
    || key === 'completed'
    || key === 'matched'
    || key === 'mapped'
    || key === 'resolved'
    || key === 'enabled'
    || key === 'added'
    || key.includes('added to')
  ) {
    return 'success'
  }

  if (key === 'no' || key === 'n') {
    return 'danger'
  }

  if (key === 'inactive' || key.includes('deactiv') || key === 'disabled') {
    return 'neutral'
  }

  if (key.includes('reject') || key.includes('fail') || key === 'deleted' || key === 'error') {
    return 'danger'
  }

  if (key.includes('pend') || key.includes('quer') || key === 'draft' || key === 'waiting') {
    return 'warning'
  }

  if (
    key.includes('forward')
    || key.includes('process')
    || key.includes('submit')
    || key === 'dispatched'
    || key === 'in progress'
    || key === 'processing'
    || key === 'frozen'
  ) {
    return 'info'
  }

  return 'secondary'
}

export function gigwStatusBadgeClass(status, extraClass = '') {
  const variant = gigwStatusBadgeVariant(status)
  const variantClass = GIGW_STATUS_VARIANT_CLASS[variant] ?? GIGW_STATUS_VARIANT_CLASS.secondary
  return `${GIGW_STATUS_BADGE_BASE} ${variantClass} ${extraClass}`.trim()
}
