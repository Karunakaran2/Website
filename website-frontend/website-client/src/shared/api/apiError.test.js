import { describe, expect, it } from 'vitest'
import { apiErrorMessage, apiFieldErrors, apiPayloadMessage } from './apiError'

describe('apiError', () => {
  it('reads field errors from payload.data', () => {
    const error = { payload: { data: { email: 'Invalid email' } } }
    expect(apiFieldErrors(error)).toEqual({ email: 'Invalid email' })
    expect(apiErrorMessage(error, 'fallback')).toBe('Invalid email')
  })

  it('reads string data and payload message', () => {
    expect(apiErrorMessage({ data: 'Gone' }, 'fallback')).toBe('Gone')
    expect(apiErrorMessage({ payload: { message: 'No seat' } }, 'fallback')).toBe('No seat')
  })

  it('reads raw HTTP payload message', () => {
    expect(apiPayloadMessage({ message: 'Bad request' }, 'x')).toBe('Bad request')
    expect(apiPayloadMessage('plain', 'x')).toBe('plain')
  })
})
