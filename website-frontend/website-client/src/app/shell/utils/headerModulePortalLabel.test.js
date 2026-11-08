import { describe, expect, it } from 'vitest'
import { resolveHeaderModulePortalLabel } from './headerModulePortalLabel'

describe('resolveHeaderModulePortalLabel', () => {
  it('returns null for home inbox', () => {
    expect(resolveHeaderModulePortalLabel('inbox')).toBeNull()
    expect(resolveHeaderModulePortalLabel(null)).toBeNull()
  })

  it('maps module 1 primary tabs', () => {
    expect(resolveHeaderModulePortalLabel('m1-overview')).toBe('common.moduleHeaderModule1')
  })

  it('maps module 2 primary tabs', () => {
    expect(resolveHeaderModulePortalLabel('m2-overview')).toBe('common.moduleHeaderModule2')
  })

  it('maps component workbench', () => {
    expect(resolveHeaderModulePortalLabel('overview')).toBe('common.moduleHeaderWorkbench')
    expect(resolveHeaderModulePortalLabel('lib-forms')).toBe('common.moduleHeaderWorkbench')
  })

  it('maps design guidelines', () => {
    expect(resolveHeaderModulePortalLabel('guide-principles')).toBe(
      'common.moduleHeaderDesignGuidelines',
    )
  })

  it('maps administration setup', () => {
    expect(resolveHeaderModulePortalLabel('company-setup')).toBe('common.moduleHeaderAdministration')
    expect(resolveHeaderModulePortalLabel('asset')).toBe('common.moduleHeaderAdministration')
  })
})
