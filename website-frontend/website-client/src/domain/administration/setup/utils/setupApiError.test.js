import { describe, expect, it } from 'vitest'
import {
  extractSetupFieldErrors,
  formatSetupLoadError,
  formatSetupMutationError,
} from './setupApiError'

describe('formatSetupLoadError', () => {
  it('returns empty string when error is missing', () => {
    expect(formatSetupLoadError(null)).toBe('')
  })

  it('maps 404 to setup availability message', () => {
    expect(formatSetupLoadError({ status: 404, data: '' })).toMatch(/not available/)
  })

  it('uses string data for 500 when present', () => {
    expect(formatSetupLoadError({ status: 500, data: 'DB down' })).toBe('DB down')
  })
})

describe('extractSetupFieldErrors', () => {
  it('reads field map from ApiResponse payload', () => {
    expect(
      extractSetupFieldErrors({
        payload: { data: { hoaId: 'Please select ledger.' } },
      }),
    ).toEqual({ hoaId: 'Please select ledger.' })
  })

  it('returns empty object when payload has no field map', () => {
    expect(extractSetupFieldErrors({ payload: { message: 'Validation failed' } })).toEqual({})
  })
})

describe('formatSetupMutationError', () => {
  it('joins field validation messages', () => {
    const message = formatSetupMutationError({
      payload: {
        message: 'Validation failed',
        data: { hoaId: 'Please select ledger.', officeId: 'Invalid office.' },
      },
    })
    expect(message).toBe('Please select ledger. Invalid office.')
  })

  it('falls back to payload.message', () => {
    expect(
      formatSetupMutationError({
        payload: { message: 'Unable to save. Check field lengths and required values.' },
      }),
    ).toBe('Unable to save. Check field lengths and required values.')
  })

  it('uses custom fallback when error is null', () => {
    expect(formatSetupMutationError(null, 'Save failed')).toBe('Save failed')
  })
})
