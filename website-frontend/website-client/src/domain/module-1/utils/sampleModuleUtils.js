/**
 * Sample Module Utilities
 * Provides formatting, validation, metric calculation, and filtering helpers.
 */

import { formatDisplayDateOrDash, formatRupee, parseAmount } from '@/shared/utils/probityFormat'

/** @deprecated name — use formatRupee from @/shared/utils/probityFormat in new code */
export function formatINR(val) {
  if (val === null || val === undefined || val === '' || Number.isNaN(parseAmount(val))) {
    return formatRupee(0)
  }
  return formatRupee(val)
}

export function formatDate(dateStr) {
  const formatted = formatDisplayDateOrDash(dateStr)
  return formatted === '—' ? '-' : formatted
}

export function computeSampleMetrics(records = []) {
  const totalCount = records.length
  const activeCount = records.filter((r) => r.status === 'Active').length
  const pendingCount = records.filter((r) => r.status === 'Pending').length
  const approvedCount = records.filter((r) => r.status === 'Approved').length
  const completedCount = records.filter((r) => r.status === 'Completed').length
  const totalAmount = records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
  const averageProgress = totalCount
    ? Math.round(records.reduce((sum, r) => sum + (Number(r.progress) || 0), 0) / totalCount)
    : 0

  return {
    totalCount,
    activeCount,
    pendingCount,
    approvedCount,
    completedCount,
    totalAmount,
    averageProgress,
  }
}

export function getStatusVariant(status) {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'approved':
    case 'completed':
    case 'success':
      return 'success'
    case 'pending':
    case 'in progress':
      return 'warning'
    case 'rejected':
    case 'critical':
      return 'danger'
    case 'draft':
    default:
      return 'neutral'
  }
}

export function getPriorityVariant(priority) {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return 'danger'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    case 'low':
    default:
      return 'neutral'
  }
}

export function validateSampleRecord(data) {
  const errors = {}

  if (!data.title?.trim()) {
    errors.title = 'Title is required'
  } else if (data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters'
  }

  if (!data.category || data.category === 'All') {
    errors.category = 'Please select a valid category'
  }

  if (!data.department) {
    errors.department = 'Department is required'
  }

  if (data.amount === undefined || data.amount === '' || isNaN(Number(data.amount))) {
    errors.amount = 'Valid budget amount is required'
  } else if (Number(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero'
  }

  if (!data.dueDate) {
    errors.dueDate = 'Target completion date is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
