import { describe, expect, it } from 'vitest'
import {
  normalizeSetupRow,
  resolveSetupNumericId,
  resolveSetupPublicId,
  setupMutationIdFields,
} from './setupRowId'

describe('resolveSetupNumericId', () => {
  it('parses positive integer strings and numbers', () => {
    expect(resolveSetupNumericId(12)).toBe(12)
    expect(resolveSetupNumericId('34')).toBe(34)
  })

  it('rejects masked or non-numeric ids', () => {
    expect(resolveSetupNumericId('GU6PpS1e6y')).toBeUndefined()
    expect(resolveSetupNumericId('')).toBeUndefined()
  })
})

describe('resolveSetupPublicId', () => {
  it('prefers idMask when configured', () => {
    expect(resolveSetupPublicId({ idMask: 'mask-1', id: 5 }, { idField: 'idMask' })).toBe('mask-1')
  })

  it('falls back to officeId for allocation rows', () => {
    expect(resolveSetupPublicId({ officeId: 10 }, { idField: 'officeId' })).toBe('10')
  })
})

describe('normalizeSetupRow', () => {
  it('adds idMask when missing', () => {
    expect(normalizeSetupRow({ id: 7 }, { idField: 'id' })).toEqual({ id: 7, idMask: '7' })
  })
})

describe('setupMutationIdFields', () => {
  it('merges public id and legacy numeric fields', () => {
    expect(setupMutationIdFields({ id: 2, costId: 9 }, 'mask-x')).toEqual({
      idMask: 'mask-x',
      id: 2,
      costId: 9,
    })
  })
})
