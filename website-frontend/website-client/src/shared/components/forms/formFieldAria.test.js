import { describe, expect, it } from 'vitest'
import { buildFieldDescribedBy } from './FormFields'

describe('buildFieldDescribedBy', () => {
  it('includes error id; omits hint when FORM_FIELD_HINTS_ENABLED is false', () => {
    expect(
      buildFieldDescribedBy({
        error: 'Required',
        hint: 'Help',
        errorId: 'f-error',
        hintId: 'f-hint',
      }),
    ).toBe('f-error')
  })

  it('returns undefined when no messages', () => {
    expect(buildFieldDescribedBy({ errorId: 'e', hintId: 'h' })).toBeUndefined()
  })
})
