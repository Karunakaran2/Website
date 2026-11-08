/**
 * Utility functions for Setup Domain Master Data
 */

export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * Computes aggregate summary metrics across master data records.
 * @param {Array<object>} records
 */
export function computeSetupMetrics(records = []) {
  const total = records.length
  let active = 0
  let inactive = 0
  const categoriesSet = new Set()
  const byCategory = {}

  for (const r of records) {
    if (r.status === 'Active') {
      active++
    } else {
      inactive++
    }

    if (r.category) {
      categoriesSet.add(r.category)
      if (!byCategory[r.category]) {
        byCategory[r.category] = { total: 0, active: 0, inactive: 0 }
      }
      byCategory[r.category].total++
      if (r.status === 'Active') {
        byCategory[r.category].active++
      } else {
        byCategory[r.category].inactive++
      }
    }
  }

  return {
    total,
    active,
    inactive,
    categoriesCount: categoriesSet.size,
    byCategory,
  }
}

/**
 * Validates master-data configuration record input fields, including
 * required field constraints and duplicate code uniqueness.
 *
 * @param {object} data
 * @param {Array<object>} existingRecords
 * @param {string} [currentId]
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateMasterRecord(data = {}, existingRecords = [], currentId = null) {
  const errors = {}

  // 1. Code Validation
  if (!data.code || !data.code.trim()) {
    errors.code = 'Configuration Code is required'
  } else {
    const trimmedCode = data.code.trim().toUpperCase()
    if (trimmedCode.length < 2) {
      errors.code = 'Code must contain at least 2 characters'
    } else if (!/^[A-Z0-9_\-.]+$/.test(trimmedCode)) {
      errors.code = 'Code must only contain letters, numbers, hyphens, and periods'
    } else {
      // Duplicate check (ignore case and ignore own record when editing)
      const isDuplicate = existingRecords.some(
        (r) => r.id !== currentId && r.code?.trim().toUpperCase() === trimmedCode
      )
      if (isDuplicate) {
        errors.code = `Code "${trimmedCode}" already exists. Configuration codes must be globally unique.`
      }
    }
  }

  // 2. Name Validation
  if (!data.name || !data.name.trim()) {
    errors.name = 'Configuration Name is required'
  } else if (data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters long'
  }

  // 3. Category Validation
  if (!data.category || data.category === 'All') {
    errors.category = 'Please select a Master Data Category'
  }

  // 4. Status Validation
  if (!data.status) {
    errors.status = 'Status is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
