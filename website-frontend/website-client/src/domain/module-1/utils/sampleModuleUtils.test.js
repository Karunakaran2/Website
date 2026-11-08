import { describe, it, expect } from 'vitest'
import {
  formatINR,
  formatDate,
  computeSampleMetrics,
  getStatusVariant,
  getPriorityVariant,
  validateSampleRecord,
} from './sampleModuleUtils'

describe('sampleModuleUtils', () => {
  describe('formatINR', () => {
    it('formats Indian rupee amounts with currency symbol', () => {
      expect(formatINR(1450000)).toBe('₹14,50,000.00')
    })

    it('handles zero, null, and undefined values safely', () => {
      expect(formatINR(0)).toBe('₹0.00')
      expect(formatINR(null)).toBe('₹0.00')
      expect(formatINR(undefined)).toBe('₹0.00')
      expect(formatINR('invalid')).toBe('₹0.00')
    })
  })

  describe('formatDate', () => {
    it('formats ISO date string into dd-mm-yyyy display format', () => {
      expect(formatDate('2026-10-25')).toBe('25-10-2026')
    })

    it('returns fallback dash for null/empty date', () => {
      expect(formatDate(null)).toBe('-')
      expect(formatDate('')).toBe('-')
    })
  })

  describe('computeSampleMetrics', () => {
    it('calculates counts, totals, and average progress from sample records', () => {
      const records = [
        { status: 'Active', amount: 500000, progress: 80 },
        { status: 'Pending', amount: 200000, progress: 40 },
        { status: 'Completed', amount: 300000, progress: 100 },
      ]

      const metrics = computeSampleMetrics(records)
      expect(metrics.totalCount).toBe(3)
      expect(metrics.activeCount).toBe(1)
      expect(metrics.pendingCount).toBe(1)
      expect(metrics.completedCount).toBe(1)
      expect(metrics.totalAmount).toBe(1000000)
      expect(metrics.averageProgress).toBe(73) // (80 + 40 + 100) / 3 = 73.33 -> 73
    })

    it('handles empty records array gracefully', () => {
      const metrics = computeSampleMetrics([])
      expect(metrics.totalCount).toBe(0)
      expect(metrics.totalAmount).toBe(0)
      expect(metrics.averageProgress).toBe(0)
    })
  })

  describe('getStatusVariant & getPriorityVariant', () => {
    it('maps status names to semantic token variants', () => {
      expect(getStatusVariant('Active')).toBe('success')
      expect(getStatusVariant('Pending')).toBe('warning')
      expect(getStatusVariant('Rejected')).toBe('danger')
      expect(getStatusVariant('Draft')).toBe('neutral')
    })

    it('maps priority levels to semantic token variants', () => {
      expect(getPriorityVariant('Critical')).toBe('danger')
      expect(getPriorityVariant('High')).toBe('warning')
      expect(getPriorityVariant('Medium')).toBe('info')
      expect(getPriorityVariant('Low')).toBe('neutral')
    })
  })

  describe('validateSampleRecord', () => {
    it('returns isValid true for valid project payload', () => {
      const payload = {
        title: 'Cloud Infrastructure Upgrade',
        category: 'Infrastructure',
        department: 'Engineering',
        amount: 850000,
        dueDate: '2026-11-30',
      }
      const res = validateSampleRecord(payload)
      expect(res.isValid).toBe(true)
      expect(Object.keys(res.errors)).toHaveLength(0)
    })

    it('returns validation errors for missing or invalid fields', () => {
      const invalidPayload = {
        title: 'Abc', // too short (< 5)
        category: 'All', // invalid placeholder
        department: '',
        amount: -500, // negative amount
        dueDate: '',
      }
      const res = validateSampleRecord(invalidPayload)
      expect(res.isValid).toBe(false)
      expect(res.errors.title).toBeDefined()
      expect(res.errors.category).toBeDefined()
      expect(res.errors.department).toBeDefined()
      expect(res.errors.amount).toBeDefined()
      expect(res.errors.dueDate).toBeDefined()
    })
  })
})
