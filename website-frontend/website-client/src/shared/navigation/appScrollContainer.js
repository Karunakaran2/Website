/** Primary app scroll region (see {@link MainLayout} `#main-content`). */
export const APP_MAIN_SCROLL_ID = 'main-content'

const SCROLL_RESTORE_PREFIX = 'kran.scroll.'

export function getAppScrollContainer() {
  if (typeof document === 'undefined') {
    return null
  }
  return document.getElementById(APP_MAIN_SCROLL_ID)
}

export function scrollAppContainerToTop({ behavior = 'auto' } = {}) {
  const main = getAppScrollContainer()
  if (main) {
    main.scrollTo({ top: 0, left: 0, behavior })
    return
  }
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior })
  }
}

export function readAppScrollTop() {
  const main = getAppScrollContainer()
  if (main) {
    return main.scrollTop
  }
  return typeof window !== 'undefined' ? window.scrollY : 0
}

export function restoreAppScrollTop(top, { behavior = 'auto' } = {}) {
  const value = Number(top)
  if (!Number.isFinite(value) || value < 0) {
    return
  }
  const main = getAppScrollContainer()
  if (main) {
    main.scrollTo({ top: value, left: 0, behavior })
    return
  }
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: value, left: 0, behavior })
  }
}

export function saveScrollPositionForLocation(locationKey, scrollTop) {
  if (!locationKey || typeof window === 'undefined') {
    return
  }
  try {
    window.sessionStorage.setItem(`${SCROLL_RESTORE_PREFIX}${locationKey}`, String(scrollTop))
  } catch {
    // ignore quota / privacy mode
  }
}

export function loadScrollPositionForLocation(locationKey) {
  if (!locationKey || typeof window === 'undefined') {
    return null
  }
  try {
    const raw = window.sessionStorage.getItem(`${SCROLL_RESTORE_PREFIX}${locationKey}`)
    if (raw == null) {
      return null
    }
    const top = Number(raw)
    return Number.isFinite(top) ? top : null
  } catch {
    return null
  }
}
