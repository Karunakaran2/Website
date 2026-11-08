import { describe, expect, it } from 'vitest'
import { sanitizeDecimalAmountInput, validateQuantityInput } from './probityFormat'

const emptyMessage = 'Please enter quantity.'
const invalidMessage = 'Quantity must contain only numbers.'

describe('quantity input', () => {
  it('drops letters and extra decimal points while typing', () => {
    expect(sanitizeDecimalAmountInput('12abc')).toBe('12')
    expect(sanitizeDecimalAmountInput('1.2.3')).toBe('1.23')
    expect(sanitizeDecimalAmountInput('qty-4')).toBe('4')
  })

  it('rejects a value that still contains non-numeric characters', () => {
    expect(validateQuantityInput('12abc', emptyMessage, invalidMessage)).toBe(invalidMessage)
    expect(validateQuantityInput('1.5', emptyMessage, invalidMessage)).toBe(true)
    expect(validateQuantityInput('', emptyMessage, invalidMessage)).toBe(emptyMessage)
    expect(validateQuantityInput('0', emptyMessage, invalidMessage)).toBe(emptyMessage)
  })
})