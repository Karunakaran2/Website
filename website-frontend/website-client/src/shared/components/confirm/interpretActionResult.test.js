import { describe, expect, it } from 'vitest'
import { confirmedActionFailure, interpretActionResult } from './interpretActionResult'

describe('interpretActionResult', () => {
  it('treats false as failure', () => {
    expect(interpretActionResult(false)).toEqual({ success: false, errorMessage: null })
  })

  it('reads confirmedActionFailure payload', () => {
    expect(interpretActionResult(confirmedActionFailure('Nope'))).toEqual({
      success: false,
      errorMessage: 'Nope',
    })
  })

  it('treats undefined as success', () => {
    expect(interpretActionResult(undefined)).toEqual({ success: true })
  })
})
