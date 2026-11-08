import { describe, expect, it } from 'vitest'
import { canonicalizeWorkbenchSpecPathname } from './workbenchSpecRedirects'

describe('canonicalizeWorkbenchSpecPathname', () => {
  it('redirects lib-forms spec paths to forms interactive routes', () => {
    expect(canonicalizeWorkbenchSpecPathname('/component-workbench/lib-forms/text-input')).toBe(
      '/component-workbench/forms/text-inputs',
    )
  })

  it('redirects lib-actions buttons to actions buttons', () => {
    expect(canonicalizeWorkbenchSpecPathname('/component-workbench/lib-actions/buttons')).toBe(
      '/component-workbench/actions/buttons',
    )
  })

  it('returns null for already canonical paths', () => {
    expect(canonicalizeWorkbenchSpecPathname('/component-workbench/forms/text-inputs')).toBeNull()
  })
})
