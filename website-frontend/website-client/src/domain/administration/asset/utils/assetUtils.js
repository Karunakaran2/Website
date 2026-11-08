/**
 * Utility functions for Asset Management Domain
 */

import { formatDisplayDateOrDash, formatRupee, parseAmount } from '@/shared/utils/probityFormat'

/** Indian rupee display — delegates to shared probityFormat. */
export function formatINR(amount) {
  if (amount == null || amount === '' || Number.isNaN(parseAmount(amount))) {
    return formatRupee(0)
  }
  return formatRupee(amount)
}

/** Display date — delegates to shared probityFormat (dd-mm-yyyy or em dash). */
export function formatDate(dateString) {
  if (!dateString) return '—'
  const formatted = formatDisplayDateOrDash(dateString)
  return formatted === '—' && dateString ? dateString : formatted
}

/**
 * Derives aggregate metrics from asset records.
 * @param {Array<object>} records
 */
export function computeAssetMetrics(records = []) {
  const total = records.length
  let active = 0
  let underMaintenance = 0
  let retired = 0
  let inStorage = 0
  let totalValue = 0

  for (const r of records) {
    const val = Number(r.purchaseValue) || 0
    totalValue += val

    if (r.status === 'Active') {
      active++
    } else if (r.status === 'Under Maintenance') {
      underMaintenance++
    } else if (r.status === 'Retired') {
      retired++
    } else if (r.status === 'In Storage') {
      inStorage++
    }
  }

  return {
    total,
    active,
    underMaintenance,
    retired,
    inStorage,
    totalValue,
    formattedTotalValue: formatINR(totalValue),
  }
}

/**
 * Validates asset form input values.
 * @param {object} data
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateAssetRecord(data = {}) {
  const errors = {}

  if (!data.name || !data.name.trim()) {
    errors.name = 'Asset Name is required'
  } else if (data.name.trim().length < 3) {
    errors.name = 'Asset Name must contain at least 3 characters'
  }

  if (!data.category || data.category === 'All') {
    errors.category = 'Please select a valid Asset Category'
  }

  if (!data.department) {
    errors.department = 'Please select an assigning Department'
  }

  if (!data.location) {
    errors.location = 'Please select a physical Location'
  }

  if (data.purchaseValue === undefined || data.purchaseValue === null || data.purchaseValue === '') {
    errors.purchaseValue = 'Purchase Value is required'
  } else {
    const val = Number(data.purchaseValue)
    if (isNaN(val) || val <= 0) {
      errors.purchaseValue = 'Purchase Value must be a positive number greater than 0'
    }
  }

  if (!data.purchaseDate) {
    errors.purchaseDate = 'Purchase Date is required'
  }

  if (!data.status) {
    errors.status = 'Status is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
