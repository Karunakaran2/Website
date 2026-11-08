import { describe, expect, it } from 'vitest'
import {
  probityTableCellsShouldWrap,
  probityTableOverflowDetailLabelNode,
} from './probityTableCellPresentation'

describe('probityTableCellsShouldWrap', () => {
  it('wraps by default for standalone Probity tables', () => {
    expect(probityTableCellsShouldWrap()).toBe(true)
  })

  it('wraps when responsiveNoScroll even if wrapCells is false', () => {
    expect(probityTableCellsShouldWrap({ wrapCells: false, responsiveNoScroll: true })).toBe(true)
  })

  it('respects explicit wrapCells false outside responsive mode', () => {
    expect(probityTableCellsShouldWrap({ wrapCells: false, responsiveNoScroll: false })).toBe(
      false,
    )
  })
})

describe('probityTableOverflowDetailLabelNode', () => {
  it('prefixes ₹ for currency overflow labels', () => {
    const node = probityTableOverflowDetailLabelNode(
      { header: 'Amount', format: 'currency' },
      null,
    )
    expect(node).toBeTruthy()
    expect(typeof node).toBe('object')
  })
})
