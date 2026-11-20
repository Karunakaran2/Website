import { describe, it, expect } from 'vitest'
import {
  PORTAL_FOOTER_MODULES,
  PORTAL_LANDING_MODULES,
  PORTAL_MODULES,
} from './portalModules'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'

describe('portalModules', () => {
  it('omits demo module cards on the landing grid when website CMS mode is on', () => {
    const expectedIds = WEBSITE_AUTH_ENABLED ? [] : ['module-1', 'module-2']
    expect(PORTAL_LANDING_MODULES.map((m) => m.id)).toEqual(expectedIds)
    expect(PORTAL_LANDING_MODULES).toHaveLength(expectedIds.length)
  })

  it('exposes workbench and guidelines via footer modules', () => {
    expect(PORTAL_FOOTER_MODULES.map((m) => m.id)).toEqual(['workbench', 'guidelines'])
  })

  it('does not include administration in portal module paths', () => {
    expect(PORTAL_MODULES.some((m) => m.id === 'administration')).toBe(false)
  })
})
