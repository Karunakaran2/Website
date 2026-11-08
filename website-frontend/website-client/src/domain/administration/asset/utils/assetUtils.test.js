import { describe, it, expect } from 'vitest'
import {
  formatINR,
  formatDate,
  computeAssetMetrics,
  validateAssetRecord,
} from './assetUtils'

describe('assetUtils', () => {
  it('formats currency in Indian Rupee notation correctly', () => {
    expect(formatINR(1000)).toBe('₹1,000.00')
    expect(formatINR(1500000)).toBe('₹15,00,000.00')
    expect(formatINR('invalid')).toBe('₹0.00')
  })

  it('formats dates consistently', () => {
    expect(formatDate('2024-01-15')).toBe('15-01-2024')
    expect(formatDate('')).toBe('—')
  })

  it('computes metrics from asset records', () => {
    const mock = [
      { status: 'Active', purchaseValue: 100000 },
      { status: 'Under Maintenance', purchaseValue: 50000 },
      { status: 'Retired', purchaseValue: 20000 },
      { status: 'In Storage', purchaseValue: 30000 },
    ]
    const metrics = computeAssetMetrics(mock)
    expect(metrics.total).toBe(4)
    expect(metrics.active).toBe(1)
    expect(metrics.underMaintenance).toBe(1)
    expect(metrics.retired).toBe(1)
    expect(metrics.inStorage).toBe(1)
    expect(metrics.totalValue).toBe(200000)
    expect(metrics.formattedTotalValue).toMatch(/₹\s*2,00,000\.00/)
  })

  it('validates required fields for asset records', () => {
    const invalid = validateAssetRecord({})
    expect(invalid.isValid).toBe(false)
    expect(invalid.errors.name).toBeDefined()
    expect(invalid.errors.category).toBeDefined()
    expect(invalid.errors.department).toBeDefined()
    expect(invalid.errors.location).toBeDefined()
    expect(invalid.errors.purchaseValue).toBeDefined()

    const valid = validateAssetRecord({
      name: 'MacBook Pro 16"',
      category: 'IT Hardware',
      department: 'Engineering',
      location: 'Technopark Campus, TVM',
      purchaseValue: 250000,
      purchaseDate: '2024-01-15',
      status: 'Active',
    })
    expect(valid.isValid).toBe(true)
    expect(Object.keys(valid.errors).length).toBe(0)
  })
})
