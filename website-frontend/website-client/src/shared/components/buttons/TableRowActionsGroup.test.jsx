import { describe, expect, it } from 'vitest'
import { OVERFLOW_THRESHOLD, INLINE_VISIBLE_WHEN_OVERFLOW } from './TableRowActionsGroup'

describe('TableRowActionsGroup overflow policy', () => {
  it('uses two inline actions when more than two actions exist', () => {
    expect(OVERFLOW_THRESHOLD).toBe(2)
    expect(INLINE_VISIBLE_WHEN_OVERFLOW).toBe(2)
  })

  it('documents split for four actions', () => {
    const count = 4
    const useOverflow = count > OVERFLOW_THRESHOLD
    const inline = useOverflow ? INLINE_VISIBLE_WHEN_OVERFLOW : count
    const overflow = useOverflow ? count - INLINE_VISIBLE_WHEN_OVERFLOW : 0
    expect(useOverflow).toBe(true)
    expect(inline).toBe(2)
    expect(overflow).toBe(2)
  })
})
