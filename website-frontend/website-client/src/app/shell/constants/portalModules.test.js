import { describe, it, expect } from 'vitest'
import {
  PORTAL_FOOTER_MODULES,
  PORTAL_LANDING_MODULES,
  PORTAL_MODULES,
} from './portalModules'

describe('portalModules', () => {
  it('shows only Module 1 and Module 2 on the landing grid', () => {
    expect(PORTAL_LANDING_MODULES).toHaveLength(2)
    expect(PORTAL_LANDING_MODULES.map((m) => m.id)).toEqual(['module-1', 'module-2'])
  })

  it('exposes workbench and guidelines via footer modules', () => {
    expect(PORTAL_FOOTER_MODULES.map((m) => m.id)).toEqual(['workbench', 'guidelines'])
  })

  it('does not include administration in portal module paths', () => {
    expect(PORTAL_MODULES.some((m) => m.id === 'administration')).toBe(false)
  })
})
