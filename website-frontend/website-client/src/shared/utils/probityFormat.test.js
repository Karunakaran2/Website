import { describe, expect, it } from 'vitest'
import {
  formatIndianAmount,
  formatRupee,
  parseAmount,
  sanitizeDecimalAmountInput,
} from './probityFormat'

describe('probityFormat (Indian currency)', () => {
  it('groups amounts with en-IN and two decimal places', () => {
    expect(formatIndianAmount(1000)).toBe('1,000.00')
    expect(formatIndianAmount(1450000)).toBe('14,50,000.00')
    expect(formatRupee(1450000)).toBe('₹14,50,000.00')
    expect(formatRupee(-250)).toBe('-₹250.00')
  })

  it('parses grouped and symbol-prefixed input strings', () => {
    expect(parseAmount('₹14,50,000.50')).toBe(1450000.5)
    expect(parseAmount('1,000')).toBe(1000)
  })

  it('sanitizes live decimal typing without breaking single dot', () => {
    expect(sanitizeDecimalAmountInput('12.34.5')).toBe('12.345')
    expect(sanitizeDecimalAmountInput('1,000')).toBe('1000')
  })
})
