/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { labelFromFieldKey, toUiLabelCase } from './uiLabelCase'

describe('uiLabelCase', () => {
  it('title-cases ordinary phrases', () => {
    expect(toUiLabelCase('submitted by')).toBe('Submitted By')
    expect(toUiLabelCase('application no.')).toBe('Application No.')
  })

  it('preserves configured acronyms', () => {
    expect(toUiLabelCase('gstin number')).toBe('GSTIN Number')
    expect(toUiLabelCase('cgst amount')).toBe('CGST Amount')
  })

  it('derives labels from field keys', () => {
    expect(labelFromFieldKey('applicationStatus')).toBe('Application Status')
    expect(labelFromFieldKey('created_date')).toBe('Created Date')
  })
})
