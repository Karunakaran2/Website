/** Must match `MODULE_ROUTE_PREFIX.WORKBENCH` in moduleRoutes.js (avoid circular import). */
const WORKBENCH_ROUTE_PREFIX = '/component-workbench'

/** Legacy gold-nav primaries that duplicated interactive workbench categories. */
export const WORKBENCH_SPEC_PRIMARY_REDIRECT = {
  'lib-actions': 'actions',
  'lib-forms': 'forms',
  'lib-feedback': 'feedback',
  'lib-data-display': 'data-display',
  'lib-navigation': 'navigation',
}

/** Map spec secondary ids to canonical interactive (or merged) secondaries. */
export const WORKBENCH_SPEC_SECONDARY_REDIRECT = {
  'text-input': 'text-inputs',
  'password-input': 'text-inputs',
  textarea: 'text-inputs',
  select: 'select-controls',
  'checkbox-radio': 'checkboxes',
  switch: 'switches',
  validation: 'form-validation',
  'dialogs-modals': 'dialogs',
  toasts: 'notifications',
  'badges-status': 'badges',
  dropdowns: 'dropdown-menus',
  'accordions-tabs': 'tabs',
  'action-states': 'action-states',
  tooltips: 'tooltips',
  headers: 'headers',
  sidebars: 'sidebars',
  'grid-layout': 'grid-layout',
}

/** Redirect legacy lib-* workbench paths to consolidated primary categories. */
export function canonicalizeWorkbenchSpecPathname(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return null
  }
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/'
  const prefix = WORKBENCH_ROUTE_PREFIX
  if (!cleanPath.startsWith(`${prefix}/`)) {
    return null
  }

  const segments = cleanPath.slice(prefix.length + 1).split('/').filter(Boolean)
  if (segments.length !== 2) {
    return null
  }

  const [primary, secondary] = segments
  const canonicalPrimary = WORKBENCH_SPEC_PRIMARY_REDIRECT[primary]
  if (!canonicalPrimary) {
    return null
  }

  const canonicalSecondary = WORKBENCH_SPEC_SECONDARY_REDIRECT[secondary] ?? secondary
  const next = `${prefix}/${canonicalPrimary}/${canonicalSecondary}`
  if (next === cleanPath) {
    return null
  }
  return next
}
