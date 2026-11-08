import {
  DEPRECIATION_CATEGORY_OPTIONS,
  DEPRECIATION_CATEGORY_SUGGESTIONS,
} from '../constants/assetDepreciation'
import {
  INITIAL_DEPRECIATION_ROWS,
  MOCK_DEPRECIATION_HISTORY,
} from '../constants/assetDepreciationMockData'

let depreciationRows = [...INITIAL_DEPRECIATION_ROWS]
let nextSequence = 4

function categoryLabel(code) {
  return DEPRECIATION_CATEGORY_OPTIONS.find((opt) => opt.value === code)?.label ?? code
}

function filterRows(rows, search) {
  const q = (search || '').trim().toLowerCase()
  if (!q) {
    return rows
  }
  return rows.filter((row) =>
    [
      row.depreciationNumber,
      row.depreciationDate,
      row.processUpTo,
      row.categoryLabel,
      row.categoryList,
      String(row.depreciationAmount),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}

function sortRows(rows, sortBy, sortDir) {
  if (!sortBy) {
    return rows
  }
  const dir = sortDir === 'asc' ? 1 : -1
  return [...rows].sort((left, right) => {
    const a = left[sortBy] ?? ''
    const b = right[sortBy] ?? ''
    if (a < b) {
      return -1 * dir
    }
    if (a > b) {
      return 1 * dir
    }
    return 0
  })
}

export function getDepreciationProcessDefaults() {
  const year = new Date().getFullYear()
  const processUpTo = `${year}-03-31`
  return {
    depreciationNo: `DEP-${year}-${String(nextSequence).padStart(4, '0')}`,
    processUpToStr: processUpTo,
  }
}

export function searchDepreciationRuns({ search, page = 1, pageSize = 10, sortBy, sortDir } = {}) {
  const filtered = sortRows(filterRows(depreciationRows, search), sortBy, sortDir)
  const total = filtered.length
  const start = Math.max(0, (page - 1) * pageSize)
  const rows = filtered.slice(start, start + pageSize)
  return { rows, total }
}

export function processDepreciationRun(payload) {
  const amount = 45000 + Math.floor(Math.random() * 200000)
  const row = {
    idMask: `dep-mask-${Date.now()}`,
    depreciationAmount: amount,
    depreciationNumber: payload.depreciationNo,
    depreciationDate: payload.depreciationDateStr,
    processUpTo: payload.processUpToStr,
    category: payload.category,
    categoryLabel: categoryLabel(payload.category),
    categoryList: payload.categoryList || '',
  }
  depreciationRows = [row, ...depreciationRows]
  nextSequence += 1
  MOCK_DEPRECIATION_HISTORY[row.idMask] = [
    {
      assetId: 'FA-000101',
      description: 'Sample asset — depreciation line',
      amount: (amount * 0.6).toFixed(2),
    },
    {
      assetId: 'FA-000205',
      description: 'Sample asset — second line',
      amount: (amount * 0.4).toFixed(2),
    },
  ]
  return { row, rowCount: MOCK_DEPRECIATION_HISTORY[row.idMask].length }
}

export function getDepreciationHistory(idMask) {
  return MOCK_DEPRECIATION_HISTORY[idMask] ?? []
}

export function listDepreciationCategorySuggestions(category, query) {
  const base = DEPRECIATION_CATEGORY_SUGGESTIONS[category] ?? []
  const q = (query || '').trim().toLowerCase()
  if (!q) {
    return base.slice(0, 8)
  }
  return base.filter((item) => item.toLowerCase().includes(q)).slice(0, 8)
}

export function resetDepreciationMockStore() {
  depreciationRows = [...INITIAL_DEPRECIATION_ROWS]
  nextSequence = 4
}
