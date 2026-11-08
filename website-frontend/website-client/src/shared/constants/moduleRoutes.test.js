import { describe, expect, it } from 'vitest'
import {
  canonicalizeModulePathname,
  getModuleRoute,
  legacyDashboardPathToModuleRoute,
  parseModulePath,
} from '@/shared/constants/moduleRoutes'

describe('moduleRoutes', () => {
  it('builds prefixed module paths without /dashboard or accountId', () => {
    expect(getModuleRoute('overview', 'module-overview')).toBe(
      '/component-workbench/overview/module-overview',
    )
    expect(getModuleRoute('m1-overview', 'dashboard')).toBe('/module-1/m1-overview/dashboard')
    expect(getModuleRoute('sample-dashboard', 'overview')).toBe(
      '/module-1/sample-dashboard/overview',
    )
    expect(getModuleRoute('company-setup', 'overview')).toBe(
      '/administration/setup/company-setup/overview',
    )
    expect(getModuleRoute('asset', 'fa-group')).toBe('/administration/asset/fa-group')
    expect(getModuleRoute('m2-overview', 'dashboard')).toBe('/module-2/m2-overview/dashboard')
    expect(getModuleRoute('hrms-directory', 'overview')).toBe('/module-2/hrms-directory/overview')
    expect(getModuleRoute('inbox', 'overview')).toBe('/inbox/overview')
  })

  it('ignores legacy accountId arity when building routes', () => {
    expect(getModuleRoute('thiruvananthapuram', 'asset', 'fa-group')).toBe(
      '/administration/asset/fa-group',
    )
  })

  it('parses module paths and legacy dashboard URLs', () => {
    expect(parseModulePath('/administration/asset/fa-group')).toEqual({
      primaryTab: 'asset',
      secondaryTab: 'fa-group',
    })
    expect(parseModulePath('/administration/setup/company-setup/overview')).toEqual({
      primaryTab: 'company-setup',
      secondaryTab: 'overview',
    })
    expect(parseModulePath('/dashboard/asset/fa-group')).toEqual({
      primaryTab: 'asset',
      secondaryTab: 'fa-group',
    })
    expect(parseModulePath('/dashboard/thiruvananthapuram/inbox/overview')).toEqual({
      primaryTab: 'inbox',
      secondaryTab: 'overview',
    })
  })

  it('redirects legacy dashboard and short setup/asset paths', () => {
    expect(legacyDashboardPathToModuleRoute('/dashboard/actions/buttons')).toBe(
      '/component-workbench/actions/buttons',
    )
    expect(canonicalizeModulePathname('/setup/company-setup/overview')).toBe(
      '/administration/setup/company-setup/overview',
    )
    expect(canonicalizeModulePathname('/asset/fa-group')).toBe('/administration/asset/fa-group')
  })

  it('redirects legacy Module 1 and Module 2 URL prefixes', () => {
    expect(canonicalizeModulePathname('/sample-module/sample-forms/overview')).toBe(
      '/module-1/sample-forms/overview',
    )
    expect(canonicalizeModulePathname('/workforce/hrms-directory/overview')).toBe(
      '/module-2/hrms-directory/overview',
    )
    expect(canonicalizeModulePathname('/workforce-management/hrms-directory/overview')).toBe(
      '/module-2/hrms-directory/overview',
    )
    expect(parseModulePath('/sample-module/sample-dashboard/overview')).toEqual({
      primaryTab: 'sample-dashboard',
      secondaryTab: 'overview',
    })
  })
})
