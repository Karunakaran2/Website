import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { ROUTES } from '@/shared/constants'
import {
  clearSetupReturnRoute,
  ensureSetupReturnRouteForSetupEntry,
  getSetupReturnRoute,
  isHeaderSetupNavAvailable,
  isValidReturnRoute,
  saveSetupReturnRoute,
  syncSetupReturnRouteForPathname,
} from './setupReturnNav'

function installSessionStorageMock() {
  const bag = new Map()
  const mock = {
    getItem: (key) => (bag.has(key) ? bag.get(key) : null),
    setItem: (key, value) => {
      bag.set(key, String(value))
    },
    removeItem: (key) => {
      bag.delete(key)
    },
    clear: () => {
      bag.clear()
    },
  }
  globalThis.sessionStorage = mock
  globalThis.window = globalThis
  return mock
}

describe('setupReturnNav', () => {
  beforeEach(() => {
    installSessionStorageMock()
    clearSetupReturnRoute()
  })

  afterEach(() => {
    delete globalThis.sessionStorage
    delete globalThis.window
  })

  it('rejects login, home, seats, and setup paths as module return targets', () => {
    expect(isValidReturnRoute(ROUTES.LOGIN)).toBe(false)
    expect(isValidReturnRoute(ROUTES.HOME)).toBe(false)
    expect(isValidReturnRoute(ROUTES.SEATS)).toBe(false)
    expect(isValidReturnRoute('/administration/setup/company-setup/overview')).toBe(false)
  })

  it('accepts reference module routes as return targets', () => {
    expect(isValidReturnRoute('/module-1/sample-dashboard/overview')).toBe(true)
    expect(isValidReturnRoute('/module-2/hrms-directory/overview')).toBe(true)
    expect(isValidReturnRoute('/sample-module/sample-dashboard/overview')).toBe(true)
    expect(isValidReturnRoute('/component-workbench/overview/module-overview')).toBe(true)
    expect(isValidReturnRoute('/administration/asset/fa-group')).toBe(true)
  })

  it('rejects malformed stored return payloads', () => {
    globalThis.sessionStorage.setItem('kran.setupReturnRoute', '{not-json')
    expect(getSetupReturnRoute().fullPath).toBe(ROUTES.HOME)
    globalThis.sessionStorage.setItem(
      'kran.setupReturnRoute',
      JSON.stringify({ fullPath: '/administration/setup/company-setup/overview' }),
    )
    expect(getSetupReturnRoute().fullPath).toBe(ROUTES.HOME)
  })

  it('persists and restores a valid module return route in session storage', () => {
    const pathname = '/module-1/sample-dashboard/overview'
    saveSetupReturnRoute({
      pathname,
      search: '?tab=1',
      hash: '',
      state: { from: 'test' },
    })
    const restored = getSetupReturnRoute()
    expect(restored.pathname).toBe(pathname)
    expect(restored.fullPath).toBe(`${pathname}?tab=1`)
    expect(restored.state).toEqual({ from: 'test' })
  })

  it('persists module list home as explicit setup return target', () => {
    saveSetupReturnRoute({
      pathname: ROUTES.HOME,
      search: '',
      hash: '',
      state: null,
    })
    const restored = getSetupReturnRoute()
    expect(restored.fullPath).toBe(ROUTES.HOME)
    expect(restored.pathname).toBe(ROUTES.HOME)
  })

  it('overwrites stale module history when saving from module list home', () => {
    saveSetupReturnRoute({
      pathname: '/module-1/sample-dashboard/overview',
      search: '',
      hash: '',
    })
    saveSetupReturnRoute({
      pathname: ROUTES.HOME,
      search: '',
      hash: '',
    })
    expect(getSetupReturnRoute().fullPath).toBe(ROUTES.HOME)
  })

  it('clears stored route when syncing module list home', () => {
    saveSetupReturnRoute({
      pathname: '/module-2/hrms-directory/overview',
      search: '',
      hash: '',
    })
    syncSetupReturnRouteForPathname(ROUTES.HOME)
    expect(globalThis.sessionStorage.getItem('kran.setupReturnRoute')).toBe(null)
    expect(getSetupReturnRoute().fullPath).toBe(ROUTES.HOME)
  })

  it('controls header setup visibility by shell context', () => {
    expect(isHeaderSetupNavAvailable(ROUTES.HOME)).toBe(false)
    expect(isHeaderSetupNavAvailable(ROUTES.MY_PROFILE)).toBe(false)
    expect(isHeaderSetupNavAvailable('/module-1/sample-dashboard/overview')).toBe(true)
    expect(isHeaderSetupNavAvailable('/administration/setup/company-setup/overview')).toBe(true)
  })

  it('ignores unconfirmed stale module storage (direct Setup URL / legacy payloads)', () => {
    globalThis.sessionStorage.setItem(
      'kran.setupReturnRoute',
      JSON.stringify({
        fullPath: '/module-1/sample-dashboard/overview',
        pathname: '/module-1/sample-dashboard/overview',
        returnKind: 'module',
      }),
    )
    expect(getSetupReturnRoute().fullPath).toBe(ROUTES.HOME)
    ensureSetupReturnRouteForSetupEntry('/administration/setup/company-setup/overview')
    expect(globalThis.sessionStorage.getItem('kran.setupReturnRoute')).toBe(null)
  })

  it('keeps confirmed storage when entering Setup (refresh after module entry)', () => {
    saveSetupReturnRoute({
      pathname: '/module-2/hrms-directory/overview',
      search: '',
      hash: '',
    })
    ensureSetupReturnRouteForSetupEntry('/administration/setup/company-setup/overview')
    expect(getSetupReturnRoute().pathname).toBe('/module-2/hrms-directory/overview')
  })
})
