import { describe, it, expect } from 'vitest'
import {
  computeSetupMetrics,
  validateMasterRecord,
  formatDate,
} from './setupUtils'

describe('setupUtils', () => {
  it('formats dates consistently', () => {
    expect(formatDate('2026-08-14')).toMatch(/14\/08\/2026/)
    expect(formatDate('')).toBe('—')
  })

  it('computes metrics from master data records', () => {
    const mock = [
      { category: 'Departments', status: 'Active' },
      { category: 'Departments', status: 'Inactive' },
      { category: 'Locations', status: 'Active' },
    ]
    const metrics = computeSetupMetrics(mock)
    expect(metrics.total).toBe(3)
    expect(metrics.active).toBe(2)
    expect(metrics.inactive).toBe(1)
    expect(metrics.categoriesCount).toBe(2)
    expect(metrics.byCategory['Departments'].total).toBe(2)
    expect(metrics.byCategory['Departments'].active).toBe(1)
    expect(metrics.byCategory['Departments'].inactive).toBe(1)
  })

  it('validates duplicate code in master data records', () => {
    const existing = [
      { id: '1', code: 'DEPT-ENG', name: 'Engineering', category: 'Departments' },
    ]

    const dup = validateMasterRecord(
      { code: 'DEPT-ENG', name: 'Software', category: 'Departments', status: 'Active' },
      existing
    )
    expect(dup.isValid).toBe(false)
    expect(dup.errors.code).toContain('already exists')

    // Editing own record should allow same code
    const ownEdit = validateMasterRecord(
      { code: 'DEPT-ENG', name: 'Software', category: 'Departments', status: 'Active' },
      existing,
      '1'
    )
    expect(ownEdit.isValid).toBe(true)
  })
})
