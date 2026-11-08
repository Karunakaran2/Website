export function pathId(value) {
  if (value == null || value === '') {
    return ''
  }
  return encodeURIComponent(String(value))
}

export function toPagingRequest({
  search,
  page,
  pageSize,
  sortBy,
  sortDir,
  allocationFilter,
}) {
  const start = Math.max(0, (page - 1) * pageSize)
  const body = {
    draw: page,
    start,
    length: pageSize,
    search: {
      value: search || '',
      regexp: null,
    },
    order: sortBy
      ? [{ column: 0, dir: sortDir === 'desc' ? 'desc' : 'asc' }]
      : [],
    columns: sortBy ? [{ data: sortBy }] : [],
  }
  if (allocationFilter != null && allocationFilter !== '') {
    body.allocationFilter = allocationFilter
  }
  return body
}

/** View All — custodian_id null = not allocated (matches asset_information). */
export function filterViewAllRowsByAllocation(rows, allocationFilter) {
  if (allocationFilter === 'ALL' || !allocationFilter) {
    return rows
  }
  if (allocationFilter === 'ALLOCATED') {
    return rows.filter((row) => String(row.custodianId ?? '').trim() !== '')
  }
  if (allocationFilter === 'NOT_ALLOCATED') {
    return rows.filter((row) => String(row.custodianId ?? '').trim() === '')
  }
  return rows
}

export function pageArrayToListResult(pageArray, page, pageSize) {
  return {
    rows: pageArray?.data ?? [],
    total: pageArray?.recordsFiltered ?? pageArray?.recordsTotal ?? 0,
    page,
    pageSize,
  }
}

export function unwrapErrorMessage(error) {
  const fieldErrors = error?.data?.fieldErrors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const firstFieldMessage = Object.values(fieldErrors).find(
      (value) => value != null && String(value).trim() !== '',
    )
    if (firstFieldMessage) {
      return String(firstFieldMessage)
    }
  }
  if (error?.data?.message) {
    return error.data.message
  }
  if (typeof error?.data === 'string') {
    return error.data
  }
  return error?.message || 'Request failed'
}

export function parseOptionalLong(value) {
  if (value == null || value === '') {
    return null
  }
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : null
}

export function parseOptionalDouble(value) {
  if (value == null || value === '') {
    return null
  }
  const parsed = Number.parseFloat(
    String(value).trim().replace(/\u20B9/g, '').replace(/,/g, ''),
  )
  return Number.isFinite(parsed) ? parsed : null
}

export function toIsoDate(value) {
  if (!value) {
    return null
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  const text = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10)
  }
  const parsed = new Date(text)
  if (Number.isNaN(parsed.getTime())) {
    return text
  }
  return parsed.toISOString().slice(0, 10)
}
