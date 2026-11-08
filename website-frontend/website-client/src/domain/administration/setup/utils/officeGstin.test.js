import { describe, expect, it } from 'vitest'
import { gstinFieldErrorKey, isExistingOfficeGstin, normalizeGstin } from './officeGstin'

const office = {
  gstNumber: '27ABCDE1234F1Z5',
  gstAddressEntries: [
    { gstNumber: '27ABCDE1234F1Z5' },
    { gstNumber: '29ABCDE1234F1Z5' },
  ],
}

describe('officeGstin', () => {
  it('normalizes GSTIN for comparison', () => {
    expect(normalizeGstin(' 27abcde1234f1z5 ')).toBe('27ABCDE1234F1Z5')
  })

  it('skips uniqueness for the office GSTIN being edited', () => {
    expect(isExistingOfficeGstin('27abcde1234f1z5', office, 0)).toBe(true)
    expect(isExistingOfficeGstin('29ABCDE1234F1Z5', office, 1)).toBe(true)
  })

  it('does not skip a GSTIN that belongs to another office', () => {
    expect(isExistingOfficeGstin('24AAAAA0000A1Z5', office, 0)).toBe(false)
    expect(isExistingOfficeGstin('27ABCDE1234F1Z5', null, 0)).toBe(false)
  })

  it('uses gstNumber for the first row and indexed keys after that', () => {
    expect(gstinFieldErrorKey(0)).toBe('gstNumber')
    expect(gstinFieldErrorKey(2)).toBe('gstNumber[2]')
  })
})
