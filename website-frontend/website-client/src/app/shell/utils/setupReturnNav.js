import { ROUTES } from '@/shared/constants'
import { isSetupAreaPathname, parseModulePath } from '@/shared/constants/moduleRoutes'
import {
  isSetupPrimary,
  isSetupModulePrimary,
} from '@/app/shell/constants/dashboard'

const STORAGE_KEY = 'kran.setupReturnRoute'

export function normalizeAppPathname(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return '/'
  }
  return pathname.split('?')[0].replace(/\/+$/, '') || '/'
}

export function isModuleListHomePath(pathname) {
  return normalizeAppPathname(pathname) === ROUTES.HOME
}

const NON_MODULE_SHELL_PATHS = new Set([
  ROUTES.LOGIN,
  ROUTES.DEPARTMENT_LOGIN,
  ROUTES.MODULE_LOGIN,
  ROUTES.SEATS,
  ROUTES.HOME,
  ROUTES.MY_PROFILE,
])

/**
 * Setup gear in the app header is shown only inside an active module shell (not module list home).
 */
export function isHeaderSetupNavAvailable(pathname) {
  const cleanPath = normalizeAppPathname(pathname)
  if (NON_MODULE_SHELL_PATHS.has(cleanPath)) {
    return false
  }
  if (isSetupAreaPathname(cleanPath)) {
    return true
  }
  return isValidModuleReturnRoute(cleanPath)
}

/**
 * Validates whether a pathname is eligible as a module return target from Setup.
 * Cannot be empty, root, login, seats, /home, or another Setup page.
 */
export function isValidReturnRoute(pathname) {
  return isValidModuleReturnRoute(normalizeAppPathname(pathname))
}

function isValidModuleReturnRoute(cleanPath) {
  if (!cleanPath || !cleanPath.startsWith('/')) {
    return false
  }

  if (
    cleanPath === ROUTES.LOGIN ||
    cleanPath === ROUTES.DEPARTMENT_LOGIN ||
    cleanPath === ROUTES.MODULE_LOGIN ||
    cleanPath === ROUTES.SEATS ||
    cleanPath === ROUTES.HOME ||
    cleanPath === ROUTES.SETUP_ROOT ||
    cleanPath === ROUTES.MY_PROFILE ||
    cleanPath === ''
  ) {
    return false
  }

  if (isSetupAreaPathname(cleanPath)) {
    return false
  }

  const parsed = parseModulePath(cleanPath)
  if (parsed?.primaryTab) {
    if (isSetupPrimary(parsed.primaryTab) || isSetupModulePrimary(parsed.primaryTab)) {
      return false
    }
  }

  return true
}

function isStoredHomeReturn(parsed) {
  return parsed?.returnKind === 'home' || normalizeAppPathname(parsed?.pathname) === ROUTES.HOME
}

function persistSetupReturnPayload(payload) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Session storage failure fallback (private mode / quota)
  }
}

/**
 * Checks if a given pathname belongs to the Setup area.
 */
export function isSetupRoute(pathname) {
  return isSetupAreaPathname(pathname)
}

/**
 * Saves the navigation origin before entering Setup. Always replaces any previous value.
 * Module list home (/home) is stored explicitly so Setup Home returns to /home, not stale module history.
 */
export function saveSetupReturnRoute(location) {
  if (!location) return

  const pathname = location.pathname || ''
  const cleanPath = normalizeAppPathname(pathname)

  if (isSetupAreaPathname(cleanPath)) {
    return
  }

  const fullPath = `${pathname}${location.search || ''}${location.hash || ''}`
  const basePayload = {
    pathname: cleanPath,
    search: location.search || '',
    state: location.state || null,
    savedAt: Date.now(),
  }

  if (isModuleListHomePath(cleanPath)) {
    persistSetupReturnPayload({
      ...basePayload,
      fullPath: ROUTES.HOME,
      pathname: ROUTES.HOME,
      returnKind: 'home',
      confirmed: true,
    })
    return
  }

  if (!isValidModuleReturnRoute(cleanPath)) {
    return
  }

  persistSetupReturnPayload({
    ...basePayload,
    fullPath,
    returnKind: 'module',
    confirmed: true,
  })
}

/**
 * Retrieves the stored return route from Setup.
 * Falls back safely to ROUTES.HOME if none found or if invalid.
 */
export function getSetupReturnRoute() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.confirmed !== true) {
        return {
          fullPath: ROUTES.HOME,
          pathname: ROUTES.HOME,
          search: '',
          state: null,
        }
      }
      if (isStoredHomeReturn(parsed)) {
        return {
          fullPath: ROUTES.HOME,
          pathname: ROUTES.HOME,
          search: '',
          state: null,
        }
      }
      if (parsed?.fullPath && isValidModuleReturnRoute(normalizeAppPathname(parsed.pathname || parsed.fullPath))) {
        return {
          fullPath: parsed.fullPath,
          pathname: parsed.pathname,
          search: parsed.search || '',
          state: parsed.state || null,
        }
      }
    }
  } catch {
    // Ignore JSON parse errors
  }

  return {
    fullPath: ROUTES.HOME,
    pathname: ROUTES.HOME,
    search: '',
    state: null,
  }
}

/**
 * Clears stored return route (e.g. on logout or session reset).
 */
export function clearSetupReturnRoute() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage errors
  }
}

/**
 * When the user lands on module list home, drop stale module return context for Setup.
 */
export function syncSetupReturnRouteForPathname(pathname) {
  if (isModuleListHomePath(pathname)) {
    clearSetupReturnRoute()
  }
}

/**
 * Direct URL / bookmark into Setup: drop unconfirmed (stale) return context so Home defaults to /home.
 * Confirmed routes are kept (module entry via header or refresh while in Setup).
 */
export function ensureSetupReturnRouteForSetupEntry(pathname) {
  if (!isSetupAreaPathname(pathname)) {
    return
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw)
    if (parsed?.confirmed !== true) {
      clearSetupReturnRoute()
    }
  } catch {
    clearSetupReturnRoute()
  }
}

/**
 * Header Home icon: inside Setup → saved origin; elsewhere → module list (/home).
 */
export function navigateHeaderHome(navigate, location) {
  if (isSetupAreaPathname(location?.pathname)) {
    const returnTarget = getSetupReturnRoute()
    navigate(
      returnTarget.fullPath || ROUTES.HOME,
      returnTarget.state ? { state: returnTarget.state } : undefined,
    )
    return
  }
  navigate(ROUTES.HOME)
}
