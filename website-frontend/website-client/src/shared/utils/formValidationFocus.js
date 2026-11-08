/** Read nested RHF `errors` message for a field path (`items.0.qty`). */
export function getFieldErrorMessage(errors, name) {
  if (!errors || !name) {
    return undefined
  }
  const parts = String(name).split('.')
  let node = errors
  for (const part of parts) {
    if (!node || typeof node !== 'object') {
      return undefined
    }
    node = node[part]
  }
  if (node && typeof node === 'object' && node.message) {
    return String(node.message)
  }
  return undefined
}

/**
 * All leaf error paths from react-hook-form `errors` (excludes `root`).
 */
export function collectErrorPaths(errors, prefix = '') {
  if (!errors || typeof errors !== 'object') {
    return []
  }
  const paths = []
  for (const [key, value] of Object.entries(errors)) {
    if (key === 'root') {
      continue
    }
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && 'message' in value && value.message) {
      paths.push(path)
      continue
    }
    if (value && typeof value === 'object') {
      paths.push(...collectErrorPaths(value, path))
    }
  }
  return paths
}

/**
 * First leaf error path from react-hook-form `errors` (e.g. `customerName`, `items.0.gstRate`).
 */
export function findFirstErrorPath(errors, prefix = '') {
  if (!errors || typeof errors !== 'object') {
    return null
  }
  for (const [key, value] of Object.entries(errors)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && 'message' in value && value.message) {
      return path
    }
    if (value && typeof value === 'object' && !('message' in value)) {
      const nested = findFirstErrorPath(value, path)
      if (nested) {
        return nested
      }
    }
  }
  return null
}

function queryFieldElement(path) {
  if (!path) {
    return null
  }
  const escaped = path.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  let el = document.querySelector(`[name="${escaped}"]`)
  if (el) {
    return el
  }
  el = document.querySelector(`[id="${escaped}"]`)
  if (el) {
    return el
  }
  const dataMatch = document.querySelector(`[data-field-name="${escaped}"]`)
  if (dataMatch) {
    return dataMatch
  }
  return document.querySelector(`[data-form-field-anchor="${escaped}"]`)
}

function resolveFocusTarget(element) {
  if (!element) {
    return null
  }
  if (element.matches('input,textarea,select,button,[tabindex]:not([tabindex="-1"])')) {
    return element
  }
  return (
    element.querySelector('input,textarea,select')
    || element.querySelector('[role="button"][aria-haspopup="listbox"]')
    || element
  )
}

/**
 * Run {@link focusFirstFormError} after the next paint so RHF error UI is in the DOM.
 * Pass a getter when errors are set in the same tick (e.g. after `setError` / `trigger`).
 */
export function scheduleFocusFirstFormError(errorsOrGetter) {
  const resolveErrors = () =>
    typeof errorsOrGetter === 'function' ? errorsOrGetter() : errorsOrGetter

  if (typeof window === 'undefined' || typeof requestAnimationFrame !== 'function') {
    focusFirstFormError(resolveErrors())
    return
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      focusFirstFormError(resolveErrors())
    })
  })
}

/** Scroll inside the app main region so Chrome does not grow the window past the footer. */
function scrollWithinAppMain(element) {
  if (!element) return
  const scroller = document.getElementById('main-content')
  if (!scroller?.contains(element)) return
  const scrollerRect = scroller.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  const top = elementRect.top - scrollerRect.top + scroller.scrollTop
  const target = top - scroller.clientHeight / 2 + elementRect.height / 2
  scroller.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
}

/**
 * Scroll the app main region to the first invalid field and move focus when possible.
 */
export function focusFirstFormError(errors) {
  if (errors?.root?.message) {
    const rootBanner = document.querySelector('[data-voucher-root-error]')
    scrollWithinAppMain(rootBanner)
    return
  }
  const path = findFirstErrorPath(errors)
  if (!path) {
    return
  }
  const fieldEl = queryFieldElement(path)
  const scrollTarget =
    fieldEl?.closest?.('[data-form-field-anchor]')
    || fieldEl?.closest?.('.min-w-0')
    || fieldEl
  scrollWithinAppMain(scrollTarget)
  const focusTarget = resolveFocusTarget(fieldEl)
  if (focusTarget?.focus) {
    try {
      focusTarget.focus({ preventScroll: true })
    } catch {
      focusTarget.focus()
    }
  }
}
